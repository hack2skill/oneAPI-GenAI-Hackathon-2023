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
![image](https://github.com/Hemachandirant/Intel_Hackathon_Customer_Support-oneAPI/assets/83321708/e188e3b5-67e2-4dcd-ad67-58cdfd17408e)

### Architecture
![Architecture](https://github.com/Hemachandirant/Intel_Hackathon_Customer_Support-oneAPI/assets/83321708/2e45c1f6-2b25-48f2-8af6-919af445da90)

### Core Components of oneAPI AI Toolkit & IDC Used in the Project
![Core Components](https://github.com/Hemachandirant/Intel_Hackathon_Customer_Support-oneAPI/assets/83321708/dc0a4bb6-856b-4e65-bf4f-1930dc734f1f)

### Models
- Huggingface Transformers [https://huggingface.co/shivani05/Mistral-Finetuned-CPU/tree/main]
  - LLMs: Mistral-7B, Zephyr-7B

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

### Xenon CPU Utilization during model training:

https://github.com/Hemachandirant/Intel_Hackathon_Customer_Support-oneAPI/assets/83321708/06202406-01e2-4fd4-aee2-57b494b3b3e7

### Training loss and saving the model:

![BeFunky-collage](https://github.com/Hemachandirant/Intel_Hackathon_Customer_Support-oneAPI/assets/83321708/ef4653da-1ffe-43d6-ba56-15fd14b4684c)


### Future Scope:
   Our roadmap involves leveraging Large Language Models (LLMs) to integrate advanced automation support into the customer support application, enhancing issue resolution and user experience.

1. **Remote System Control:**
   - Securely take remote control of users' systems.
   - Establish encrypted communication using LLM for seamless interaction.

2. **Automated Troubleshooting:**
   - Implement intelligent scripting powered by LLM for real-time issue diagnosis.
   - Develop a repository of LLM-driven automated scripts for common issues.

3. **User-Empowered Solutions:**
   - Allow users to initiate LLM-driven automated checks and resolutions.
   - Ensure transparency and user consent for LLM-powered automated actions.
  
## Medium Article

[Revolutionizing Tech Support with Intel AI Toolkits and OneAPI](https://medium.com/@rshivanipriya/revolutionizing-tech-support-with-intel-ai-toolkits-and-oneapi-4cf7027909af)

## Step-by-Step Code Execution Instructions

```bash
# Connect with Visual Studio Through Remote Tunnels Extensions
ssh <SSH command> -L 8888:localhost:8888

# Install Essential Packages
sudo apt update
sudo apt-get install build-essential

# Check Environment List
conda env list

# Create Conda Environment
# Follow the instructions [here](#).
ENV_NAME="myenv"
rm -rf $ENV_NAME
python3 -m venv $ENV_NAME
source $ENV_NAME/bin/activate
pip install --upgrade pip
pip install scikit-image jupyter matplotlib intel_extension_for_transformers intel-extension-for-tensorflow[cpu]==2.13.0.0 keras_cv keras_core ipykernel prettytable
jupyter kernelspec uninstall $ENV_NAME -y
python3 -m ipykernel install --user --name=$ENV_NAME
conda deactivate

# Install Packages using Requirements.txt
pip install -r requirements.txt

# Resolve GCC Error
# If you encounter a GCC error, install necessary packages:
conda install aiohttp greenlet llvmlite pyarrow

# Run Streamlit Application
cd App
streamlit run app.py

# Install Ngrok for Port Forwarding
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list && sudo apt update && sudo apt install ngrok

# Authentication for Ngrok
ngrok config add-authtoken YOUR_TOKEN

#Run the below command to lauch
ngrok http <Port number>
