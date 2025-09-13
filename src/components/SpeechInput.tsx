import React, { useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";

type Props = {
  onResult: (text: string) => void;
  currentText?: string;
};

export const SpeechInput: React.FC<Props> = ({ onResult, currentText = '' }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const lastTranscriptRef = useRef('');
  const isListeningRef = useRef(false);

  // Update tracking refs
  useEffect(() => {
    isListeningRef.current = listening;
  }, [listening]);

  // Handle transcript changes
  useEffect(() => {
    if (listening && transcript && transcript !== lastTranscriptRef.current) {
      // Only append the new part of transcript to existing text
      const newPart = transcript.replace(lastTranscriptRef.current, '');
      if (newPart.trim()) {
        const updatedText = currentText + (currentText ? ' ' : '') + newPart.trim();
        onResult(updatedText);
      }
      lastTranscriptRef.current = transcript;
    }
  }, [transcript, listening, onResult, currentText]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <Button variant="outline" type="button" disabled title="Tarayıcı konuşmayı desteklemiyor">
        <Mic className="h-4 w-4" />
      </Button>
    );
  }

  const handleToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      // Reset transcript when stopping
      setTimeout(() => {
        resetTranscript();
        lastTranscriptRef.current = '';
      }, 100);
    } else {
      // Reset transcript when starting
      resetTranscript();
      lastTranscriptRef.current = '';
      SpeechRecognition.startListening({ continuous: true, language: 'tr-TR' });
    }
  };

  return listening ? (
    <Button variant="destructive" type="button" onClick={handleToggle} title="Dinlemeyi durdur">
      <Square className="h-4 w-4" />
    </Button>
  ) : (
    <Button variant="secondary" type="button" onClick={handleToggle} title="Konuşmayı başlat">
      <Mic className="h-4 w-4" />
    </Button>
  );
};

export default SpeechInput;
