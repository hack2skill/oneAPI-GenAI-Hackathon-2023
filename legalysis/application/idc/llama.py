from transformers import AutoTokenizer, AutoModelForCausalLM
import sys
 
description = sys.argv[1]
tokenizer = AutoTokenizer.from_pretrained("Bhuvanesh-Ch/summarizationFineTuned")
model = AutoModelForCausalLM.from_pretrained("Bhuvanesh-Ch/summarizationFineTuned")
prompt = description.replace("#", " ")
inputs = tokenizer(prompt, return_tensors='pt')
output = tokenizer.decode(
    model.generate(
        inputs["input_ids"],
        max_new_tokens=1000,
    )[0],
    skip_special_tokens=True
)
 
print(output)
 