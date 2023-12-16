import pandas as pd
from datasets import Dataset
from huggingface_hub import login
import numpy as np
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, AutoTokenizer
from peft import LoraConfig
from transformers import TrainingArguments
from trl import SFTTrainer
import os
import pyarrow as pa
import tqdm

hf_token=''

login(hf_token)

df = pd.read_csv('training_instruct.csv')
df = df.drop('Unnamed: 0', axis=1)

df = df[df.Instruct != np.nan]
dataset = Dataset(pa.Table.from_pandas(df))

model_name = "mistralai/Mistral-7B-Instruct-v0.2"

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
)

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=bnb_config,
    trust_remote_code=True
)
model.config.use_cache = False

tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
tokenizer.pad_token = tokenizer.eos_token

tokenizer.chat_template = "{{ bos_token }}{% for message in messages %}{% if (message['role'] == 'user') != (loop.index0 % 2 == 0) %}{{ raise_exception('Conversation roles must alternate user/assistant/user/assistant/...') }}{% endif %}{% if message['role'] == 'user' %}{{ '[INST] ' + message['content'] + ' [/INST] ' }}{% elif message['role'] == 'assistant' %}{{ message['content'] + eos_token + ' ' }}{% else %}{{ raise_exception('Only user and assistant roles are supported!') }}{% endif %}{% endfor %}"
tokenizer.pad_token = tokenizer.unk_token
tokenizer.clean_up_tokenization_spaces = True
tokenizer.add_bos_token = False
tokenizer.padding_side = "right"
tokenizer.pad_token

lora_alpha = 16
lora_dropout = 0.1
lora_r = 64

peft_config = LoraConfig(
    lora_alpha=lora_alpha,
    lora_dropout=lora_dropout,
    r=lora_r,
    bias="none",
    task_type="CAUSAL_LM",
    target_modules=[
        "q_proj",
        "k_proj",
        "v_proj",
        "o_proj",
    ],
)


output_dir = "./results"
num_train_epochs = 2
auto_find_batch_size = True
gradient_accumulation_steps = 2
optim = "paged_adamw_32bit"
save_strategy = "epoch"
learning_rate = 3e-4
lr_scheduler_type = "cosine"
warmup_ratio = 0.03
logging_strategy = "steps"
logging_steps = 25
evaluation_strategy = "no"
bf16 = True

training_arguments = TrainingArguments(
    output_dir=output_dir,
    num_train_epochs=num_train_epochs,
    auto_find_batch_size=auto_find_batch_size,
    gradient_accumulation_steps=gradient_accumulation_steps,
    optim=optim,
    save_strategy=save_strategy,
    learning_rate=learning_rate,
    lr_scheduler_type=lr_scheduler_type,
    warmup_ratio=warmup_ratio,
    logging_strategy=logging_strategy,
    logging_steps=logging_steps,
    evaluation_strategy=evaluation_strategy,
    bf16=False,
)

max_seq_length = 512

response_template = "[/INST]"
print(f"Response template for collator: {response_template}")


trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    dataset_text_field="Instruct",
    #data_collator=collator,
    peft_config=peft_config,
    max_seq_length=max_seq_length,
    tokenizer=tokenizer,
    args=training_arguments,
)

# [markdown]
# We will also pre-process the model by upcasting the layer norms in float 32 for more stable training

# %%
for name, module in trainer.model.named_modules():
    if "norm" in name:
        module = module.to(torch.float32)


trainer.train()   
trainer.model.push_to_hub(repo_id)

