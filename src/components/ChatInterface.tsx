import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { improvePrompt } from '@/store/promptSlice';
import { actPrompt } from '@/store/promptActSlice';
import { optimizeTask } from '@/store/optimizeTaskSlice';
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
  type?: string;
  tasks?: Array<{
    id: number;
    description: string;
    startDate: string;
    endDate: string;
  }>;
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
  const promptAct = useAppSelector(state => state.promptAct);
  // promptAct artık store'da, ama burada kullanılmıyor
  const [inputText, setInputText] = useState('');
  const dispatch = useAppDispatch();
  const [improveTargetId, setImproveTargetId] = useState<string | null>(null);
  const [improvedMap, setImprovedMap] = useState<{[id: string]: string}>({});
  const [approvedId, setApprovedId] = useState<string | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeError, setOptimizeError] = useState<string | null>(null);

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

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // /prompt/act API çağrısı
    try {
      const result = await dispatch(actPrompt({ prompt: text })).unwrap();
      setMessages(prev => [
        ...prev,
        {
          id: (result.id !== null && result.id !== undefined) ? result.id.toString() : Date.now().toString(),
          text: result.message,
          isUser: false,
          timestamp: new Date(),
          type: result.type,
          tasks: result.tasks || undefined,
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'AI yanıtı alınamadı.',
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    }

    setInputText('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
    if (inputText.trim()) {
      setIsFullscreen(true);
    }
  };

  const optimizeTaskState = useAppSelector(state => state.optimizeTask);

  const handleOptimizeTasks = async (taskIds: number[]) => {
    setOptimizing(true);
    setOptimizeError(null);
    try {
      const result = await dispatch(optimizeTask({ taskIds })).unwrap();
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: result.message,
          isUser: false,
          timestamp: new Date(),
          type: 'OPTIMIZE_RESULT',
          tasks: result.newTask ? [result.newTask] : undefined,
        }
      ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setOptimizeError(typeof err === 'string' ? err : 'Optimize işlemi başarısız');
    }
    setOptimizing(false);
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
                          // AI mesajı ise type'a göre ikon ve renk
                          message.type === 'NOTE_CREATED' ? (
                            <span className="text-lg font-bold text-accent-gold">📝</span>
                          ) : message.type === 'TASK_CREATED' ? (
                            <span className="text-lg font-bold text-accent-gold">✅</span>
                          ) : (
                            <span className="text-lg font-bold">AI</span>
                          )
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
                        {/* AI mesajı ise type'ı göster */}
                        {!message.isUser && message.type && (
                          <div className="mb-1 text-xs font-bold text-accent-gold flex items-center gap-1">
                            {message.type === 'NOTE_CREATED' && <span>📝 Not oluşturuldu</span>}
                            {message.type === 'TASK_CREATED' && <span>✅ Görev oluşturuldu</span>}
                            {message.type === 'CHAT' && <span>💬 Sohbet</span>}
                          </div>
                        )}
                             
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                        {/* TASKS_LISTED ise görevleri kart şeklinde göster */}
                        {!message.isUser && message.type === 'TASKS_LISTED' && message.tasks && message.tasks.length > 0 && (
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {message.tasks.map(task => (
                              <Card key={task.id} className="p-3 border border-accent-gold/40 bg-navy-light/10">
                                <div className="font-bold text-accent-gold mb-1">Görev #{task.id}</div>
                                <div className="text-navy-light mb-1">{task.description}</div>
                                <div className="text-xs text-navy-light/60">Başlangıç: {new Date(task.startDate).toLocaleString()}</div>
                                <div className="text-xs text-navy-light/60">Bitiş: {new Date(task.endDate).toLocaleString()}</div>
                              </Card>
                            ))}
                          </div>
                        )}
                        {/* DUBLICATE_TASK türündeyse çift görevleri ve optimize sonucu yeni görevi göster */}
                        {!message.isUser && message.type === 'DUBLICATE_TASK' && message.tasks && message.tasks.length > 0 && (
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {message.tasks.map(task => (
                              <Card key={task.id} className="p-3 border border-red-400 bg-navy-light/10">
                                <div className="font-bold text-red-400 mb-1">Çift Görev #{task.id}</div>
                                <div className="text-navy-light mb-1">{task.description}</div>
                                <div className="text-xs text-navy-light/60">Başlangıç: {new Date(task.startDate).toLocaleString()}</div>
                                <div className="text-xs text-navy-light/60">Bitiş: {new Date(task.endDate).toLocaleString()}</div>
                              </Card>
                            ))}
                            {message.text === 'Do you want to remove these tasks with one?' && (
                              <div className="mt-2 flex gap-2 items-center">
                                <button
                                  className="bg-accent-gold border border-navy-primary/20 rounded-full p-1 shadow flex items-center justify-center"
                                  title="Onayla ve birleştir"
                                  disabled={optimizing}
                                  onClick={() => handleOptimizeTasks(message.tasks.map(t => t.id))}
                                  style={{zIndex:2}}
                                >
                                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                                    <path d="M5 10l4 4 6-8" stroke="#1a2236" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                {optimizeError && <span className="text-xs text-red-500">{optimizeError}</span>}
                              </div>
                            )}
                          </div>
                        )}
                        {/* OPTIMIZE_RESULT tipinde yeni görev kartı göster */}
                        {!message.isUser && message.type === 'OPTIMIZE_RESULT' && message.tasks && message.tasks.length > 0 && (
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {message.tasks.map(task => (
                              <Card key={task.id} className="p-3 border border-green-400 bg-navy-light/10">
                                <div className="font-bold text-green-400 mb-1">Yeni Birleştirilmiş Görev #{task.id}</div>
                                <div className="text-navy-light mb-1">{task.description}</div>
                                <div className="text-xs text-navy-light/60">Başlangıç: {new Date(task.startDate).toLocaleString()}</div>
                                <div className="text-xs text-navy-light/60">Bitiş: {new Date(task.endDate).toLocaleString()}</div>
                              </Card>
                            ))}
                          </div>
                        )}
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
                    {/* Promptu İyileştir butonu ve öneri solda */}
                    <div className="flex flex-col items-start justify-center mr-2">
                      {!improvedMap['input'] && (
                        <button
                          className={`bg-white border border-navy-primary/20 rounded-full p-1 shadow transition hover:bg-accent-gold/80 mb-1`}
                          title="Promptu İyileştir"
                          onClick={async (e) => {
                            e.preventDefault();
                            if (inputText.trim()) {
                              setImproveTargetId('input');
                              try {
                                const res = await dispatch(improvePrompt({ prompt: inputText })).unwrap();
                                setImprovedMap(prev => ({ ...prev, input: res.improved }));
                              } catch (e) { /* empty */ }
                              setImproveTargetId(null);
                            }
                          }}
                          disabled={improveTargetId === 'input' || !inputText.trim()}
                          style={{zIndex:2}}
                        >
                          <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M10 15V5m0 0l-5 5m5-5l5 5" stroke="#1a2236" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      )}
                      {improvedMap['input'] && (
                        <div className="flex items-center gap-2">
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
                    <SpeechInput
                      currentText={inputText}
                      onResult={(text) => {
                        setInputText(text);
                      }}
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={!inputText.trim()} 
                      className="bg-accent-gold hover:bg-accent-gold/80 text-navy-dark rounded-full transition-all duration-200"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
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