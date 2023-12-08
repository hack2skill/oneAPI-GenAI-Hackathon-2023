import json
import os
import streamlit as st
from langchain.llms import CTransformers

class response_function:
    @staticmethod
    def generate_response(input_text, conversation_history):
            intial_prompt = f"""
                    You are the IT Expert, dedicated to resolving technical issues.
                """
            #LLM Initialization
            #LLM Initialization
            local_llm = "TheBloke/mistral-7b-intel-v0.1.Q4_0.gguf"

            config = {
                    'max_new_tokens': 1024,
                    'repetition_penalty': 1.1,
                    'temperature': 0.1,
                    'top_k': 50,
                    'top_p': 0.9,
                    'stream': True,
                    'threads': int(os.cpu_count() / 2)
                }
           
            llm = CTransformers(
                model=local_llm,
                model_type="mistral",
                lib="avx2",  # for CPU use
                **config
            )
            return response_message
           
    
