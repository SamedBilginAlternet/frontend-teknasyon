import React, { useState } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { NotesSection } from '@/components/NotesSection';
import { PromptImprover } from '@/components/PromptImprover';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChatInterface } from '@/components/ChatInterface';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  isVoiceNote: boolean;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const handleVoiceTranscription = (text: string) => {
    const note: Note = {
      id: Date.now().toString(),
      content: text,
      timestamp: new Date(),
      isVoiceNote: true,
    };
    setNotes([note, ...notes]);
  };

  const handleImprovedPrompt = (improvedText: string) => {
    const note: Note = {
      id: Date.now().toString(),
      content: improvedText,
      timestamp: new Date(),
      isVoiceNote: false,
    };
    setNotes([note, ...notes]);
  };

  const addNote = (note: Note) => {
    setNotes([note, ...notes]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-navy-dark/80 to-navy-medium/40">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-shadow border-b border-navy-primary/20 h-16 flex items-center px-6 shadow-md">
        <div className="container mx-auto flex items-center gap-4 h-full">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-navy-light">Akıllı Görevler</h1>
          <span className="text-sm text-muted-foreground ml-2">Görevlerinizi yönetin ve zamanınızı takip edin</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl grid grid-cols-1 xl:grid-cols-3 gap-8">
          <Card className="p-8 rounded-3xl shadow-xl bg-gradient-to-br from-navy-medium/60 to-navy-dark/40 border-navy-primary/30">
            <h2 className="text-xl font-bold text-navy-light mb-4">Sesli Not Ekle</h2>
            <VoiceRecorder onTranscription={handleVoiceTranscription} />
          </Card>
          <Card className="p-8 rounded-3xl shadow-xl bg-gradient-to-br from-navy-medium/60 to-navy-dark/40 border-navy-primary/30">
            <h2 className="text-xl font-bold text-navy-light mb-4">Prompt İyileştirici</h2>
            <PromptImprover onImprovedPrompt={handleImprovedPrompt} />
          </Card>
          <Card className="p-8 rounded-3xl shadow-xl bg-gradient-to-br from-navy-medium/60 to-navy-dark/40 border-navy-primary/30">
            <h2 className="text-xl font-bold text-navy-light mb-4">Notlarım</h2>
            <NotesSection 
              notes={notes}
              onAddNote={addNote}
              onDeleteNote={deleteNote}
            />
          </Card>
        </div>
      </main>

      {/* Chat sabit alt kısımda */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Notes;