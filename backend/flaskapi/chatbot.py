from flask import Flask, request, jsonify
import cohere
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv() 


app = Flask(__name__)
CORS(app)

COHERE_API_KEY = os.getenv("cohere_apikey")
co = cohere.Client(COHERE_API_KEY)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.form.get("message")

    image = request.files.get("image")

    if not user_message:
        return jsonify({"error": "Invalid request, 'message' key missing"}), 400

    if image:
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
        image.save(image_path)

    response = co.generate(
        model="command",
        prompt=user_message,
        max_tokens=100
    )

    bot_reply = response.generations[0].text.strip()

    return jsonify({"reply": bot_reply, "image_url": image_path if image else None})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
