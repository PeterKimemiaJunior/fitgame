// src/ui/Navigation.tsx

interface NavItemProps {
  label: string;
  icon: 'home' | 'dumbbell' | 'apple' | 'chart-bar' | 'user';
  active: boolean;
  onClick: () => void;
}

// --- COMPONENTE DE ÍCONES (Local para Navigation) ---
const NavIcon = ({ name, className }: { name: string; className: string }) => {
  switch (name) {
    case 'home': // Hoje
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    case 'dumbbell': // Atividade
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0-2.278-3.694-4.125-8.25-4.125s-8.25 1.847-8.25 4.125" />
        </svg>
      );
    case 'apple': // Nutrição
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.715 3.105a.375.375 0 11.53 0L15.51 5.44a.375.375 0 01-.106.532l-4.813 2.935a.375.375 0 01-.356.01l-2.792-.762a.375.375 0 01-.269-.478l.998-4.372a.375.375 0 01.532-.262z M6.75 19.375c.39-.555.835-1.02 1.33-1.405.648-.51 1.39-.85 2.17-.995a6.75 6.75 0 013.5 0c.78.145 1.522.485 2.17.995.495.385.94.85 1.33 1.405m-6.75-1.073v0c0 2.223.905 4.223 2.37 5.66.955.94 2.19 1.49 3.5 1.5.95-.01 1.85-.35 2.58-.96.735-.615 1.24-1.49 1.44-2.47v0c.25-1.2.04-2.465-.6-3.515-.645-1.05-1.645-1.83-2.81-2.18l-1.62-.49m-7.86-9.07l-1.62.49c-1.165.35-2.165 1.13-2.81 2.18-.64 1.05-.85 2.315-.6 3.515v0c.2.98.705 1.855 1.44 2.47.73.61 1.63.95 2.58.96 1.31-.01 2.545-.56 3.5-1.5 1.465-1.437 2.37-3.437 2.37-5.66v0" />
        </svg>
      );
    case 'chart-bar': // Progresso
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      );
    case 'user': // Perfil
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      );
    default:
      return null;
  }
};

function NavItem({ label, icon, active, onClick }: NavItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 text-[10px] font-medium gap-1 ${
        active 
          ? 'text-emerald-600' 
          : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <NavIcon name={icon} className={`w-6 h-6 ${active ? 'stroke-[2px]' : 'stroke-[1.5px]'}`} />
      <span className="uppercase tracking-wide font-semibold">{label}</span>
    </button>
  );
}

interface NavigationProps {
  current: 'today' | 'activity' | 'nutrition' | 'progress' | 'profile';
  onNavigate: (page: 'today' | 'activity' | 'nutrition' | 'progress' | 'profile') => void;
}

export function Navigation({ current, onNavigate }: NavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-white/95 backdrop-blur-sm border-t border-gray-200 flex items-center justify-between px-2 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <NavItem label="Hoje" icon="home" active={current === 'today'} onClick={() => onNavigate('today')} />
      <NavItem label="Atividade" icon="dumbbell" active={current === 'activity'} onClick={() => onNavigate('activity')} />
      <NavItem label="Nutrição" icon="apple" active={current === 'nutrition'} onClick={() => onNavigate('nutrition')} />
      <NavItem label="Progresso" icon="chart-bar" active={current === 'progress'} onClick={() => onNavigate('progress')} />
      <NavItem label="Perfil" icon="user" active={current === 'profile'} onClick={() => onNavigate('profile')} />
    </div>
  );
}