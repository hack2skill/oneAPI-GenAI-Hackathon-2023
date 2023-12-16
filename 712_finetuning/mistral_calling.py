from huggingface_hub import InferenceClient
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TextIteratorStreamer
)
from threading import Thread
from typing import Iterator

class Mistral:
    def __init__(self):
        #self.model_name = "mistralai/Mixtral-8x7B-Instruct-v0.1"
        self.client = InferenceClient("mistralai/Mixtral-8x7B-Instruct-v0.1")
        self.model = None
        self.tokenizer = None
    def format_prompt(self,message):
        prompt = "<s>"
        prompt += f"[INST] {message} [/INST]"
        return prompt
    def inference(self,prompt, temperature=0.9, max_new_tokens=256, top_p=0.95, repetition_penalty=1.0):
        temperature = float(temperature)
        if temperature < 1e-2:
            temperature = 1e-2
        top_p = float(top_p)
        generate_kwargs = dict(
            temperature=temperature,
            max_new_tokens=max_new_tokens,
            top_p=top_p,
            repetition_penalty=repetition_penalty,
            do_sample=True,
            seed=42)
        system_prompt = """You are a data extractor for occupier details of a property in India. Using the provided HTML data, extract information to create a JSON array of objects. If you do not find a match, leave the value empty. Translate all numbers in English. Do NOT send the wrong answer. The HTML data is structured in a table format, with each row representing an occupier's details. The fields are 'Account Number', 'Occupier Name', 'Area', 'Land Revenue', 'Barren', and 'Number of mutation', each located within specific table cells. Your task is to parse this HTML and convert it into a JSON array, where each object corresponds to a row in the HTML table. The JSON object should have key-value pairs matching the field names to the extracted data. The final output should strictly follow the format [{},{},...], with each object containing the keys: 'Account Number', 'Occupier Name', 'Area', 'Land Revenue', 'Barren', and 'Number of mutation', each corresponding to their respective data in the HTML."""
        prompt = f"""{system_prompt},{prompt}"""
        formatted_prompt = self.format_prompt(prompt)
        stream = self.client.text_generation(formatted_prompt, **generate_kwargs, stream=True, details=True, return_full_text=False)
        output = ""
        for response in stream:
            output += response.token.text
        return output
    
    def model_tokenizer(self):
        self.model = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2")
        self.tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2")
    
    def generate(self,message: str,max_new_tokens: int = 1024,temperature: float = 0.6,top_p: float = 0.9,top_k: int = 50,repetition_penalty: float = 1.2,) -> Iterator[str]:
        self.model_tokenizer()
        conversation = []
        conversation.append({"role": "user", "content": message})
        input_ids = self.tokenizer.apply_chat_template(conversation, return_tensors="pt")
        if input_ids.shape[1] > self.MAX_INPUT_TOKEN_LENGTH:
            input_ids = input_ids[:, -self.MAX_INPUT_TOKEN_LENGTH:]
            gr.Warning(f"Trimmed input from conversation as it was longer than {self.MAX_INPUT_TOKEN_LENGTH} tokens.")
        input_ids = input_ids.to(self.model.device)
        #print(input_ids)
        streamer = TextIteratorStreamer(self.tokenizer, timeout=20.0, skip_prompt=True, skip_special_tokens=True)
        generate_kwargs = dict(
            {"input_ids": input_ids},
            streamer=streamer,
            max_new_tokens=max_new_tokens,
            do_sample=True,
            top_p=top_p,
            top_k=top_k,
            temperature=temperature,
            num_beams=1,
            repetition_penalty=repetition_penalty,
        )
        t = Thread(target=self.model.generate, kwargs=generate_kwargs)
        t.start()
        outputs = []
        for text in streamer:
            outputs.append(text)
        return outputs

