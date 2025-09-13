import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Akıllı Görevler', subtitle = 'Görevlerinizi yönetin ve zamanınızı takip edin' }) => {
  const location = useLocation();
  const showBack = location.pathname !== '/';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-navy-dark/80 to-navy-medium/40">
      <header className="sticky top-0 z-40 bg-gradient-shadow border-b border-navy-primary/20 h-16 flex items-center px-6 shadow-md">
        <div className="container mx-auto flex items-center gap-4 h-full">
          {showBack && (
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <h1 className="text-xl font-bold text-navy-light">{title}</h1>
          <span className="text-sm text-muted-foreground ml-2">{subtitle}</span>
        </div>
      </header>
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
};

export default Layout;
