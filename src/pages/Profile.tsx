import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Mail, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  ArrowLeft,
  Settings,
  Shield,
  Bell
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nickname: user?.nickname || '',
    email: user?.email || ''
  });

  // Avatar URL'yi tam path'e çevir
  const getAvatarUrl = () => {
    if (!user?.avatarUrl) return null;
    return user.avatarUrl.startsWith('http')
      ? user.avatarUrl
      : `http://192.168.20.43:8083${user.avatarUrl}`;
  };

  const handleSave = () => {
    // TODO: API call to update user profile
    console.log('Saving profile:', editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      nickname: user?.nickname || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-navy-dark/50 border-b border-navy-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-navy-light hover:text-accent-gold"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ana Sayfa
              </Button>
              <h1 className="text-2xl font-bold text-accent-gold">Profilim</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-shadow border-navy-primary/20">
              <div className="text-center space-y-4">
                {/* Profile Photo */}
                <div className="relative inline-block">
                  {getAvatarUrl() ? (
                    <img
                      src={getAvatarUrl()!}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-accent-gold/40 shadow-lg mx-auto"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-navy-primary/20 border-4 border-accent-gold/40 flex items-center justify-center mx-auto">
                      <User className="w-16 h-16 text-navy-light" />
                    </div>
                  )}
                  <button className="absolute bottom-2 right-2 p-2 bg-accent-gold rounded-full shadow-lg hover:bg-accent-gold/90 transition-colors">
                    <Camera className="w-4 h-4 text-navy-dark" />
                  </button>
                </div>

                {/* User Info */}
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-navy-light">{user.nickname}</h2>
                  <p className="text-sm text-navy-light/60">{user.email}</p>
                  <div className="flex items-center justify-center gap-2 text-xs text-green-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Online
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-navy-primary/30 text-navy-light hover:bg-navy-medium/30"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Profili Düzenle
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="p-6 bg-gradient-shadow border-navy-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-navy-light flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Kişisel Bilgiler
                </h3>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-navy-light hover:text-accent-gold"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nickname" className="text-navy-light">Kullanıcı Adı</Label>
                      <Input
                        id="nickname"
                        value={editForm.nickname}
                        onChange={(e) => setEditForm({...editForm, nickname: e.target.value})}
                        className="bg-navy-dark/50 border-navy-primary/30 text-navy-light"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-navy-light">E-posta</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="bg-navy-dark/50 border-navy-primary/30 text-navy-light"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="bg-accent-gold text-navy-dark hover:bg-accent-gold/90">
                      <Save className="w-4 h-4 mr-2" />
                      Kaydet
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="border-navy-primary/30 text-navy-light">
                      <X className="w-4 h-4 mr-2" />
                      İptal
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-navy-dark/30 rounded-lg">
                      <User className="w-5 h-5 text-accent-gold" />
                      <div>
                        <p className="text-xs text-navy-light/60">Kullanıcı Adı</p>
                        <p className="text-sm font-medium text-navy-light">{user.nickname}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-navy-dark/30 rounded-lg">
                      <Mail className="w-5 h-5 text-accent-gold" />
                      <div>
                        <p className="text-xs text-navy-light/60">E-posta</p>
                        <p className="text-sm font-medium text-navy-light">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Settings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Settings */}
              <Card className="p-6 bg-gradient-shadow border-navy-primary/20 hover:border-accent-gold/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-accent-gold/20 rounded-lg">
                    <Settings className="w-5 h-5 text-accent-gold" />
                  </div>
                  <h4 className="font-semibold text-navy-light">Hesap Ayarları</h4>
                </div>
                <p className="text-sm text-navy-light/60">
                  Hesap güvenliği ve gizlilik ayarlarını yönetin
                </p>
              </Card>

              {/* Security */}
              <Card className="p-6 bg-gradient-shadow border-navy-primary/20 hover:border-accent-gold/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-accent-gold/20 rounded-lg">
                    <Shield className="w-5 h-5 text-accent-gold" />
                  </div>
                  <h4 className="font-semibold text-navy-light">Güvenlik</h4>
                </div>
                <p className="text-sm text-navy-light/60">
                  Şifre değiştirme ve iki faktörlü doğrulama
                </p>
              </Card>

              {/* Notifications */}
              <Card className="p-6 bg-gradient-shadow border-navy-primary/20 hover:border-accent-gold/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-accent-gold/20 rounded-lg">
                    <Bell className="w-5 h-5 text-accent-gold" />
                  </div>
                  <h4 className="font-semibold text-navy-light">Bildirimler</h4>
                </div>
                <p className="text-sm text-navy-light/60">
                  E-posta ve uygulama bildirim tercihleri
                </p>
              </Card>

              {/* Data & Privacy */}
              <Card className="p-6 bg-gradient-shadow border-navy-primary/20 hover:border-accent-gold/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-accent-gold/20 rounded-lg">
                    <User className="w-5 h-5 text-accent-gold" />
                  </div>
                  <h4 className="font-semibold text-navy-light">Veri ve Gizlilik</h4>
                </div>
                <p className="text-sm text-navy-light/60">
                  Kişisel verilerinizi yönetin ve indirin
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
