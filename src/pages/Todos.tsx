import React from 'react';
import { TodoTimer } from '@/components/TodoTimer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Todos = () => {
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
            <h1 className="text-3xl font-bold text-navy-light">Akıllı Görevler</h1>
            <p className="text-muted-foreground">Görevlerinizi yönetin ve zamanınızı takip edin</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <TodoTimer />
          
          {/* Additional Todo Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-shadow border-navy-primary/20">
              <h3 className="text-xl font-semibold text-navy-light mb-4">Haftalık Hedefler</h3>
              <p className="text-muted-foreground">
                Uzun vadeli hedeflerinizi belirleyin ve haftalık olarak takip edin.
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-shadow border-navy-primary/20">
              <h3 className="text-xl font-semibold text-navy-light mb-4">Performans Analizi</h3>
              <p className="text-muted-foreground">
                Tamamlanan görevlerinizi analiz edin ve verimliliğinizi artırın.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todos;