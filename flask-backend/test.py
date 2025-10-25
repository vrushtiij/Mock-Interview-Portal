import whisper

model = whisper.load_model("base")
result = model.transcribe("sample_audio.wav")
print(result["text"])
