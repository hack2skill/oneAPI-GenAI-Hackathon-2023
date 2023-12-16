from gtts import gTTS
from langchain.chat_models import ChatGooglePalm
from transformers import BlipProcessor, BlipForConditionalGeneration, AutoModelForCausalLM, AutoTokenizer
from langchain.document_loaders.csv_loader import CSVLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import CTransformers
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
import sys
import csv
import os
# import intel_exstention_pytorch as ipex


os.environ['CMAKE_ARGS'] = '-DLLAMA_OPENBLAS=on'
os.environ['FORCE_CMAKE'] = '1'


class Intel_Model:
    def __init__(self):
        # Load the Vision Large Language Model
        self.image_processor_path = "Machine-Leaning\\image-models-processor\\"
        self.image_model_path = "Machine-Leaning\\image-models\\"
        self.image_processor = BlipProcessor.from_pretrained(self.image_processor_path)
        self.image_model = BlipForConditionalGeneration.from_pretrained(self.image_model_path)

        self.chatbot_path = "Machine-Leaning\\chatbot_model\\"
        self.chatbot_token_path = "Machine-Leaning\\chatbot_tokenizer\\"

        self.chatbot_tokenizer = AutoTokenizer.from_pretrained(self.chatbot_token_path, padding_side='left')
        self.chatbot_model = AutoModelForCausalLM.from_pretrained(self.chatbot_path)
        DB_FAISS_PATH = "vectorstore/db_faiss"
        loader = CSVLoader(file_path="C:\\Users\\jains\\OneDrive\\Desktop\\oneAPI-GenAI-Hackathon-2023\\Optic\\website"
                                     "\\products.csv", encoding="utf-8", csv_args={'delimiter': ','})
        data = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=20)
        text_chunks = text_splitter.split_documents(data)
        embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
        docsearch = FAISS.from_documents(text_chunks, embeddings)
        llm = CTransformers(model="TheBloke/Llama-2-13B-Ensemble-v5-GGUF",
                            model_file="llama-2-13b-ensemble-v5.Q5_K_M.gguf",
                            model_type="llama",
                            max_new_tokens=512,
                            temperature=0.1, n_gpu_layers=200)
        llm_chat = ChatGooglePalm(google_api_key="AIzaSyDTi3N4HBRfnfbctmWK0czsZmzH0knlkow")
        self.qa = ConversationalRetrievalChain.from_llm(llm_chat, retriever=docsearch.as_retriever(),max_tokens_limit=512)

    def Image_Description_Generation(self, image):
        inputs = self.image_processor(image, return_tensors="pt")

        out = self.image_model.generate(**inputs, max_new_tokens=1000)
        return self.image_processor.decode(out[0], skip_special_tokens=True)

    def chatbot(self, text):
        result = self.qa({"question": text, "chat_history": []})
        return result['answer'].split('\n')[0]

    def chat(self, text):
        chat_history = []
        tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
        model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")

        result = self.qa({"question": text, "chat_history": chat_history})
        language = 'en'

        # Passing the text and language to the engine,
        # here we have marked slow=False. Which tells
        # the module that the converted audio should
        # have a high speed
        myobj = gTTS(text=result['answer'], lang=language, slow=False)

        # Saving the converted audio in a mp3 file named
        # welcome
        myobj.save("static/img/file_example_MP3_700KB.mp3")
        return result['answer']
