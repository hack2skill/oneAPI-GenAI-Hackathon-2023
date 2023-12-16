import pandas as pd
import re
import os

basePath = os.path.dirname(os.path.abspath(__file__))
df = pd.read_json(basePath + '/output.jsonl')

def remove_newline_chars(content):
    if 'content' in content:
        content['content'] = content['content'].replace('\n', ' ')
    return content

# Apply the function to the 'content' key in each dictionary
df['messages'] = df['messages'].apply(lambda x: [remove_newline_chars(item) for item in x])

df=df['messages']
data=pd.DataFrame({'instructions':[], 'input':[],'output':[]})

data = []
for i in df:
    data.append({'instruction':i[0]['content'],'input':i[1]['content'],'output':i[2]['content']})    #p
df = pd.DataFrame(data)

def convert_to_conversation(df):
    data = []
    pattern1 = re.compile(r'Extract the values of keys in this JSON format:(.*?)from the following:', re.DOTALL)
    pattern2 = re.compile(r'If multiple values are found for the same key, list them separated by commas.', re.DOTALL)
    
    for index, row in df.iterrows():
        question = row[1]
        match1 = re.search(pattern1, question)
        if match1:
            question = question.replace(match1.group(0), '')
        match2 = re.search(pattern2, question)
        if match2:
            question = question.replace(match2.group(0), '')
        
        answer = row[2]
        prompt = f"""{question} Extract the values of keys in this JSON format from the above given texts.
        If you do not find a match, leave the value empty. Translate all numbers in English.
        Do NOT send the wrong answer.Extract multiple occurrences of the keys, separated by commas.
        Extract only the following keys in JSON format: {{ 'वार्ड नं.':"", 'घर नं.':"", 'प्लॉट नं.':"",'शिट नं.':"", 'सिटी सर्व्हे नं.':"",'खसरा नंबर':"", 'प्लॉट ची आराजी':"","क्षेत्रफळ":"" ,"Building Name":""}} """        
        data.append(prompt)
    return data

s=convert_to_conversation(df)
df = pd.DataFrame(s, columns=['Instruct'])

df.to_csv("training_instruct.csv")