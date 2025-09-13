import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register } from '@/store/authSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image } from 'lucide-react';
import dragonIcon from '@/assets/dragon-icon.png';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(state => state.auth);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !nickname || !password) return;
      const formData = new FormData();
      formData.append('email', email);
      formData.append('nickname', nickname);
      formData.append('password', password);
      if (photo) formData.append('photo', photo);
      await dispatch(register(formData));
      navigate('/login');
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-primary via-navy-medium to-navy-dark">
      <Card className="w-full max-w-md p-8 rounded-xl shadow-lg bg-gradient-shadow border-navy-primary/20 flex flex-col items-center">
        <img src={dragonIcon} alt="Dragon" className="h-16 w-16 mb-4" />
        <h2 className="text-3xl font-bold text-accent-gold mb-2">ThroneMind Kayıt Ol</h2>
        <p className="text-navy-light mb-6">AI ile verimliliğinizi artırın. Hesabınızı oluşturun.</p>
        <form className="w-full space-y-4" onSubmit={handleRegister}>
          <Input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-navy-dark text-navy-light border-navy-primary/40"
          />
          <Input
            type="text"
            placeholder="Kullanıcı Adı"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            className="bg-navy-dark text-navy-light border-navy-primary/40"
          />
          <Input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-navy-dark text-navy-light border-navy-primary/40"
          />
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              onChange={e => setPhoto(e.target.files?.[0] || null)}
              className="bg-navy-dark text-navy-light border-navy-primary/40 pl-10 cursor-pointer"
              style={{ paddingLeft: '2.5rem' }}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
              <Image className="h-5 w-5 text-navy-light" />
              {/* <span className="text-navy-light text-sm">Avatarın için resmini yükle</span> */}
            </span>
          </div>
          {error && <div className="text-destructive text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full bg-navy-primary text-navy-dark" disabled={loading}>
            {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
          </Button>
        </form>
        <Button variant="link" className="mt-4 text-navy-light" onClick={() => navigate('/login')}>
          Zaten hesabın var mı? Giriş yap
        </Button>
      </Card>
    </div>
  );
};

export default Register;
