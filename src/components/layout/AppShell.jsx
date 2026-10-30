import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { BottomNav } from './BottomNav';
import { RightRail } from './RightRail';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppShell() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const showRail = !location.pathname.startsWith('/messages');

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open || isDesktop) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, isDesktop]);

  return (
    <div className="min-h-screen bg-canvas">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-xl focus:bg-card focus:px-4 focus:py-2 focus:shadow-pop"
      >
        Skip to content
      </a>
      <TopBar onMenu={() => setOpen(true)} />
      {open && !isDesktop && (
        <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 bg-ink/50 lg:hidden" onClick={() => setOpen(false)} />
      )}
      <Sidebar open={open || isDesktop} onClose={() => setOpen(false)} />
      <main id="main" className="pb-20 lg:pb-0 lg:pl-[260px]">
        <div
          className={
            showRail
              ? 'mx-auto flex w-full max-w-[1220px] gap-8 px-3 py-4 sm:px-5 sm:py-5 lg:px-8 lg:py-6'
              : 'mx-auto w-full max-w-[1100px] sm:px-5 sm:py-5 lg:px-8 lg:py-6'
          }
        >
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
          {showRail && (
            <aside className="hidden w-[320px] shrink-0 2xl:block">
              <RightRail />
            </aside>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
