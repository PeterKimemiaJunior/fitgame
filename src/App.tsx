import { useUserStore } from './store/useUserStore';
import { Dashboard } from './pages/Dashboard';
import { Register } from './pages/Register';

export default function App() {
  const user = useUserStore((state) => state.user);
  return user ? <Dashboard /> : <Register />;
}