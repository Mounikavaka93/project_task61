import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { cn } from '../../utils/cn';
import { Icon } from '../ui/Icon';
import { isNavActive, NAV_ITEMS } from './nav';

export function BottomNav() {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();
  const { unreadNotifications, unreadMessages } = useSocial();
  const badges = { notifications: unreadNotifications, messages: unreadMessages };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 backdrop-blur-md lg:hidden"
      aria-label="Primary"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid h-16 grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(item.id, pathname, currentUser.username);
          const badge = badges[item.id] || 0;
          return (
            <li key={item.id}>
              <Link
                to={item.to}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-full flex-col items-center justify-center gap-1 text-[10px] font-bold tracking-tight',
                  active ? 'text-brand-700' : 'text-ink-faint',
                )}
              >
                <span className="relative">
                  <Icon name={item.icon} className="h-6 w-6" />
                  {badge > 0 && (
                    <span className="absolute -right-2 -top-1 grid min-w-[1rem] place-items-center rounded-full bg-roseheart px-1 text-[9px] font-bold leading-4 text-white">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </span>
                <span className="max-w-full truncate px-0.5 text-[9px] leading-none xs:text-[10px]">{item.id === 'notifications' ? 'Alerts' : item.short}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
