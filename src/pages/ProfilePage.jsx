import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { FollowButton, UserRow } from '../components/users/UserRow';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { GridTile } from '../components/ui/Media';
import { Icon } from '../components/ui/Icon';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { useTitle } from '../hooks/useTitle';
import { formatJoined, websiteHref } from '../utils/format';
import { cn } from '../utils/cn';

export function ProfilePage() {
  const { username } = useParams();
  const { users, currentUser } = useAuth();
  const { posts, getOrCreateConversation } = useSocial();
  const navigate = useNavigate();
  const profile = username
    ? users.find((user) => user.username.toLowerCase() === username.toLowerCase())
    : currentUser;
  useTitle(profile ? profile.name : 'Profile');
  const [tab, setTab] = useState('posts');
  const [editing, setEditing] = useState(false);
  const [list, setList] = useState(null);

  if (!profile) {
    return <EmptyState title="This profile is not here" text="That username does not match an account in this demo." />;
  }

  const isOwn = profile.id === currentUser.id;
  const authored = posts
    .filter((post) => post.userId === profile.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const saved = posts.filter((post) => post.savedBy.includes(currentUser.id));
  const liked = posts.filter((post) => post.likes.includes(currentUser.id));
  const tabs = isOwn
    ? [
        { id: 'posts', label: 'Posts', count: authored.length },
        { id: 'saved', label: 'Saved', count: saved.length },
        { id: 'liked', label: 'Liked', count: liked.length },
      ]
    : [{ id: 'posts', label: 'Posts', count: authored.length }];
  const activeTab = tabs.some((item) => item.id === tab) ? tab : 'posts';
  const grid = activeTab === 'saved' ? saved : activeTab === 'liked' ? liked : authored;

  function message() {
    const id = getOrCreateConversation(profile.id);
    navigate(`/messages/${id}`);
  }

  const listIds = list === 'followers' ? profile.followers : list === 'following' ? profile.following : [];
  const listUsers = listIds.map((id) => users.find((user) => user.id === id)).filter(Boolean);

  return (
    <div className="animate-rise">
      <article className="overflow-hidden rounded-2xl border border-line bg-card shadow-card">
        <div className="h-36 sm:h-48">
          <Cover src={profile.cover} />
        </div>
        <div className="px-4 pb-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <Avatar user={profile} size="xl" className="-mt-12 shrink-0 ring-4 ring-card sm:-mt-14" online={profile.online} />
            <div className="flex flex-wrap items-center gap-2 sm:mb-1 sm:justify-end">
              {isOwn ? (
                <Button variant="secondary" onClick={() => setEditing(true)}>
                  <Icon name="edit" className="h-4 w-4" />
                  Edit profile
                </Button>
              ) : (
                <>
                  <FollowButton userId={profile.id} userName={profile.name} size="md" />
                  <Button variant="secondary" onClick={message}>
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight">{profile.name}</h1>
          <p className="text-sm font-semibold text-ink-soft">@{profile.username}</p>
          {profile.bio && <p className="mt-3 max-w-xl text-sm leading-relaxed">{profile.bio}</p>}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
            {profile.location && <span>{profile.location}</span>}
            {profile.website && (
              <a href={websiteHref(profile.website)} target="_blank" rel="noreferrer" className="font-bold text-brand-700 hover:underline">
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            <span>Joined {formatJoined(profile.createdAt)}</span>
          </div>
          <div className="mt-4 flex gap-5 text-sm">
            <p>
              <span className="font-extrabold">{authored.length}</span> posts
            </p>
            <button type="button" onClick={() => setList('followers')} className="hover:underline">
              <span className="font-extrabold">{profile.followers.length}</span> followers
            </button>
            <button type="button" onClick={() => setList('following')} className="hover:underline">
              <span className="font-extrabold">{profile.following.length}</span> following
            </button>
          </div>
        </div>
        <div className="grid border-t border-line" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                'border-b-2 py-3 text-sm font-bold transition',
                activeTab === item.id ? 'border-ink text-ink' : 'border-transparent text-ink-faint hover:text-ink',
              )}
              aria-pressed={activeTab === item.id}
            >
              {item.label}
              <span className="ml-1 text-xs">{item.count}</span>
            </button>
          ))}
        </div>
      </article>

      <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-card p-1 shadow-card sm:p-3">
        {grid.length === 0 ? (
          <EmptyState
            className="border-0 shadow-none"
            title={activeTab === 'posts' ? 'No posts yet' : activeTab === 'saved' ? 'Nothing saved' : 'No likes yet'}
            text={
              activeTab === 'posts'
                ? isOwn
                  ? 'Share a photo, a video, or a note from the home feed.'
                  : 'When they post, it will show up in this grid.'
                : activeTab === 'saved'
                  ? 'Save a post and it will wait for you here.'
                  : 'Posts you like will collect here.'
            }
            action={
              isOwn && activeTab === 'posts' ? (
                <Link to="/" state={{ compose: true }}>
                  <Button>Create a post</Button>
                </Link>
              ) : null
            }
          />
        ) : (
          <div className="grid grid-cols-3 gap-1 sm:gap-3">
            {grid.map((post) => (
              <Link key={post.id} to={`/post/${post.id}`} className="group overflow-hidden rounded-md sm:rounded-xl">
                <GridTile post={post} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {editing && <EditProfileModal open onClose={() => setEditing(false)} />}
      <Modal open={Boolean(list)} onClose={() => setList(null)} title={list === 'followers' ? 'Followers' : 'Following'}>
        {listUsers.length === 0 ? (
          <p className="text-sm text-ink-soft">No one here yet.</p>
        ) : (
          <div className="space-y-3">
            {listUsers.map((user) => (
              <UserRow key={user.id} user={user} onNavigate={() => setList(null)} />
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

function Cover({ src }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <div className="h-full w-full bg-gradient-to-r from-[#3c316e] via-[#8d4d86] to-[#e0a15a]" />;
  }
  return <img src={src} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />;
}
