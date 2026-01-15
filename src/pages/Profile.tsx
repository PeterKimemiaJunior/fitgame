import { useState, useMemo } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useV4Store } from '../store/useV4Store';
import { calculateHealthMetrics } from '../domain/health/metrics';
import { EDUCATION } from '../domain/health/education';
import { InfoModal } from '../components/ui/InfoModal';

export function Profile() {
  const user = useUserStore((state) => state.user);
  const { dailyProgress, resetAllData } = useV4Store();
  
  const summary = useMemo(() => {
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

  const healthMetrics = useMemo(() => {
    if (!user) return null;
    return calculateHealthMetrics(user.age, user.weight, user.height, user.gender, user.activityLevel, user.goal);
  }, [user]);

  const [showHealthModal, setShowHealthModal] = useState(false);

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
    <div className="p-6 space-y-6 pb-20">
      {/* Header */}
      <header className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-sm text-gray-500">Visão geral da sua saúde e objetivos.</p>
      </header>

      {/* 1. DADOS PESSOAIS */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          Dados Pessoais
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex justify-between p-4 border-b border-gray-100">
            <span className="text-gray-600 text-sm">Nome</span>
            <span className="font-semibold text-gray-900">{user.name}</span>
          </div>
          <div className="flex justify-between p-4 border-b border-gray-100">
            <span className="text-gray-600 text-sm">Idade</span>
            <span className="font-semibold text-gray-900">{user.age} anos</span>
          </div>
          <div className="flex justify-between p-4">
            <span className="text-gray-600 text-sm">Género</span>
            <span className="font-semibold text-gray-900 capitalize">
              {user.gender === 'male' ? 'Masculino' : user.gender === 'female' ? 'Feminino' : 'Outro'}
            </span>
          </div>
        </div>
      </section>

      {/* 2. SAÚDE & METAS (GRID 2x2 SIMÉTRICO) */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Saúde & Metas
          </h2>
          <button 
            onClick={() => setShowHealthModal(true)}
            className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full transition-colors"
            title="Ver explicações"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </button>
        </div>

        {healthMetrics && (
          <div className="grid grid-cols-2 gap-3">
            {/* 1. IMC */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">IMC</p>
              <div className="flex items-baseline gap-1">
                <p className="text-xl font-black text-gray-900 leading-none">{healthMetrics.bmi}</p>
                <p className="text-xs font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded mt-1">
                  {healthMetrics.bmiLabel}
                </p>
              </div>
            </div>

            {/* 2. TMB */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">TMB</p>
              <div className="flex items-baseline gap-1">
                <p className="text-xl font-black text-gray-900 leading-none">{healthMetrics.bmr} <span className="text-sm font-normal text-gray-500 ml-1">kcal</span></p>
              </div>
              <p className="text-[9px] text-gray-400 mt-1">Repouso</p>
            </div>

            {/* 3. TDEE */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Gasto Total</p>
              <div className="flex items-baseline gap-1">
                <p className="text-xl font-black text-gray-900 leading-none">{healthMetrics.tdee} <span className="text-sm font-normal text-gray-500 ml-1">kcal</span></p>
              </div>
              <p className="text-[9px] text-gray-400 mt-1">TMB + Atividade</p>
            </div>

            {/* 4. META DIÁRIA */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Meta Diária</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-bold text-emerald-700 leading-none">{healthMetrics.targetCalories} <span className="text-sm font-normal text-emerald-600 ml-1">kcal</span></p>
                </div>
              </div>
              <div className="text-right mt-1">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {user.goal === 'loss_aggressive' ? 'Acelerado' : user.goal === 'loss_moderate' ? 'Moderado' : 'Manter'}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. ADERÊNCIA */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          Resumo de Adesão
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div>
             <p className="text-xs text-gray-500 font-bold uppercase mb-1">Consistência (7 dias)</p>
             <p className="text-2xl font-black text-gray-900">{summary.adherenceRate}<span className="text-lg text-gray-400">%</span></p>
          </div>
          <div className="text-right">
             <p className="text-xs text-gray-500 mb-1">Dias Ativos</p>
             <p className="text-lg font-bold text-gray-800">{summary.totalDays}</p>
          </div>
        </div>
      </section>

      {/* AVISO LEGAL */}
      <p className="text-[10px] text-gray-400 text-center leading-relaxed px-4">
           Este app fornece orientações baseadas em médias gerais e não substitui avaliação médica.
      </p>

      {/* MODAL EDUCACIONAL */}
      <InfoModal 
        isOpen={showHealthModal} 
        onClose={() => setShowHealthModal(false)}
        title="Guia de Saúde & Termos"
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">O que é IMC?</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {EDUCATION.bmi.text}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">O que é TMB?</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {EDUCATION.bmr.text}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">Gasto Total (TDEE)</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              É a soma do seu TMB com as calorias gastas em suas atividades diárias. Este valor representa o equilíbrio do seu peso atual.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">Meta & Déficit Calórico</h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              <strong>Caloria (kcal):</strong> Unidade de energia. 1kg de gordura equivale aproximadamente a 7700kcal.
            </p>
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <p className="text-sm font-medium text-emerald-900">
                {EDUCATION.deficit.text}
              </p>
            </div>
          </div>
        </div>
      </InfoModal>

      {/* ZONA DE PERIGO */}
      <section className="pt-4 border-t border-gray-100">
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