import logging
import sys
import torch
from pprint import pprint
from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext
from llama_index.llms import HuggingFaceLLM
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
# from llama_index import LangchainEmbedding
from llama_index.prompts.prompts import SimpleInputPrompt

from pathlib import Path
from llama_index import download_loader

PDFReader = download_loader("PDFReader")
loader = PDFReader()

system_prompt = "You are a data extractor. Extract the exact data from given document. If no information is found, please reply 'No information found'"
query_wrapper_prompt = SimpleInputPrompt("<|USER|>{query_str}<|ASSISTANT|>")

context_window = 4096
temperature = 0.0
tokenizer_name = 'meta-llama/Llama-2-7b-chat-hf'
model_name = 'litelo/llama-2-case-whisper'

from transformers import LlamaTokenizer, LlamaForCausalLM
tokenizer = LlamaTokenizer.from_pretrained(tokenizer_name)
model_llm = LlamaForCausalLM.from_pretrained(
    model_name,
    # torch_dtype=torch.float16,
    device_map='auto'
)

llm = HuggingFaceLLM(
    context_window=context_window,
    max_new_tokens=256,
    generate_kwargs={"temperature":temperature, "do_sample": False},
    system_prompt= system_prompt,
    query_wrapper_prompt = query_wrapper_prompt,
    tokenizer=tokenizer,
    model=model_llm,
    device_map='auto',
    model_kwargs={"use_auth_token": True}
)

embed_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

service_context = ServiceContext.from_defaults(
    chunk_size=1024,
    llm=llm,
    embed_model=embed_model
)

import json
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def get():
    json_data = request.json
    query = json_data["query"]
    context = json_data["context"]
    if context!="" :
        documents = loader.load_data(file=Path('../supreme-court-data/data/data/'+context))
        index = VectorStoreIndex.from_documents(documents, service_context=service_context)
        query_engine = index.as_query_engine()
        response=query_engine.query(query)
        json_data['response'] = response.response
        return jsonify(json_data)
    else:
        response = llm.complete(query)
        json_data['response'] = response.text
        return jsonify(json_data)

app.run(host='0.0.0.0', port=5000)

