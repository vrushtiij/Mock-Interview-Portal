from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from textblob import TextBlob
import textstat
import mysql.connector
import requests
import re
import spacy

class SpacyGrammarChecker:
    """Advanced grammar and quality checking using spaCy"""
    
    def __init__(self):
        try:
            # Load spaCy's English model
            self.nlp = spacy.load("en_core_web_sm")
            self.spacy_available = True
            print("✅ spaCy model loaded successfully")
        except OSError:
            print("⚠️ spaCy model not found. Install with: python -m spacy download en_core_web_sm")
            self.spacy_available = False
            self.nlp = None
    
    def check_grammar_with_spacy(self, text):
        """Use spaCy for advanced grammar and quality analysis"""
        if not text or not text.strip():
            return 10
        
        if not self.spacy_available:
            return self._fallback_grammar_check(text)
        
        try:
            doc = self.nlp(text)
            errors = 0
            
            # 1. Check for incomplete sentences
            if len(list(doc.sents)) == 0:
                errors += 2
            
            # 2. Check POS tag patterns for basic grammar
            pos_tags = [token.pos_ for token in doc]
            
            # Look for unusual POS sequences that might indicate grammar issues
            if len(pos_tags) >= 3:
                # Check for missing verbs
                if 'VERB' not in pos_tags:
                    errors += 2
                
                # Check for missing nouns/subjects
                if 'NOUN' not in pos_tags and 'PRON' not in pos_tags:
                    errors += 1
            
            # 3. Check punctuation
            if text and text[-1] not in ['.', '!', '?']:
                errors += 1
            
            # 4. Check capitalization
            sentences = list(doc.sents)
            for sent in sentences:
                if sent.text.strip() and not sent.text.strip()[0].isupper():
                    errors += 1
            
            # 5. Check for very short answers
            if len(doc) < 3:  # Less than 3 tokens
                errors += 2
            
            # 6. Check for repeated tokens (indicating stuttering or poor structure)
            tokens = [token.text.lower() for token in doc]
            if len(tokens) > 5:
                unique_ratio = len(set(tokens)) / len(tokens)
                if unique_ratio < 0.6:  # Too much repetition
                    errors += 1
            
            return max(1, errors)  # At least 1 error for very poor answers
            
        except Exception as e:
            print(f"spaCy analysis error: {e}")
            return self._fallback_grammar_check(text)
    
    def get_advanced_metrics(self, text):
        """Get advanced linguistic metrics using spaCy"""
        if not self.spacy_available or not text.strip():
            return {
                'sentence_count': 0,
                'avg_sentence_length': 0,
                'lexical_diversity': 0,
                'noun_ratio': 0,
                'verb_ratio': 0
            }
        
        try:
            doc = self.nlp(text)
            sentences = list(doc.sents)
            tokens = [token for token in doc if not token.is_punct and not token.is_space]
            
            if len(tokens) == 0:
                return {
                    'sentence_count': 0,
                    'avg_sentence_length': 0,
                    'lexical_diversity': 0,
                    'noun_ratio': 0,
                    'verb_ratio': 0
                }
            
            # Calculate metrics
            sentence_count = len(sentences)
            avg_sentence_length = len(tokens) / max(1, sentence_count)
            
            # Lexical diversity (type-token ratio)
            unique_tokens = set(token.text.lower() for token in tokens if not token.is_punct)
            lexical_diversity = len(unique_tokens) / len(tokens)
            
            # POS ratios
            nouns = [token for token in tokens if token.pos_ in ['NOUN', 'PROPN']]
            verbs = [token for token in tokens if token.pos_ == 'VERB']
            noun_ratio = len(nouns) / len(tokens)
            verb_ratio = len(verbs) / len(tokens)
            
            return {
                'sentence_count': sentence_count,
                'avg_sentence_length': avg_sentence_length,
                'lexical_diversity': lexical_diversity,
                'noun_ratio': noun_ratio,
                'verb_ratio': verb_ratio
            }
            
        except Exception as e:
            print(f"spaCy metrics error: {e}")
            return {
                'sentence_count': 0,
                'avg_sentence_length': 0,
                'lexical_diversity': 0,
                'noun_ratio': 0,
                'verb_ratio': 0
            }
    
    def _fallback_grammar_check(self, text):
        """Fallback grammar checking"""
        errors = 0
        if not text.strip():
            return 10
        
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        for sentence in sentences:
            if sentence and not sentence[0].isupper():
                errors += 1
        
        if text and text[-1] not in ['.', '!', '?']:
            errors += 1
        
        if len(text.split()) < 3:
            errors += 2
        
        return max(1, errors)

# Initialize AI components
model = SentenceTransformer('all-MiniLM-L6-v2')
spacy_checker = SpacyGrammarChecker()

# Connect to database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="mockme"
)
cursor = db.cursor()

def grade_interview():
    try:
        user_id = 6

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
        details = []

        for qid, user_answer, sample_answer, question_text in rows:
            user_answer = user_answer or ""
            sample_answer = sample_answer or ""
            question_text = question_text or "Unknown Question"

            print(f"\n📝 Question: {question_text}")
            print(f"💬 User Answer: {user_answer}")
            print(f"🎯 Sample Answer: {sample_answer}")

            # 1. AI: Semantic Similarity (Sentence Transformers)
            if user_answer and sample_answer:
                embeddings = model.encode([user_answer, sample_answer])
                cos_sim = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0] * 100
                print(f"   🔍 AI Analysis: Semantic similarity calculated")
            else:
                cos_sim = 0

            # 2. AI: Sentiment Analysis (TextBlob)
            user_sentiment = TextBlob(user_answer).sentiment.polarity
            sample_sentiment = TextBlob(sample_answer).sentiment.polarity
            sentiment_score = max(0, 100 - abs(user_sentiment - sample_sentiment) * 100)
            print(f"   😊 AI Analysis: Sentiment matching analyzed")

            # 3. AI: Advanced Grammar & Structure (spaCy)
            grammar_errors = spacy_checker.check_grammar_with_spacy(user_answer)
            grammar_score = max(0, 100 - grammar_errors * 4)
            
            # Get advanced metrics for detailed feedback
            advanced_metrics = spacy_checker.get_advanced_metrics(user_answer)
            print(f"   📊 spaCy Analysis: Grammar & structure evaluated")
            print(f"      - Sentences: {advanced_metrics['sentence_count']}")
            print(f"      - Avg length: {advanced_metrics['avg_sentence_length']:.1f} words")
            print(f"      - Lexical diversity: {advanced_metrics['lexical_diversity']:.2f}")

            # 4. Enhanced Readability with spaCy metrics
            try:
                readability_score = textstat.flesch_reading_ease(user_answer)
                # Enhance with spaCy metrics
                structure_bonus = 0
                if advanced_metrics['sentence_count'] > 0:
                    structure_bonus = min(20, advanced_metrics['sentence_count'] * 2)
                if advanced_metrics['lexical_diversity'] > 0.7:
                    structure_bonus += 10
                
                structure_score = max(0, min(readability_score + structure_bonus, 100))
            except:
                structure_score = 50

            # Final weighted score
            final_score = round(
                0.4 * cos_sim +      # AI - Semantic similarity
                0.2 * sentiment_score + # AI - Sentiment  
                0.25 * grammar_score +  # AI - spaCy grammar
                0.15 * structure_score, # Enhanced readability
                2
            )

            total_score += final_score
            
            details.append({
                'question_id': qid,
                'question_text': question_text,
                'user_answer': user_answer,
                'sample_answer': sample_answer,
                'cosine_similarity': round(cos_sim, 2),
                'sentiment_score': round(sentiment_score, 2),
                'grammar_score': round(grammar_score, 2),
                'structure_score': round(structure_score, 2),
                'spacy_metrics': advanced_metrics,
                'final_score': final_score
            })

            print(f"\n📊 ENHANCED SCORING BREAKDOWN:")
            print(f"   • 🤖 AI Semantic Analysis: {cos_sim:.2f}%")
            print(f"   • 😊 AI Sentiment Matching: {sentiment_score:.2f}%")
            print(f"   • 🧠 spaCy Grammar & Structure: {grammar_score:.2f}%")
            print(f"   • 📈 Enhanced Readability: {structure_score:.2f}%")
            print(f"   🎯 FINAL SCORE: {final_score:.2f}%")
            print(f"{'-'*60}")

        average_score = round(total_score / total_questions, 2)
        
        print(f"\n{'='*80}")
        print(f"📈 OVERALL ENHANCED AI SCORE: {average_score}%")
        print(f"🤖 AI Components: 85% (spaCy + Transformers + TextBlob)")
        print(f"⚙️  Enhanced Metrics: 15%")
        print(f"{'='*80}")

        return {
            'success': True,
            'total_questions': total_questions,
            'average_score': average_score,
            'grading_system': 'spaCy Enhanced AI (85% AI models, 15% enhanced metrics)',
            'ai_components': ['Sentence Transformers', 'TextBlob Sentiment', 'spaCy NLP'],
            'details': details
        }

    except Exception as e:
        print(f"❌ Error in spaCy grading system: {str(e)}")
        return {'success': False, 'error': str(e)}

if __name__ == "__main__":
    response = grade_interview()
    print(f"\n📦 Enhanced AI System Response: {response}")