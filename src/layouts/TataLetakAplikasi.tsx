import { useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Sidebar } from '../components/Sidebar';
import { Avatar } from '../components/UI';
import { getHomeConfig } from '../data/homeConfig';

export default function TataLetakAplikasi() {
  const { user } = useAuth();
  const { role } = useParams();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const homePage = location.pathname.endsWith('/home');
  const dashboardPage = location.pathname.endsWith('/dashboard');
  const homeNavigation = user ? getHomeConfig(user.role, user.name).headerLinks : [];
  const contentHorizontalPadding = homePage
    ? 'px-5 sm:px-8 lg:px-[min(7vw,100px)]'
    : 'px-3 sm:px-5 lg:px-7';

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role !== user.role.toLowerCase()) {
    return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;
  }

  return (
    <div className={`${collapsed ? 'md:grid-cols-[minmax(0,1fr)]' : 'md:grid-cols-[232px_minmax(0,1fr)]'} min-h-dvh w-full bg-white md:grid`}>
      <Sidebar
        role={user.role}
        open={open}
        collapsed={collapsed}
        onClose={() => setOpen(false)}
        onToggleCollapse={() => setCollapsed((value) => !value)}
      />

      <div className={`${dashboardPage ? 'min-h-0' : 'min-h-dvh'} min-w-0`}>
        <header className="sticky top-0 z-30 flex h-[86px] items-center justify-between gap-4 bg-white px-3 sm:px-5 lg:px-7">
          <button
            className="-ml-2 grid size-10 shrink-0 place-items-center rounded-lg text-[#c10000] hover:bg-[#fff5e0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c10000] md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            <img className="size-4 shrink-0 object-contain" src="/assets/figma-menu.svg" alt="" />
          </button>
          <button
            className="-ml-2 hidden size-10 shrink-0 place-items-center rounded-lg text-[#c10000] hover:bg-[#fff5e0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c10000] md:grid"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? 'Perluas menu' : 'Ciutkan menu'}
            aria-expanded={!collapsed}
          >
            <img className="size-7 shrink-0 object-contain" src="/assets/figma-menu.svg" alt="" />
          </button>

          {homePage && (
            <nav className="flex min-w-0 flex-1 items-center justify-start gap-2 overflow-x-auto sm:justify-center sm:gap-5 lg:gap-8" aria-label="Navigasi halaman">
              {homeNavigation.map(([label, path]) => (
                <Link key={path} className="whitespace-nowrap rounded-full px-2 py-2 text-xs text-[#c10000] hover:bg-[#fff5e0] sm:text-sm lg:px-7 lg:text-base" to={`/${role}/${path}`}>
                  {label}
                </Link>
              ))}
            </nav>
          )}

          <div className="ml-auto flex shrink-0 items-center gap-3">
            <Avatar user={user} size="home" />
          </div>
        </header>

        <main className={`${contentHorizontalPadding} ${homePage ? 'py-6 lg:pb-8 lg:pt-6' : 'pb-8 pt-4 sm:pb-9 sm:pt-5 lg:pt-0'} min-w-0`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
