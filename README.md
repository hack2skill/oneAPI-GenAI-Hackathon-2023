rr# oneAPI-GenAI-Hackathon-2023 - Hack2Skill

#### Team Name - Team BhuMe
#### Problem Statement - AI-Enhanced Legal Practice Platform
#### Team Leader Email - p17rajatp@iima.ac.in

### Overview
  This project delves into the innovative approach of leveraging government digital land record data to streamline the search for property ownership trails. By harnessing the capabilities of Intel’s OneAPI, coupled with the power of Artificial Intelligence and Asynchronous programming, we have significantly improved the speed, accuracy, and relevance of the data required for tracing property ownership. This professional enhancement of data processing not only simplifies the task at hand but also paves the way for a more efficient and reliable system for property ownership verification.
  
  The primary objective of this project is to improve the process of property due-diligence by 100x. We aim to achieve this by downloading year-wise property data, ensuring its relevance and accuracy, and moving away from traditional methods of property verification. By harnessing the untapped potential of Intel's OneAPI and Artificial Intelligence, we can present data in various formats required for property verification. This not only enhances the efficiency of the process but also ensures a higher degree of reliability and accuracy.

### A Brief of the Prototype:
  App is available on https://app.bhume.in/
  
  Lawyers use this tool to automatically download property registry data from government website, and then filter the property of interest based on property schedule containing khasra no., survey no., plot no. and other fields.
  
  Valuers use this tool to extract sale instances of properties near their area of interest.


### Tech Stack: 
   List Down all technologies used to Build the prototype
   We use a mix of react, python, django, postgres and libraries like Selenium, scikit-learn and finetuned LLMs from OpenAI to build and run the app. Data is scrapped and stored for each request during runtime. downloaded data is filtered using document type and then fed into LLMs one by one to extract information which can help us identify the property precisely. For each row in the dataset, we check whether the entry might be relevant to our property of interest. All relevant rows are then shown to the user.
   
### Step-by-Step Code Execution Instructions:
  This Section must contain a set of instructions required to clone and run the prototype so that it can be tested and deeply analyzed
  Go to app.bhume.in and use the app as prototype.

### Step-by-Step Finetuning 
  Use the following commands to setup and activate the conda environment
  ```bash
  conda create -n venv python==3.8.10
  conda activate venv
  install pip install -r requirements.txt
  ```
  
  set the env variable to select Intel AMX ISA 
  ```bash
  export ONEDNN_MAX_CPU_ISA="AVX512_CORE_AMX"
  ```

  Preprocessing 
  Prepare the dataset using preprocess.py
  ```python preprocess.py```
  
  Finetuning
  run the command 
  ```python falcon-tune.py --bf16 True --use_ipex True --max_seq_length 512```
  
  Inference
  ```python falcon-tuned-inference.py --checkpoints <PATH-TO-CHECKPOINT> --max_length 200 --top_k 10```

  
### Future Scope:
   Write about the scalability and futuristic aspects of the prototype developed

   Property disputes account for 70% of all civil court cases in India. Proper due-diligence before any transaction can help a person avoid legal issues. Barrier to due-diligence currently is data cleaning, processing and analyzing for each property in a short duration of time, while the deal is being negotiated.
   
   Future scope of work is:
   1. to integrate other legal documents pertaining to property ownership (depth)
   2. to expand to other states
   3. simplify the legal document to be understandable by a layman
