import json

def load_and_process_json(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Extract relevant information from the JSON structure
    processed_data = []
    for item in data['messages']:
        if item['role'] in ['system', 'user', 'assistant']:
            processed_data.append(item['content'])
    
    # Further preprocessing steps can be added here if necessary

    return processed_data
