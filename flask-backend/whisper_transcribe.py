from flask import Blueprint, request, jsonify
import whisper
import os
from werkzeug.utils import secure_filename

transcribe_bp = Blueprint("transcribe", __name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load Whisper model once
model = whisper.load_model("tiny")  # or "small", "medium", "large"

@transcribe_bp.route("/api/speech", methods=["POST"])
def transcribe_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]
    filename = secure_filename(audio_file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    audio_file.save(filepath)

    try:
        result = model.transcribe(filepath)
        transcript = result["text"]
        return jsonify({"transcript": transcript}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(filepath)
