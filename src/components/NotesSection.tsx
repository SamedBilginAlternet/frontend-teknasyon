import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollText, Edit3, Trash2, Plus } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  isVoiceNote: boolean;
}

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ notes, onAddNote, onDeleteNote }) => {
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        timestamp: new Date(),
        isVoiceNote: false,
      };
      onAddNote(note);
      setNewNote('');
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="p-6 bg-gradient-shadow border-throne-gold/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-throne-gold flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Notes Archive
          </h3>
          <Badge variant="outline" className="border-throne-gold text-throne-gold">
            {notes.length} notes
          </Badge>
        </div>

        {/* Add new note */}
        <div className="space-y-2">
          <Textarea
            placeholder="Write your thoughts here..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="bg-throne-charcoal border-throne-gold/30 text-foreground min-h-[100px]"
          />
          <Button variant="throne" onClick={addNote} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>

        {/* Notes list */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ScrollText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No notes yet. Start by recording a voice note or typing above.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="p-4 rounded-lg bg-throne-charcoal/50 border border-throne-gold/10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-throne-gold">
                        {formatTimestamp(note.timestamp)}
                      </span>
                      {note.isVoiceNote && (
                        <Badge variant="outline" className="border-dragon-fire text-dragon-fire text-xs">
                          Voice Note
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(editingId === note.id ? null : note.id)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteNote(note.id)}
                      className="text-dragon-fire hover:text-dragon-fire-dark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};