import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export function FollowButton({ userId, userName, size = 'sm' }) {
  const { currentUser } = useAuth();
  const { toggleFollow } = useSocial();
  if (!currentUser || userId === currentUser.id) return null;
  const following = currentUser.following.includes(userId);

  return (
    <Button
      size={size}
      variant={following ? 'secondary' : 'primary'}
      onClick={() => toggleFollow(userId)}
      aria-pressed={following}
      aria-label={following ? `Unfollow ${userName}` : `Follow ${userName}`}
    >
      {following ? 'Following' : 'Follow'}
    </Button>
  );
}

export function UserRow({ user, onNavigate }) {
  const { currentUser } = useAuth();
  const followsYou = user.following?.includes(currentUser.id);

  return (
    <div className="flex items-center gap-3">
      <Link to={`/profile/${user.username}`} onClick={onNavigate} className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar user={user} size="sm" online={user.online} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-ink">{user.name}</span>
          <span className="block truncate text-xs text-ink-soft">
            @{user.username}
            {followsYou ? ' · Follows you' : ''}
          </span>
        </span>
      </Link>
      <FollowButton userId={user.id} userName={user.name} />
    </div>
  );
}
