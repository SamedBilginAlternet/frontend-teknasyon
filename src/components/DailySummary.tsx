
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

export const DailySummary: React.FC = () => {
  const dailySummary = useAppSelector(state => state.dailySummary);
  const {
    productivityScore,
    tasksDone,
    focusTimeHours,
    deadlines,
    yesterdaysVictory,
    todaysFocus,
    aiRecommendations,
    recentNotes,
    loading,
    error,
    reignPercent,
    date,
  } = dailySummary;

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-shadow border-throne-gold/20 text-center">
        <span className="text-throne-gold">Yükleniyor...</span>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="p-6 bg-gradient-shadow border-throne-gold/20 text-center">
        <span className="text-red-500">{error}</span>
      </Card>
    );
  }
  return (
    <Card className="p-6 bg-gradient-shadow border-throne-gold/20">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-throne-gold flex items-center gap-2">
            <Crown className="h-6 w-6" />
            Daily AI Summary
          </h2>
          <Badge variant="outline" className="border-throne-gold text-throne-gold">
            Today's Reign: {reignPercent}%
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground mb-2">{date}</div>
        {/* Productivity Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-throne-charcoal/50 border border-throne-gold/20">
            <TrendingUp className="h-5 w-5 text-throne-gold mx-auto mb-1" />
            <div className="text-lg font-semibold text-throne-gold">{productivityScore}%</div>
            <div className="text-xs text-muted-foreground">Productivity</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-throne-charcoal/50 border border-throne-gold/20">
            <CheckCircle className="h-5 w-5 text-dragon-fire mx-auto mb-1" />
            <div className="text-lg font-semibold text-dragon-fire">{tasksDone}</div>
            <div className="text-xs text-muted-foreground">Tasks Done</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-throne-charcoal/50 border border-throne-gold/20">
            <Clock className="h-5 w-5 text-winter-blue mx-auto mb-1" />
            <div className="text-lg font-semibold text-winter-blue">{focusTimeHours}h</div>
            <div className="text-xs text-muted-foreground">Focus Time</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-throne-charcoal/50 border border-throne-gold/20">
            <AlertTriangle className="h-5 w-5 text-dragon-fire mx-auto mb-1" />
            <div className="text-lg font-semibold text-dragon-fire">{deadlines}</div>
            <div className="text-xs text-muted-foreground">Deadlines</div>
          </div>
        </div>
        {/* AI Insights */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-throne-charcoal/30 border border-throne-gold/10">
            <h4 className="font-semibold text-throne-gold mb-2">🏆 Yesterday's Victory</h4>
            <p className="text-sm text-foreground">{yesterdaysVictory}</p>
          </div>
          <div className="p-4 rounded-lg bg-throne-charcoal/30 border border-throne-gold/10">
            <h4 className="font-semibold text-throne-gold mb-2">🎯 Today's Focus</h4>
            <p className="text-sm text-foreground">{todaysFocus}</p>
          </div>
          <div className="p-4 rounded-lg bg-throne-charcoal/30 border border-throne-gold/10">
            <h4 className="font-semibold text-throne-gold mb-2">💡 AI Recommendations</h4>
            <ul className="space-y-1">
              {aiRecommendations.map((rec, index) => (
                <li key={index} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-throne-gold">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Notes Summary */}
        {recentNotes.length > 0 && (
          <div className="p-4 rounded-lg bg-throne-charcoal/30 border border-throne-gold/10">
            <h4 className="font-semibold text-throne-gold mb-2">📝 Recent Notes ({recentNotes.length})</h4>
            <div className="space-y-2">
              {recentNotes.slice(0, 3).map((note, index) => (
                <p key={note.id} className="text-sm text-foreground line-clamp-2">
                  {note.content}
                </p>
              ))}
              {recentNotes.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{recentNotes.length - 3} more notes...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};