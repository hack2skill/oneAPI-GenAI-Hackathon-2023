
# from pdfminer.high_level import extract_text
from haystack.nodes import PromptNode
# from haystack.pipelines import GenerativeQAPipeline
# from haystack.utils import  print_answers,convert_files_to_docs
import os
# from haystack import Pipeline
from haystack.nodes.prompt import PromptNode, PromptModel
from haystack.nodes import PromptNode, PromptTemplate, AnswerParser
# from haystack.nodes import BM25Retriever
from haystack.pipelines import Pipeline
from haystack.schema import Document

os.environ['FAISS_NO_AVX2'] = '1'

from langchain.document_loaders import TextLoader
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS





def MyHaystackPipeline(query):
    print(query)



    rag_prompt = PromptTemplate(
    prompt="""Provide a clear and concise response that summarizes the key points and information presented in the text.
                Use an unbiased and journalistic tone. Do not repeat text, in short way possible within 70 words.
                \n\n Related text: {join(documents)} \n\n Question: {query} \n\n Answer:""",

    output_parser=AnswerParser(),
    )
    loader = TextLoader("Datasets/case-123.txt")
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
# docs = text_splitter.split_documents(documents)

    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    docs = text_splitter.split_documents(documents)
    
    db = FAISS.from_documents(docs, embeddings)
    docs = db.similarity_search(query)
    print(docs[0].page_content)

    prompt_node = PromptNode(
    model_name_or_path="mistralai/Mistral-7B-v0.1 OR PATH TO THE MODEL", api_key='YOUR_API_KEY', default_prompt_template=rag_prompt, max_length=350
    )


    pipe = Pipeline()
    # pipe.add_node(component=retriever, name="retriever", inputs=["Query"])
    pipe.add_node(component=prompt_node, name="prompt_node", inputs=["Query"])
    ans = pipe.run(query=query,documents=[Document(docs[0].page_content)])
    print(ans["answers"][0].answer)
    return ans["answers"][0].answer

# print(MyHaystackPipeline("Tell me about Olivia Thompson case?"))

