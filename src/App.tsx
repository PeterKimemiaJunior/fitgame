import { useUserStore } from './store/useUserStore';
import { Layout } from './app/Layout';
import { Navigation } from './ui/Navigation';
import { Today } from './pages/Today';
import { Activity } from './pages/Activity';
import { Nutrition } from './pages/Nutrition';
import { Profile } from './pages/Profile';
import { Register } from './pages/Register'; // Importar Registro
import { useState } from 'react';

export default function App() {
  const user = useUserStore((state) => state.user);
  const [current, setCurrent] = useState<'today' | 'activity' | 'nutrition' | 'profile'>('today');

  // GUARDA DE NAVEGAÇÃO
  // Se não houver usuário, renderiza apenas a tela de Registro
  if (!user) {
    return <Register />;
  }

  // Se houver usuário, renderiza a app completa com navegação
  return (
    <Layout>
      {current === 'today' && <Today />}
      {current === 'activity' && <Activity />}
      {current === 'nutrition' && <Nutrition />}
      {current === 'profile' && <Profile />}
      
      <Navigation current={current} onNavigate={setCurrent} />
    </Layout>
  );
}