import pytest
from streamlit.proto.BlockPath_pb2 import BlockPath
from streamlit.testing.streamlit_test_client import StreamlitTestClient
from your_app_file import main  # Replace 'your_app_file' with the actual name of your Streamlit app file

def test_main_functionality():
    with StreamlitTestClient(main) as client:
        # Test the main functionality of your Streamlit app

        # Example: Check if the title is displayed correctly
        client.wait_for_element_to_appear("h1")
        title_element = client.get_element("h1")
        assert title_element.text == "🖥️ IT Customer Support, Driven by Intel® Innovation."

        # Example: Simulate a button click
        client.simulate_click("Contact Us")
        client.wait_for_element_to_appear("div")  # Adjust the element selector based on your app structure
        contact_form_element = client.get_element("div")
        assert "Contact form or support contact information can go here." in contact_form_element.text

       

if __name__ == "__main__":
    pytest.main(["-v", "--color=yes"])
