import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';

export function TopBar({ onMenu }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-card/90 px-3 backdrop-blur-md lg:hidden">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink transition hover:bg-canvas"
      >
        <Icon name="menu" />
      </button>
      <Logo />
      <Link
        to="/explore"
        aria-label="Search"
        className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink transition hover:bg-canvas"
      >
        <Icon name="search" />
      </Link>
    </header>
  );
}
