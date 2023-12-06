from langchain.embeddings import HuggingFaceEmbeddings
from langchain import HuggingFacePipeline
import sys
import site
from pathlib import Path
import os
from langchain.embeddings import HuggingFaceEmbeddings
from langchain import HuggingFacePipeline
import logging
import os
import random
import re
import warnings
import torch
import intel_extension_for_pytorch as ipex

from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from transformers import LlamaTokenizer, LlamaForCausalLM
from transformers import BertTokenizer, BertForSequenceClassification
from langchain import HuggingFacePipeline


from langchain.chains import RetrievalQA 
from langchain.chains.question_answering import load_qa_chain
from langchain.indexes import VectorstoreIndexCreator
import base64
import streamlit as st
import os
# import json
from pathlib import Path
# import ast

from langchain.chains import RetrievalQA
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.prompts import PromptTemplate
from prettytable import PrettyTable as pt
from dotenv import load_dotenv
import time
from langchain.document_loaders import PyPDFLoader
from PIL import Image
import pathlib
from PyPDF2 import PdfReader
import src.entity as entity 
from src.entity import QAModel
import shutil
import logging
from difflib import SequenceMatcher
import re



# Suppress warnings for a cleaner output
warnings.filterwarnings("ignore")
# os.environ['TRANSFORMERS_CACHE'] = './my_llama_model'
os.environ["SYCL_PI_LEVEL_ZERO_USE_IMMEDIATE_COMMANDLISTS"] = "1"
os.environ["ENABLE_SDP_FUSION"] = "1"

# Get Python version
def get_python_version():
    return "python" + ".".join(map(str, sys.version_info[:2]))

# Set local binary path for system paths
def set_local_bin_path():
    local_bin = str(Path.home() / ".local" / "bin") 
    local_site_packages = str(
        Path.home() / ".local" / "lib" / get_python_version() / "site-packages"
    )
    sys.path.append(local_bin)
    sys.path.insert(0, site.getusersitepackages())
    sys.path.insert(0, sys.path.pop(sys.path.index(local_site_packages)))

set_local_bin_path()

# Check if Torch XPU is available and set seed
if torch.xpu.is_available():
    seed = 88
    random.seed(seed)
    torch.xpu.manual_seed(seed)
    torch.xpu.manual_seed_all(seed)

def select_device(preferred_device=None):
    """
    Selects the best available XPU device or the preferred device if specified.

    Args:
        preferred_device (str, optional): Preferred device string (e.g., "cpu", "xpu", "xpu:0", "xpu:1", etc.). If None, a random available XPU device will be selected or CPU if no XPU devices are available.

    Returns:
        torch.device: The selected device object.
    """
    try:
        if preferred_device and preferred_device.startswith("cpu"):
            print("Using CPU.")
            return torch.device("cpu")
        if preferred_device and preferred_device.startswith("xpu"):
            if preferred_device == "xpu" or (
                ":" in preferred_device
                and int(preferred_device.split(":")[1]) >= torch.xpu.device_count()
            ):
                preferred_device = (
                    None  # Handle as if no preferred device was specified
                )
            else:
                device = torch.device(preferred_device)
                if device.type == "xpu" and device.index < torch.xpu.device_count():
                    vram_used = torch.xpu.memory_allocated(device) / (
                        1024**2
                    )  # In MB
                    print(
                        f"Using preferred device: {device}, VRAM used: {vram_used:.2f} MB"
                    )
                    return device

        if torch.xpu.is_available():
            device_id = random.choice(
                range(torch.xpu.device_count())
            )  # Select a random available XPU device
            device = torch.device(f"xpu:{device_id}")
            vram_used = torch.xpu.memory_allocated(device) / (1024**2)  # In MB
            print(f"Selected device: {device}, VRAM used: {vram_used:.2f} MB")
            return device
    except Exception as e:
        print(f"An error occurred while selecting the device: {e}")
    print("No XPU devices available or preferred device not found. Using CPU.")
    return torch.device("cpu")

###########################################################################################
# Cache path for the model
MODEL_CACHE_PATH = "./my_llama_model"

class hf_model():
    """
    ChatBotModel is a class for generating responses based on text prompts using a pretrained model.

    Attributes:
    - device: The device to run the model on. Default is "xpu" if available, otherwise "cpu".
    - model: The loaded model for text generation.
    - tokenizer: The loaded tokenizer for the model.
    - torch_dtype: The data type to use in the model.
    """

    def __init__(
        self,
        model_id_or_path: str ="meta-llama/Llama-2-7b-chat-hf",#"meta-llama/Llama-2-13b-chat-hf",#"circulus/Llama-2-13b-orca-v1", #"my_llama_model",# "circulus/Llama-2-13b-orca-v1",#"microsoft/Orca-2-13b",#"01-ai/Yi-34B",#"bhenrym14/platypus-yi-34b",#"tiiuae/hf-7b-instruct",  #"Intel/neural-chat-7b-v3-1",  # "Writer/camel-5b-hf",  #tiiuae/hf-7b-instruct
        torch_dtype: torch.dtype = torch.bfloat16,
        optimize: bool = True,
    ) -> None:
        """
        The initializer for ChatBotModel class.

        Parameters:
        - model_id_or_path: The identifier or path of the pretrained model.
        - torch_dtype: The data type to use in the model. Default is torch.bfloat16.
        - optimize: If True, ipex is used to optimized the model
        """
        self.torch_dtype = torch_dtype
        self.device = select_device("xpu")
        self.model_id_or_path = model_id_or_path
        # local_model_id = self.model_id_or_path.replace("/", "--")
        # model_id_or_path = os.path.join(MODEL_CACHE_PATH, local_model_id) #local_model_path = "meta-llama/Llama-2-13b-chat-hf"
        # local_model_path = "my-model"
        # model_id_or_path = "meta-llama/Llama-2-13b-chat-hf"
        local_model_id = self.model_id_or_path.replace("/", "--")
        local_model_path = os.path.join(MODEL_CACHE_PATH, local_model_id)
        
        if (
            self.device == self.device.startswith("xpu")
            if isinstance(self.device, str)
            else self.device.type == "xpu"
        ):

            self.autocast = torch.xpu.amp.autocast
        else:
            self.autocast = torch.cpu.amp.autocast
        self.torch_dtype = torch_dtype
        try:
            if "llama" in model_id_or_path:
                self.tokenizer = LlamaTokenizer.from_pretrained(local_model_path,use_auth_token=token,cache_dir="my_llama_model/")
                self.model = (
                    LlamaForCausalLM.from_pretrained(
                        local_model_path,use_auth_token=token,
                        low_cpu_mem_usage=True,
                        torch_dtype=self.torch_dtype,cache_dir="my_llama_model/"
                    )
                    .to(self.device)
                    .eval()
                )
            else:
                self.tokenizer = AutoTokenizer.from_pretrained(
                    local_model_path, trust_remote_code=True,cache_dir="my_llama_model/"
                )
                self.model = (
                    AutoModelForCausalLM.from_pretrained(
                        local_model_path,
                        low_cpu_mem_usage=True,
                        trust_remote_code=True,
                        torch_dtype=self.torch_dtype,cache_dir="my_llama_model/"
                    )
                    .to(self.device)
                    .eval()
                )
        except (OSError, ValueError, EnvironmentError) as e:
            logging.info(
                f"Tokenizer / model not found locally. Downloading tokenizer / model for {self.model_id_or_path} to cache...: {e}"
            )
            if "llama" in model_id_or_path:
                self.tokenizer = LlamaTokenizer.from_pretrained(self.model_id_or_path,use_auth_token=token,cache_dir="my_llama_model/")
                self.model = (
                    LlamaForCausalLM.from_pretrained(
                        self.model_id_or_path,
                        low_cpu_mem_usage=True,use_auth_token=token,
                        torch_dtype=self.torch_dtype,cache_dir="my_llama_model/"
                    )
                    .to(self.device)
                    .eval()
                )
            else:
                self.tokenizer = AutoTokenizer.from_pretrained(
                    self.model_id_or_path, trust_remote_code=True,cache_dir="my_llama_model/"
                )
                self.model = (
                    AutoModelForCausalLM.from_pretrained(
                        self.model_id_or_path,
                        low_cpu_mem_usage=True,
                        trust_remote_code=True,
                        torch_dtype=self.torch_dtype,cache_dir="my_llama_model/"
                    )
                    .to(self.device)
                    .eval()
                )


        
        self.max_length = 256

        if optimize:
            if hasattr(ipex, "optimize_transformers"):
                try:
                    ipex.optimize_transformers(self.model, dtype=self.torch_dtype)
                except:
                    ipex.optimize(self.model, dtype=self.torch_dtype)
            else:
                ipex.optimize(self.model, dtype=self.torch_dtype)


    def generate_text(self):
        gt = pipeline(task="text-generation", model=self.model, tokenizer=self.tokenizer)

        return gt
#################################################################

# HuggingFacePipeline for the Model
token = "hugging face token"
# LangChain HuggingFacePipeline set to our transformer pipeline
hf_model_obj=hf_model()
hf_pipeline = HuggingFacePipeline(pipeline=hf_model_obj.generate_text())

# Image for the Streamlit page
img = Image.open("images/affine.jpg")

# Streamlit page configuration
page_config = {"page_title":"invoice_tool.io","page_icon":img,"layout":"wide"}
st.set_page_config(**page_config)

## Divide the user interface into two parts: column 1 (small) and column 2 (large).
#"""This code assigns the st.columns([1, 8]) statement to the variables col1 and col2, 
#which divide the user interface into two columns. Column 1 will be smaller in width, 
# while column 2 will be larger.
#"""

hide_streamlit_style = """
            <style>
            footer {visibility: hidden;}
            </style>
            """
st.markdown(hide_streamlit_style, unsafe_allow_html=True)

col1, col2,col3,col4 = st.columns([2.5,2.5,8.5,0.5])
with col1:
    st.write(' ')
with col2:
    #img = Image.open("images/affine.jpg")
    st.image(img,width = 130)

with col3:
    st.markdown("""
<h2 style='font-size: 48px; font-family: Arial, sans-serif; 
                   letter-spacing: 2px; text-decoration: none;'>
<span style='background: linear-gradient(45deg, #ed4965, #c05aaf);
                          -webkit-background-clip: text;
                          -webkit-text-fill-color: transparent;
                          text-shadow: none;'>
                Contract Comparator
</span>
</h2>
</div>
""", unsafe_allow_html=True)
    
    st.write("**Get Comparison of two contracts**")

with col4:
    st.write(' ')

st.write("\n")
st.write("\n")

path = "data/Contracts/"

with st.sidebar:
    # key=col1._text_input()
    # Left column: Upload PDF text
    # st.header("Dashboard")
    st.markdown("""
<div style='text-align: center;top-margin:90px;'>
<h2 style='font-size: 20px; font-family: Arial, sans-serif; 
                   letter-spacing: 2px; text-decoration: none;'>
<span style='background: linear-gradient(45deg, #ed4965, #c05aaf);
                          -webkit-background-clip: text;
                          -webkit-text-fill-color: transparent;
                          text-shadow: none;'>
                Contract Comparator
</span>
<span style='font-size: 40%;'>
<sup style='position: relative; top: 5px; color: #ed4965;'></sup>
</span>
</h2>
</div>
""", unsafe_allow_html=True)
    
    subdirs = os.listdir(path)
    subdirs.insert(0,"Select2")
    subdirs.insert(0,"Select1")

    print(subdirs)
    doc1 = st.selectbox('**Pick the First document :**', sorted(subdirs), key="0")

    doc2 = st.selectbox('**Pick the Second document :**', sorted(subdirs), key="1")
    if doc1 !="Select" and doc2 !="Select": 

        st.write("**Click the below button if you want to compare two documents :**")
        trigger_1 = st.button("Compare")
        
        st.write("\n")
        st.write("\n")



qa_model=QAModel()


file_1 = f"{path}{doc1}"
file_2 = f"{path}{doc2}"

footer = """ """
special_characters = r"[]{}()^$.*+?|\\"

    # Escape special characters by adding a backslash before them
escaped_string = re.sub(f"[{''.join(re.escape(char) for char in special_characters)}]", r"\\\g<0>", footer)
pattern = re.sub(r'\s+', r'\\s*', escaped_string)
replacement = " footer "

if trigger_1 :
    
    if os.path.exists('.chroma'):
        shutil.rmtree('.chroma')

    # Load file one and store the embeddings 

    pdf_reader1=PyPDFLoader(file_1)
    #documents1 = pdf_reader1.load()
    if file_1 is not None:
        pdf_reader = PdfReader(file_1)
        print('PDF LOADED')
        documents1 = ""
        for page in pdf_reader.pages:
            documents1 += ' '.join(page.extract_text().splitlines())
                            # split into chunks
    documents1 = re.sub(pattern, replacement, documents1)
    document_chunks1=qa_model.document_splitter_assistant(documents1,user_input_chunk_size = 2000,user_input_chunk_overlap = 300)  

    vectorstore_doc1 = qa_model.create_embedding_assistant(document_chunks1)
    pdf_reader2=PyPDFLoader(file_2)
    if file_2 is not None:
        pdf_reader = PdfReader(file_2)
        print('PDF LOADED')
        documents2 = ""
        for page in pdf_reader.pages:
            #result = re.sub(pattern, replacement, page.extract_text())
            documents2 += ' '.join(page.extract_text().splitlines())
                            # split into chunks

    documents2 = re.sub(pattern, replacement, documents2)
    document_chunks2=qa_model.document_splitter_assistant(documents2,user_input_chunk_size = 2000,user_input_chunk_overlap = 300) 
                        

    # Define the retraiver
    vectorstore_doc2=qa_model.create_embedding_assistant(document_chunks2)


    st.write("Comparison : ")
    st.write("\n")
    changes =[]
    changes_1 = []
    highlight_1 = []
    ct = 0
    for i in document_chunks2:
        print("*"*100)
        print("Chunk Counter : ")
        text = i
        print(i)
            # QA Model to process the further things with each chunk of text 

        query= "Find a context that matches the text : {}".format(text)
        custom_prompt_template ="""Use the following pieces of context to answer the question at the end. Don't try to make up an answer that is not present in the document.	
        Below is the context provided to you:	
        {context}	
        You are an editor of a company who has to provide insight on the changes that were made in the new version of a document compared to the older version and 	
        explain the changes.	
        Below is the old version of the document :	
        {text} 	
        Compare the details of text containing older version of document with details of context containing the new version of document , and explain the 	
        changes that were made in the text with reference to context in the below format :	
        • Change: If there are any difference between the text and context then explain the difference otherwise say 'None'.	
        	
        Dont add anything other than the above provided format	
        Question: {question}	
        Answer from the given document chunk. The answer for question is """


        llm=hf_pipeline
        custom_prompt_template=custom_prompt_template
        query=query

        PROMPT = PromptTemplate(
                                    template = custom_prompt_template, input_variables = ["context","question"],
                                    partial_variables={"text": text}
                                    )
        chain_type_kwargs = {"prompt": PROMPT}
                    # retriever=chroma_db.as_retriever(type = "similarity", search_kwargs={"k":1})
        custom_qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", 
                                                            retriever=vectorstore_doc1.as_retriever(type = "similarity",search_kwargs={"k":3}),
                                                            chain_type_kwargs=chain_type_kwargs,
                                                            return_source_documents = True)
        
        try:                                                   
            response = custom_qa({"query": query})
            #st.write(response)
            result = response['result']
            change = result.split("Change:")[-1]

            if change not in ["None"," None","• Change: None","None.","Change: None","""• Change: None

    The provided text matches the context in the document without any differences."""] :
                changes.append(change)
                j = i.split("footer")
                if isinstance(j, str):
                        highlight_1.append(j)
                else:
                        highlight_1.extend(j)
                changes_1.append(change)        
                ct+=1    
                st.write(str(ct)+'. '+change)
                st.write('\n')
                #st.write('\n')
        except:
            continue
    st.write('\n')
    st.write('\n')
    path_1= qa_model.pdf_highlight(file_2,highlight_1)
    qa_model.displayPDF(path_1)
    st.write('\n')
    st.write('\n')

