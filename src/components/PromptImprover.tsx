import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { improvePrompt, setCurrentPrompt, clearCurrentPrompt, clearError, PromptHistoryItem } from '@/store/promptSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Copy, 
  RotateCcw, 
  Send, 
  History,
  Trash2,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface PromptImproverProps {
  onImprovedPrompt?: (prompt: string) => void;
}

export const PromptImprover: React.FC<PromptImproverProps> = ({ onImprovedPrompt }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { currentPrompt, improvedPrompt, loading, error, history } = useAppSelector(state => state.prompts);
  const [showHistory, setShowHistory] = useState(false);

  const handleImprove = async () => {
    if (!currentPrompt.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen bir prompt girin.",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(improvePrompt({ prompt: currentPrompt.trim() })).unwrap();
      toast({
        title: "Başarılı",
        description: "Prompt başarıyla iyileştirildi!",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: error as string,
        variant: "destructive",
      });
    }
  };

  const handleCopyImproved = () => {
    if (improvedPrompt) {
      navigator.clipboard.writeText(improvedPrompt);
      toast({
        title: "Kopyalandı",
        description: "İyileştirilmiş prompt panoya kopyalandı.",
      });
    }
  };

  const handleUseImproved = () => {
    if (improvedPrompt && onImprovedPrompt) {
      onImprovedPrompt(improvedPrompt);
      toast({
        title: "Başarılı",
        description: "İyileştirilmiş prompt kullanıma hazır!",
      });
    }
  };

  const handleHistorySelect = (item: PromptHistoryItem) => {
    dispatch(setCurrentPrompt(item.original));
    setShowHistory(false);
  };

  const handleClear = () => {
    dispatch(clearCurrentPrompt());
  };

  return (
    <div className="space-y-4">
      {/* Main Input Card */}
      <Card className="p-6 bg-gradient-shadow border-accent-gold/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-gold" />
              <h3 className="text-lg font-semibold text-navy-light">Prompt İyileştirici</h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-navy-light hover:text-accent-gold"
              >
                <History className="w-4 h-4" />
              </Button>
              {currentPrompt && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-navy-light hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-navy-light">Orijinal Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Örn: fatih abe bana devexreps lib öğren ui dedi"
              value={currentPrompt}
              onChange={(e) => dispatch(setCurrentPrompt(e.target.value))}
              className="min-h-[100px] bg-navy-dark/50 border-navy-primary/30 text-navy-light resize-none"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(clearError())}
                className="mt-2 text-destructive hover:text-destructive/80"
              >
                Hatayı Temizle
              </Button>
            </div>
          )}

          <Button
            onClick={handleImprove}
            disabled={loading || !currentPrompt.trim()}
            className="w-full bg-accent-gold text-navy-dark hover:bg-accent-gold/90"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-navy-dark border-t-transparent rounded-full"></div>
                İyileştiriliyor...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Prompt'u İyileştir
              </div>
            )}
          </Button>
        </div>
      </Card>

      {/* Improved Result Card */}
      {improvedPrompt && (
        <Card className="p-6 bg-gradient-shadow border-green-500/20">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h4 className="font-semibold text-navy-light">İyileştirilmiş Prompt</h4>
              <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                Hazır
              </Badge>
            </div>

            <div className="p-4 bg-navy-dark/30 rounded-lg border border-green-500/20">
              <p className="text-navy-light leading-relaxed">{improvedPrompt}</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyImproved}
                className="border-navy-primary/30 text-navy-light hover:bg-navy-medium/30"
              >
                <Copy className="w-4 h-4 mr-2" />
                Kopyala
              </Button>
              {onImprovedPrompt && (
                <Button
                  size="sm"
                  onClick={handleUseImproved}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Kullan
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* History Card */}
      {showHistory && (
        <Card className="p-6 bg-gradient-shadow border-navy-primary/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-navy-light">Prompt Geçmişi</h4>
              <Badge variant="secondary" className="bg-navy-primary/20 text-navy-light">
                {history.length} öğe
              </Badge>
            </div>

            {history.length === 0 ? (
              <p className="text-sm text-navy-light/60 text-center py-4">
                Henüz geçmiş yok. İlk prompt'unuzu iyileştirin!
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleHistorySelect(item)}
                    className="p-3 bg-navy-dark/30 rounded-lg hover:bg-navy-medium/30 cursor-pointer transition-colors border border-navy-primary/10"
                  >
                    <div className="space-y-1">
                      <p className="text-xs text-navy-light/60">
                        {new Date(item.timestamp).toLocaleString('tr-TR')}
                      </p>
                      <p className="text-sm text-navy-light/80 line-clamp-2">
                        {item.original}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-green-500">
                        <ArrowRight className="w-3 h-3" />
                        <span className="line-clamp-1">{item.improved}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
