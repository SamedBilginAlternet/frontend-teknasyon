import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";

type Props = {
  onResult: (text: string) => void;
};

export const SpeechInput: React.FC<Props> = ({ onResult }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Update input text as user speaks
  React.useEffect(() => {
    onResult(transcript);
  }, [transcript, onResult]);

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
    } else {
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
