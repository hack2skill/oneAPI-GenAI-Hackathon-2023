from peft import PeftModel, PeftConfig
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer)
from transformers import pipeline

model = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2")

repo_id = ''   #adapter repo id 


model = PeftModel.from_pretrained(model,repo_id)

prompt = ""
system_prompt = ""
pipe = pipeline(task="text-generation", model=model, tokenizer=tokenizer, max_length=1000)
result = pipe(f"""Question:{prompt}[INST]{system_prompt}[/INST] Assistant:""")
print(result[0]['generated_text'])
