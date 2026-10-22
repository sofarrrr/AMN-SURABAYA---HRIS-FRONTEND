import { NavLink, useNavigate } from 'react-router';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

type SidebarProps = {
  role: string;
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
};

const links = [
  ['Beranda', 'home', 'figma-home-nav.svg'],
  ['Dashboard', 'dashboard', 'figma-dashboard.svg'],
  ['Data Karyawan', 'employees', 'figma-employee.svg'],
  ['Absensi', 'attendance', 'figma-attendance.svg'],
  ['Perizinan', 'permits', 'figma-permit.svg'],
] as const;

function SidebarLink({ to, icon, children, onClose, collapsed }: { to: string; icon: string; children: ReactNode; onClose: () => void; collapsed: boolean }) {
  return (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) => `group flex h-[38px] w-[90%] shrink-0 self-center items-center gap-[9px] rounded-[11px] px-[14px] py-[7px] text-[12px] font-medium leading-[14px] transition-colors ${collapsed ? 'md:justify-center md:px-2' : ''} ${isActive ? 'bg-white text-[#c10000]' : 'text-white hover:bg-[#faecd6] hover:text-[#c10000]'}`}
    >
      <img className="size-[18px] shrink-0 object-contain brightness-0 invert group-[.bg-white]:[filter:brightness(0)_saturate(100%)_invert(13%)_sepia(99%)_saturate(4783%)_hue-rotate(356deg)_brightness(78%)_contrast(115%)] group-hover:[filter:brightness(0)_saturate(100%)_invert(13%)_sepia(99%)_saturate(4783%)_hue-rotate(356deg)_brightness(78%)_contrast(115%)]" src={`/assets/${icon}`} alt="" />
      <span className={`whitespace-nowrap ${collapsed ? 'md:sr-only' : ''}`} title={typeof children === 'string' ? children : undefined}>{children}</span>
    </NavLink>
  );
}

export function Sidebar({ role, open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const base = `/${role.toLowerCase()}`;

  const exit = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
          aria-label="Tutup menu"
        />
      )}

      <aside
        aria-label="Navigasi utama"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(82vw,232px)] flex-col gap-0 overflow-hidden bg-[#c10000] text-white transition-transform duration-200 md:sticky md:top-0 md:h-dvh md:min-h-0 md:w-full md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className={`flex min-h-[76px] items-center gap-3 px-4 py-3 md:h-[86px] md:min-h-[86px] md:gap-[10px] md:px-[19px] md:py-0 ${collapsed ? 'md:justify-center md:px-2' : ''}`}>
          <img className="size-10 shrink-0 object-contain" src="/assets/logo-amn.png" alt="Logo AMN" />
          <span className={`min-w-0 flex-1 whitespace-nowrap text-[#fff5e0] [font:500_12.8px/19.2px_'Plus_Jakarta_Sans',Inter,sans-serif] ${collapsed ? 'md:hidden' : ''}`}>AMN Surabaya</span>
          <button
            className="grid size-9 shrink-0 place-items-center rounded-lg text-xl text-white hover:bg-white/10 md:hidden"
            onClick={onClose}
            aria-label="Tutup menu"
          >
            &times;
          </button>
          <button
            className={`hidden size-5 shrink-0 place-items-center rounded-md hover:bg-white/10 md:grid ${collapsed ? 'md:hidden' : ''}`}
            onClick={onToggleCollapse}
            aria-label="Ciutkan menu"
          >
            <img className="size-5 shrink-0 object-contain brightness-0 invert" src="/assets/figma-sidebar.svg" alt="" />
          </button>
        </div>

        <nav className={`flex min-h-0 flex-1 flex-col gap-[6px] overflow-y-auto px-4 pt-[10px] ${collapsed ? 'md:px-2' : ''}`}>
          {links.filter(([label]) => !(role === 'Karyawan' && label === 'Data Karyawan')).map(([label, path, icon]) => (
            <SidebarLink key={path} to={`${base}/${path}`} icon={icon} onClose={onClose} collapsed={collapsed}>{label}</SidebarLink>
          ))}

          {role === 'Direktur' && (
            <SidebarLink to={`${base}/users`} icon="figma-users.svg" onClose={onClose} collapsed={collapsed}>User Management</SidebarLink>
          )}

          <SidebarLink to={`${base}/profile`} icon="figma-profile.svg" onClose={onClose} collapsed={collapsed}>Profil</SidebarLink>
        </nav>

        <div className={`mt-auto px-4 pb-6 pt-4 md:px-4 md:pb-[75px] md:pt-0 ${collapsed ? 'md:px-2' : ''}`}>
          <button className={`flex h-[38px] w-[90%] shrink-0 self-center items-center gap-[9px] rounded-[11px] px-[14px] text-left text-[12px] font-medium leading-[14px] text-white hover:bg-[#a80000] ${collapsed ? 'md:justify-center md:px-2' : ''}`} onClick={exit} title={collapsed ? 'Logout' : undefined}>
            <img className="size-[18px] shrink-0 object-contain brightness-0 invert" src="/assets/figma-logout.svg" alt="" />
            <span className={collapsed ? 'md:sr-only' : ''}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
