import { useState } from 'react';
import { Layout } from './app/Layout';
import { Navigation } from './ui/Navigation';
import { Today } from './pages/Today';
import { Activity } from './pages/Activity';
import { Nutrition } from './pages/Nutrition';
import { Progress } from './pages/Progress'; // Verifique se essa linha existe
import { Profile } from './pages/Profile';
import { Register } from './pages/Register';
import { useUserStore } from './store/useUserStore';

export default function App() {
  // Estado que controla qual aba está aberta
  const [current, setCurrent] = useState<'today' | 'activity' | 'nutrition' | 'progress' | 'profile'>('today');

  // Se não houver usuário, mostra Cadastro
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Register />;
  }

  // Se houver usuário, mostra a App com Navegação
  return (
    <Layout>
      {current === 'today' && <Today />}
      {current === 'activity' && <Activity />}
      {current === 'nutrition' && <Nutrition />}
      {current === 'progress' && <Progress />} {/* Esta é a linha que mostra a página */}
      {current === 'profile' && <Profile />}
      
      <Navigation current={current} onNavigate={setCurrent} />
    </Layout>
  );
}