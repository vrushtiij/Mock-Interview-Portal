// VoiceRecorder.jsx
import React, { useEffect } from "react";
import { useVoiceToText } from "react-speakup";
import { Mic, MicOff } from "lucide-react";

const VoiceRecorder = ({ onTranscriptChange, isListening, setIsListening, resetKey }) => {
  const { startListening, stopListening, transcript } = useVoiceToText({
    continuous: true,
    lang: "en-US",
    key: resetKey, // this ensures a fresh instance per question
  });

  useEffect(() => {
    onTranscriptChange(transcript);
    return () => {
      if (isListening) {
        stopListening();
        setIsListening(false);
      }
    };
  }, [transcript, isListening, stopListening, setIsListening]);

  const handleStart = () => {
    startListening();
    setIsListening(true);
  };

  const handleStop = () => {
    stopListening();
    setIsListening(false);
  };

  return (
    <div className="mic-controls">
      <button className={`mic-button ${isListening ? "active" : ""}`} onClick={handleStart} disabled={isListening}>
        <Mic /> Start Speaking
      </button>
      <button className="mic-button" onClick={handleStop} disabled={!isListening}>
        <MicOff /> Stop Speaking
      </button>
    </div>
  );
};

export default VoiceRecorder;
