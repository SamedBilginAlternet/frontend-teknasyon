import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Square, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        
        // Simulate AI transcription for demo
        setIsProcessing(true);
        setTimeout(() => {
          const mockTranscription = "This is a demo transcription of your voice note. In the full version, this would be processed by AI to clean up and structure your thoughts.";
          onTranscription(mockTranscription);
          setIsProcessing(false);
          toast({
            title: "Voice note transcribed",
            description: "Your voice note has been processed and added to your notes.",
          });
        }, 2000);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak your thoughts, and AI will transcribe them.",
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  return (
    <Card className="p-6 bg-gradient-shadow border-throne-gold/20">
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold text-throne-gold">Voice Notes</h3>
        <p className="text-sm text-muted-foreground text-center">
          Record your thoughts and let AI transcribe them into structured notes
        </p>
        
        <div className="flex items-center space-x-4">
          {!isRecording ? (
            <Button 
              variant="throne" 
              size="lg" 
              onClick={startRecording}
              className="animate-pulse-gold"
            >
              <Mic className="h-5 w-5" />
              Start Recording
            </Button>
          ) : (
            <Button 
              variant="fire" 
              size="lg" 
              onClick={stopRecording}
              className="animate-glow"
            >
              <Square className="h-5 w-5" />
              Stop Recording
            </Button>
          )}
          
          {audioURL && (
            <Button variant="royal" size="lg" onClick={playRecording}>
              <Play className="h-5 w-5" />
              Play
            </Button>
          )}
        </div>

        {isProcessing && (
          <div className="flex items-center space-x-2 text-throne-gold">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-throne-gold"></div>
            <span className="text-sm">AI is transcribing your voice...</span>
          </div>
        )}
      </div>
    </Card>
  );
};