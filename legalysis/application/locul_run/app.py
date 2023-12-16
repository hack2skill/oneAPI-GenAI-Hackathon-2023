import streamlit as st
from streamlit_option_menu import option_menu
import json
import requests  # pip install requests
#import streamlit as st  # pip install streamlit
from streamlit_lottie import st_lottie  # pip install streamlit-lottie
import time  
from datetime import date

import requests

# GitHub: https://github.com/andfanilo/streamlit-lottie
# Lottie Files: https://lottiefiles.com/

def load_lottiefile(filepath: str):
    with open(filepath, "r") as f:
        return json.load(f)


def load_lottieurl(url: str):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()
    

lottie_coding = load_lottiefile("lottiefile.json")  # replace link to local lottie file
lottie_hello = load_lottieurl("https://assets9.lottiefiles.com/packages/lf20_M9p23l.json")


st.set_page_config(layout="wide")

st.markdown("""<img src='https://logo6303.s3.amazonaws.com/logo6.png' width=350 height= 80  >""", True)

col3,col4 = st.columns([7,3])

with col3:
    st.markdown("""<br><p style="font-family:Verdana;font-size: 15px;float:left;padding:5rem 5rem 0 0">Revolutionize your legal approach with AI-powered Document summarization, Legal case analasys and developing Litigation strategies. Streamline processes and gain crucial insights for optimized outcomes.</p>""",True)

with col4:
    st_lottie(
    lottie_coding,
    speed=1,
    reverse=False,
    loop=True,
    quality="low", # medium ; high
    #renderer="svg", # canvas
    height=250,
    width=250,
    key=None,
)

    

# st.title("Legalysis")
# st.caption("Revolutionize your legal approach with AI-powered litigation strategies and document summarization. Streamline processes and gain crucial insights for optimized outcomes.")
st.markdown(
        """
        <style>
            .title {
                background-image: url('C:/Users/Kodee/Desktop/webapp/images/law.jpg');
                background-size: cover;
                color: #ffffff;
            }
        </style>
        """,
        unsafe_allow_html=True
    )

selected=option_menu(
        menu_title=None, #mandatory required
        options=["Summarize Document","Legal Research","IPC","Litigation Strategy"], 
        icons=["book","house","bezier","upc-scan"],#optional
        menu_icon=["cast"],
        default_index=0,
        orientation="horizontal",
                    styles={
                "container": {"padding": "0!important", "background-color": "#fafafa"},
                "icon": {"color": "orange", "font-size": "25px"},
                "nav-link": {
                    "font-size": "20px",
                    "text-align": "center",
                    "margin": "0px",
                    "--hover-color": "#eee",
                },
                "nav-link-selected": {"background-color": "green"},
            },
    )

  

import PyPDF2


def set_background_color(color):
    """
    Set the background color of the entire app.

    Parameters:
    - color (str): The background color in CSS format (e.g., 'lightblue').
    """
    page_bg_color = f"""
        <style>
            body {{
                background-color: {color};
            }}
        </style>
    """
    st.markdown(page_bg_color, unsafe_allow_html=True)

def read_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page_num in pdf_reader.pages:
        text += page_num.extract_text()
    return text




def main():
    # st.header(":green[Upload your file]")
    st.markdown("""<h3 style="color:#3F000F;font-family:Verdana">Upload your file</h3>""",True)
    st.markdown("""  
    <style>  
    .stButton>button {  
        background-color: #4CAF50;  
        color: white;
        margin-top: 20px;  
    }, 
    </style>  
    """, unsafe_allow_html=True) 

    #create columns
    col1, col2 = st.columns(2)

    # File upload widgets
    uploaded_file = col1.file_uploader("Upload a file", type=["pdf", "txt"],label_visibility="collapsed")
    

    if uploaded_file is not None:
        st.success("File successfully uploaded!")

   

    if col2.button('Generate summary'):
        if uploaded_file is not None:
           
            if uploaded_file.type == "application/pdf":
                st.write("### PDF Content")
                pdf_text =  read_pdf(uploaded_file)
                st.write(pdf_text)

            elif uploaded_file.type == "text/plain":
                text_content = uploaded_file.getvalue().decode("utf-8")
                API_URL = "Input the ngrok url from Intel Developer Cloud"
                def query(payload):
                    response = requests.post(API_URL, json=payload)
                    return response.json()
                output = query({ "data":"Summarization"," description": text_content})
                output1 = output[0]['generated_text']
                result = output1.replace(text_content," ")
                
                
                html_code1 = """<div style="background-color:#ffffff;padding:50px;border-radius: 10px">  
                        <p style="text-align:center;font-family:Verdana">{}</p></div> """.format(result)
            
                # Display a message in white color  
                st.markdown('<h4 style="color:#3F000F;font-family:Verdana">Summarizing content....</h4>', unsafe_allow_html=True)  

                # st.write("### Summarized Content")
                st.markdown("""<h4 style="color:#3F000F;font-family:Verdana">Summarized Content</h4>""",True)
                st.markdown(html_code1, unsafe_allow_html=True)
        
        else:
            st.write("No file uploaded") 

def rag(question):
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.chains import RetrievalQA
    from langchain.document_loaders import TextLoader
    from langchain.document_loaders import PyPDFLoader
    from langchain.document_loaders import DirectoryLoader
    from langchain.embeddings import HuggingFaceEmbeddings
    from langchain.vectorstores import Chroma
    from langchain.chains.question_answering import load_qa_chain
    from langchain import HuggingFaceHub

    # Load and process the pdf files
    loader = DirectoryLoader('./cases', glob="./*.pdf", loader_cls=PyPDFLoader)
    documents = loader.load()

    #splitting the text into
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.split_documents(documents)

    # Embeddings
    embeddings = HuggingFaceEmbeddings()
    db = Chroma.from_documents(texts, embeddings)
    llm=HuggingFaceHub(repo_id="HuggingFaceH4/zephyr-7b-beta", model_kwargs={"temperature":0.02, "max_length":512},huggingfacehub_api_token='token')
    chain = load_qa_chain(llm, chain_type="stuff")
    search_type="mmr"
    docs = db.search(question,search_type)

    return chain.run(input_documents=docs, question=question)

def text_input(selected):
    # st.header("Legal Assistant")
    st.markdown("""<h3 style="color:#3F000F;font-family:Verdana">{} Assistant</h3>""".format(selected),True)

    # #text input widget
    # question = st.text_area("Ask your question", placeholder='Message your assistant', height=2,label_visibility="collapsed" )

    if selected == "Legal Research":
        question = st.text_area("Ask your question", placeholder='Message your assistant', height=2,label_visibility="collapsed" )
        if question != "":
            
            # Display a message in white color  
            st.markdown('<h3 style="color:#3F000F;font-family:Verdana">Generating content....</h3>', unsafe_allow_html=True) 
        
            result = rag(question)
            html_code2 = """<div style="background-color:#ffffff;padding:50px;border-radius: 10px">  
                        <p style="text-align:center;font-family:Verdana">{}</p></div> """.format(result)
            st.markdown("""<h3 style="color:#3F000F;font-family:Verdana">Generated content</h3>""",True)
            st.markdown(html_code2, unsafe_allow_html=True)
            question = ""
    if selected == "IPC":
        question1 = st.text_area("Ask your question", placeholder='Message your assistant', height=2,label_visibility="collapsed" )
        if question1 != "":
            API_URL = "https://api-inference.huggingface.co/models/Bhuvanesh-Ch/Tout"
            headers = "huggingface key"
            def query(payload):
                response = requests.post(API_URL, headers=headers, json=payload)
                return response.json()
            
            output = query({ "inputs": "What does Section 10000000 from XVII about?s", })
            res = output[0]['generated_text']
            # Display a message in white color  
            st.markdown('<h3 style="color:#3F000F;font-family:Verdana">Searching....</h3>', unsafe_allow_html=True)
            
        
            # st.write("### Summarized Content")
            html_code3 = """<div style="background-color:#ffffff;padding:50px;border-radius: 10px">  
                        <p style="text-align:center;font-family:Verdana">{}</p></div> """.format(res)
            
            st.markdown("""<h3 style="color:#3F000F;font-family:Verdana">Search result</h3>""",True)
            st.markdown(html_code3, unsafe_allow_html=True) 
    if selected == "Litigation Strategy":
        question1 = st.text_area("Ask your question", placeholder='Message your assistant', height=2,label_visibility="collapsed" )
        if question1 != "":
            
            # Display a message in white color  
            st.markdown('<h3 style="color:#3F000F;font-family:Verdana">Generating litigation strategy....</h3>', unsafe_allow_html=True)
            API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"
            headers = {"Authorization": "Bearer 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"}
            def query(payload):
                response = requests.post(API_URL, headers=headers, json=payload)
                return response.json()
            inp = "Give me a decent litigation strategy with key arguments for the following in 50 words and don't include the prompt I sent."+" question1"+" Your strategy should aim to protect your client's interests, minimize potential damages, and achieve a favorable outcome in the litigation. "
            output = query({ "inputs": inp, })
            output1 = output[0]['generated_text']
            result = output1.replace(inp," ")
            
            # st.write("### Summarized Content")
            st.markdown("""<h3 style="color:#3F000F;font-family:Verdana">Litigation strategy</h3>""",True)
            html_code4 =  """<div style="background-color:#ffffff;padding:50px;border-radius: 10px">  
            <p style="text-align:center;">{}</p>  
            </div> """.format(result)
            st.markdown(html_code4, unsafe_allow_html=True) 


if selected=="Litigation Strategy":
    # st.header("In Progress...")
    # st.markdown("""<h2 style="color:#ffffff">In Progress...</h2>""",True)
    text_input(selected)
if selected=="Summarize Document":
    #st.title(f"Please upload your file for summarization")
    main()
if selected == "Legal Research":
    text_input(selected)
if selected == "IPC":
    text_input(selected)

# # st.set_page_config(page_title="My first project",layout="wide", page_icon=":tada:")
# # # ---- HEADER SECTION ----
# # with st.container():
# #     st.subheader("Hi, I am Kodees :wave:")
# #     st.title("Streamlit option menu")
# #     st.write(
# #         "Instead of looking at my page why can't you just focus on your work."
# #     )
# #     st.write("[Learn More >](https://pythonandvba.com)")


# Create a lot of empty space before the footer
for _ in range(4):  
    st.write("\n") 

# Get the current year  
current_year = date.today().year  

# Display the copyright notice  
# st.markdown('&#169; Copyright 2023 Legalysis, Inc. All rights reserved.', unsafe_allow_html=True)  
st.markdown("""<p style="color:#595959;text-align: center;">&#169; Copyright 2023 Legalysis, Inc. All rights reserved.</p>""",True)




