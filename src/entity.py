# Import necessary libraries and modules
from langchain.chains import RetrievalQA
import base64
import os
import fitz
import json
from pathlib import Path
import ast
import streamlit as st
from langchain.chains import RetrievalQA
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.prompts import PromptTemplate
import chromadb
from prettytable import PrettyTable as pt
from langchain.embeddings import HuggingFaceEmbeddings
from langchain import HuggingFacePipeline


class QAModel:
    def __init__(self):
        pass


    def displayPDF(self,file):
        """
        Displays a PDF file in the browser.

        Parameters:
            file (str): The path to the PDF file.

        Returns:
            None

        """
        # Opening file from file path
        with open(file, "rb") as f:
            base64_pdf = base64.b64encode(f.read()).decode('utf-8')

        # Embedding PDF in HTML
        #pdf_display = F'<iframe src="data:application/pdf;base64,{base64_pdf}" ALIGN=CENTER width="700" height="1000" type="application/pdf"></iframe>'
        pdf_display = F'<iframe src="data:application/pdf;base64,{base64_pdf}" ALIGN=CENTER width="900" height="300" type="application/pdf">'
        #pdf_display = f'<embed src="data:application/pdf;base64,{base64_pdf}" ALIGN=CENTER width="1000" height="300" type="application/pdf"></embed>'
        # Displaying File
        st.markdown(pdf_display, unsafe_allow_html=True)

    def pdf_saver(self,pdf,save_folder_path):
        """
        Saves a PDF file to the specified folder.

        Parameters:
            pdf (bytes): The PDF file content as bytes.
            save_folder_path (str): The path to the folder where the PDF will be saved.

        Returns:
            save_path (Path): The path to the saved PDF file.

        """
        save_path = Path(save_folder_path, pdf.name)
        with open(save_path, mode='wb') as w:
            w.write(pdf.getvalue())
        if save_path.exists():
            st.success(f'File {pdf.name} is successfully saved!')
            return save_path

    
    def pdf_highlight1(self, pdf_path, highlight_1):
        with fitz.open(pdf_path) as doc:
            text = ''
            # Iterate through each page
            for page in doc:
                # Extract text from each page
                text += page.get_text()
            pdf_text = text

        found_text = " "
        c = 0
        for high_text in highlight_1:

            c = c + 1
            start_words = high_text[1:10]
            end_words = high_text[-10:-1]
            start_pattern = re.escape(start_words)
            end_pattern = re.escape(end_words)
            pattern = rf"{start_pattern}(.*?){end_pattern}"

            # Use re.DOTALL to allow '.' to match newline characters as well
            match = re.search(pattern, pdf_text, re.DOTALL)
            if match:
                f = match.group(0)  # Return the entire matched text
            else:
                f = None
            if f:
                found_text += f
                found_text += "\n"
            # st.write(found_text)
            list_text = found_text.split("\n")
            filtered_list = [item.rstrip()
                             for item in list_text if item.strip()]

        # input text to be highlighted
        doc = fitz.open(pdf_path)
        for page in doc:
            list1 = []
            for t in filtered_list:

                text_instances = page.search_for(t)

                for text_instance in text_instances:

                    list1.append(text_instance)

            for inst in list1:
                highlight = page.add_highlight_annot(inst)
                highlight.update()
        if list1:

            path = "./saved_contract/" + os.path.basename(pdf_path)
            doc.save(path)
            cwd = os.getcwd()

            webbrowser.open_new(f"{cwd}/{path}")

            doc.close()

        return path

    def pdf_highlight(self,pdf,text):
        """
        license = asp.License()
        license.set_license("Aspose.Total.lic")

        # Load the PDF
        doc = asp.Document(pdf)

        # Search target text to highlight
        for i in text :

            textFragmentAbsorber = pdf.text.TextFragmentAbsorber(i)
            doc.pages[1].accept(textFragmentAbsorber)

            # Create a highlight annotation
            ha = asp.annotations.HighlightAnnotation(doc.pages[1], textFragmentAbsorber.text_fragments[1].rectangle)

            # Specify highlight color 
            ha.color = asp.Color.yellow

            # Add annotation to highlight text in PDF 
            doc.pages[1].annotations.add(ha,True)
        
        path = "./saved_contract/"+os.path.basename(pdf) 
        # Save the document 
        doc.save(path)
        """
        
        #filename = "your file name here"

        my_pdf = fitz.open(pdf)      
        # input text to be highlighted  
        
        for i in text :  
            st.write(i)                   
            if i!=None and len(i)>0 and i != '' and i!= ' ':
                for n_page in my_pdf:    
                        matchWords = n_page.search_for(i) 
                        #st.write(matchWords)     
                        for word in matchWords:  
                            my_highlight = n_page.add_highlight_annot(word)  
                            my_highlight.update()    
                    
        # saving the pdf file as highlighted.pdf
        path = "./saved_contract/" + os.path.basename(pdf)  
        my_pdf.save(path)  


        return path

    
    def document_splitter_assistant(self,documents,user_input_chunk_size = 2048,user_input_chunk_overlap = 20):
        """
        Splits a document into chunks for processing.

        Parameters:
            documents (str): The document text.
            user_input_chunk_size (int): Size of each chunk.
            user_input_chunk_overlap (int): Overlap between chunks.

        Returns:
            document_chunks (list): List of document chunks.
        """
        text_splitter = RecursiveCharacterTextSplitter(chunk_size = user_input_chunk_size,
                                    chunk_overlap = user_input_chunk_overlap,
                                    length_function = len)
        document_chunks = text_splitter.split_text(documents)
        return document_chunks
    

    
    def create_embedding_assistant(self,document_chunks):
        """
        Creates an embedding assistant for the given document chunks.

        Parameters:
            document_chunks (list): List of document chunks.

        Returns:
            vectorstore (Chroma): Chroma vectorstore created from document chunks.
        """
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

        vectorstore = Chroma.from_texts( texts= document_chunks, embedding=embeddings)
        return vectorstore
    
    
