import { HistoryChart } from '../components/HistoryChart';
import { MetricCard } from '../components/ui/MetricCard';
import { HABITS_LIST } from '../types';
import { useTodayLog } from '../hooks/useTodayLog';
import { useTotalPoints } from '../hooks/useTotalPoints';
import { useUserMetrics } from '../hooks/useUserMetrics';
import { useUserStore } from '../store/useUserStore';

export function Dashboard() {
  const user = useUserStore((state) => state.user)!;
  
  // CORREÇÃO: Removido 'todayLog' pois não está sendo usado no JSX
  const { completedIds, toggleHabit } = useTodayLog(); 
  
  const totalPoints = useTotalPoints();
  const { bmi, bmr, calories, bmiLabel } = useUserMetrics();
  const logs = useUserStore((state) => state.logs);

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md space-y-6">
        
        {/* Header + Pontos */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <h1 className="text-xl font-bold text-gray-800">Olá, {user.name}</h1>
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
              {totalPoints} pts
            </div>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-3 gap-2">
             <MetricCard
               title="IMC"
               value={bmi}
               containerClass="bg-blue-50 p-2 rounded border border-blue-100 flex flex-col justify-between"
               titleClass="text-[10px] text-blue-600 font-bold uppercase"
               valueClass="text-sm font-black text-blue-800 leading-none"
               subValue={bmiLabel}
               subValueClass="text-[9px] text-blue-400 truncate"
            />
            <MetricCard
               title="TMB"
               value={bmr}
               containerClass="bg-orange-50 p-2 rounded border border-orange-100 flex flex-col justify-center"
               titleClass="text-[10px] text-orange-600 font-bold uppercase"
               valueClass="text-sm font-black text-orange-800 leading-none"
            />
            <MetricCard
               title="Meta"
               value={calories}
               containerClass="bg-emerald-50 p-2 rounded border border-emerald-100 flex flex-col justify-center"
               titleClass="text-[10px] text-emerald-600 font-bold uppercase"
               valueClass="text-sm font-black text-emerald-700 leading-none"
            />
          </div>

        {/* Lista de Hábitos */}
        <div className="space-y-3 text-left">
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wide border-b pb-2">
            Seus Hábitos de Hoje
          </h2>
          
          {HABITS_LIST.map((habit) => {
            const isCompleted = completedIds.includes(habit.id);
            
            return (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  isCompleted 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{habit.icon}</span>
                  <span className={`font-medium ${isCompleted ? 'line-through opacity-70' : ''}`}>
                    {habit.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    isCompleted ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-400'
                  }`}>
                    +{habit.points}
                  </span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
                  }`}>
                    {isCompleted && <span className="text-white text-xs">✓</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* SEÇÃO DE HISTÓRICO */}
        <div className="pt-4 border-t border-gray-100">
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3 text-center">
            Evolução (7 dias)
          </h2>
          <HistoryChart logs={logs} />
        </div>

      </div>
    </div>
  );
}