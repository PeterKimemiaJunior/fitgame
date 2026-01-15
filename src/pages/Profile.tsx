import { useUserStore } from '../store/useUserStore';
import { useV4Store } from '../store/useV4Store';
import { calculateWeeklySummary } from '../domain/stats/weekly';
import { calculateHealthMetrics } from '../domain/health/metrics';

export function Profile() {
  const user = useUserStore((state) => state.user);
  const { dailyProgress, resetAllData } = useV4Store();
  
  const summary = calculateWeeklySummary(dailyProgress);
  
  // Calcula métricas biométricas se o usuário existir
  const healthMetrics = user ? calculateHealthMetrics(user.age, user.weight, user.height, user.gender) : null;

  const handleReset = () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja apagar todos os seus dados? ' +
      'Isso inclui seu perfil, histórico e progresso atual. ' +
      'Esta ação não pode ser desfeita.'
    );
    if (confirmed) {
      resetAllData();
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Nenhum perfil encontrado.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <header className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-sm text-gray-500">Visão geral da sua saúde e progresso.</p>
      </header>

      {/* Dados Biométricos Principais */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Dados Biométricos
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* IMC Card */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <div className="text-[10px] font-bold text-blue-600 uppercase mb-1">IMC</div>
            <div className="text-2xl font-black text-blue-800">{healthMetrics?.bmi}</div>
            <div className="text-xs text-blue-500 font-medium mt-1">{healthMetrics?.bmiLabel}</div>
          </div>

          {/* Meta Calórica Card */}
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
            <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Meta Diária</div>
            <div className="text-2xl font-black text-emerald-800">{healthMetrics?.dailyCalories}</div>
            <div className="text-xs text-emerald-500 font-medium mt-1">kcal</div>
          </div>
        </div>

        {/* Detalhes Físicos */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-600 text-sm">Peso</span>
            <span className="font-semibold text-gray-800">{user.weight} kg</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-600 text-sm">Altura</span>
            <span className="font-semibold text-gray-800">{user.height} cm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">TMB (Repouso)</span>
            <span className="font-semibold text-gray-800">{healthMetrics?.bmr} kcal</span>
          </div>
        </div>
      </section>

      {/* Informações Pessoais */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          Informações Pessoais
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-600 text-sm">Nome</span>
            <span className="font-semibold text-gray-800 text-right">{user.name}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-600 text-sm">Género</span>
            <span className="font-semibold text-gray-800 capitalize">
              {user.gender === 'male' ? 'Masculino' : user.gender === 'female' ? 'Feminino' : 'Outro'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Idade</span>
            <span className="font-semibold text-gray-800">{user.age} anos</span>
          </div>
        </div>
      </section>

      {/* Resumo Semanal (V4) */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          Resumo de Aderência
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 font-medium">Consistência (7 dias)</span>
            <span className="text-2xl font-bold text-emerald-600">
              {summary.adherenceRate}%
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Dias com atividade</span>
              <span className="font-semibold text-gray-800">{summary.daysActivityCompleted} / 7</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Dias com meta nutricional</span>
              <span className="font-semibold text-gray-800">{summary.daysNutritionCompleted} / 7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="pt-4">
        <button
          onClick={handleReset}
          className="w-full py-3 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Apagar Todos os Dados
        </button>
      </section>
    </div>
  );
}