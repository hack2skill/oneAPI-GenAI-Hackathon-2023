
####  Team Name - Optic
#### Problem Statement - Retail Store
#### Team Leader Email - jainsahil1116@gmail.com

#### Image Caption Generation
Description: Utilizes advanced machine learning models to generate descriptive captions for images of products in our store.
Usage: Access the image caption generation feature through [endpoint URL or instructions].
#### Chatbot
Description: Offers users an interactive chat interface for inquiries, product information, and assistance.
Usage: Engage with the chatbot by [instructions on accessing the chatbot].
#### Recommendation Chat
Description: Provides personalized product recommendations based on user preferences and browsing history.
Usage: Explore tailored recommendations through [instructions].
#### Augmented Reality Try-On
Description: Enables customers to virtually try on products using augmented reality technology.
Usage: Experience the AR Try-On by

### LLM
The LLM folder contains the code of the model and traning using intel toolkit usage

### Webiste

The webiste folder contains all the website code including the DB




#### Steps to run
### Clone the repository to your local machine:

   ```bash 
   https://github.com/SahilJain8/oneAPI-GenAI-Hackathon-2023.git 
   ```
### Navigate to the directory containing the Django pROJECT:

```bash 
cd oneAPI-GenAI-Hackathon-2023/optic/webiste/
```
### Install the required dependencies:

``` bash
pip install -r requirements.txt
```


### Model Folder

Downalod the Model folder Make sure to place all the 4 model in a single folder "Machine-learning" and place that folder  in optic/webiste/
```` bash
https://drive.google.com/drive/folders/1UVNSlUs2f0EeA0V6Cee8g_K3872EWlYu?usp=drive_link
````

### Configuration
#### Configure the Django settings, including database setup, API keys, or any other environment-specific configurations.

#### Migrate the database schema:

``` bash
python manage.py makemigrations
python manage.py migrate
```

### Add Product Data
To add data to product table create a superuser using
 ``` bash python manage.py createsuperuser
 ```
 After that start the server 
 ```` bash
python manage.py runserver
````
and head to the  http://127.0.0.1:8000/admin login with the super user there you will find a option to add data to the product table

### Start the Django development server:

```` bash
python manage.py runserver
````


### Customization and Extending Functionality
Feel free to customize or extend the chatbot's functionality by modifying the Django app's codebase. You can explore the chatbot's logic, response generation, and integrations within the directory of our project.




