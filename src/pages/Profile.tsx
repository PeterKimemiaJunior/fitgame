/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useV4Store } from '../store/useV4Store';
import { calculateHealthMetrics } from '../domain/health/metrics'; // Importar o motor de cálculo real
import { EDUCATION } from '../domain/health/education';
import { InfoModal } from '../components/ui/InfoModal';

export function Profile() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser); // Para salvar dados brutos
  
  const { dailyProgress, profileMetrics, setProfileMetrics, resetAllData } = useV4Store(); // Para salvar métricas

  // --- LÓGICA DE MÉTRICAS (CORRIGIDA) ---
  // 1. Tenta pegar do Store (Calculado no Registro ou edição anterior)
  // 2. Fallback: Calcula se o usuário existir mas o store estiver vazio
  let healthMetrics = profileMetrics;
  if (!healthMetrics && user) {
    healthMetrics = calculateHealthMetrics(user.age, user.weight, user.height, user.gender, user.activityLevel, user.goal);
  }

  // --- ESTADO DE EDIÇÃO ---
  const [isEditing, setIsEditing] = useState(false);
  const [editWeight, setEditWeight] = useState(user?.weight || '');
  const [editActivity, setEditActivity] = useState(user?.activityLevel || 'sedentary');
  const [editGoal, setEditGoal] = useState(user?.goal || 'maintain');
  const [showHealthModal, setShowHealthModal] = useState(false);

  // --- HANDLERS ---
  
  const handleSaveEdit = () => {
    if (!user) return;

    // 1. Atualizar dados brutos no useUserStore
    setUser({
      ...user,
      weight: Number(editWeight),
      activityLevel: editActivity,
      goal: editGoal,
    });

    // 2. Recalcular Métricas
    const newMetrics = calculateHealthMetrics(
      user.age, 
      Number(editWeight), 
      user.height, 
      user.gender, 
      editActivity, 
      editGoal
    );

    // 3. Salvar novas métricas no useV4Store
    setProfileMetrics(newMetrics);

    // 4. Sair do modo edição
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Resetar campos para os valores originais
    setEditWeight(user?.weight || '');
    setEditActivity(user?.activityLevel || 'sedentary');
    setEditGoal(user?.goal || 'maintain');
    setIsEditing(false);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja apagar todos os seus dados? ' +
      'Isso inclui seu perfil, histórico e progresso atual. ' +
      'Esta ação não pode ser desfeita.'
    );
    if (confirmed) resetAllData();
  };

  // --- LÓGICA DE RESUMO (7 dias) ---
  const summary = useMemo(() => {
    if (!user) return { adherenceRate: 0, totalDays: 0, totalXP: 0 };
    
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
  }, [dailyProgress, user]);

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
      <header className="border-b border-gray-100 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-sm text-gray-500">Ajuste sua jornada a qualquer momento.</p>
        </div>
        {/* Botão para Editar Rápido */}
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-emerald-600 text-sm font-medium hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors"
          >
            Editar Dados
          </button>
        )}
      </header>

      {/* 1. DADOS PESSOAIS (Fixos) */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Dados Pessoais</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-600 text-sm">Nome</span>
            <span className="font-semibold text-gray-900">{user.name}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-600 text-sm">Idade</span>
            <span className="font-semibold text-gray-900">{user.age} anos</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Género</span>
            <span className="font-semibold text-gray-900 capitalize">
              {user.gender === 'male' ? 'Masculino' : user.gender === 'female' ? 'Feminino' : 'Outro'}
            </span>
          </div>
        </div>
      </section>

      {/* 2. BIOMETRIA & OBJETIVO (EDITÁVEL) */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          Biometria & Objetivo
        </h2>
        <div className={`bg-white border ${isEditing ? 'border-emerald-500 shadow-sm' : 'border-gray-200'} rounded-lg p-4 transition-all`}>
          
          {/* MODO VISUALIZAÇÃO */}
          {!isEditing ? (
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600 text-sm">Peso</span>
                <span className="font-semibold text-gray-900">{user.weight} kg</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600 text-sm">Altura</span>
                <span className="font-semibold text-gray-900">{user.height} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Objetivo</span>
                <span className="font-semibold text-gray-900">
                  {user.goal === 'maintain' ? 'Manter peso' : 
                   user.goal === 'loss_moderate' ? 'Emagrecer (Moderado)' : 
                   user.goal === 'loss_aggressive' ? 'Emagrecer (Acelerado)' : 
                   user.goal === 'gain_muscle' ? 'Ganhar Massa' : user.goal}
                </span>
              </div>
            </div>
          ) : (
            /* MODO EDIÇÃO */
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Peso (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={editWeight} 
                  onChange={(e) => setEditWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Nível de Atividade</label>
                <select 
                  value={editActivity} 
                  onChange={(e) => setEditActivity(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option value="sedentary">Sedentário</option>
                  <option value="lightly_active">Levemente Ativo</option>
                  <option value="moderately_active">Moderadamente Ativo</option>
                  <option value="very_active">Muito Ativo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Objetivo</label>
                <select 
                  value={editGoal} 
                  onChange={(e) => setEditGoal(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option value="maintain">Manter Peso</option>
                  <option value="loss_moderate">Emagrecer (Moderado)</option>
                  <option value="loss_aggressive">Emagrecer (Acelerado)</option>
                  <option value="gain_muscle">Ganhar Massa</option>
                </select>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleCancelEdit}
                  className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="flex-1 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. SAÚDE & METAS (DADOS REAIS) */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Saúde & Metas
          </h2>
          <button 
            onClick={() => setShowHealthModal(true)}
            className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </button>
        </div>

        {healthMetrics && (
          <div className="grid grid-cols-2 gap-3">
            {/* IMC */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">IMC</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <p className="text-2xl font-black text-gray-900 leading-none">{healthMetrics.bmi}</p>
                  <p className="text-xs font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded mt-1">
                    {healthMetrics.bmiLabel}
                  </p>
                </div>
              </div>
            </div>

            {/* TMB */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between">
               <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">TMB</p>
                 <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-2xl font-black text-gray-900 leading-none">{healthMetrics.bmr} <span className="text-sm font-normal text-gray-500 ml-1">kcal</span></p>
                 </div>
                 <p className="text-[9px] text-gray-400 mt-1">Repouso</p>
               </div>
            </div>

            {/* TDEE */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between">
               <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase">Gasto Total</p>
                 <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-2xl font-black text-gray-900 leading-none">{healthMetrics.tdee} <span className="text-sm font-normal text-gray-500 ml-1">kcal</span></p>
                 </div>
                 <p className="text-[9px] text-gray-400 mt-1">TMB + Atividade</p>
               </div>
            </div>

            {/* META DIÁRIA */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between border-emerald-200">
               <div>
                 <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Meta Diária</p>
                 <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-2xl font-bold text-emerald-700 leading-none">{healthMetrics.targetCalories} <span className="text-sm font-normal text-emerald-600 ml-1">kcal</span></p>
                 </div>
                 <p className="text-[9px] font-medium text-emerald-700 mt-1">
                   {user.goal === 'loss_aggressive' ? 'Acelerado' : user.goal === 'loss_moderate' ? 'Moderado' : user.goal === 'gain_muscle' ? 'Superávit' : 'Manutenção'}
                 </p>
               </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. ADERÊNCIA */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          Resumo de Aderência
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div>
             <p className="text-xs text-gray-500 font-bold uppercase mb-1">Consistência (7 dias)</p>
             <p className="text-sm text-gray-700">Últimos 7 dias</p>
          </div>
          <div className="text-right">
             <p className="text-2xl font-black text-gray-900">{summary.adherenceRate}<span className="text-lg text-gray-400">%</span></p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-3">
           <div className="flex items-center justify-between">
             <div className="flex flex-col">
               <p className="text-xs text-gray-500 font-bold uppercase mb-1">Dias Ativos</p>
               <p className="text-2xl font-bold text-gray-800">{summary.totalDays} / 7</p>
            </div>
             <div className="text-right mt-2">
               <p className="text-xs text-gray-500 mb-1">Total XP</p>
               <p className="text-lg font-bold text-gray-800">{summary.totalXP}</p>
             </div>
           </div>
        </div>
      </section>

      <p className="text-[10px] text-gray-400 text-center leading-relaxed px-4">
         Este app fornece orientações baseadas em médias gerais e não substitui avaliação médica.
      </p>

      {/* MODAL EDUCACIONAL (Preservado) */}
      <InfoModal 
        isOpen={showHealthModal} 
        onClose={() => setShowHealthModal(false)}
        title="Guia de Saúde & Termos"
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">IMC (Índice de Massa Corporal)</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{EDUCATION.bmi.text}</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">TMB (Taxa Metabólica Basal)</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{EDUCATION.bmr.text}</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2">Meta & Déficit Calórico</h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              <strong>Caloria (kcal):</strong> Unidade de energia. 1kg de gordura equivale a 7700kcal.
            </p>
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 mt-2">
              <p className="text-sm font-medium text-emerald-900">{EDUCATION.deficit.text}</p>
            </div>
          </div>
        </div>
      </InfoModal>

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