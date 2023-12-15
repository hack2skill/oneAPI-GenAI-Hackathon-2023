
# from huggingface_hub import hf_hub_download
# import pandas as pd
# import pydeck as pdk
# from langchain.document_loaders import PyPDFLoader, OnlinePDFLoader
# import textwrap
# from langchain.text_splitter import CharacterTextSplitter
import time
# import requests
# import numpy as np
# import fitz
import streamlit as st
import os
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import HuggingFaceHub
import torch
from transformers import pipeline
from peft import AutoPeftModelForCausalLM
from transformers import GenerationConfig
from transformers import AutoTokenizer
from streamlit_option_menu import option_menu
import PyPDF4
from io import BytesIO




def loading_dataKnowledge():
    ############################### RAG GETTING ANSWERS FROM KNOWLEDGEBASE ##############################################
    ###############################LOADING DOCUMENT IN DB AND MAKING IT TO VECTOR########################################  
    # loader = PyPDFLoader("C:\\Users\\HP\\Downloads\\SpeechToSpeechBot\\SpeechToSpeechBot\\hackathon\\COI.pdf")
    #loader = PyPDFLoader("/content/The-Field-Guide-to-Data-Science.pdf")
    #!gdown "https://drive.google.com/uc?id=15hUEJQViQDxu_fnJeO_Og1hGqykCmJut&confirm=t"
    # data = loader.load()
    # documents=data
    # text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    # docs = text_splitter.split_documents(documents)
    ######################################################################################################################
    
    ###################################LOADING LOCALY STORD DB############################################################
    os.environ["HUGGINGFACEHUB_API_TOKEN"] = "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"
    embeddings = HuggingFaceEmbeddings()
    db =FAISS.load_local("/home/ubuntu/jupyter_env/Intel-Hackathon/hackathon/db", embeddings)
    llm=HuggingFaceHub(repo_id="HuggingFaceH4/zephyr-7b-beta", model_kwargs={"temperature":0.7, "max_length":1024}) #USEING ZEPHUR FOR GETING DOMINE KNOWLEDGE WITH TRAINED DATA
    chain = load_qa_chain(llm, chain_type="stuff")
    return db,chain

##############################################INFERENCING LLM MODEL USING intel_extension_for_transformers#########################################
def Zephyr_response(prompt):                # SAMPLE INFRENCING HuggingFaceH4/zephyr-7b-beta TO RUN IN INTEL DEVELOPER CLOUD NOTEBOOK

    import subprocess

    # Uninstall the existing transformers version
    subprocess.run(['pip', 'uninstall', '-y', 'transformers'])

    # Install the desired version of transformers
    subprocess.run(['pip', 'install', 'transformers==4.34.1'])
    subprocess.run(['pip', 'install', 'intel-extension-for-transformers'])
    from transformers import AutoTokenizer, TextStreamer
    from intel_extension_for_transformers.transformers import AutoModelForCausalLM


    model_name = "HuggingFaceH4/zephyr-7b-beta"     # Hugging Face model_id or local model
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
    inputs = tokenizer(prompt, return_tensors="pt").input_ids
    streamer = TextStreamer(tokenizer)
    model = AutoModelForCausalLM.from_pretrained(model_name, load_in_8bit=False)
    outputs = model.generate(inputs, streamer=streamer, max_new_tokens=300)
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(generated_text)
    return generated_text
def process_data_sample2(example):   # PROMPT TUNING TO GET REQUIRED RESPONSE FOR LEGAL DOCUMENT

      processed_example = "<|system|>\n You are legal document generator and is going to prepare a document for user with given prompt. you always give best document possible in correct format.ensure that the document is always complete.it should not be incomplete.</s>\n<|user|>\n" + example["instruction"] + "</s>\n<|assistant|>\n"

      return processed_example

def doucument_creation(sentence):    # DOCUMENT CREATING USING FINE TUNED LLM 
  tokenizer = AutoTokenizer.from_pretrained("/content/drive/MyDrive/intel hackathon/simple1")  #LOADING OUR MODEL FROM LOCAL DRIVE
  inp_str = process_data_sample2(
      {
          "instruction": sentence,
      }
  )

  inputs = tokenizer(inp_str, return_tensors="pt").to("cuda")                           #SINCE OUR LLM MODEL IS GPTQ WE REQUIRE CUDA OR SOME GPU

  model = AutoPeftModelForCausalLM.from_pretrained(
      "/content/drive/MyDrive/intel hackathon/simple1",
      low_cpu_mem_usage=True,
      return_dict=True,
      torch_dtype=torch.float16,
      device_map="cuda")

  generation_config = GenerationConfig(
      do_sample=True,
      top_k=1,
      temperature=0.1,
      max_new_tokens=256,
      pad_token_id=tokenizer.eos_token_id
  )
  return model,generation_config,inputs,tokenizer

     
def process_data_sample(example):   # PROMPT TUNING TO GET REQUIRED RESPONSE FOR SUMMARIZATION
    processed_example = "<|system|>\n You are document sumarizer who is going to summarise the content without missing any keypoints in a concise manner.Truncate the input if it it beyond length you can handle.always give a complete sentence which makes sense and inform how much word you can handle and take care of grammer and use Capital letter wereever nessary</s>\n<|user|>\n" + example["instruction"] + "</s>\n<|assistant|>\n"
    return processed_example
   
def document_summarization(sentence):
  tokenizer = AutoTokenizer.from_pretrained("sample2")
  inp_str = process_data_sample(
    {
        "instruction": sentence,
    }
    )
  inputs = tokenizer(inp_str, return_tensors="pt").to("cuda")                   #SINCE OUR LLM MODEL IS GPTQ WE REQUIRE CUDA OR SOME GPU

  model = AutoPeftModelForCausalLM.from_pretrained(
    "sample2",
    low_cpu_mem_usage=True,
    return_dict=True,
    torch_dtype=torch.float16,
    device_map="cuda")

  generation_config = GenerationConfig(
      do_sample=True,
      top_k=1,
      temperature=0.1,
      max_new_tokens=256,
      pad_token_id=tokenizer.eos_token_id
  )
  return model,generation_config,inputs,tokenizer





#st.title="IntelliLegalHub"
st.set_page_config(
  page_title="IntellLegalHub", layout="wide",
  page_icon="⚖️",
)

# Define header  

def sign_up():
    # Your sign-up logic goes here
    st.write("Signing up...")

# Function to simulate login action
def log_in():
    # Your login logic goes here
    st.write("Logging in...")

header_container = st.container()
with header_container:
    col1, col2, col3 = st.columns([3, 1, 1])

    with col1:
        # Add logo at the start of your application
        st.image("image.png",use_column_width=True)  # Adjust width as needed

    with col3:
        st.write("")  # Placeholder for alignment
        col_signup, col_login = st.columns(2)

        with col_signup:
            if st.button("Sign Up"):
                sign_up()

        with col_login:
            if st.button("Log In"):
                log_in()

with st.sidebar:
            selected = option_menu(
                menu_title="IntellLegalHub",  # required
                options=["Home", "Document Creator", "Legal Insights Hub", "Document Summarizer & Reader"],  # required
                icons=["house", "book", "search", "book-fill"],  # optional
                menu_icon="robot",  # optional
                default_index=0,  # optional
            )


if selected ==  "Home":
   
    st.markdown("---")
    word='''
    Welcome to IntellLegalHub, where innovation meets legal expertise. Our platform is dedicated to revolutionizing the legal landscape by harnessing the power of artificial intelligence. Designed to assist lawyers in their work, our AI-powered solution is finely tuned with the latest in Legal Language Models
    '''
    st.write(word)
 
# Define headers and text
    lines = [
        "<b>AI Empowered Document Creation </b><br> &nbsp;&nbsp;&nbsp;Create legally binding documents effortlessly. Craft Non-Disclosure Agreements, Wills, Articles of Incorporation, and more, all powered by cutting-edge AI precision.",
        "<b>AI-Driven Legal Insights Hub </b><br>&nbsp;&nbsp;&nbsp; Dive into legal intricacies effortlessly. Explore IPC and CRPC sections, previous case judgments, law amendments, exceptions, and specialized interpretations with our AI-powered legal insights hub.",
        "<b>AI-Enabled Document Summarizer & Reader </b><br> &nbsp;&nbsp;&nbsp;Condense complexity, elevate understanding. Summarize extensive documents, including judgments, and convert them into audio, simplifying comprehension with AI-enabled summarization and reader features."
    ]
    colors = ["#ffffff", "#ffffff", "#ffffff"]  # Different shades of gray
 
    # Display each line with a padding box and background color
    for i in range(len(lines)):
        st.markdown(
            f"""
            <div style=' padding: 10px; margin: 5px; font-size:15px; background-color: {colors[i]};'>{lines[i]}</div>
            """,
            unsafe_allow_html=True
        )

if selected == "Document Creator":
    st.markdown("---")

    ttl_container = st.container()
    with ttl_container:
        col1, col2 = st.columns([1, 9])
        with col1:
            st.image("paper.png",width=70)
        with col2:
            st.markdown(
                
                f"""
                <div style="text-align: left">
                    <h3>AI Powered Document Creation</h3>
                </div>
                """,
                unsafe_allow_html=True,
            )


    # Document types  

    def display_content():
        lines = [
            "Non - Disclousure Agreement (NDA) &ensp; &ensp; &ensp; &ensp; &ensp; &ensp; Will and Testament",
            "Articles of Incorporation Contract  &ensp; &ensp; &ensp; &ensp; &ensp; &ensp; Power of Attorney"
        ]
        colors = ["#ffffff", "#ffffff"]  # Background color: gray

        for i in range(len(lines)):
            st.markdown(
                f"""
                <div>
                <div style='padding: 10px; text-align: center; font-size: 20px; margin: 5px; background-color: {colors[i]};'>
                {lines[i]}
                </div>
                </div>
                """,
                unsafe_allow_html=True
            )

    button_label = "⮟"
    st.write("<p style='font-size: 15px; font-weight: bold;'>To view all features</p>", unsafe_allow_html=True)
    display_content_flag = False

    if st.button(button_label):
        display_content_flag = not display_content_flag
        if display_content_flag:
            display_content()

    if display_content_flag:
        st.button("⮝")
    else:
        st.empty()


    st.markdown("---")

    # Title for chat  
    st.write("How can I help you today?")  
    # Chat input  
    message = st.text_input("", placeholder="Type your message here...")  
    # Display user messages  
    try:
      if st.button("Send ➤"):  
        st.image("user.png", width=50)
        st.write("", message)  
        msg=message+" Give me the legal document based on Indian law for above query, and in 1 page and in correct format, give me the complete document only the assistant response dont give the system and user passage ,The document should be complete and in proper format"
        model,config,inputs,tokenizer=doucument_creation(message)
        outputs = model.generate(**inputs, generation_config=config)
        bot_response=tokenizer.decode(outputs[0], skip_special_tokens=True)
        # Compute the bot response  
        # bot_response =Zephyr_response(msg)
        parts = bot_response.split("<|assistant|>", 1)
        result=""
        if len(parts) > 1:
            # Extract the text before the substring
            result = parts[1]
            print(result)
        else:
            print("something went wrong")
        bot_response=result
        
        #Display the bot response in the main window  
        st.image("bot.png", width=50)
        st.write("", bot_response)
    except Exception as e:
       bot_response =Zephyr_response(msg)
       st.image("bot.png", width=50)
       st.write("", bot_response)
    finally:
       # Chat display  
        st.markdown("---")
        st.subheader("Chat History")  
        st.empty()  
   
def response(msg,db):
    docs = db.similarity_search(msg)
   
    return docs
if selected == "Legal Insights Hub":
       
    #splitdataset()if selected == "Legal Insights Hub":
    st.markdown("---")
    ttl1_container = st.container()
    with ttl1_container:
        col1, col2 = st.columns([1, 9])
        with col1:
            st.image("loupe.png",width=70)
        with col2:
            st.markdown(
                f"""
                <div style="text-align: left">
                    <h3>AI - Driven Legal Insights Hub</h3>
                </div>
                """,
                unsafe_allow_html=True,
            )
 
# Content for AI - Driven Legal Insights Hub section  
    def display_content():
        lines = [
            "Queries IPC and CRPC Sections &ensp; &ensp; &ensp; &ensp; &ensp; &ensp; Queries previous case Judgements",  
            "Checks for amendments in laws &ensp; &ensp; &ensp; &ensp; &ensp; &ensp; Checks for exceptions from clause",  
            "Checks for special interpretation for the law"
        ]
        colors = ["#ffffff", "#ffffff", "#ffffff", "#ffffff"]  # Background color: gray

        for i in range(len(lines)):
            st.markdown(
                f"""
                <div>
                <div style=' padding: 10px; text-align: center;  font-size: 20px; margin: 5px; background-color: {colors[i]};'>{lines[i]}</div>
                </div>
                """,
                unsafe_allow_html=True
            )
            
    
    db,chain=loading_dataKnowledge()
    button_label = "⮟"
    st.write("<p style='font-size: 15px; font-weight: bold;'>To view all features</p>", unsafe_allow_html=True)
    display_content_flag = False

    if st.button(button_label):
        display_content_flag = not display_content_flag
        if display_content_flag:
            display_content()

    if display_content_flag:
        st.button("⮝")
    else:
        st.empty()


    st.markdown("---")
 
    st.write("What infromation do you want to know?")  
 
    # Chat input  
    message = st.text_input("", placeholder="Type your message here...")
    # Display user messages
    try:
      if st.button("Send ➤"):
        st.image("user.png", width=50)  
        st.write("", message)  
        msg=message+" ? Give me the response based on content given if available , stop at full stop. if not use your knowledge. Ensure the answer is precise and complete. Be on the point while answering and try to be legally sound.Your Response should be always complete."  
        

        # Compute the bot response  
        bot_response =chain.run(input_documents=response(msg,db) , question= msg)
        
        
        # Display the bot response in the main window  
        st.image("bot.png", width=50)
        st.write("", bot_response)
    except Exception as e:
        st.image("bot.png", width=50)
        st.write("SomeThing went wrong")
    finally:
        st.markdown("---")
        st.subheader("Chat History")  
        st.empty()

if selected == "Document Summarizer & Reader":
    st.markdown("---")
    ttl2_container = st.container()
    with ttl2_container:
        col1, col2 = st.columns([1, 9])
        with col1:
            st.image("reading.png",width=70)
        with col2:
            st.markdown(
                f"""
                <div style="text-align: left">
                    <h3>AI enabled Document Summarizer & Reader</h3>
                </div>
                """,
                unsafe_allow_html=True,
            )
 
    # Creating narrower boxes in a single row with three columns
    def display_content():
        lines = [
            "Summarizes Judgements  &ensp; &ensp; &ensp; &ensp; &ensp; &ensp; Summarizes long documents",
            "Converts the summarized document to audio"
        ]
        colors = ["#ffffff", "#ffffff"]  # Background color: gray

        for i in range(len(lines)):
            st.markdown(
                f"""
                <div style='padding: 10px; text-align: center;  font-size: 20px; margin: 5px; background-color: {colors[i]};'>{lines[i]}</div>
                """,
                unsafe_allow_html=True
            )

    button_label = "⮟"
    st.write("<p style='font-size: 15px; font-weight: bold;'>To view all features</p>", unsafe_allow_html=True)
    display_content_flag = False

    if st.button(button_label):
        display_content_flag = not display_content_flag
        if display_content_flag:
            display_content()

    if display_content_flag:
        st.button("⮝")
    else:
        st.empty()
   
    st.markdown("---")

    st.write("How can I help you today?")  
    message_from_pdf=""
    def read_pdf(file):
        pdf_reader=PyPDF4.PdfFileReader(file)
        text=""
        for page in range(pdf_reader.getNumPages()):
            page_obj=pdf_reader.getPage(page)
            text +=page_obj.extractText()
        return text

    uploaded_file = st.file_uploader("Upload a PDF", type="pdf")
    print(uploaded_file)
    if uploaded_file is not None:
        # Process the uploaded file (for example, display its content)
        file_contents = uploaded_file.read()
        text=read_pdf(BytesIO(file_contents))
        message_from_pdf=text
        
        # print(text+"HHHHHHHHHHHHHHHHHHHHHHHH")
    
    message = st.text_input("", placeholder="Type your message here...")  
    message=message_from_pdf
        # Display user messages  
    try:
      if st.button("Send ➤"):
        st.image("user.png", width=50)  
        st.write("", message)  
        msg=message+"summarize the above content without loosing any key points"
        model,con,inp,tokenizer=document_summarization(msg)
        outputs = model.generate(**inp, generation_config=con)
        bot_response=(tokenizer.decode(outputs[0], skip_special_tokens=True))
        print(bot_response+"************************************************")
        parts = bot_response.split("<|assistant|>", 1)
        result=""
        if len(parts) > 1:
            # Extract the text before the substring
            result = parts[2]
            print(result)
        else:
            print("Substring not found in the string.")
        
        # Display the bot response in the main window
      
        st.image("bot.png", width=50)  
        st.write("", bot_response)
    except Exception as e:
        bot_response =Zephyr_response(msg)
        st.image("bot.png", width=50)  
        
        st.write("", bot_response)
    finally:
        st.markdown("---")
        st.subheader("Chat History")  
        st.empty()  
    
   



#i button
def display_info_buttons():
    sb1_container = st.sidebar.container()
    with sb1_container:
        col1, col2 = st.columns([1, 7])
        with col1:
            st.image("about.png", width=30)
        with col2:
            st.button("About", key="about_button")

    sb2_container = st.sidebar.container()
    with sb2_container:
        col1, col2 = st.columns([1, 7])
        with col1:
            st.image("help.png", width=30)
        with col2:
            st.button("Help", key="help_button")

    sb3_container = st.sidebar.container()
    with sb3_container:
        col1, col2 = st.columns([1, 7])
        with col1:
            st.image("appdocs.png", width=30)
        with col2:
            st.button("Document", key="document_button")

# Sidebar info button
info_clicked = st.sidebar.button("ℹ️")
if info_clicked:
    if "displayed" not in st.session_state:
        st.session_state.displayed = False  # Initialize the state if not set

    if st.session_state.displayed:
        st.session_state.displayed = False  # Hide content if already displayed
    else:
        display_info_buttons()  # Show buttons if not displayed
        st.session_state.displayed = True
 
logo=st.sidebar.container()
with logo:
    st.image("logo.png")

#footer in sidebar
footer_container = st.sidebar.container()  
with footer_container:  
     st.markdown(  
        f"""  
        <div style=" margin: 0 auto; text-align: center">  
            <p>Follow Us on </p>  
            
        </div>  
        """,
        unsafe_allow_html=True, )
     col1, col2, col3,col4 = st.columns([1, 1, 1,1])
     with col1:
        st.image("facebook.png")
     with col2:
        st.image("whatsapp.png")
     with col3:
        st.image("instagram.png")
     with col4:
        st.image("linkedin.png")
     st.markdown(  
        f"""  
        <div style=" margin: 0 auto; text-align: center">
         <p>Contact Us:&nbsp&nbsp<a href="mailto:intellilegalhub@gmail.com">IntelliLegalHub</a></p>  
        <p>©️ 2023 IntelliLegalHub. All rights reserved.</p>
            
        </div>  
        """,
        unsafe_allow_html=True, )
