import type { InsightFeedback } from '../../insights/types';

interface InsightsCardProps {
  feedback: InsightFeedback | null;
  consistencyScore: number;
}

export function InsightsCard({ feedback, consistencyScore }: InsightsCardProps) {
  if (!feedback) return null;

  // Paleta de cores baseada no tipo de insight
  const styles = {
    positive: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const currentStyle = styles[feedback.type];

  // Ícones baseados no tipo
  const icons = {
    positive: '🌟',
    warning: '⚠️',
    info: '💡',
  };

  return (
    <div className={`border-2 p-4 rounded-xl transition-all ${currentStyle}`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl filter drop-shadow-sm">{icons[feedback.type]}</div>
        <div className="flex-1">
          <h3 className="text-sm font-bold uppercase mb-1">{feedback.title}</h3>
          <p className="text-xs font-medium leading-relaxed opacity-90">
            {feedback.message}
          </p>
        </div>
      </div>
      
      {/* Indicador visual de consistência */}
      <div className="mt-3 pt-3 border-t border-current border-opacity-20 flex justify-between items-center text-xs font-bold opacity-80">
        <span>Consistência (7d)</span>
        <span>{consistencyScore}%</span>
      </div>
    </div>
  );
}