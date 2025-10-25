import spacy
import math
from collections import Counter

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def check_grammar_with_spacy(text):
    """
    Basic grammar checking using spaCy
    Returns number of potential grammar issues
    """
    if not text or not text.strip():
        return 0
    
    doc = nlp(text)
    
    # Count potential issues
    issues = 0
    
    # Check for very short/long sentences
    sentences = list(doc.sents)
    if sentences:
        for sent in sentences:
            if len(sent) < 3:  # Very short sentence
                issues += 1
            elif len(sent) > 50:  # Very long sentence
                issues += 1
    
    # Check for basic punctuation issues
    if text and not text[-1] in ['.', '!', '?']:
        issues += 1
    
    return issues

def get_advanced_metrics(text):
    """
    Get advanced linguistic metrics using spaCy
    """
    if not text or not text.strip():
        return {
            'sentence_count': 0,
            'avg_sentence_length': 0,
            'lexical_diversity': 0,
            'pos_tags': {},
            'readability_level': 'Unknown'
        }
    
    doc = nlp(text)
    sentences = list(doc.sents)
    
    # Sentence metrics
    sentence_count = len(sentences)
    avg_sentence_length = sum(len(sent) for sent in sentences) / max(1, sentence_count)
    
    # Lexical diversity (type-token ratio)
    words = [token.text.lower() for token in doc if token.is_alpha and not token.is_stop]
    lexical_diversity = len(set(words)) / max(1, len(words))
    
    # POS tag distribution
    pos_tags = Counter([token.pos_ for token in doc if token.pos_])
    
    # Basic readability assessment
    if avg_sentence_length < 10:
        readability_level = "Simple"
    elif avg_sentence_length < 20:
        readability_level = "Standard"
    else:
        readability_level = "Complex"
    
    return {
        'sentence_count': sentence_count,
        'avg_sentence_length': avg_sentence_length,
        'lexical_diversity': lexical_diversity,
        'pos_tags': dict(pos_tags),
        'readability_level': readability_level
    }

def get_basic_metrics(text):
    """
    Fallback function if spaCy is not available
    """
    if not text:
        return {
            'sentence_count': 0,
            'avg_sentence_length': 0,
            'lexical_diversity': 0,
            'pos_tags': {},
            'readability_level': 'Unknown'
        }
    
    # Basic sentence splitting
    sentences = text.split('.')
    sentences = [s.strip() for s in sentences if s.strip()]
    sentence_count = len(sentences)
    
    # Basic word analysis
    words = text.split()
    avg_sentence_length = len(words) / max(1, sentence_count)
    lexical_diversity = len(set(words)) / max(1, len(words))
    
    return {
        'sentence_count': sentence_count,
        'avg_sentence_length': avg_sentence_length,
        'lexical_diversity': lexical_diversity,
        'pos_tags': {'NOUN': 0, 'VERB': 0, 'ADJ': 0},
        'readability_level': 'Basic'
    }