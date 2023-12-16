from huggingface_hub import InferenceClient
import gradio as gr
from flask import Flask, request, jsonify
from pyngrok import ngrok

app = Flask(__name__)
client = InferenceClient(
    "mistralai/Mixtral-8x7B-Instruct-v0.1"
)


def format_prompt(message, history):
  prompt = "<s>"
  prompt += f"[INST] {message} [/INST]"
  return prompt

def generate(
    prompt, history=None, system_prompt=None, temperature=0.9, max_new_tokens=256, top_p=0.95, repetition_penalty=1.0,
):
    temperature = float(temperature)
    if temperature < 1e-2:
        temperature = 1e-2
    top_p = float(top_p)

    generate_kwargs = dict(
        temperature=temperature,
        max_new_tokens=max_new_tokens,
        top_p=top_p,
        repetition_penalty=repetition_penalty,
        do_sample=True,
        seed=42,
    )
    # system_prompt =""" Extract the values of keys in this JSON format from the above given texts.\n       If you do not find a match, leave the value empty. Translate all numbers in English.\n        Do NOT send the wrong answer.Extract multiple occurrences of the keys, separated by commas.\n        Extract only the following keys in JSON format: { \'वार्ड नं.\':"", \'घर नं.\':"", \'प्लॉट नं.\':"",शिट नं.\':"", \'सिटी सर्व्हे नं.\':"",\'खसरा नंबर\':"", \'प्लॉट ची आराजी\':"",\"क्षेत्रफळ\":"" ,\"Building Name\":""d} :"}"""
    system_prompt ="""You are a data extractor for occupier details of a property in India. Using the provided HTML data, extract information to create a JSON array of objects. If you do not find a match, leave the value empty. Translate all numbers in English. Do NOT send the wrong answer. The HTML data is structured in a table format, with each row representing an occupier's details. The fields are 'Account Number', 'Occupier Name', 'Area', 'Land Revenue', 'Barren', and 'Number of mutation', each located within specific table cells. Your task is to parse this HTML and convert it into a JSON array, where each object corresponds to a row in the HTML table. The JSON object should have key-value pairs matching the field names to the extracted data. The final output should strictly follow the format [{},{},...], with each object containing the keys: 'Account Number', 'Occupier Name', 'Area', 'Land Revenue', 'Barren', and 'Number of mutation', each corresponding to their respective data in the HTML."""
    formatted_prompt = format_prompt(f"{system_prompt}, {prompt}", history)
    stream = client.text_generation(formatted_prompt, **generate_kwargs, stream=True, details=True, return_full_text=False)
    output = ""

    for response in stream:
        output += response.token.text
        # yield output
    print(output)
    return output


@app.route('/generate', methods=['POST'])
def generate_text():
    data = request.json
    prompt = data.get('prompt')
    output = generate(prompt)
    return jsonify({"response": output})

if __name__ == '__main__':
    public_url = ngrok.connect(5000)
    print(f"Ngrok tunnel opened at {public_url}")
    app.run(debug=True)
    
