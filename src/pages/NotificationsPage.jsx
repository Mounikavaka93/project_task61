import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState, PageHeader } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { useTitle } from '../hooks/useTitle';
import { timeAgo } from '../utils/format';
import { cn } from '../utils/cn';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'like', label: 'Likes' },
  { id: 'comment', label: 'Comments' },
  { id: 'follow', label: 'Follows' },
  { id: 'other', label: 'Other' },
];

function matches(note, filter) {
  if (filter === 'all') return true;
  if (filter === 'other') return note.type === 'share' || note.type === 'mention';
  return note.type === filter;
}

function actionText(note) {
  if (note.type === 'like') return 'liked your post';
  if (note.type === 'comment') return 'commented on your post';
  if (note.type === 'follow') return 'started following you';
  if (note.type === 'share') return 'shared your post';
  return 'mentioned you';
}

export function NotificationsPage() {
  useTitle('Notifications');
  const { users } = useAuth();
  const { notifications, posts, markNotificationRead, markAllNotificationsRead, unreadNotifications } = useSocial();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const visible = notifications.filter((note) => matches(note, filter));

  function open(note) {
    markNotificationRead(note.id);
    if (note.type === 'follow') {
      const person = users.find((user) => user.id === note.fromUserId);
      if (person) navigate(`/profile/${person.username}`);
      return;
    }
    if (note.postId) navigate(`/post/${note.postId}`);
  }

  return (
    <div className="mx-auto max-w-2xl animate-rise">
      <PageHeader
        title="Notifications"
        subtitle={unreadNotifications ? `${unreadNotifications} new` : 'You are all caught up'}
        action={
          <Button variant="secondary" size="sm" disabled={!unreadNotifications} onClick={markAllNotificationsRead}>
            Mark all read
          </Button>
        }
      />
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-sm font-bold transition',
              filter === item.id ? 'bg-ink text-white' : 'bg-card text-ink-soft hover:bg-white',
            )}
            aria-pressed={filter === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <EmptyState title="Nothing in this list" text="Likes, comments, follows, and mentions will show up here." />
      ) : (
        <ul className="overflow-hidden rounded-2xl border border-line bg-card shadow-card">
          {visible.map((note) => {
            const person = users.find((user) => user.id === note.fromUserId);
            const post = posts.find((entry) => entry.id === note.postId);
            const thumb = post?.media?.type === 'video' ? post.media.poster : post?.media?.url;
            if (!person) return null;
            return (
              <li key={note.id} className={cn('border-b border-line last:border-b-0', !note.read && 'bg-brand-50/80')}>
                <button type="button" onClick={() => open(note)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-canvas/80">
                  <Avatar user={person} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm leading-snug">
                      <span className="font-extrabold">{person.name}</span> {actionText(note)}
                    </span>
                    {note.text && <span className="mt-0.5 block truncate text-sm text-ink-soft">“{note.text}”</span>}
                    <span className="mt-1 block text-xs font-semibold text-ink-faint">{timeAgo(note.createdAt)}</span>
                  </span>
                  {!note.read && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-600" aria-label="Unread" />}
                  {thumb && <img src={thumb} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
