from transformers import AutoModelForCausalLM, AutoTokenizer
import sys
statement = sys.argv[1]
prompt2 = sys.argv[2]
clr_st = statement.replace("#", " ")
clr_pmt = prompt2.replace("#", " ")
device = "cpu"


def find_nth_occurrence(text, target, n):
    count = 0
    index = -1

    while count < n:
        index = text.find(target, index + 1)

        if index == -1:
            break  # Target not found

        count += 1

    return index


target_string = "[/INST]"
nth_occurrence = 2

tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct-v0.1")
model = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-Instruct-v0.1")
messages = [
    {"role": "user", "content": "I need some assistance in IT"},
    {"role": "assistant", "content": clr_pmt},
    {"role": "user", "content": clr_st}

]
encodeds = tokenizer.apply_chat_template(messages, return_tensors="pt")
# model.save_pretrained()
model_inputs = encodeds.to(device)
model.to(device)
generated_ids = model.generate(
    model_inputs, max_new_tokens=1000, do_sample=True)
decoded = tokenizer.batch_decode(generated_ids)
result = find_nth_occurrence(decoded[0], target_string, nth_occurrence)
print(decoded[0][result+7:])
