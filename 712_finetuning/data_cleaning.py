import pandas as pd
import re
import os

basePath = os.path.dirname(os.path.abspath(__file__))
df = pd.read_json(basePath + '/712data.jsonl')

def remove_newline_chars(content):
    if 'content' in content:
        content['content'] = content['content'].replace('\n', ' ')
    return content

#Apply the function to the 'content' key in each dictionary
df['messages'] = df['messages'].apply(lambda x: [remove_newline_chars(item) for item in x])

df=df['messages']
data=pd.DataFrame({'instructions':[], 'input':[],'output':[]})

data = []
for i in df:
    data.append({'instruction':i[0]['content'],'input':i[1]['content'],'output':i[2]['content']})    #p
df = pd.DataFrame(data)

def convert_to_conversation(df):
    data = []
    # pattern1 = re.compile(r'Extract the values of keys in this JSON format:(.*?)from the following:', re.DOTALL)
    # pattern2 = re.compile(r'If multiple values are found for the same key, list them separated by commas.', re.DOTALL)
    
    for index, row in df.iterrows():
        question = row[0]
        
        answer = row[1]
        prompt = f'''{question} You are a data extractor for occupier details of a property in India. Using the provided HTML data, extract information to create a JSON array of objects. If you do not find a match, leave the value empty. Translate all numbers in English. Do NOT send the wrong answer. The HTML data is structured in a table format, with each row representing an occupier's details. The fields are 'Account Number', 'Occupier Name', 'Area', 'Land Revenue', 'Barren', and 'Number of mutation', each located within specific table cells. Your task is to parse this HTML and convert it into a JSON array, where each object corresponds to a row in the HTML table. The JSON object should have key-value pairs matching the field names to the extracted data. The final output should strictly follow the format [{},{},...], with each object containing the keys: 'Account Number', 'Occupier Name', 'Area', 'Land Revenue', 'Barren', and 'Number of mutation', each corresponding to their respective data in the HTML.'''
        data.append(prompt)
    return data

s=convert_to_conversation(df)
df = pd.DataFrame(s, columns=['Instruct'])

df.to_csv("712_training_instruct.csv")