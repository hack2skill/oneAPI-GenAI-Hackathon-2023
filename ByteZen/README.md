# ByteZen Customer Support Prototype

## Team Name
ByteZen

## Problem Statement
Customer Support

## Team Leader Email
[hemachandiran.t88@wipro.com](mailto:hemachandiran.t88@wipro.com)

## Brief of the Prototype

### Description
ByteZen is working on a groundbreaking solution for Customer IT Technical Support using a Large Language Model. The application leverages Intel's analytical toolkit and Cloud CPU to design and fine-tune AI models capable of understanding complex technical issues and providing prompt solutions. The toolkit includes the Intel Distribution of Modin for efficient data preprocessing, Intel Xeon CPUs coupled with Intel Extension for Transformers, and the Neural Compressor for model quantization.

### Goal
The goal of ByteZen is to revolutionize technical support by building an AI-powered application that offers round-the-clock assistance. The application aims to provide instant solutions to customer problems, reducing downtime and enhancing the overall user experience.

## Prototype Description

The prototype utilizes Huggingface Transformers with large language models, including Mistral-7B and LLava-13B. Technologies such as Intel Extension for transformers, Intel Analytical Toolkit, Intel Neural Compressor, Intel Distribution for Python, streamlit, Langchain, node.js (Avatar Application), Azure Speech Service, and Ngrok are employed to achieve the project goals.

## Tech Stack

### Architecture
![Architecture](https://github.com/Hemachandirant/Intel_Hackathon_Customer_Support-oneAPI/assets/83321708/2e45c1f6-2b25-48f2-8af6-919af445da90)

### Core Components of oneAPI AI Toolkit & IDC Used in the Project
![Core Components](https://github.com/Hemachandirant/Intel_Hackathon_Customer_Support-oneAPI/assets/83321708/dc0a4bb6-856b-4e65-bf4f-1930dc734f1f)

### Models
- Huggingface Transformers
  - LLMs: Mistral-7B, LLava-13B

### Technologies Used
1. Intel Extension for transformers
2. Intel Analytical Toolkit
3. Intel Neural Compressor
4. Intel Distribution for Python
5. Streamlit
6. Langchain
7. Node.js (Avatar Application)
8. Azure Speech Service
9. Ngrok

## Step-by-Step Code Execution Instructions

```bash
# Connect with Visual Studio Through Remote Tunnels Extensions
ssh <SSH command> -L 8888:localhost:8888

# Install Essential Packages
sudo apt update
sudo apt-get install build-essential

# Create Conda Environment
# Follow the instructions [here](#).

# Install Packages using Requirements.txt
pip install -r requirements.txt

# Resolve GCC Error
# If you encounter a GCC error, install necessary packages:
conda install aiohttp greenlet llvmlite pyarrow

# Run Streamlit Application
streamlit run app.py

# Install Ngrok for Port Forwarding
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list && sudo apt update && sudo apt install ngrok

# Authentication for Ngrok
ngrok config add-authtoken YOUR_TOKEN

# Check Environment List
conda env list

# Create Conda Environment
ENV_NAME="myenv"
conda deactivate
rm -rf $ENV_NAME
python3 -m venv $ENV_NAME
source $ENV_NAME/bin/activate
pip install --upgrade pip
pip install scikit-image jupyter matplotlib intel_extension_for_transformers intel-extension-for-tensorflow[cpu]==2.13.0.0 keras_cv keras_core ipykernel prettytable
jupyter kernelspec uninstall $ENV_NAME -y
python3 -m ipykernel install --user --name=$ENV_NAME
conda deactivate

# Install Python3 Separately (if needed)
# Replace with the appropriate code.
