from flask import Flask, render_template, request
import openai
from intel_analytics_tool import analyze_legal_text  # Replace with the actual Intel analytics tool you're using

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

    # Use Intel analytics tool for further analysis (replace with actual tool)
    intel_analytics_result = analyze_legal_text(research_result.choices[0].text)

    return render_template('result.html', result=intel_analytics_result)

# Add similar routes for case prediction and contract review

if __name__ == '__main__':
    app.run(debug=True)
