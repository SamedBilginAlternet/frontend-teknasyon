import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, Circle } from 'lucide-react';
import { ChatInterface } from '@/components/ChatInterface';
import Layout from '@/components/Layout';

const todos = [
  { id: 1, title: 'Sunum hazırla', done: false },
  { id: 2, title: 'Toplantı notlarını gözden geçir', done: true },
  { id: 3, title: 'Yeni görev ekle', done: false },
  { id: 4, title: 'Raporu gönder', done: true },
];

const Todos = () => {
  return (
    <Layout title="Akıllı Görevler" subtitle="Görevlerinizi yönetin ve zamanınızı takip edin">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <Card className="w-full max-w-2xl p-8 rounded-3xl shadow-xl bg-gradient-to-br from-navy-medium/60 to-navy-dark/40 border-navy-primary/30">
          <h2 className="text-2xl font-bold text-navy-light mb-6">Bugünkü Görevler</h2>
          <ul className="space-y-4">
            {todos.map(todo => (
              <li key={todo.id} className="flex items-center gap-4 p-4 rounded-xl bg-navy-light/10 border border-navy-primary/20 hover:bg-navy-light/20 transition-all">
                <span>
                  {todo.done ? (
                    <CheckCircle className="text-accent-gold w-6 h-6" />
                  ) : (
                    <Circle className="text-navy-primary w-6 h-6" />
                  )}
                </span>
                <span className={`flex-1 text-lg font-medium ${todo.done ? 'line-through text-navy-light/60' : 'text-navy-light'}`}>{todo.title}</span>
                <button className="px-3 py-1 rounded-full bg-navy-primary/10 text-navy-light text-sm hover:bg-navy-primary/30 transition">Düzenle</button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="fixed bottom-0 left-0 w-full z-50">
        <ChatInterface />
      </div>
    </Layout>
  );
};

export default Todos;