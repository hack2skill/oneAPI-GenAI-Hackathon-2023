import base64
import io

from PIL import Image
from utils.ml_utility import get_model_info
import torch
import pandas as pd
from datasets import load_dataset
import pinecone


class AdvanceSearch:
    def __init__(self, index_name, query, top_results: int = 5):
        from app import PINECONE_ENV, PINECONE_API_KEY
        self.query_embedding = None
        pinecone.init(
            api_key=PINECONE_API_KEY,
            environment=PINECONE_ENV
        )
        self.index_name = index_name
        self.query = query
        # Connect to the index
        self.index = pinecone.Index(self.index_name)
        self.__load_data()
        self._set_device()
        self.top_results = top_results

    def __load_data(self):
        # Load data
        # https://huggingface.co/datasets/ashraq/fashion-product-images-small
        self.image_data = load_dataset(
            "ashraq/fashion-product-images-small", split="train",
        )
        self.image_data_df = pd.DataFrame(self.image_data[:500])

    def _set_device(self):
        # Set the device
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        self.model_ID = "openai/clip-vit-base-patch32"

        self.model, self.processor, self.tokenizer = get_model_info(self.model_ID, self.device)

    def _get_single_text_embedding(self):
        inputs = self.tokenizer(self.query, return_tensors="pt").to(self.device)

        text_embeddings = self.model.get_text_features(**inputs)

        # convert the embeddings to numpy array
        return text_embeddings.cpu().detach().numpy()

    def _get_single_image_embedding(self):
        image = self.processor(
            text=None,
            images=self.query,
            return_tensors="pt"
        )["pixel_values"].to(self.device)

        embedding = self.model.get_image_features(image)

        # convert the embeddings to numpy array
        return embedding.cpu().detach().numpy()

    def similarity_search(self, image_search=False):
        result_data = []
        if image_search:
            # First, decode the base64 data to bytes
            img_bytes = base64.b64decode(self.query)
            # Create a BytesIO object to work with the image bytes
            img_byte_io = io.BytesIO(img_bytes)
            self.query = Image.open(img_byte_io)

            # Get the image embedding
            self.query_embedding = self._get_single_image_embedding().tolist()
        else:
            self.query_embedding = self._get_single_text_embedding().tolist()

        ans = self.index.query(self.query_embedding, top_k=self.top_results, include_metadata=True)
        for data in ans.matches:
            id = self.image_data_df.iloc[int(data.id)].id
            gender = self.image_data_df.iloc[int(data.id)].gender
            masterCategory = self.image_data_df.iloc[int(data.id)].masterCategory
            subCategory = self.image_data_df.iloc[int(data.id)].subCategory
            articleType = self.image_data_df.iloc[int(data.id)].articleType
            baseColour = self.image_data_df.iloc[int(data.id)].baseColour
            season = self.image_data_df.iloc[int(data.id)].season
            year = self.image_data_df.iloc[int(data.id)].year
            usage = self.image_data_df.iloc[int(data.id)].usage
            productDisplayName = self.image_data_df.iloc[int(data.id)].productDisplayName
            image = self.image_data_df.iloc[int(data.id)].image

            result_data.append({"score": data.score, "meta_data": data.metadata, "gender": gender,
                                "masterCategory": masterCategory, "subCategory": subCategory, "articleType": articleType,
                                "baseColour": baseColour, "season": season, "year": year, "usage": usage,  "productDisplayName": productDisplayName, "image": image})
        return result_data
