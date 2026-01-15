import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import type { User, ActivityLevel, Goal } from '../types';

export function Register() {
  const setUser = useUserStore((state) => state.setUser);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('sedentary');
  const [goal, setGoal] = useState<Goal>('loss_moderate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !age || !gender || !weight || !height) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const userData: User = {
      name,
      age: Number(age),
      gender: gender as 'male' | 'female' | 'other',
      weight: Number(weight),
      height: Number(height),
      activityLevel,
      goal,
    };

    setUser(userData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Bem-vindo ao FitGame</h1>
          <p className="text-sm text-gray-500 mt-2">
            Vamos personalizar seu plano baseado no seu estilo de vida.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Seu nome"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Idade</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Anos"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Género</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                required
              >
                <option value="">Selecione</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Peso</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="kg"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Altura</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="cm"
                required
              />
            </div>
          </div>

          {/* NOVOS CAMPOS */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nível de Atividade</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="sedentary">Sedentário (Pouco ou nenhum exercício)</option>
                <option value="lightly_active">Levemente Ativo (1-3 dias/semana)</option>
                <option value="moderately_active">Moderadamente Ativo (3-5 dias/semana)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Objetivo</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as Goal)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="maintain">Manter Peso</option>
                <option value="loss_moderate">Emagrecer (Moderado)</option>
                <option value="loss_aggressive">Emagrecer (Acelerado)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold mt-4 hover:bg-emerald-700 transition-colors"
          >
            Criar Perfil
          </button>
        </form>
      </div>
    </div>
  );
}