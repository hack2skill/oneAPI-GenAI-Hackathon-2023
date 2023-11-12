from flask import Flask, render_template, request
import openai

app = Flask(__name__)

# Set your OpenAI API key
openai.api_key = 'your_openai_api_key'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/research', methods=['POST'])
def legal_research():
    query = request.form['query']

    # Use LLM for legal research (adapt based on OpenAI's API)
    research_result = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Legal research on: {query}",
        temperature=0.7,
        max_tokens=150
    )

    return render_template('result.html', result=research_result.choices[0].text)

@app.route('/case_prediction', methods=['POST'])
def case_prediction():
    case_details = request.form['case_details']

    # Use LLM for case outcome prediction (adapt based on OpenAI's API)
    prediction_result = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Case outcome prediction for: {case_details}",
        temperature=0.7,
        max_tokens=150
    )

    return render_template('result.html', result=prediction_result.choices[0].text)

@app.route('/contract_review', methods=['POST'])
def contract_review():
    contract_text = request.form['contract_text']

    # Use LLM for contract review (adapt based on OpenAI's API)
    review_result = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Contract review: {contract_text}",
        temperature=0.7,
        max_tokens=150
    )

    return render_template('result.html', result=review_result.choices[0].text)

if __name__ == '__main__':
    app.run(debug=True)
