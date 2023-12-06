import streamlit as st
from PIL import Image

img = Image.open("images/affine.jpg")

page_config = {"page_title":"Contract_comparison_tool.io","page_icon":img,"layout":"wide"}

st.set_page_config(**page_config)

## Divide the user interface into two parts: column 1 (small) and column 2 (large).
#"""This code assigns the st.columns([1, 8]) statement to the variables col1 and col2, 
#which divide the user interface into two columns. Column 1 will be smaller in width, 
# while column 2 will be larger.
#"""

hide_streamlit_style = """
            <style>
            #MainMenu {visibility: hidden;}
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
<h2 style='font-size: 55px; font-family: Arial, sans-serif; 
                   letter-spacing: 2px; text-decoration: none;'>
<span style='background: linear-gradient(45deg, #ed4965, #c05aaf);
                          -webkit-background-clip: text;
                          -webkit-text-fill-color: transparent;
                          text-shadow: none;'>
                Contract Comparator
</span>
""", unsafe_allow_html=True)
with col4:
    st.write(' ')

st.write("\n")
st.write("\n")
st.write("\n")
st.write("\n")
st.write("\n")
st.write("\n")
st.write("**It is a tool that can compare two different versions of the same contract and mention all the major changes that were made between the two documents .**") 


   # key=col1._text_input()
    # Left column: Upload PDF text
    # st.header("Dashboard")
    
    

# Extract the text from uploaded pdf
