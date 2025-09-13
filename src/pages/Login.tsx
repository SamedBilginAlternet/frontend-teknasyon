import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/authSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import dragonIcon from '@/assets/dragon-icon.png';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, user, token } = useAppSelector(state => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Remove local loading and error, use Redux state

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const resultAction = await dispatch(login({ email, password }));
    // Sadece status 200 ise redirect
      // Redux Toolkit createAsyncThunk'da status doğrudan yok, ama fulfilled ise genellikle 200'dür
      navigate('/');
    
    // error is handled by Redux state
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-primary via-navy-medium to-navy-dark">
      <Card className="w-full max-w-md p-8 rounded-xl shadow-lg bg-gradient-shadow border-navy-primary/20 flex flex-col items-center">
        <img src={dragonIcon} alt="Dragon" className="h-16 w-16 mb-4" />
        <h2 className="text-3xl font-bold text-accent-gold mb-2">ThroneMind Giriş</h2>
        <p className="text-navy-light mb-6">AI ile verimliliğinizi artırın. Lütfen giriş yapın.</p>
        <form className="w-full space-y-4" onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-navy-dark text-navy-light border-navy-primary/40"
          />
          <Input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-navy-dark text-navy-light border-navy-primary/40"
          />
          {error && <div className="text-destructive text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full bg-navy-primary text-navy-dark" disabled={loading}>
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>
        <Button variant="link" className="mt-4 text-navy-light" onClick={() => navigate('/register')}>
          Hesabın yok mu? Kayıt ol
        </Button>
      </Card>
    </div>
  );
};

export default Login;
