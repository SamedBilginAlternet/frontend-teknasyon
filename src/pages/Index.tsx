import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { DailySummary } from '@/components/DailySummary';
import { ChatInterface } from '@/components/ChatInterface';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckSquare, FileText, Brain, BarChart3, User, LogOut, Settings } from 'lucide-react';
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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  // Avatar URL'yi tam path'e çevir
  const getAvatarUrl = () => {
    if (!user?.avatarUrl) return null;
    return user.avatarUrl.startsWith('http')
      ? user.avatarUrl
      : `http://192.168.20.43:8083${user.avatarUrl}`;
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setShowProfileDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileDropdown(false);
    };

    if (showProfileDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showProfileDropdown]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Profile */}
      <div className="absolute top-4 right-4 z-50">
        {token && user ? (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileDropdown(!showProfileDropdown);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-navy-dark/90 border border-navy-primary/30 hover:bg-navy-medium/60 transition-all duration-200 shadow-lg backdrop-blur-sm"
            >
              {getAvatarUrl() ? (
                <div className="relative">
                  <img
                    src={getAvatarUrl()!}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-accent-gold/40 shadow-md ring-2 ring-navy-primary/20"
                    onError={(e) => {
                      // Fallback to user icon if avatar fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-navy-dark"></div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-navy-primary/20 border-2 border-accent-gold/40 flex items-center justify-center">
                  <User className="w-6 h-6 text-navy-light" />
                </div>
              )}
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-navy-light">{user.nickname}</span>
                <span className="text-xs text-navy-light/60">Online</span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-navy-dark/95 border border-navy-primary/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
                <div className="p-4 border-b border-navy-primary/20 bg-gradient-to-r from-navy-dark to-navy-medium/20">
                  <div className="flex items-center gap-3">
                    {getAvatarUrl() ? (
                      <img
                        src={getAvatarUrl()!}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-accent-gold/40"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-navy-primary/20 border-2 border-accent-gold/40 flex items-center justify-center">
                        <User className="w-5 h-5 text-navy-light" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-navy-light">{user.nickname}</p>
                      <p className="text-xs text-navy-light/60">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-navy-light hover:bg-navy-medium/40 flex items-center gap-3 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Profilim</span>
                  </button>
                  <button
                    onClick={() => setShowProfileDropdown(false)}
                    className="w-full px-4 py-3 text-left text-sm text-navy-light hover:bg-navy-medium/40 flex items-center gap-3 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Ayarlar</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="bg-navy-primary text-navy-dark"
            onClick={() => navigate('/login')}
          >
            Giriş Yap
          </Button>
        )}
      </div>
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `linear-gradient(rgba(13,32,49,0.8), rgba(13,32,49,0.8)), url(${throneHero})`
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <img src={dragonIcon} alt="Dragon" className="h-12 w-12" />
            <h1 className="text-5xl font-bold text-accent-gold">ThroneMind</h1>
          </div>
          {user?.nickname ? (
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-navy-light">
                Hoşgeldin {user.nickname}!
              </h2>
              <p className="text-lg text-navy-light/80 max-w-2xl">
                AI ile verimliliğinizi artırın. Sesli notlar, akıllı görevler ve günlük özetler.
              </p>
            </div>
          ) : (
            <p className="text-xl text-navy-light max-w-2xl">
              AI ile verimliliğinizi artırın. Sesli notlar, akıllı görevler ve günlük özetler.
            </p>
          )}
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
