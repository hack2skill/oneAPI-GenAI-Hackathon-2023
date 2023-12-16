from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.document_loaders import PyPDFLoader
from langchain.document_loaders import DirectoryLoader
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains.question_answering import load_qa_chain
from langchain import HuggingFaceHub

# from InstructorEmbedding import INSTRUCTOR


# Load and process the pdf files
loader = DirectoryLoader('./cases', glob="./*.pdf", loader_cls=PyPDFLoader)
documents = loader.load()

#splitting the text into
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
texts = text_splitter.split_documents(documents)

# Embeddings
embeddings = HuggingFaceEmbeddings()

db = Chroma.from_documents(texts, embeddings)

llm=HuggingFaceHub(repo_id="HuggingFaceH4/zephyr-7b-beta", model_kwargs={"temperature":0.02, "max_length":512},huggingfacehub_api_token='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')

chain = load_qa_chain(llm, chain_type="stuff")

query = "who is the judge for  the case Shaikh Maqsood v State of Maharashtra ? give only his/her name"
search_type="mmr"
docs = db.search(query,search_type)
print(chain.run(input_documents=docs, question=query))
