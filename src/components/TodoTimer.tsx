import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Play, Pause, RotateCcw, Plus, Clock, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  estimatedMinutes: number;
  actualMinutes?: number;
}

export const TodoTimer: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Review weekly reports', completed: false, estimatedMinutes: 25 },
    { id: '2', text: 'Plan next sprint', completed: false, estimatedMinutes: 45 },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTimer) {
      interval = setInterval(() => {
        setTimeElapsed(prev => ({
          ...prev,
          [activeTimer]: (prev[activeTimer] || 0) + 1
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [activeTimer]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const estimatedMinutes = Math.max(15, Math.floor(Math.random() * 60) + 10); // AI estimation simulation
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        estimatedMinutes,
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
      
      toast({
        title: "Task added",
        description: `AI estimated ${estimatedMinutes} minutes to complete.`,
      });
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const updated = { ...todo, completed: !todo.completed };
        if (updated.completed && timeElapsed[id]) {
          updated.actualMinutes = Math.ceil(timeElapsed[id] / 60);
          if (activeTimer === id) {
            setActiveTimer(null);
          }
          toast({
            title: "Task completed!",
            description: `Completed in ${updated.actualMinutes} minutes (estimated ${todo.estimatedMinutes}).`,
          });
        }
        return updated;
      }
      return todo;
    }));
  };

  const startTimer = (id: string) => {
    setActiveTimer(activeTimer === id ? null : id);
  };

  const resetTimer = (id: string) => {
    setTimeElapsed(prev => ({ ...prev, [id]: 0 }));
    if (activeTimer === id) {
      setActiveTimer(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 bg-gradient-shadow border-throne-gold/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-throne-gold flex items-center gap-2">
            <Target className="h-5 w-5" />
            Smart To-Dos
          </h3>
          <span className="text-xs text-muted-foreground">AI-powered time estimation</span>
        </div>
        
        <div className="flex space-x-2">
          <Input
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            className="bg-throne-charcoal border-throne-gold/30 text-foreground"
          />
          <Button variant="throne" onClick={addTodo}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center space-x-3 p-3 rounded-lg bg-throne-charcoal/50 border border-throne-gold/10">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="data-[state=checked]:bg-throne-gold data-[state=checked]:border-throne-gold"
              />
              
              <div className="flex-1">
                <p className={`text-sm ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {todo.text}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-3 w-3 text-throne-gold" />
                  <span className="text-xs text-throne-gold">
                    Est: {todo.estimatedMinutes}m
                  </span>
                  {todo.actualMinutes && (
                    <span className="text-xs text-dragon-fire">
                      | Actual: {todo.actualMinutes}m
                    </span>
                  )}
                </div>
              </div>

              {!todo.completed && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono text-throne-gold min-w-[50px]">
                    {formatTime(timeElapsed[todo.id] || 0)}
                  </span>
                  <Button
                    variant="royal"
                    size="sm"
                    onClick={() => startTimer(todo.id)}
                  >
                    {activeTimer === todo.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => resetTimer(todo.id)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};