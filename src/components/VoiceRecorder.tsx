import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SpeechInput from '@/components/SpeechInput';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscription }) => {
  const [currentTranscript, setCurrentTranscript] = useState('');
  const { toast } = useToast();

  const handleSaveNote = () => {
    if (!currentTranscript.trim()) return;
    
    onTranscription(currentTranscript);
    setCurrentTranscript('');
    toast({
      title: "Sesli not kaydedildi",
      description: "Sesli notunuz başarıyla kaydedildi.",
    });
  };

  return (
    <Card className="p-6 bg-gradient-shadow border-throne-gold/20">
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold text-throne-gold">Sesli Notlar</h3>
        <p className="text-sm text-muted-foreground text-center">
          Türkçe konuşarak notlarınızı oluşturun
        </p>
        
        <SpeechInput 
          onResult={(text) => setCurrentTranscript(text)}
        />
        
        {currentTranscript && (
          <div className="w-full p-4 bg-throne-gold/10 rounded-lg border border-throne-gold/20">
            <h4 className="text-sm font-medium text-throne-gold mb-2">Transkript:</h4>
            <p className="text-sm text-muted-foreground">{currentTranscript}</p>
          </div>
        )}
        
        {currentTranscript && (
          <Button 
            onClick={handleSaveNote}
            variant="throne"
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Notu Kaydet
          </Button>
        )}
      </div>
    </Card>
  );
};