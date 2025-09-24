# FastAPI microservice for conversational assistant using HuggingFace Transformers
from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load a small conversational model (DialoGPT-small)
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-small")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-small")

class Message(BaseModel):
    message: str
    history: list = []  # Optional: previous conversation turns

@app.post("/chat")
def chat(msg: Message):
    # Build conversation history
    input_ids = tokenizer.encode(msg.message + tokenizer.eos_token, return_tensors="pt")
    if msg.history:
        for turn in msg.history[-5:]:  # Use last 5 turns for context
            input_ids = torch.cat([
                tokenizer.encode(turn + tokenizer.eos_token, return_tensors="pt"),
                input_ids
            ], dim=-1)
    # Generate response
    chat_history_ids = model.generate(input_ids, max_length=1000, pad_token_id=tokenizer.eos_token_id, do_sample=True, top_k=50, top_p=0.95)
    reply = tokenizer.decode(chat_history_ids[:, input_ids.shape[-1]:][0], skip_special_tokens=True)
    return {"reply": reply.strip()}
