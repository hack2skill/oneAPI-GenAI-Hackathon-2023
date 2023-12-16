from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
import sklearn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearnex import patch_sklearn,config_context
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
import modin.pandas as mpd
import pandas as pd
import time
from haystack.nodes import PreProcessor
from haystack.utils import  convert_files_to_docs
import glob


def covert_docs():
    docs = convert_files_to_docs("new_dataset/datasets", split_paragraphs=True)
    preprocessor = PreProcessor(
    clean_empty_lines=True,
    clean_whitespace=True,
    clean_header_footer=True,
    split_by="word",
    split_respect_sentence_boundary=True,
    )
    docs = preprocessor.process(docs)
    for doc in docs:
        doc.content = doc.content.replace("\n", " ")
    return docs 
doc = covert_docs()
list_page = [x.content for x in doc]

def similarity_search(query,k):
    # doc = covert_docs()
    # list_page = [x.content for x in doc]
    # Enable Intel Optimization for Scikit-Learn
    
    st = time.time()
    patch_sklearn()
    with config_context(target_offload="cpu:32"):
        tfidf_vectorizer = TfidfVectorizer(analyzer="char")
        sparse_matrix = tfidf_vectorizer.fit_transform([query]+list_page)
        cosine = cosine_similarity(sparse_matrix[0,:],sparse_matrix[1:,:])
        et = time.time()
    print(pd.DataFrame({'cosine':cosine[0],'strings':list_page}).sort_values('cosine',ascending=False).iloc[:k])
    
    elapsed_time = et - st
    print('Execution time with optimization:', elapsed_time, 'seconds')

def similarity_search_without_optimisation(query,k):

    st = time.time()
    
    # clustering = DBSCAN(eps=3, min_samples=2).fit(X)
    tfidf_vectorizer = TfidfVectorizer(analyzer="char")
    sparse_matrix = tfidf_vectorizer.fit_transform([query]+list_page)
    cosine = cosine_similarity(sparse_matrix[0,:],sparse_matrix[1:,:])
    et = time.time()
    print(pd.DataFrame({'cosine':cosine[0],'strings':list_page}).sort_values('cosine',ascending=False).iloc[:k])
    
    elapsed_time = et - st
    print('Execution time without optimization:', elapsed_time, 'seconds')

def similarity_search_using_faiss(path,query):
    st = time.time()
    loader = TextLoader(path)
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=900, chunk_overlap=0)
    docs = text_splitter.split_documents(documents)
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
# Equivalent to SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    db = FAISS.from_documents(docs, embeddings)
# def faiss_query(query)
    query = "Tell me about Olivia Thompson Case?"
    docs = db.similarity_search(query)
    print(docs[0].page_content)
    et = time.time()
    elapsed_time = et - st
    print('Execution time with FAISS:', elapsed_time, 'seconds')

query = "the Secretary of States right to recover certain social security benefits."


# similarity_search_without_optimisation(k=2,query= query)
similarity_search(k=2,query=query)

# si
# milarity_search_using_faiss("Datasets/case.txt",query = "Who is Olivia Thompson")
