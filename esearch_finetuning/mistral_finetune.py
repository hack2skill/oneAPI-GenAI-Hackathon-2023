from trl import SFTTrainer
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer)
import pyarrow as pa
from trl import SFTTrainer
import pandas as pd
from datasets import Dataset
import pyarrow as pa
import pyarrow.dataset as ds
from huggingface_hub import login
import numpy as np
import time
from threading import Thread
from typing import Iterator
import intel_extension_for_pytorch as ipex



hf_token =''
repo_id = ''


login(hf_token)


df = pd.read_csv('training_instruct.csv')
df = df.drop('Unnamed: 0', axis=1)
df = df[df.Instruct != np.nan]
dataset = Dataset(pa.Table.from_pandas(df))

model_name = "mistralai/Mistral-7B-Instruct-v0.2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token
model = AutoModelForCausalLM.from_pretrained(model_name, trust_remote_code=True)


def tokenize_function(examples):
    return tokenizer(examples["Instruct"], padding="max_length", truncation=True)
tokenized_datasets = dataset.map(tokenize_function, batched=True)

training_args = TrainingArguments(output_dir="test_trainer")


training_arguments = TrainingArguments(
        output_dir="./results",
        bf16=True, #change for CPU
        use_ipex=True, #change for CPU IPEX
        no_cuda=True,
        fp16_full_eval=False,
    )
trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        dataset_text_field="Instruct",
        max_seq_length=2048,
        tokenizer=tokenizer,
        args=training_arguments,
        packing=True,
)

trainer.train()

trainer.model.push_to_hub(repo_id)
