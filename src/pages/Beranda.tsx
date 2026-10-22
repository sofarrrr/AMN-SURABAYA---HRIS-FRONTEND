import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { getHomeConfig } from '../data/homeConfig';

export default function Beranda() {
  const { user } = useAuth();
  const role = user.role.toLowerCase();
  const content = getHomeConfig(user.role, user.name);

  return (
    <section className="home-hero mx-auto grid w-full max-w-[1080px] items-stretch text-amn-red font-inter">
      <div className="home-copy flex min-w-0 flex-col items-start justify-between">
        <p className="home-intro w-full max-w-[338px] text-amn-red">{content.intro}</p>
        <h1 className="m-0 w-full max-w-[338px] font-inter">
          {content.heading.map((line) => <span key={line}>{line}</span>)}
        </h1>
        <p className="home-description w-full max-w-[480px] text-amn-red">
          {content.highlightBrand ? <>
            Optimalkan pengelolaan dengan <strong>HRIS AMN Surabaya</strong> untuk menciptakan proses kerja yang lebih efisien dan mudah digunakan.
          </> : content.description}
        </p>
      </div>

      <div className="home-actions min-w-0">
        <nav className="home-action-list flex flex-col" aria-label="Akses fitur HRIS">
          {content.actionLinks.map(([label, path]) => (
            <Link className="home-action flex items-end justify-between gap-2 pb-2.5 no-underline" key={path} to={`/${role}/${path}`}>
              <span>{label}</span>
              <img className="mb-2 shrink-0" src="/assets/figma-home-link-arrow.svg" alt="" />
            </Link>
          ))}
        </nav>
        <img className="home-decorative-arrow block" src="/assets/figma-home-decorative-arrow.svg" alt="" />
      </div>
    </section>
  );
}
