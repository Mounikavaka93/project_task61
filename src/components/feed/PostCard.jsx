import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocial, useToast } from '../../context/SocialContext';
import { timeAgo } from '../../utils/format';
import { cn } from '../../utils/cn';
import { Avatar } from '../ui/Avatar';
import { Icon } from '../ui/Icon';
import { PostMedia } from '../ui/Media';
import { RichText } from '../ui/RichText';
import { ShareDialog } from './ShareDialog';

export function PostCard({ post, defaultCommentsOpen = false }) {
  const { users, currentUser } = useAuth();
  const { toggleLike, toggleSave, addComment, deleteComment, deletePost } = useSocial();
  const showToast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const author = users.find((user) => user.id === post.userId);
  const [commentsOpen, setCommentsOpen] = useState(defaultCommentsOpen);
  const [draft, setDraft] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [burst, setBurst] = useState(false);
  const menuRef = useRef(null);

  const liked = post.likes.includes(currentUser.id);
  const saved = post.savedBy.includes(currentUser.id);
  const isOwn = post.userId === currentUser.id;

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointer = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [menuOpen]);

  if (!author) return null;

  function like() {
    if (!liked) {
      setPulse(true);
      setBurst(true);
      setTimeout(() => setBurst(false), 700);
    }
    toggleLike(post.id);
  }

  function onMediaDoubleClick() {
    if (!liked) like();
    else {
      setBurst(true);
      setTimeout(() => setBurst(false), 700);
    }
  }

  function submitComment(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    addComment(post.id, draft);
    setDraft('');
    setCommentsOpen(true);
  }

  function removePost() {
    deletePost(post.id);
    showToast('Post deleted');
    if (location.pathname === `/post/${post.id}`) navigate('/');
  }

  const visibleComments = commentsOpen ? post.comments : post.comments.slice(-1);

  return (
    <article className="rounded-2xl border border-line bg-card shadow-card transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(20,19,28,0.08)]">
      <header className="flex items-center gap-3 px-4 pb-2 pt-4">
        <Link to={`/profile/${author.username}`}>
          <Avatar user={author} size="md" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link to={`/profile/${author.username}`} className="block truncate text-sm font-extrabold hover:underline">
            {author.name}
          </Link>
          <p className="truncate text-xs text-ink-soft">
            @{author.username} · {timeAgo(post.createdAt)}
          </p>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Post options"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => {
              setMenuOpen((open) => !open);
              setConfirmDelete(false);
            }}
            className="rounded-xl p-2 text-ink-soft transition hover:bg-canvas hover:text-ink"
          >
            <Icon name="more" />
          </button>
          {menuOpen && (
            <div role="menu" className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-xl border border-line bg-card py-1 shadow-pop">
              <MenuButton onClick={() => { setShareOpen(true); setMenuOpen(false); }}>Share</MenuButton>
              {isOwn && !confirmDelete && (
                <MenuButton tone="danger" onClick={() => setConfirmDelete(true)}>
                  Delete
                </MenuButton>
              )}
              {isOwn && confirmDelete && (
                <MenuButton tone="danger" onClick={removePost}>
                  Confirm delete
                </MenuButton>
              )}
            </div>
          )}
        </div>
      </header>

      {post.text && (
        <div className="px-4 pb-3">
          <RichText text={post.text} users={users} />
        </div>
      )}

      {post.media && (
        <div className="relative">
          {post.media.type === 'image' ? (
            <div onDoubleClick={onMediaDoubleClick}>
              <PostMedia media={post.media} alt={post.text || `Post by ${author.name}`} />
            </div>
          ) : (
            <PostMedia media={post.media} alt={post.text || `Video by ${author.name}`} />
          )}
          {burst && (
            <span className="pointer-events-none absolute inset-0 grid place-items-center">
              <Icon name="heart" filled className="h-20 w-20 animate-heart text-white drop-shadow" />
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-1 px-2 py-1">
        <Action
          label={liked ? 'Unlike' : 'Like'}
          pressed={liked}
          onClick={like}
          className={liked ? 'text-roseheart' : ''}
        >
          <Icon name="heart" filled={liked} className={cn('h-6 w-6', pulse && 'animate-pop')} />
          <Count value={post.likes.length} />
        </Action>
        <Action label={commentsOpen ? 'Hide comments' : 'Comment'} pressed={commentsOpen} onClick={() => setCommentsOpen((open) => !open)}>
          <Icon name="comment" className="h-6 w-6" />
          <Count value={post.comments.length} />
        </Action>
        <Action label="Share" onClick={() => setShareOpen(true)}>
          <Icon name="share" className="h-6 w-6" />
          <Count value={post.shares} />
        </Action>
        <Action
          label={saved ? 'Unsave' : 'Save'}
          pressed={saved}
          className={cn('ml-auto', saved && 'text-brand-700')}
          onClick={() => toggleSave(post.id)}
        >
          <Icon name="bookmark" filled={saved} className="h-6 w-6" />
        </Action>
      </div>

      {(visibleComments.length > 0 || commentsOpen) && (
        <div className="space-y-3 px-4 pb-4">
          {post.comments.length > 1 && !commentsOpen && (
            <button type="button" onClick={() => setCommentsOpen(true)} className="text-sm font-semibold text-ink-soft hover:text-ink">
              View all {post.comments.length} comments
            </button>
          )}
          <ul className="space-y-2.5">
            {visibleComments.map((comment) => {
              const person = users.find((user) => user.id === comment.userId);
              if (!person) return null;
              return (
                <li key={comment.id} className="flex gap-2.5">
                  <Link to={`/profile/${person.username}`} className="mt-0.5">
                    <Avatar user={person} size="xs" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm leading-snug">
                      <Link to={`/profile/${person.username}`} className="font-extrabold hover:underline">
                        {person.username}
                      </Link>
                      <div className="mt-0.5 [&_p]:text-sm">
                        <RichText text={comment.text} users={users} />
                      </div>
                    </div>
                    <p className="mt-0.5 text-[11px] font-semibold text-ink-faint">{timeAgo(comment.createdAt)}</p>
                  </div>
                  {comment.userId === currentUser.id && (
                    <button
                      type="button"
                      aria-label="Delete comment"
                      onClick={() => deleteComment(post.id, comment.id)}
                      className="text-ink-faint transition hover:text-rose-600"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          {commentsOpen && (
            <form onSubmit={submitComment} className="flex items-center gap-2">
              <Avatar user={currentUser} size="xs" />
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={280}
                placeholder="Add a comment"
                aria-label="Add a comment"
                className="h-10 min-w-0 flex-1 rounded-full border border-line bg-canvas px-3 text-sm outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="text-sm font-extrabold text-brand-700 disabled:opacity-40"
              >
                Reply
              </button>
            </form>
          )}
        </div>
      )}

      <ShareDialog post={post} open={shareOpen} onClose={() => setShareOpen(false)} />
    </article>
  );
}

function Action({ label, pressed, onClick, className, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xl px-2 py-2 text-sm font-semibold text-ink-soft transition hover:bg-canvas hover:text-ink',
        className,
      )}
    >
      {children}
    </button>
  );
}

function Count({ value }) {
  if (!value) return null;
  return <span>{value}</span>;
}

function MenuButton({ children, onClick, tone }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        'block w-full px-3 py-2 text-left text-sm font-semibold transition hover:bg-canvas',
        tone === 'danger' ? 'text-rose-600' : 'text-ink',
      )}
    >
      {children}
    </button>
  );
}
