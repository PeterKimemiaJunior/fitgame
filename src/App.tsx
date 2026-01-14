import { useState } from 'react';
import { useUserStore } from './store/useUserStore';
import { HistoryChart } from './components/HistoryChart'; // Importar
import type { User } from './types';
import { calculateBMI, calculateBMR, calculateDailyCalories } from './utils/calculations';
import { HABITS_LIST } from './types';

export default function App() {
  const user = useUserStore((state) => state.user);
  const logs = useUserStore((state) => state.logs);
  const setUser = useUserStore((state) => state.setUser);
  const toggleHabit = useUserStore((state) => state.toggleHabit);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(log => log.date === todayStr);
  const completedIds = todayLog?.completedHabits || [];
  const totalPoints = logs.reduce((acc, curr) => acc + curr.points, 0);

  if (user) {
    const bmi = calculateBMI(user.weight, user.height);
    const bmr = calculateBMR(user.age, user.weight, user.height, user.gender);
    const calories = calculateDailyCalories(bmr);
    const bmiLabel = bmi < 18.5 ? 'Abaixo' : bmi < 25 ? 'Normal' : 'Sobrepeso';

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
             <div className="bg-blue-50 p-2 rounded border border-blue-100 flex flex-col justify-between">
              <p className="text-[10px] text-blue-600 font-bold uppercase">IMC</p>
              <div>
                <p className="text-sm font-black text-blue-800 leading-none">{bmi}</p>
                <p className="text-[9px] text-blue-400 truncate">{bmiLabel}</p>
              </div>
            </div>
            <div className="bg-orange-50 p-2 rounded border border-orange-100 flex flex-col justify-center">
              <p className="text-[10px] text-orange-600 font-bold uppercase">TMB</p>
              <p className="text-sm font-black text-orange-800 leading-none">{bmr}</p>
            </div>
            <div className="bg-emerald-50 p-2 rounded border border-emerald-100 flex flex-col justify-center">
              <p className="text-[10px] text-emerald-600 font-bold uppercase">Meta</p>
              <p className="text-sm font-black text-emerald-700 leading-none">{calories}</p>
            </div>
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

          {/* SEÇÃO DE HISTÓRICO (NOVO) */}
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

  // Formulário de Cadastro
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !weight || !height || !gender) {
      alert('Preencha todos os campos.');
      return;
    }

    const userData: User = {
      name,
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      gender: gender as 'male' | 'female' | 'other',
    };

    setUser(userData);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Bem-vindo ao FitGame!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Idade"
              type="number"
              min="10"
              max="120"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              required
            >
              <option value="">Género</option>
              <option value="male">Masc.</option>
              <option value="female">Fem.</option>
              <option value="other">Outro</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Peso (kg)"
              type="number"
              step="0.1"
              min="30"
              max="300"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <input
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Altura (cm)"
              type="number"
              min="100"
              max="250"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold mt-2 hover:bg-emerald-700 transition-colors"
          >
            Começar Agora
          </button>
        </form>
      </div>
    </div>
  );
}