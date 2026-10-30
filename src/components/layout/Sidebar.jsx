import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { cn } from '../../utils/cn';
import { Avatar } from '../ui/Avatar';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { isNavActive, NAV_ITEMS } from './nav';

export function Sidebar({ open, onClose }) {
  const { currentUser, logout } = useAuth();
  const { pathname } = useLocation();
  const { unreadNotifications, unreadMessages } = useSocial();
  const badges = { notifications: unreadNotifications, messages: unreadMessages };

  return (
    <aside
      inert={open ? undefined : true}
      aria-hidden={open ? undefined : true}
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-sidebar text-white transition-transform duration-300 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="px-3 pb-2 pt-6">
        <div className="px-3">
          <Logo light />
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(item.id, pathname, currentUser.username);
          return (
            <SidebarLink
              key={item.id}
              item={item}
              active={active}
              badge={badges[item.id] || 0}
              onClick={onClose}
            />
          );
        })}
        <Link
          to="/"
          state={{ compose: true }}
          onClick={onClose}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-brand-400"
        >
          <Icon name="plus" className="h-5 w-5" />
          Create
        </Link>
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/10"
        >
          <Avatar user={currentUser} size="sm" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{currentUser.name}</span>
            <span className="block truncate text-xs text-white/50">@{currentUser.username}</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <Icon name="logout" className="h-5 w-5" />
          Log out
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ item, active, badge, onClick }) {
  return (
    <Link
      to={item.to}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition focus-visible:ring-offset-sidebar',
        active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
      )}
    >
      <span className="relative">
        <Icon name={item.icon} className="h-5 w-5" />
        {badge > 0 && (
          <span className="absolute -right-2 -top-2 grid min-w-[1.05rem] place-items-center rounded-full bg-roseheart px-1 text-[10px] font-bold leading-4 text-white">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </span>
      {item.label}
    </Link>
  );
}
