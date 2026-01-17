// src/App.tsx
import { useState } from 'react';
import { useUserStore } from './store/useUserStore';
import { Layout } from './app/Layout';
import { Register } from './pages/Register';
import { Today } from './pages/Today';
import { Activity } from './pages/Activity';
import { Nutrition } from './pages/Nutrition';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';

type Page = 'today' | 'activity' | 'nutrition' | 'progress' | 'profile';

// MUDANÇA: Usar 'export default' para o main.tsx encontrar
export default function App() {
  const user = useUserStore((state) => state.user);
  const [currentPage, setCurrentPage] = useState<Page>('today');

  // MUDANÇA: Checagem de Segurança
  // Se não tiver usuário OU se tiver usuário mas não tiver nome (dados corrompidos/vazios),
  // envia para o Registro.
  if (!user || !user.name) {
    return <Register />;
  }

  return (
    <Layout current={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'today' && <Today />}
      {currentPage === 'activity' && <Activity />}
      {currentPage === 'nutrition' && <Nutrition />}
      {currentPage === 'progress' && <Progress />}
      {currentPage === 'profile' && <Profile />}
    </Layout>
  );
}