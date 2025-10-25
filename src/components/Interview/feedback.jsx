import React, { useState, useEffect } from 'react';
import './feedback.css';
import axios from 'axios';

const Review = () => {
  const [gradingData, setGradingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const fetchGradingData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('token');

        const response = await axios.get('http://localhost:5000/grade-interview', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        if (!data.success) {
          throw new Error(data.error || 'Failed to grade interview');
        }

        // Map the new data structure to match the component's expected format
        const formattedDetails = data.question_details.map((q) => ({
          question_id: q.question_id,
          question_text: q.question_text,
          user_answer: q.user_answer,
          sample_answer: q.sample_answer,
          cosine_similarity: q.scores.cosine_similarity,
          sentiment_score: q.scores.sentiment_analysis,
          grammar_score: q.scores.grammar_score,
          structure_score: q.scores.structure_score,
          final_score: q.scores.final_score,
          spacy_metrics: {
            sentence_count: q.spacy_metrics.sentence_count,
            avg_sentence_length: q.spacy_metrics.avg_sentence_length,
            lexical_diversity: q.spacy_metrics.lexical_diversity,
            // Calculate ratios from POS tags if available
            noun_ratio: (q.spacy_metrics.pos_tags?.NOUN || 0) / Math.max(1, Object.values(q.spacy_metrics.pos_tags || {}).reduce((a, b) => a + b, 0)),
            verb_ratio: (q.spacy_metrics.pos_tags?.VERB || 0) / Math.max(1, Object.values(q.spacy_metrics.pos_tags || {}).reduce((a, b) => a + b, 0))
          }
        }));

        setGradingData({
          average_score: data.grading_summary.average_score,
          total_questions: data.grading_summary.total_questions,
          total_score: data.grading_summary.total_score,
          grading_system: data.grading_summary.grading_system,
          ai_components: data.grading_summary.ai_components_used,
          details: formattedDetails,
          scoring_weights: data.scoring_weights
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching grading data:', err);
        setError(err.response?.data?.error || err.message || 'Failed to fetch grading data');
        setLoading(false);
      }
    };

    fetchGradingData();
  }, []);

  const toggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 70) return '#f59e0b';
    if (score >= 60) return '#ef4444';
    return '#6b7280';
  };

  const getPerformanceText = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    return 'Needs Improvement';
  };

  const ScoreBreakdown = ({ question }) => {
    const scoreComponents = [
      {
        label: "Semantic Relevance",
        value: question.cosine_similarity,
        description: "Content matching with expected answer",
        icon: "🔍",
        weight: "40%"
      },
      {
        label: "Tone Matching", 
        value: question.sentiment_score,
        description: "Emotional tone appropriateness",
        icon: "😊",
        weight: "20%"
      },
      {
        label: "Grammar & Structure",
        value: question.grammar_score,
        description: "Language quality and accuracy",
        icon: "📝",
        weight: "25%"
      },
      {
        label: "Readability",
        value: question.structure_score,
        description: "Clarity and organization",
        icon: "📊",
        weight: "15%"
      }
    ];

    return (
      <div className="breakdown-container">
        <h4 className="breakdown-title">Detailed Scoring Breakdown</h4>
        <div className="scoring-breakdown">
          {scoreComponents.map((component, index) => (
            <div key={index} className="score-item">
              <div className="score-header">
                <span className="score-icon">{component.icon}</span>
                <span className="score-label">{component.label}</span>
                <span className="score-weight">({component.weight})</span>
              </div>
              <div className="score-value" style={{ color: getScoreColor(component.value) }}>
                {component.value}%
              </div>
              <div className="score-description">
                {component.description}
              </div>
              <div className="score-bar">
                <div 
                  className="score-progress" 
                  style={{ 
                    width: `${component.value}%`,
                    backgroundColor: getScoreColor(component.value)
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const QuestionCard = ({ question, index }) => {
    const isExpanded = expandedQuestion === question.question_id;
    
    return (
      <div className={`question-item ${isExpanded ? 'expanded' : ''}`}>
        <div 
          className="question-header"
          onClick={() => toggleQuestion(question.question_id)}
        >
          <div className="question-main">
            <div className="question-number">Q{index + 1}</div>
            <div className="question-text">
              <h3>{question.question_text}</h3>
            </div>
          </div>
          <div className="question-meta">
            <div 
              className="question-score"
              style={{ backgroundColor: getScoreColor(question.final_score) }}
            >
              {question.final_score}%
            </div>
            <div className="expand-icon">
              {isExpanded ? '▲' : '▼'}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="question-content">
            {/* Answers Section */}
            <div className="answers-section">
              <div className="answer-group user-answer">
                <div className="answer-header">
                  <span className="answer-icon">💬</span>
                  <span className="answer-title">Your Answer</span>
                </div>
                <div className="answer-text">
                  {question.user_answer || "No answer provided"}
                </div>
              </div>
              
              <div className="answer-group sample-answer">
                <div className="answer-header">
                  <span className="answer-icon">🎯</span>
                  <span className="answer-title">Expected Answer</span>
                </div>
                <div className="answer-text">
                  {question.sample_answer}
                </div>
              </div>
            </div>

            {/* Scoring Breakdown */}
            <ScoreBreakdown question={question} />

            {/* Weight Information */}
            <div className="weight-info">
              <h5>Scoring Weights Applied:</h5>
              <div className="weight-list">
                <span>Semantic Similarity: 40%</span>
                <span>Sentiment Analysis: 20%</span>
                <span>Grammar & Structure: 25%</span>
                <span>Readability: 15%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="review-container">
        <div className="loading-container">
          <div className="loading-animation">
            <div className="loading-spinner"></div>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <h2>Analyzing Your Interview</h2>
          <p>Our AI is carefully evaluating your responses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Results</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!gradingData || !gradingData.details || gradingData.details.length === 0) {
    return (
      <div className="review-container">
        <div className="error-container">
          <div className="error-icon">📝</div>
          <h2>No Interview Data Available</h2>
          <p>Complete an interview to see your detailed results here.</p>
          <button className="retry-button" onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-container">
      {/* Header */}
      <div className="review-header">
        <div className="header-content">
          <h1>AI-Powered Interview Review</h1>
          <p>Detailed analysis using {gradingData.ai_components?.join(', ')}</p>
        </div>
        <div className="header-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="review-content">
        {/* Summary Card */}
        <div className="summary-section">
          <div className="summary-card">
            <div className="summary-content">
              <div className="score-display">
                <div 
                  className="main-score"
                  style={{ color: getScoreColor(gradingData.average_score) }}
                >
                  {gradingData.average_score}%
                </div>
                <div className="score-label">Overall Score</div>
                <div 
                  className="performance-badge"
                  style={{ backgroundColor: getScoreColor(gradingData.average_score) }}
                >
                  {getPerformanceText(gradingData.average_score)}
                </div>
              </div>
              <div className="summary-stats">
                <div className="stat-item">
                  <div className="stat-value">{gradingData.total_questions}</div>
                  <div className="stat-label">Questions</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {gradingData.details.filter(q => q.final_score >= 70).length}
                  </div>
                  <div className="stat-label">Strong Answers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {gradingData.details.filter(q => q.final_score >= 80).length}
                  </div>
                  <div className="stat-label">Excellent</div>
                </div>
              </div>
            </div>
            <div className="summary-graphic">
              <div className="graphic-circle">
                <div className="graphic-inner"></div>
              </div>
              <div className="ai-badge">
                🤖 AI Grading
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="questions-section">
          <div className="section-header">
            <h2>Detailed Question Analysis</h2>
            <p>Click on each question to see comprehensive feedback and metrics</p>
          </div>
          <div className="questions-list">
            {gradingData.details.map((question, index) => (
              <QuestionCard 
                key={question.question_id}
                question={question}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;