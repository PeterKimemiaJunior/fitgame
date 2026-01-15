import { useMemo } from 'react';
import { SimpleLineChart } from '../components/ui/Charts';
import { useV4Store } from '../store/useV4Store';
import { calculateStreak } from '../domain/gamification/streak';
import { checkAchievements } from '../domain/gamification/achievements';

interface V4WeeklySummary {
  adherenceRate: number;
  totalDays: number;
  totalXP: number;
}

export function Progress() {
  const { dailyProgress } = useV4Store();
  
  // 1. Streaks
  const streak = useMemo(() => calculateStreak(dailyProgress), [dailyProgress]);
  
  // 2. Conquistas
  const achievements = useMemo(() => checkAchievements(dailyProgress), [dailyProgress]);
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  // 3. Stats Semanais
  const summary = useMemo((): V4WeeklySummary => {
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    let activityDone = 0;
    let nutritionDone = 0;
    let daysWithAnyData = 0;
    let totalXP = 0;

    days.forEach((date) => {
      const dayData = dailyProgress[date];
      if (dayData) {
        daysWithAnyData++;
        if (dayData.activityDone) {
          activityDone++;
          totalXP += 10;
        }
        if (dayData.nutritionDone) {
          nutritionDone++;
          totalXP += 10;
        }
      }
    });

    const totalPossible = daysWithAnyData * 2;
    const adherenceRate = totalPossible > 0 ? Math.round(((activityDone + nutritionDone) / totalPossible) * 100) : 0;

    return {
      adherenceRate,
      totalDays: daysWithAnyData,
      totalXP,
    };
  }, [dailyProgress]);

  // 4. Dados do Gráfico
  const chartData = useMemo(() => {
    const dataPoints: number[] = [];
    const labels: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayData = dailyProgress[dateKey];
      
      labels.push(new Date(d).toLocaleDateString('pt-BR', { weekday: 'narrow' }));
      
      let dayPoints = 0;
      if (dayData) {
        if (dayData.activityDone) dayPoints += 10;
        if (dayData.nutritionDone) dayPoints += 10;
      }
      dataPoints.push(dayPoints);
    }

    return { labels, data: dataPoints };
  }, [dailyProgress]);

  return (
    <div className="p-6 space-y-6">
      <header className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Seu Progresso</h1>
      </header>

      {/* 1. STREAK PRINCIPAL */}
      <section>
         <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sequência Atual</h2>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black text-orange-600">{streak.current}</span>
                <span className="text-sm font-bold text-gray-400">dias</span>
              </div>
            </div>
            {/* Ícone de Fogo condicional */}
            {streak.current >= 3 && (
              <span className="text-4xl">🔥</span>
            )}
         </div>
      </section>

      {/* 2. GRÁFICO */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          Evolução (7 dias)
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
          <SimpleLineChart labels={chartData.labels} data={chartData.data} />
        </div>
      </section>

      {/* 3. RESUMO NUMÉRICO */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          Resumo da Semana
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Dias Ativos</p>
            <p className="text-2xl font-black text-gray-800">{summary.totalDays}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase">XP Total</p>
            <p className="text-2xl font-black text-gray-800">{summary.totalXP}</p>
          </div>
        </div>
      </section>

      {/* 4. CONQUISTAS */}
      {unlockedAchievements.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            Conquistas
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((ach) => (
              <div 
                key={ach.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                  ach.unlocked 
                    ? 'bg-white border-yellow-200 bg-yellow-50' 
                    : 'bg-gray-50 border-gray-100 opacity-50 grayscale'
                }`}
              >
                <span className="text-2xl filter drop-shadow-sm">
                  {ach.unlocked ? ach.icon : '🔒'}
                </span>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-800">{ach.title}</h3>
                  <p className="text-xs text-gray-500 leading-tight">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}