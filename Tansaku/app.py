# Importing Lib for Python works and Flasks
import logging
import os
from logging.handlers import RotatingFileHandler

from flask import Flask
from flask_cors import CORS

# Importing Supporting Lib
import APP_Constants
# importing the API blueprints
from api.tansaku_api import tansaku_Blueprint
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv()

# pinecone configure client
PINECONE_API_KEY = os.environ['PINECONE_API_KEY']
PINECONE_ENV = os.environ['PINECONE_ENV']

app.register_blueprint(blueprint=tansaku_Blueprint, url_prefix=APP_Constants.APP_ENDPOINT)

rth = logging.handlers.RotatingFileHandler(
    filename='./logs/tansaku.log',
    maxBytes=25000,
    backupCount=10
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s  : %(message)s', handlers=[rth])

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
