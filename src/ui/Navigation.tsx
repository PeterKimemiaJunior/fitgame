interface NavItemProps {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ label, icon, active, onClick }: NavItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
        active ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {/* Using geometric shapes for a professional look without emojis */}
      <span className="text-xl font-serif mb-1">{icon}</span>
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
  );
}

interface NavigationProps {
  current: 'today' | 'activity' | 'nutrition' | 'profile';
  onNavigate: (page: 'today' | 'activity' | 'nutrition' | 'profile') => void;
}

export function Navigation({ current, onNavigate }: NavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex items-center justify-between px-2 pb-safe">
      <NavItem label="Hoje" icon="●" active={current === 'today'} onClick={() => onNavigate('today')} />
      <NavItem label="Actividades" icon="▲" active={current === 'activity'} onClick={() => onNavigate('activity')} />
      <NavItem label="Nutrição" icon="■" active={current === 'nutrition'} onClick={() => onNavigate('nutrition')} />
      <NavItem label="Perfil" icon="◆" active={current === 'profile'} onClick={() => onNavigate('profile')} />
    </div>
  );
}