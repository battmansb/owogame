from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load the pre-trained model for word embeddings
model = pipeline("feature-extraction", model="bert-base-uncased")

# Generate related words based on embeddings
@app.route("/generate_clues", methods=["POST"])
def generate_clues():
    data = request.json
    secret_word = data.get("secret_word", "")

    # Example synonyms (replace with a smarter algorithm)
    fake_clues = {
        "example": ["demo", "sample", "illustration", "test"],
        "game": ["play", "match", "competition", "sport"]
    }

    if secret_word in fake_clues:
        return jsonify({"clues": fake_clues[secret_word]})

    # For simplicity, return fake related words for untrained words
    return jsonify({"clues": ["hint1", "hint2", "hint3"]})

if __name__ == "__main__":
    app.run(port=5000)
