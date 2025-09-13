import React, { useState } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { NotesSection } from '@/components/NotesSection';
import { PromptImprover } from '@/components/PromptImprover';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-shadow border-b border-navy-primary/20 p-6">
        <div className="container mx-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-navy-light">Notlar</h1>
            <p className="text-muted-foreground">Sesli ve yazılı notlarınızı yönetin</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div>
              <VoiceRecorder onTranscription={handleVoiceTranscription} />
            </div>
            <div>
              <PromptImprover onImprovedPrompt={handleImprovedPrompt} />
            </div>
            <div>
              <NotesSection 
                notes={notes}
                onAddNote={addNote}
                onDeleteNote={deleteNote}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;