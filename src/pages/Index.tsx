import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { DailySummary } from '@/components/DailySummary';
import { fetchDailySummary } from '@/store/dailySummarySlice';
import { ChatInterface } from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, CheckSquare, FileText } from 'lucide-react';
import throneHero from '@/assets/throne-hero.jpg';
import dragonIcon from '@/assets/dragon-icon.png';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  isVoiceNote: boolean;
}

const Index = () => {
  // Daily summary fetch
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchDailySummary());
  }, [dispatch]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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
      {/* Header with Navigation */}
      <div className="absolute top-4 left-4 right-4 z-50">
        {token && user ? (
          <div className="flex items-center justify-between">
            {/* Navigation Links */}
            <div className="flex items-center gap-6 bg-navy-dark/90 border border-navy-primary/30 rounded-xl px-6 py-3 backdrop-blur-sm shadow-lg">
              <button
                onClick={() => navigate('/todos')}
                className="flex items-center gap-2 text-navy-light hover:text-accent-gold transition-colors duration-200"
              >
                <CheckSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Görevler</span>
              </button>
              <button
                onClick={() => navigate('/notes')}
                className="flex items-center gap-2 text-navy-light hover:text-accent-gold transition-colors duration-200"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Notlar</span>
              </button>
            </div>

            {/* Profile Dropdown */}
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
          </div>
        ) : (
          <div className="flex justify-end">
            <Button
              variant="default"
              size="sm"
              className="bg-navy-primary text-navy-dark"
              onClick={() => navigate('/login')}
            >
              Giriş Yap
            </Button>
          </div>
        )}
      </div>
      {/* Hero Section */}
      <div className="relative h-30 overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `linear-gradient(rgba(13,32,49,0.8), rgba(13,32,49,0.8)), url(${throneHero})`
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mt-10 mb-8">
            <img src={dragonIcon} alt="Dragon" className="h-10 w-10" />
            <h1 className="text-4xl font-bold text-accent-gold">ThroneMind</h1>
          </div>
          {user?.nickname ? (
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-navy-light">
                Hoşgeldin {user.nickname}!
              </h2>
              <p className="text-base text-navy-light/80 max-w-2xl">
                AI ile verimliliğinizi artırın. Sesli notlar, akıllı görevler ve günlük özetler.
              </p>
            </div>
          ) : (
            <p className="text-lg text-navy-light max-w-2xl">
              AI ile verimliliğinizi artırın. Sesli notlar, akıllı görevler ve günlük özetler.
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 pb-24">
        {/* Daily Summary */}
        <DailySummary />
      </div>

      {/* Chat Interface - Fixed at bottom */}
      <ChatInterface />
    </div>
  );
};

export default Index;
