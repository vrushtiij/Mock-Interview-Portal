from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import mysql.connector

app = Flask(__name__)
CORS(app)  

# MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="test1"
)
cursor = db.cursor()

@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    query = "SELECT * FROM login WHERE email = %s AND password = %s"
    cursor.execute(query, (email, password))
    user = cursor.fetchone()

    if user:
        return jsonify({"message": "Login successful", "status": "success"}), 200
    else:
        return jsonify({"message": "Invalid credentials", "status": "fail"}), 401
