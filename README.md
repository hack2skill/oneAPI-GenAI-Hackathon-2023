#### Team Name - Team Affine
#### Problem Statement - Generative AI Large Language Models Fine Tuned For Legal Practice Platform
#### Team Leader Email - jayanth.ajay@affine.ai

### A Brief of the Prototype:

  ![Image](https://github.com/bhaskarturkar/oneAPI-GenAI-Hackathon-2023/blob/main/process-flow-diagram.JPG)

  
### Tech Stack: 
   Technologies used (Mark down oneAPI AI Analytics libraries used) <br>
1.Python <br>
2.Hugging Face <br>
3.ChromaDB <br>
4.Langchain <br>
5.Open-docx <br>
6.PyPDF <br>
7.Pytorch <br>

8.Intel OpenDNN <br>
9.Intel OneAPI Base Toolkit <br>

   
### Step-by-Step Code Execution Instructions:

#### Getting Started
These instructions will guide you through setting up your environment and running the project.

#### Prerequisites
1.An IDC compute instance <br>
2.SSH access to the instance <br>
3.Miniconda (instructions included for installation) <br>
#### Installation and Setup
1. SSH into the IDC Compute Instance
To start, SSH into your IDC compute instance. Replace <YourInstanceIP> with your actual instance IP address.
```
ssh username@<YourInstanceIP>
```
2. Install Miniconda
Once logged in, install Miniconda for a simplified Python environment management. Run the following:
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

5. Accessing Streamlit UI and Port Forwarding
To access the Streamlit UI, use SSH tunneling for port forwarding. Run the following command on your local machine:
```
streamlit run Homepage.py
```
```
ssh -L 8501:localhost:8501 username@<YourInstanceIP>
```
Then, you can access the Streamlit UI by navigating to localhost:8501 in your web browser.

#### Working demo
[Working demo of contract comparator](https://vimeo.com/891854466)

Contributing
Guidelines for contributing to this repository, if applicable.



Note: Replace placeholders (like <YourInstanceIP>) with actual values relevant to your project. 


### Future Scope:
   A Fine tuning a bigger model using proper relevant dataset may improve the results.
