/* eslint-disable react-hooks/static-components */
import { useState, useMemo } from 'react';
import { useUserStore } from '../store/useUserStore'; // Dados brutos
import { useV4Store } from '../store/useV4Store';   // Métricas calculadas
import { calculateHealthMetrics } from '../domain/health/metrics';
import type { ActivityLevel, Goal, Gender, User } from '../types';

type Step = 'identity' | 'biometrics' | 'lifestyle' | 'summary';

export function Register() {
  const setUser = useUserStore((state) => state.setUser);
  const setProfileMetrics = useV4Store((state) => state.setProfileMetrics);

  // Estado Local (Dados Brutos)
  const [step, setStep] = useState<Step>('identity');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('sedentary');
  const [goal, setGoal] = useState<Goal>('maintain');

  // Derivações para UI (Preview Instantâneo)
  const metricsPreview = useMemo(() => calculateHealthMetrics(
    Number(age), Number(weight), Number(height), gender as Gender, activityLevel, goal
  ), [age, weight, height, gender, activityLevel, goal]);

  const handleNext = () => {
    if (step === 'identity') setStep('biometrics');
    else if (step === 'biometrics') setStep('lifestyle');
    else if (step === 'lifestyle') setStep('summary');
  };

  const handleBack = () => {
    if (step === 'biometrics') setStep('identity');
    else if (step === 'lifestyle') setStep('biometrics');
    else if (step === 'summary') setStep('lifestyle');
  };

  const handleSubmit = () => {
    if (!name || !age || !gender || !weight || !height) {
      alert('Por favor, preencha todos os dados.');
      return;
    }

    // 1. Dados Brutos para useUserStore
    const userData: User = {
      name,
      age: Number(age),
      gender: gender as Gender,
      weight: Number(weight),
      height: Number(height),
      activityLevel,
      goal,
    };
    setUser(userData);

    // 2. Métricas Calculadas para useV4Store
    setProfileMetrics(metricsPreview);
  };

  // UI Helper: Card Selecionável
  const SelectableCard = ({ 
    selected, 
    onClick, 
    children, 
    subtitle 
  }: { 
    selected: boolean; 
    onClick: () => void; 
    children: React.ReactNode; 
    subtitle?: string;
  }) => (
    <div
      onClick={onClick}
      className={`p-4 border-2 rounded-xl cursor-pointer transition-all mb-3 flex justify-between items-center ${
        selected 
          ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' 
          : 'border-gray-200 bg-white hover:border-emerald-300'
      }`}
    >
      <div>
        <div className={`font-medium ${selected ? 'text-emerald-900' : 'text-gray-700'}`}>
          {children}
        </div>
        {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
      </div>
      {selected && (
        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold text-gray-900">Configurar Perfil</h1>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase">
              Passo {step === 'identity' ? '1' : step === 'biometrics' ? '2' : step === 'lifestyle' ? '3' : '4'}/4
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: step === 'identity' ? '25%' : step === 'biometrics' ? '50%' : step === 'lifestyle' ? '75%' : '100%' }}
            />
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-center">
          
          {/* Passo 1: Identidade */}
          {step === 'identity' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-lg font-semibold text-gray-800">Vamos começar pelo básico</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Seu nome"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Passo 2: Biometria */}
          {step === 'biometrics' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-lg font-semibold text-gray-800">Seus dados físicos</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none" placeholder="Anos" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none bg-white">
                    <option value="" disabled>Selecione</option>
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none" placeholder="0.0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none" placeholder="0" />
                </div>
              </div>
              {metricsPreview.bmi > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 animate-in fade-in">
                  <div className="text-emerald-600">ℹ️</div>
                  <div><p className="text-sm font-bold text-emerald-900">IMC: {metricsPreview.bmi}</p><p className="text-xs text-emerald-700">{metricsPreview.bmiLabel}</p></div>
                </div>
              )}
            </div>
          )}

          {/* Passo 3: Estilo de Vida */}
          {step === 'lifestyle' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-lg font-semibold text-gray-800">Estilo de Vida</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Atividade</label>
                <SelectableCard selected={activityLevel === 'sedentary'} onClick={() => setActivityLevel('sedentary')} subtitle="Pouco ou nenhum exercício">Sedentário</SelectableCard>
                <SelectableCard selected={activityLevel === 'lightly_active'} onClick={() => setActivityLevel('lightly_active')} subtitle="1-3 dias/semana">Levemente Ativo</SelectableCard>
                <SelectableCard selected={activityLevel === 'moderately_active'} onClick={() => setActivityLevel('moderately_active')} subtitle="3-5 dias/semana">Moderadamente Ativo</SelectableCard>
                <SelectableCard selected={activityLevel === 'very_active'} onClick={() => setActivityLevel('very_active')} subtitle="6-7 dias/semana">Muito Ativo</SelectableCard>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo</label>
                {(['maintain', 'loss_moderate', 'loss_aggressive', 'gain_muscle'] as Goal[]).map((g) => (
                  <SelectableCard key={g} selected={goal === g} onClick={() => setGoal(g)} subtitle={g === 'gain_muscle' ? 'Ganhar massa' : g === 'maintain' ? 'Manter' : 'Perder peso'}>
                    {g === 'maintain' ? 'Manter' : g === 'gain_muscle' ? 'Hipertrofia' : g === 'loss_moderate' ? 'Emagrecer' : 'Emagrecer Rápido'}
                  </SelectableCard>
                ))}
                {metricsPreview.tdee > 0 && (
                  <div className="mt-3 text-xs text-blue-800 bg-blue-50 p-3 rounded-lg">💡 Baseado no seu nível, seu gasto diário (TDEE) é de <strong>{metricsPreview.tdee} kcal</strong>.</div>
                )}
              </div>
            </div>
          )}

          {/* Passo 4: Resumo */}
          {step === 'summary' && (
            <div className="text-center space-y-6 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">🚀</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tudo pronto, {name.split(' ')[0]}!</h2>
                <div className="bg-gray-50 rounded-xl p-4 text-left mt-4 space-y-2 border border-gray-100">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">TMB (Repouso)</span><span className="font-medium">{metricsPreview.bmr} kcal</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">TDEE (Total)</span><span className="font-medium">{metricsPreview.tdee} kcal</span></div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Sua Meta</span><span className="font-bold text-emerald-600 text-lg">{metricsPreview.targetCalories} kcal</span></div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          {step !== 'identity' && <button onClick={handleBack} className="w-full mb-3 py-3 text-sm font-medium text-gray-600">Voltar</button>}
          <button
            onClick={step === 'summary' ? handleSubmit : handleNext}
            disabled={(step === 'identity' && !name) || (step === 'biometrics' && (!age || !gender || !weight || !height))}
            className={`w-full py-4 rounded-xl font-bold text-white ${((step === 'identity' && !name) || (step === 'biometrics' && (!age || !gender || !weight || !height))) ? 'bg-gray-300' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {step === 'summary' ? 'Concluir' : 'Continuar'}
          </button>
        </div>

      </div>
    </div>
  );
}