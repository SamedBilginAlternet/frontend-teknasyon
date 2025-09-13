import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { improvePrompt } from '@/store/promptSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mic, Send, Square, X } from 'lucide-react';
import SpeechInput from '@/components/SpeechInput';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

import axios from 'axios';

export const ChatInterface = () => {
  const { user } = useAppSelector(state => state.auth);
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
  const dispatch = useAppDispatch();
  const [improveTargetId, setImproveTargetId] = useState<string | null>(null);
  const [improvedMap, setImprovedMap] = useState<{[id: string]: string}>({});
  const [approvedId, setApprovedId] = useState<string | null>(null);

  // Mesajı iyileştir (Copilot arrow)
  const handleImproveMessage = async (id: string, text: string) => {
    setImproveTargetId(id);
    try {
      // Redux thunk ile API çağrısı
      const res = await dispatch(improvePrompt({ prompt: text })).unwrap();
      setImprovedMap(prev => ({ ...prev, [id]: res.improved }));
    } catch (e) {
      // Hata yönetimi
    }
    setImproveTargetId(null);
  };

  // Onayla ve yeni mesaj olarak gönder
  const handleApprove = (id: string) => {
    const improved = improvedMap[id];
    if (improved) {
      setApprovedId(id);
      setInputText(improved);
      sendMessage(improved);
    }
  };

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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-navy-dark/95 border-b border-navy-primary/20 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-accent-gold to-accent-gold/70 rounded-full flex items-center justify-center">
                  <span className="text-navy-dark font-bold text-sm">AI</span>
                </div>
                <h3 className="text-lg font-semibold text-navy-light">ThroneMind AI</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsFullscreen(false)}
                className="text-navy-light hover:bg-navy-medium/40 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-hidden bg-gradient-to-b from-navy-dark/60 to-navy-medium/40">
              <div 
                className="h-full overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-navy-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-navy-primary/50"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(59, 130, 246, 0.3) transparent'
                }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar + Improve Arrow (Copilot style) */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center relative">
                      {message.isUser && !improvedMap[message.id] && (
                        <button
                          className={`absolute -top-4 -left-7 bg-white border border-navy-primary/20 rounded-full p-1 shadow transition hover:bg-accent-gold/80 ${improveTargetId === message.id ? 'animate-pulse' : ''}`}
                          title="Promptu İyileştir"
                          onClick={() => handleImproveMessage(message.id, message.text)}
                          disabled={improveTargetId === message.id}
                          style={{zIndex:2}}
                        >
                          <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M10 15V5m0 0l-5 5m5-5l5 5" stroke="#1a2236" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      )}
                      {message.isUser && improvedMap[message.id] && (
                        <button
                          className="absolute -top-4 -left-7 bg-accent-gold border border-navy-primary/20 rounded-full p-1 shadow flex items-center justify-center"
                          title="Düzeltilmiş promptu onayla ve gönder"
                          onClick={() => handleApprove(message.id)}
                          style={{zIndex:2}}
                        >
                          <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M5 10l4 4 6-8" stroke="#1a2236" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      )}
                      <div className={`${message.isUser ? '' : 'bg-gradient-to-r from-accent-gold to-accent-gold/70 text-navy-dark'} w-12 h-12 rounded-full flex items-center justify-center`}>
                        {message.isUser ? (
                          user?.avatarUrl ? (
                            <img
                              src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://192.168.20.43:8083${user.avatarUrl}`}
                              alt="Profil"
                              className="w-12 h-12 rounded-full object-cover border-2 border-navy-primary/40"
                            />
                          ) : (
                            <span className="text-lg font-semibold">S</span>
                          )
                        ) : (
                          <span className="text-lg font-bold">AI</span>
                        )}
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className={`flex-1 max-w-[80%] ${message.isUser ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-block p-4 rounded-2xl shadow-lg ${
                          message.isUser
                            ? 'bg-navy-primary text-navy-dark rounded-br-md'
                            : 'bg-navy-light/10 text-navy-light border border-navy-primary/20 rounded-bl-md backdrop-blur-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                        {/* Düzeltilmiş öneri mesajı */}
                        {message.isUser && improvedMap[message.id] && (
                          <div className="mt-2 flex items-center justify-end gap-2">
                            <span className="text-xs bg-accent-gold/20 px-2 py-1 rounded text-navy-dark font-semibold animate-blink">
                              {improvedMap[message.id]}
                            </span>
                            {approvedId === message.id && (
                              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 10l4 4 6-8" stroke="#FFD700" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            )}
                          </div>
                        )}
                      </div>
                      <div className={`mt-1 text-xs text-navy-light/50 ${message.isUser ? 'text-right' : 'text-left'}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-navy-dark/95 border-t border-navy-primary/20 backdrop-blur-md">
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <div className="flex items-end gap-3 bg-navy-medium/30 rounded-xl p-3 border border-navy-primary/30 backdrop-blur-sm">
                  <div className="flex-1">
                    <Input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Mesajınızı yazın..."
                      className="border-0 bg-transparent focus:ring-0 focus:outline-none text-navy-light placeholder:text-navy-light/50 resize-none min-h-[20px] max-h-32"
                      style={{ boxShadow: 'none' }}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <SpeechInput
                      currentText={inputText}
                      onResult={(text) => {
                        setInputText(text);
                      }}
                    />
                    {/* Promptu İyileştir butonu input için */}
                    {!improvedMap['input'] && (
                      <button
                        className={`bg-white border border-navy-primary/20 rounded-full p-1 shadow transition hover:bg-accent-gold/80`}
                        title="Promptu İyileştir"
                        onClick={async (e) => {
                          e.preventDefault();
                          if (inputText.trim()) {
                            setImproveTargetId('input');
                            try {
                              const res = await dispatch(improvePrompt({ prompt: inputText })).unwrap();
                              setImprovedMap(prev => ({ ...prev, input: res.improved }));
                            } catch (e) {}
                            setImproveTargetId(null);
                          }
                        }}
                        disabled={improveTargetId === 'input' || !inputText.trim()}
                        style={{zIndex:2}}
                      >
                        <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M10 15V5m0 0l-5 5m5-5l5 5" stroke="#1a2236" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    )}
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={!inputText.trim()} 
                      className="bg-accent-gold hover:bg-accent-gold/80 text-navy-dark rounded-full transition-all duration-200"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* İyileştirilmiş öneri input kutusunun altında gösteriliyor */}
                  {improvedMap['input'] && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-accent-gold/20 px-2 py-1 rounded text-navy-dark font-semibold animate-blink">
                        {improvedMap['input']}
                      </span>
                      <button
                        className="bg-accent-gold border border-navy-primary/20 rounded-full p-1 shadow flex items-center justify-center"
                        title="Düzeltilmiş promptu değiştir ve gönder"
                        onClick={async (e) => {
                          e.preventDefault();
                          setInputText(improvedMap['input']);
                          await sendMessage(improvedMap['input']);
                          setImprovedMap(prev => ({ ...prev, input: undefined }));
                        }}
                        style={{zIndex:2}}
                      >
                        <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M5 10l4 4 6-8" stroke="#1a2236" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-gradient-shadow border-navy-primary/20 shadow-lg">
          <Card className="w-full rounded-none p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="w-full flex justify-center">
                <div className="flex gap-2 w-full max-w-lg items-center bg-navy-medium/20 rounded-lg p-2 border border-navy-primary/30">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    className="flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none"
                  />
                  <div className="flex gap-1">
                    <SpeechInput
                      currentText={inputText}
                      onResult={(text) => {
                        setInputText(text);
                      }}
                    />
                    <Button type="submit" size="icon" disabled={!inputText.trim()} className="bg-navy-primary hover:bg-navy-primary/80">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}