# oneAPI-GenAI-Hackathon-2023 - Hack2Skill

Welcome to the official repository for the oneAPI-GenAI-Hackathon-2023 organized by Hack2Skill!

## Getting Started

To get started with the oneAPI-GenAI-Hackathon-2023 repository, follow these steps:

### Submission Instruction:
  1. Fork this repository
  2. Create a folder with your Team Name
  3. Upload all the code and necessary files in the created folder
  4. Upload a **README.md** file in your folder with the below-mentioned information.
  5. Generate a Pull Request with your Team Name. (Example: submission-XYZ_team)

### README.md must consist of the following information:

#### Team Name - base234
#### Problem Statement - Revolutionary AI-Infused Retail Platform
#### Team Leader Email - manijb13@gmail.com

### A Brief of the Prototype:
  This project aims to develop a generative AI system that revolutionizes how customers interact with e-commerce platforms by introducing visual search capabilities leveraging state-of-the-art LLM technologies.
  - This system will allow users to upload images of desired products or items, then identify similar products from the product catalog, enhancing the user's shopping experience.
  - We develop a generative AI system that enables visual search, allowing customers to find products by uploading images rather than using text-based queries.
  
### Tech Stack: 
   - LLM
   - Python
   - React
   - Flask
   - Intel Oneapi Developer cloud platform
   
### Step-by-Step Code Execution Instructions:
  - For visual search, we’ve encoded query images using the trained encoder and then found similarly encoded representations from our dataset.
  - OpenAI's CLIP (Contrastive Language-Image Pretraining) model is used for embedding images.
  - Each of these embeddings is then saved to Pinecone Vector Database for semantic search against the query.
  - For product discovery, we generate new product images using the trained generator and display them to users based on their preferences.

#### Prerequisites
1. An IDC compute instance <br>
2. SSH access to the instance <br>
3. Miniconda (instructions included for installation) <br>
#### Installation and Setup
1. SSH into the IDC Compute Instance
2. To start, SSH into your IDC compute instance. Replace <YourInstanceIP> with your actual instance IP address.
```
ssh username@<YourInstanceIP>
```
2. Install Miniconda
Once logged in, install Miniconda for simplified Python environment management. Run the following:
```
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
```
Follow the on-screen instructions to complete the installation.

3. Create and Activate a Conda Environment
Create a new Conda environment with Python version 3.10.6:

```
conda create -n myenv python=3.10.6
conda activate myenv
```
This will create and activate a new environment named myenv.

4. Install Required Modules
Install the required modules specified in requirements.txt:
```
pip install -r requirements.txt
```
Ensure requirements.txt is present in your current directory.

5. Accessing React UI, Flask API, and Port Forwarding
To access the React UI, and Flask API, use SSH tunneling for port forwarding. Run the following command on your local machine:
```
python app.py
npm run dev
```
```
ssh -L 8501:localhost:8501 username@<YourInstanceIP>
```
Then, you can access the React UI, and Flask API by navigating to localhost:8501 and localhost:8502 in your web browser.

  
### Future Scope:
   * [x] Image to Image Search.
   * [x] Text to Image Search.
   * [ ] Product Discovery (Create new types of products based on user requirements).
   * [ ] Use generative AI to extract results from multiple E-commerce databases.
   * [ ] Create an Android/iOS Application.
   * [ ] Deploy the Application in AWS using EKS (Elastic Kubernetes Service)

