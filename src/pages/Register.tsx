import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import type { User } from '../types';

export function Register() {
  const setUser = useUserStore((state) => state.setUser);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');

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