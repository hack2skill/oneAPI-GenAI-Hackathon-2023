# oneAPI-GenAI-Hackathon-2023 - Hack2Skill

Welcome to the official repository for the oneAPI-GenAI-Hackathon-2023 organized by Hack2Skill!

## Getting Started

To get started with the oneAPI-GenAI-Hackathon-2023 repository, follow these steps:

### Submission Instruction:
  1. Fork this repository
  2. Create a folder with your Team Name
  3. Upload all the code and necessary files in the created folder
  4. Upload a **README.md** file in your folder with the below mentioned informations.
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
  
### Future Scope:
   * [x] Image to Image Search.
   * [x] Text to Image Search.
   * [ ] Product Discovery (Create new types of products based on user requirements).
   * [ ] Use generative AI to extract results from multiple E-commerce databases.
   * [ ] Create an Android/iOS Application.
   * [ ] Deploy the Application in AWS using EKS (Elastic Kubernetes Service)

