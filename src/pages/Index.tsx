import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { DailySummary } from '@/components/DailySummary';
import { ChatInterface } from '@/components/ChatInterface';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckSquare, FileText, Brain, BarChart3 } from 'lucide-react';
import throneHero from '@/assets/throne-hero.jpg';
import dragonIcon from '@/assets/dragon-icon.png';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  isVoiceNote: boolean;
}

const Index = () => {
  const [notes] = useState<Note[]>([
    { id: '1', content: 'Bugün toplantı notları al', timestamp: new Date(), isVoiceNote: false },
    { id: '2', content: 'Proje planlaması yap', timestamp: new Date(), isVoiceNote: true },
  ]);
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant={token ? "outline" : "default"}
          size="sm"
          className={token ? "border-destructive text-destructive" : "bg-navy-primary text-navy-dark"}
          onClick={() => {
            if (token) {
              dispatch(logout());
              navigate('/login');
            } else {
              navigate('/login');
            }
          }}
        >
          {token ? "Logout" : "Login"}
        </Button>
      </div>
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `linear-gradient(rgba(13,32,49,0.8), rgba(13,32,49,0.8)), url(${throneHero})` }}
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <img src={dragonIcon} alt="Dragon" className="h-12 w-12" />
            <h1 className="text-5xl font-bold text-accent-gold">ThroneMind</h1>
          </div>
          <p className="text-xl text-navy-light max-w-2xl">
            AI ile verimliliğinizi artırın. Sesli notlar, akıllı görevler ve günlük özetler.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Daily Summary */}
        <DailySummary notes={notes.map(n => n.content)} />

        {/* Chat Interface */}
        <ChatInterface />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/todos">
            <Card className="p-6 bg-gradient-shadow border-navy-primary/20 hover:bg-navy-medium/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <CheckSquare className="h-8 w-8 text-navy-primary" />
                <h3 className="text-lg font-semibold text-navy-light">Akıllı Görevler</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Görevlerinizi yönetin ve zamanınızı takip edin
              </p>
            </Card>
          </Link>

          <Link to="/notes">
            <Card className="p-6 bg-gradient-shadow border-navy-primary/20 hover:bg-navy-medium/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-8 w-8 text-navy-primary" />
                <h3 className="text-lg font-semibold text-navy-light">Notlar</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Sesli ve yazılı notlarınızı organize edin
              </p>
            </Card>
          </Link>

          <Card className="p-6 bg-gradient-shadow border-navy-primary/20 hover:bg-navy-medium/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="h-8 w-8 text-navy-primary" />
              <h3 className="text-lg font-semibold text-navy-light">AI Analiz</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Verimliliğinizi analiz edin ve öneriler alın
            </p>
          </Card>

          <Card className="p-6 bg-gradient-shadow border-navy-primary/20 hover:bg-navy-medium/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="h-8 w-8 text-navy-primary" />
              <h3 className="text-lg font-semibold text-navy-light">Raporlar</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Günlük, haftalık ve aylık performans raporları
            </p>
          </Card>
        </div>

        {/* Footer */}
        <Card className="p-6 bg-gradient-shadow border-accent-gold/20 text-center">
          <p className="text-sm text-muted-foreground">
            "Akıl kitaplara ihtiyaç duyar, tıpkı kılıcın bileme taşına ihtiyaç duyduğu gibi." - Tyrion Lannister
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Index;
