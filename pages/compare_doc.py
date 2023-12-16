# Import necessary libraries
import sys
import site
from pathlib import Path
import os
import logging
import random
import re
import warnings
import torch
import intel_extension_for_pytorch as ipex

from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline # ,BitsAndBytesConfig
from transformers import LlamaTokenizer, LlamaForCausalLM
from langchain.llms.huggingface_pipeline import HuggingFacePipeline

from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.chains import LLMChain
from langchain.chains import RetrievalQA 
from langchain.chains.question_answering import load_qa_chain
from langchain.indexes import VectorstoreIndexCreator
import base64
import streamlit as st
from pathlib import Path

from langchain.embeddings import HuggingFaceEmbeddings
from langchain.globals import set_debug
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
from langchain.globals import set_verbose, set_debug
set_verbose(True)
set_debug(True)


# Suppress warnings for a cleaner output
warnings.filterwarnings("ignore")
# os.environ['TRANSFORMERS_CACHE'] = './my_llama_model'
os.environ["SYCL_PI_LEVEL_ZERO_USE_IMMEDIATE_COMMANDLISTS"] = "1"
os.environ["ENABLE_SDP_FUSION"] = "1"

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
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
MODEL_CACHE_PATH = "./" 

# Model name to be used
model_name = "perlthoughts/Falkor-11b"

model= AutoModelForCausalLM.from_pretrained(
                        model_name,
                        low_cpu_mem_usage=True,
                        trust_remote_code=True,
                        torch_dtype=torch.bfloat16,cache_dir="./").to("cpu").eval()   #load_in_8bit=True

# IPEX for Quantization and Optimization
qconfig = ipex.quantization.get_weight_only_quant_qconfig_mapping(
  weight_dtype=torch.qint8, # or torch.quint4x2
  lowp_mode=ipex.quantization.WoqLowpMode.NONE, # or FP16, BF16, INT8
)

checkpoint = None # optionally load int4 or int8 checkpoint #"falkor-11b-q8_0.gguf" # 
model = ipex.optimize_transformers(model, quantization_config=qconfig, low_precision_checkpoint=checkpoint)
tokenizer = AutoTokenizer.from_pretrained(
                    model_name, trust_remote_code=True,cache_dir="./"           )


def generate_text():
    gt = pipeline(task="text-generation", model=model, tokenizer=tokenizer)

    return gt


hf_pipeline = HuggingFacePipeline(pipeline=generate_text())


token = "your hugging face token"

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
    # doc1, doc2 = "leave1.pdf", "leave2.pdf"
    doc2 = st.selectbox('**Pick the Second document :**', sorted(subdirs), key="1")
    if doc1 !="Select" and doc2 !="Select": 

        st.write("**Click the below button if you want to compare two documents :**")
        trigger_1 = st.button("Compare")
        
        st.write("\n")
        st.write("\n")

qa_model=QAModel()

file_1 = f"{path}{doc1}"
file_2 = f"{path}{doc2}"

footer = """Analytics"""
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
    document_chunks1=qa_model.document_splitter_assistant(documents1,user_input_chunk_size = 300,user_input_chunk_overlap = 30)  
    embedd_path = os.path.join("./chroma_db",doc1.split(".")[0])
    if not os.path.exists(embedd_path):
        if not os.path.exists("./chroma_db"):
            os.mkdir("./chroma_db")
        os.mkdir(embedd_path) #+"/")
        vectorstore_doc1 = qa_model.create_embedding_assistant(document_chunks1, embedd_path)
    else:
        vectorstore_doc1 = Chroma(persist_directory=embedd_path, embedding_function = embeddings)
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
    document_chunks2=qa_model.document_splitter_assistant(documents2,user_input_chunk_size = 400,user_input_chunk_overlap = 30)
                        

    # Define the retraiver
    # vectorstore_doc2=qa_model.create_embedding_assistant(document_chunks2)
    st.write("Comparison : ")
    st.write("\n")
    changes =[]
    changes_1 = []
    highlight_1 = []
    ct = 0
    # llm = model.generate("what is capital of india?")

    for i in document_chunks2:
        print("*"*100, "Chunk Counter : ")
        text = i
        print(text)
        st.write("chunkss")
        st.write(i)
        query= text

        custom_prompt_template ="""
        You are an experienced legal consultant, your task is identifying the changes made in the latest version of the document as compared to the
        previous one and mention those changes in the Output.\n
        The document versions are given below:
        \n
        latest version of document:{text}
        \n
        previous version of document :{context}
        \n	

        Guidelines: If there are no substantial legal changes, respond with "No change." Avoid highlighting minor edits such as prepositions, punctuation
        marks, or formatting adjustments. Focus on meaningful alterations that impact the legal context.
        Do not make up the things. Give response in short.
        \n
        Change: 
        """
        

        custom_prompt_template_2 = """
        In the below provided context there is information to answer the question asked at the end. Read the context properly and answer the question asked to           you at the end :
        \n Context: \n
        ##########
        {context}
        ########## 
        Explain the leave policy of Affine?
        """
 

        llm = hf_pipeline
        

        PROMPT = PromptTemplate(template = custom_prompt_template, input_variables = ["context"] #,"question"]
                                     ,partial_variables={"text": query}
                                    )
        chain_type_kwargs = {"prompt": PROMPT}
                    # retriever=chroma_db.as_retriever(type = "similarity", search_kwargs={"k":1})
        custom_qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", 
                                                            retriever=vectorstore_doc1.as_retriever(type = "similarity",search_kwargs={"k":3}),
                                                            verbose=True,
                                                            chain_type_kwargs=chain_type_kwargs,
                                                            return_source_documents = True)
        
        try:                                                   
            response = custom_qa({"query": query})
            st.write("response")
            st.write(response)
            # st.write(response['source_documents'])
            result = response['result']
            # st.write("resulteeeeeeeeeeeee")
            # st.write(result)
            change = result.split("Change:")[-1]
            # st.write("changeeeeeeeeeeeeeeeeeeeee")
            # st.write(change)
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
        if ct==6:
            break
        

    
    st.write('\n')
    st.write('\n')
    st.write("highlight_1")
    st.write(highlight_1)
    path_1= qa_model.pdf_highlight1(file_2,highlight_1)
    qa_model.displayPDF(path_1)
    st.write('\n')
    st.write('\n')

