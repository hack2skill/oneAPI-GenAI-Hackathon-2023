# Import Path into System Path
import base64
import io
import os.path
import sys
import logging

from flask import Blueprint, jsonify, request
from flask_api import status
import cohere
from dotenv import load_dotenv

load_dotenv()

from ml.clip_search_pinecone import AdvanceSearch

path = os.path.abspath(os.path.join(os.getcwd(), "./."))
sys.path.append(path)

# Creating Blueprint for all APIs

COHERE_API_KEY = os.getenv('COHERE_API_KEY')

co = cohere.Client(COHERE_API_KEY)


tansaku_Blueprint = Blueprint('tansaku_Blueprint', __name__)

chat_history = []
max_turns = 20


@tansaku_Blueprint.route('/advance_search', methods=['GET'])
def search_api():
    try:
        index_name = "clip-image-search"
        query = request.headers.get("query")
        is_image_search = request.args.get("is_image", False)
        top_results = int(request.args.get("top_results") or 6)

        search = AdvanceSearch(index_name, query, top_results)
        result = search.similarity_search(is_image_search)
        for data in result:
            img_byte_array = io.BytesIO()
            data["image"].save(img_byte_array, format='JPEG')
            img_byte_array.seek(0)
            data["image"] = base64.b64encode(img_byte_array.read()).decode('utf-8')
        return jsonify(result), status.HTTP_200_OK
    except Exception as err:
        return jsonify({"message": f"Module - Error - {err}"}), status.HTTP_400_BAD_REQUEST


@tansaku_Blueprint.route('/chat_bot', methods=['POST'])
def chat_bot():
    inputpayload = request.get_json(cache=False)
    logging.info("Request for chatBot - %s", inputpayload['parameters']['user_message'])
    user_input = str(inputpayload['parameters']['user_message'])
    try:

        for i in range(max_turns):
            # get user input
            message = "Context - Consider yourself a fashion expert. Task - Recommend " + user_input

            # generate a response with the current chat history
            response = co.chat(
                message,
                temperature=0.8,
                chat_history=chat_history
            )
            answer = response.text

            # add message and answer to the chat history
            user_message = {"user_name": "User", "text": message}
            bot_message = {"user_name": "Chatbot", "text": answer}

            chat_history.append(user_message)
            chat_history.append(bot_message)

            return jsonify(bot_message), status.HTTP_200_OK
    except Exception as err:
        return jsonify({"message": f"Module - Error - {err}"}), status.HTTP_400_BAD_REQUEST
