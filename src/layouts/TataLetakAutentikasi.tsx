import { Outlet } from 'react-router';

export default function TataLetakAutentikasi() {
  return (
    <main className="grid min-h-dvh w-full place-items-center overflow-x-hidden bg-white px-4 py-6 sm:px-6 lg:px-0 lg:py-8 max-[720px]:place-items-start max-[720px]:content-start max-[720px]:py-3">
      <div className="auth-stage">
        <aside className="auth-illustration" aria-label="Ilustrasi pintu terbuka">
          <img src="/assets/login-door-art.png" alt="" />
        </aside>
        <section className="auth-panel">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
