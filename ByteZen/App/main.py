import streamlit as st
import numpy as np
import time
import replicate
import time
import base64
import boto3
from generate_response_opensourcemodel import response_function
from botocore.exceptions import NoCredentialsError
import io
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM 
from transformers import pipeline
import torch 
import textwrap 
from langchain.document_loaders import PyPDFLoader, DirectoryLoader, PDFMinerLoader 
from langchain.text_splitter import RecursiveCharacterTextSplitter 
from langchain.embeddings import SentenceTransformerEmbeddings 
from langchain.vectorstores import Chroma 
from langchain.llms import HuggingFacePipeline
from langchain.chains import RetrievalQA 
from constants import CHROMA_SETTINGS
from streamlit_chat import message
from PIL import Image
from streamlit.components.v1 import html
import os
from PATHS import NAVBAR_PATHS, SETTINGS
from langchain import PromptTemplate, LLMChain
from langchain.llms import CTransformers
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.embeddings import HuggingFaceBgeEmbeddings
import transformers
import pytesseract
from langchain.chains import RetrievalQAWithSourcesChain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import UnstructuredURLLoader
from langchain.vectorstores import FAISS
from dotenv import load_dotenv
import requests
import utils as utl
import os
import textwrap
from datetime import datetime
from persist import persist, load_widget_state


# Define a persistent key for st.session_state.messages
messages_key = persist("messages")

st.set_page_config(layout="wide", page_title='Navbar sample')
st.set_option('deprecation.showPyplotGlobalUse', False)
utl.inject_custom_css()
utl.navbar_component()
# Initialize st.session_state.messages as a list if not already defined
st.session_state.messages = st.session_state.get(messages_key, [])



#st.set_page_config(layout="wide")

status_placeholder = st.empty()

# Display loading status only once when the script is executed
if not st.session_state.get('loaded', False):
    with status_placeholder:
        st.status("Loading the Application...")
        time.sleep(2)
        st.status("CPU Detected...")
        time.sleep(2)
        st.status("Loading the model to CPU..")
        time.sleep(2)
        st.text("Connected")
        status_placeholder.empty()
        st.session_state['loaded'] = True
        
st.markdown(
    """
    <style>
        footer {visibility: hidden;}
    </style>
    """,
    unsafe_allow_html=True,
)




def main(stop_keyword="restart", exit_keyword="exit"):
    st.markdown("<h1 style='text-align: centre;'> IT Customer Support Intel® oneAPI.</h1>", unsafe_allow_html=True)
    option = st.text_input(label = "Ask Something")
    st.markdown("<br>", unsafe_allow_html=True)


    st.markdown("""
        <div style='position: absolute; z-index: -1; top: 0; left: 0; width: 100%; height: 100%;'>
            <img src='AI.jpg' style='object-fit: cover; width: 100%; height: 100%; opacity: 0.3;'/>
        </div>
    """, unsafe_allow_html=True)
    st.image("imagelog.jpeg",width=850)


    copyright_text = """
    <div style="text-align: center; padding: 10px; background-color: CCD1D1; border-radius: 5px;">
        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">🚀 ByteZEN © . All rights reserved. 🚀</p>
    </div>
"""

    st.markdown(copyright_text, unsafe_allow_html=True)


def image_upload_button():
    uploaded_image = None
    upload_button = st.button("📷 Upload Image")
    
    if upload_button:
        uploaded_image = st.file_uploader("Choose an image...", type=["jpg", "png", "jpeg"])

    return uploaded_image
    
def Chat_support():
    st.title("🤖 Intelligent Chat Support")
    st.write("Effortlessly connect with our AI chatbot for swift and expert IT support through text, avoiding the need for human intervention.")

    st.sidebar.selectbox("Choose Your Preferred Language", st.session_state["languages"], key=persist("language_name"))

    if "messages" not in st.session_state:
        st.session_state.messages = []

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("What is up?"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("ai"):
            full_response = response_function.generate_response(
                prompt, st.session_state.messages
            )
            st.session_state.messages.append(
                {"role": "assistant", "content": full_response}
            )

            # Implement letter-by-letter printing
            st.markdown(full_response)


def extract_text_from_image(image_bytes):
    try:
        # Initialize the OCR reader
        reader = easyocr.Reader(['en'])

        # Use EasyOCR to extract text from the image
        result = reader.readtext(image_bytes)

        # Extract and concatenate text from the result
        text = ' '.join([item[1] for item in result])

        return text
    except Exception as e:
        return str(e)



def upload_to_s3(local_file_path, bucket_name, s3_file_name):
    s3 = boto3.client('s3')

    try:
        s3.upload_file(local_file_path, bucket_name, s3_file_name)
        st.success(f"Upload Successful: {s3_file_name}")
        return f"s3://{bucket_name}/{s3_file_name}"
    except FileNotFoundError:
        st.error(f"The file {local_file_path} was not found.")
        return None
    except NoCredentialsError:
        st.error("Credentials not available.")
        return None
    

def image_support():
    st.title("📷 Image Analysis Assistance")
    st.write("Capture the challenge through an image upload, and let our AI-driven Image Analysis Assistance rapidly deliver detailed steps and troubleshooting guidance. Harness the efficiency of visuals for a seamless IT problem-solving experience.")
    

    # Image upload
    # File uploader
    uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "png", "jpeg"])
    #   st.write("File uploaded")


    if uploaded_file is not None:
        
        st.image(uploaded_file, caption="", use_column_width=True,width=100)
        #st.write("test", uploaded_file)

        file_name = uploaded_file.name
        print(file_name)
        #st.write("name", file_name)

        # Replace these with your actual AWS S3 credentials and bucket information
        AWS_ACCESS_KEY = ''
        AWS_SECRET_KEY = ''
        BUCKET_NAME = ''

        # Replace this with the desired name of the file on S3
        s3_file_name = file_name

        # Set your AWS credentials
        boto3.setup_default_session(
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY
        )

        # Upload the image to S3 and get the S3 URI
        s3 = boto3.client('s3')
        try:
            s3.upload_file(file_name, BUCKET_NAME, s3_file_name)
            print(f"Upload Successful: {s3_file_name}")
            #s3_uri = f"s3://{BUCKET_NAME}/{s3_file_name}"

            #st.write(f"S3 URI: {s3_uri}")

            # Use the S3 URI in replicate.run
            output = replicate.run(
                "yorickvp/llava-13b:<API KEY>",
                input={
                    "image": f"https://{BUCKET_NAME}.s3.amazonaws.com/{s3_file_name}",
                    
                    "prompt": "Given the uploaded image that illustrates a particular issue, instruct the Language Model to provide detailed and step-by-step resolution steps to address and fix the problem depicted in the image. The response should be clear, concise, and include any necessary actions, configurations, or troubleshooting steps required for a successful resolution.The solution given by you should consist of interpretation of the user's error in 2 lines and then provide the solution for the error in steps.",
                    "max_tokens": 1024,
                    "temperature": 0.2
                }
            )
            progress_bar = st.progress(0)
            status_text = st.empty()
        # Display the uploaded image
            for i in range(100):
    # Update progress bar.
                progress_bar.progress(i + 1)

                new_rows = np.random.randn(10, 2)

                # Update status text.
                status_text.text(
                    'Computing the issue: %s' % new_rows[-1, 1])

                # Append data to the chart.
                #chart.add_rows(new_rows)

                # Pretend we're doing some computation that takes time.
                time.sleep(0.1)

                status_text.text('Done!')
            st.header("Resolution steps:")
            st.text_area("", output,height=400)
            print(output)

        except FileNotFoundError:
            st.error(f"The file {file_name} was not found.")
        except NoCredentialsError:
            st.error("Credentials not available.")
        except Exception as e:
            st.error(f"An error occurred: {e}")

def general_queries():
    st.sidebar.title("FAQ's")
    tokenizer = AutoTokenizer.from_pretrained("mistral-7b-instruct-v0.1.Q4_0.gguf")
    base_model = AutoModelForSeq2SeqLM.from_pretrained(
        "mistral-7b-instruct-v0.1.Q4_0.gguf",
        device_map=device,
        torch_dtype=torch.float32
    )
    # Chat history for the document chat
    @st.cache_resource
    def data_ingestion():
        for root, dirs, files in os.walk("docs"):
            for file in files:
                if file.endswith(".pdf"):
                    print(file)
                    loader = PDFMinerLoader(os.path.join(root, file))
        documents = st.sidebar.file_uploader("Select a PDF Document", type=["pdf"])
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=500)
        texts = text_splitter.split_documents(documents)
        #create embeddings here
        embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
        #create vector store here
        db = Chroma.from_documents(texts, embeddings, persist_directory=persist_directory, client_settings=CHROMA_SETTINGS)
        db.persist()
        db=None 

    @st.cache_resource
    def llm_pipeline():
        pipe = pipeline(
            'text2text-generation',
            model = base_model,
            tokenizer = tokenizer,
            max_length = 256,
            do_sample = True,
            temperature = 0.3,
            top_p= 0.95,
            device="cpu"
        )
        local_llm = HuggingFacePipeline(pipeline=pipe)
        return local_llm

    @st.cache_resource
    def qa_llm():
        llm = llm_pipeline()
        embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
        db = Chroma(persist_directory="db", embedding_function = embeddings, client_settings=CHROMA_SETTINGS)
        retriever = db.as_retriever()
        qa = RetrievalQA.from_chain_type(
            llm = llm,
            chain_type = "stuff",
            retriever = retriever,
            return_source_documents=True
        )
        return qa

    # Display AI response directly below the input field
    st.subheader("AI Response:")
    st.write(qa)

def virtual_ai():
    st.subheader("Check out our [Virtual AI](https://share.streamlit.io/mesmith027/streamlit_webapps/main/MC_pi/streamlit_app.py)")
    st.markdown("<br>", unsafe_allow_html=True)

def automation_support():
    pass


#LLM Initialization
local_llm = "TheBloke/zephyr-7B-beta-GGUF"

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

# Prompt Template
prompt_template = """Use the following pieces of information to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context: {context}
Question: {question}

Only return the helpful answer below and nothing else.
Helpful answer:
"""

prompt = PromptTemplate(template=prompt_template, input_variables=['context', 'question'])

# Vector Store and Retriever
load_vector_store = Chroma(persist_directory="rag/customer_support", embedding_function=HuggingFaceBgeEmbeddings(model_name="BAAI/bge-large-en", model_kwargs={'device': 'cpu'}, encode_kwargs={'normalize_embeddings': False}))
retriever = load_vector_store.as_retriever(search_kwargs={"k": 1})


def get_response(input):
    query = input
    chain_type_kwargs = {"prompt": prompt}
    qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever, return_source_documents=True, chain_type_kwargs=chain_type_kwargs, verbose=True)
    response = qa(query)
    return response

def ragsupport():
    st.title("RAG")
    st.write("This is a RAG implementation based on Zephyr 7B Beta LLM trained on IT support.")

    # #sample_prompts = ["what is the fastest speed for a greyhound dog?",
    #                   "Why should we not feed chocolates to the dogs?",
    #                   "Name two factors which might contribute to why some dogs might get scared?"]

    input_prompt = st.text_input("Ask your Question", "")

    if st.button("Get Response"):
        response = get_response(input_prompt)
        st.subheader("Response:")
        st.write(response)
    

if "page" not in st.session_state:
    # Initialize session state.
    st.session_state.update({
        # Default page.
        "page": "Home",

        "list": [],

        # Languages which you prefer
        "languages": ["English", "French", "Hindi", "Tamil"],
    })
    #st.balloons()
#     #st.snow()



page_names_to_funcs = {
    "Home": main,
    "💬CHAT ASSIST": Chat_support,
    "🧠VIRTUAL AI":virtual_ai,
    "📷VISION GUIDANCE": image_support,
    "❓GENERAL QUERIES": general_queries,
    #"📚RAG": ragsupport,
    "🤖AUTOMATION_SUPPORT": automation_support,

}


status_placeholder = st.empty()
# Load widget state
load_widget_state()
demo_name = st.sidebar.selectbox("SUPPORT MODE", page_names_to_funcs.keys())

page_names_to_funcs[demo_name]()

with st.sidebar:

    st.image("logoside.jpeg")
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("<br>", unsafe_allow_html=True)
    #st.text("Made by ByteZEN!")
    # st.image("logoside.jpeg")
    #st.title("My Streamlit App")
    st.markdown("Follow us")
    #st.write("[![Star](https://img.shields.io/github/stars/Hemachandirant/MetaHuman.svg?logo=github&style=social)](https://github.com/Hemachandirant/MetaHuman)")
    st.write("[![Follow on Twitter](https://img.shields.io/twitter/follow/bytezen?style=social)](https://twitter.com/hemac140)")
    st.write("[![Connect on LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=social&logo=linkedin)](https://www.linkedin.com/in/hemachandiran-t-081836171/)")

    


