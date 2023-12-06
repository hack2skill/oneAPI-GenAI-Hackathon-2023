import streamlit as st


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

def main():
    # Set background color to lightblue
    set_background_color('green')

    # Your Streamlit app content
    st.title("My Streamlit App")
    st.write("This is the main content of your app.")

if __name__ == "__main__":
    main()
