import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mic, Send, Square } from 'lucide-react';
import SpeechInput from '@/components/SpeechInput';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! Size nasıl yardımcı olabilirim? Sesli mesaj gönderebilir veya yazabilirsiniz.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `"${text}" ile ilgili size yardımcı olabilirim. Bu konuda ne yapmak istiyorsunuz?`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputText('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
    if (inputText.trim()) {
      setIsFullscreen(true);
    }
  };

  return (
    <>
      {isFullscreen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <Card className="w-full max-w-2xl h-[90vh] p-6 bg-gradient-shadow border-navy-primary/20 rounded-xl shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(false)}>
                Kapat
              </Button>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-navy-primary text-navy-dark'
                        : 'bg-navy-medium text-navy-light'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="w-full flex justify-center">
                <div className="flex gap-2 w-1/2 items-center">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    className="flex-1"
                  />
                  <SpeechInput
                    onResult={(text) => {
                      setInputText(text);
                    }}
                  />
                  <Button type="submit" size="icon" disabled={!inputText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-gradient-shadow border-navy-primary/20 shadow-lg">
          <Card className="w-full rounded-none p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="w-full flex justify-center">
                <div className="flex gap-2 w-1/2 items-center">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    className="flex-1"
                  />
                  <SpeechInput
                    onResult={(text) => {
                      setInputText(text);
                    }}
                  />
                  <Button type="submit" size="icon" disabled={!inputText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}