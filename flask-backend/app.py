from flask import Flask, request, jsonify , session
from flask_cors import CORS
import mysql.connector
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from sentence_transformers import SentenceTransformer, CrossEncoder
from sklearn.metrics.pairwise import cosine_similarity
from textblob import TextBlob
import textstat
import requests
import re
import spacy
from spacy_checker import check_grammar_with_spacy, get_advanced_metrics
import math

app = Flask(__name__)
CORS(app)
app.secret_key = "abcdefghijklmnopqrstuvwxyz123456789"
CORS(app, supports_credentials=True)

app.config['JWT_SECRET_KEY'] = 'secret-key'  
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)
bi_encoder = SentenceTransformer('all-MiniLM-L6-v2')  # Fast & accurate
cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",  
    database="mockme"
)
cursor = db.cursor()

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    cursor.execute("SELECT user_id,password FROM users WHERE email=%s", (email,))
    result = cursor.fetchone()

    if result and check_password_hash(result[1], password):
        access_token = create_access_token(identity=email)
        return jsonify({
            "success": True,
            "message": "Login successful!",
            "access_token": access_token,
        }), 200
    else:
        return jsonify({"success": False, "message": "Invalid credentials."}), 401


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    password = generate_password_hash(password)
    
    try:
        check_query = "SELECT * FROM users WHERE email=%s"
        cursor.execute(check_query, (email,))
        if cursor.fetchone():
            return jsonify({"success": False, "message": "Email already exists"}), 400
            
        
        insert_query = "INSERT INTO users (email, password, name) VALUES (%s, %s, %s)"
        cursor.execute(insert_query, (email, password, name))
        db.commit()
        
        return jsonify({"success": True, "message": "Signup successful!"})
    except Exception as e:
        db.rollback()
        return jsonify({"success": False, "message": str(e)}), 500



@app.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    current_user = get_jwt_identity() 
    cursor.execute("SELECT name FROM users WHERE email = %s", (current_user,))
    user = cursor.fetchone()
    if user:
        return jsonify({
            "success": True,
            "msg": f"Welcome to your dashboard, {user}!",
            "name": user[0]
        }), 200

@app.route("/get-questions", methods=["POST"])
def get_questions():
    data = request.get_json()
    domain = data.get("selectedDomain")
    if not domain:
        return jsonify({"error": "No domain provided"}), 400

    try:
        cursor = db.cursor()
        cursor.execute(
            "SELECT question_id,question FROM questions WHERE domain = %s ORDER BY RAND() LIMIT 10",
            (domain,)
        )
        rows = cursor.fetchall()
        questions = [{"id": row[0], "text": row[1]} for row in rows]
        print(f"Fetched questions for domain '{domain}':", questions, flush=True)
        return jsonify({"questions": questions})
    except Exception as e:
        print("Error fetching questions:", e, flush=True)
        return jsonify({"error": str(e)}), 500

@app.route('/submit-answers', methods=['POST'])
@jwt_required()
def submit_answers():
    try:
        data = request.get_json()
        domain = data.get('domain')
        questions = data.get('questions', [])
        answers = data.get('answers', [])
        timestamp = data.get('timestamp')
        

        print(f"Received answers for domain: {domain}")
        print(f"Timestamp: {timestamp}")

        cursor = db.cursor()
        user_email = get_jwt_identity()
        cursor.execute("SELECT user_id FROM users WHERE email=%s", (user_email,))
        user_id = cursor.fetchone()[0]
        for ans in answers:
            question_id = ans.get("question_id")
            answer_text = ans.get("answer", "No answer provided")
            print(f"Q{question_id}: {answer_text}")
            cursor.execute(
                "INSERT INTO answers (user_id, question_id, answer_text, timestamp) VALUES (%s, %s, %s, %s)",
                (user_id, question_id, answer_text, timestamp))
            print("-" * 50)
            print(f"Total answers received: {len(answers)}")
            print(f"Received answers from {user_id}: {answers}")
        db.commit()
        cursor.close()
        return jsonify({
            'success': True,
            'message': 'Answers received successfully',
            'domain': domain,
            'total_questions': len(questions),
            'total_answers': len(answers)
        })
        
    except Exception as e:
        print(f"Error processing answers: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
@app.route('/grade-interview', methods=['GET'])
@jwt_required()
def grade_interview():
    def sigmoid(x):
        """Convert logits to 0-1 probability."""
        return 1 / (1 + math.exp(-x))
    try:
        user_email = get_jwt_identity()
        cursor.execute("SELECT user_id FROM users WHERE email=%s", (user_email,))
        user_id = cursor.fetchone()[0]

        cursor.execute("""
            SELECT a.question_id, a.answer_text, q.sample_answer, q.question
            FROM answers a
            JOIN questions q ON a.question_id = q.question_id
            WHERE a.user_id = %s
            AND a.timestamp = (
                SELECT MAX(timestamp) FROM answers WHERE user_id = %s
            )
        """, (user_id, user_id))
        rows = cursor.fetchall()

        if not rows:
            return {'success': False, 'error': 'No answers found'}

        total_score = 0
        total_questions = len(rows)
        question_details = []

        for qid, user_answer, sample_answer, question_text in rows:
            user_answer = user_answer or ""
            sample_answer = sample_answer or ""
            question_text = question_text or "Unknown Question"

            # ✅ Skip and assign 0s for empty answers
            if not user_answer.strip():
                question_details.append({
                    'question_id': int(qid),
                    'question_text': str(question_text),
                    'user_answer': str(user_answer),
                    'sample_answer': str(sample_answer),
                    'scores': {
                        'cosine_similarity': 0.0,
                        'sentiment_analysis': 0.0,
                        'grammar_score': 0.0,
                        'structure_score': 0.0,
                        'final_score': 0.0
                    },
                    'spacy_metrics': {
                        'sentence_count': 0,
                        'avg_sentence_length': 0.0,
                        'lexical_diversity': 0.0,
                        'pos_tags': {},
                        'readability_level': 'Unknown'
                    },
                    'weight_breakdown': {
                        'cosine_similarity_weight': 40,
                        'sentiment_analysis_weight': 20,
                        'grammar_score_weight': 25,
                        'structure_score_weight': 15
                    }
                })
                continue

            # --- Semantic similarity (SentenceTransformer) ---
            # --- Hybrid semantic similarity scoring ---
            cosine_similarity_score = 0
            if user_answer and sample_answer:
                try:
                    # --- Bi-encoder similarity ---
                    embeddings = bi_encoder.encode([user_answer, sample_answer])
                    bi_score = float(cosine_similarity([embeddings[0]], [embeddings[1]])[0][0])  # -1 to +1

                    # Normalize to 0-1
                    bi_score_norm = (bi_score + 1) / 2

                    # --- Cross-encoder similarity ---
                    cross_score = float(cross_encoder.predict([(user_answer, sample_answer)])[0])

                    # Detect if cross_score is likely a raw logit (>1) or 0–5 scale
                    if cross_score > 1.5:           # arbitrary threshold for logits
                        cross_score_norm = sigmoid(cross_score)
                    elif cross_score > 1:           # 0–5 scale
                        cross_score_norm = max(0, min(1, cross_score / 5))
                    else:                           # 0–1 scale
                        cross_score_norm = max(0, min(1, cross_score))

                    # --- Weighted combination ---
                    hybrid_score = 0.4 * bi_score_norm + 0.6 * cross_score_norm

                    # --- Scale to 0–100%
                    cosine_similarity_score = round(max(0, min(100, hybrid_score * 100)), 2)

                except Exception as e:
                    print(f"Error in hybrid similarity: {e}")
                    cosine_similarity_score = 0
            else:
                cosine_similarity_score = 0



            # --- Sentiment Analysis ---
            try:
                user_sentiment = TextBlob(user_answer).sentiment.polarity
                sample_sentiment = TextBlob(sample_answer).sentiment.polarity
                sentiment_score = float(max(0, 100 - abs(user_sentiment - sample_sentiment) * 100))
                sentiment_score = round(sentiment_score, 2)
            except:
                sentiment_score = 50.0

            # --- Grammar checking using spaCy ---
            try:
                grammar_errors = check_grammar_with_spacy(user_answer)
                grammar_score = float(max(0, 100 - grammar_errors * 4))
                grammar_score = round(grammar_score, 2)
            except:
                grammar_score = 50.0

            # --- Advanced text structure metrics ---
            try:
                advanced_metrics = get_advanced_metrics(user_answer)
            except:
                advanced_metrics = {
                    'sentence_count': 0,
                    'avg_sentence_length': 0.0,
                    'lexical_diversity': 0.0,
                    'pos_tags': {},
                    'readability_level': 'Unknown'
                }

            # --- Readability and structure score ---
            try:
                readability_score = textstat.flesch_reading_ease(user_answer)
                structure_bonus = 0
                if advanced_metrics['sentence_count'] > 0:
                    structure_bonus = min(20, advanced_metrics['sentence_count'] * 2)
                if advanced_metrics['lexical_diversity'] > 0.7:
                    structure_bonus += 10

                structure_score = float(max(0, min(readability_score + structure_bonus, 100)))
            except:
                structure_score = 50.0

            structure_score = round(structure_score, 2)

            # --- Final Weighted Score ---
            final_score = float(
                0.4 * cosine_similarity_score +
                0.2 * sentiment_score +
                0.25 * grammar_score +
                0.15 * structure_score
            )
            final_score = round(final_score, 2)
            total_score += final_score

            # --- Store per-question results ---
            question_details.append({
                'question_id': int(qid),
                'question_text': str(question_text),
                'user_answer': str(user_answer),
                'sample_answer': str(sample_answer),
                'scores': {
                    'cosine_similarity': float(cosine_similarity_score),
                    'sentiment_analysis': float(sentiment_score),
                    'grammar_score': float(grammar_score),
                    'structure_score': float(structure_score),
                    'final_score': float(final_score)
                },
                'spacy_metrics': {
                    'sentence_count': int(advanced_metrics['sentence_count']),
                    'avg_sentence_length': float(advanced_metrics['avg_sentence_length']),
                    'lexical_diversity': float(advanced_metrics['lexical_diversity']),
                    'pos_tags': {str(k): int(v) for k, v in advanced_metrics['pos_tags'].items()},
                    'readability_level': str(advanced_metrics['readability_level'])
                },
                'weight_breakdown': {
                    'cosine_similarity_weight': 40,
                    'sentiment_analysis_weight': 20,
                    'grammar_score_weight': 25,
                    'structure_score_weight': 15
                }
            })

        # --- Overall grading summary ---
        average_score = float(round(total_score / total_questions, 2))

        return {
            'success': True,
            'grading_summary': {
                'total_questions': int(total_questions),
                'average_score': float(average_score),
                'total_score': float(round(total_score, 2)),
                'grading_system': 'Enhanced AI Grading System',
                'ai_components_used': [
                    'Sentence Transformers',
                    'TextBlob Sentiment Analysis',
                    'spaCy Grammar Checking',
                    'Readability Metrics'
                ]
            },
            'question_details': question_details,
            'scoring_weights': {
                'cosine_similarity': '40% - Semantic similarity with sample answer',
                'sentiment_analysis': '20% - Emotional tone matching',
                'grammar_score': '25% - Grammar and language structure',
                'structure_score': '15% - Readability and text structure'
            }
        }

    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'error_type': type(e).__name__
        }
if __name__ == "__main__":
    app.run(debug=True, port=5000)
