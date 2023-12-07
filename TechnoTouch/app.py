import os
from PIL import Image
from flask import Flask, request, render_template
from datetime import datetime
from image_feature_extraction import FeatureExtractor
from pathlib import Path
import numpy as np

app = Flask(__name__)

# Read image features
fe = FeatureExtractor()
features = []
img_paths = []
for feature_path in Path("./static/flipkart_feature").glob("*.npy"):
    features.append(np.load(feature_path))
    img_paths.append(Path("./static/flipkart_dataset") / (feature_path.stem + ".jpg"))
features = np.array(features)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['query_img']
        # Save query image
        img = Image.open(file.stream)  # PIL image
        uploaded_img_path = "static/uploaded/" + datetime.now().isoformat().replace(":", ".") + "_" + file.filename
        img.save(uploaded_img_path)

        # Run search
        fe = FeatureExtractor()
        query = fe.extract(img)
        dists = np.linalg.norm(features - query, axis=1)  # L2 distances to features
        ids = np.argsort(dists)[:20]  # Top 10 results
        scores = [(dists[id], img_paths[id]) for id in ids]
        return render_template('index.html',
                               query_path=uploaded_img_path,
                               context=uploaded_img_path,
                               scores=scores
                               )
    if request.method == 'GET':
        return render_template('index.html')


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8000))
    print(port)
    app.run(host="127.0.0.1", port=port, debug=False)