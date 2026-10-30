import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { engagement } from '../../utils/format';
import { inputClass } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { UserRow } from '../users/UserRow';

export function RightRail() {
  const navigate = useNavigate();
  const { users, currentUser } = useAuth();
  const { posts } = useSocial();

  const suggested = users
    .filter((user) => user.id !== currentUser.id && !currentUser.following.includes(user.id))
    .slice(0, 3);

  const tags = trendingTags(posts).slice(0, 5);
  const trendingPosts = [...posts].sort((a, b) => engagement(b) - engagement(a)).slice(0, 3);

  return (
    <div className="sticky top-6 space-y-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const query = new FormData(event.currentTarget).get('q');
          navigate(`/explore?q=${encodeURIComponent(String(query || ''))}`);
        }}
      >
        <label className="relative block">
          <span className="sr-only">Search Vesper</span>
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" />
          <input name="q" placeholder="Search Vesper" className={`${inputClass(false)} pl-10`} />
        </label>
      </form>

      <section className="rounded-2xl border border-line bg-card p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-extrabold">Suggested for you</h2>
          <Link to="/explore" className="text-xs font-bold text-brand-700 hover:underline">
            See all
          </Link>
        </div>
        {suggested.length === 0 ? (
          <p className="text-sm text-ink-soft">You are following everyone here.</p>
        ) : (
          <div className="space-y-3">
            {suggested.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-card p-4 shadow-card">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold">
          <Icon name="trending" className="h-4 w-4 text-brand-600" />
          Trending
        </h2>
        <ol className="space-y-3">
          {tags.map((tag, index) => (
            <li key={tag.name}>
              <Link to={`/explore?q=${encodeURIComponent(`#${tag.name}`)}`} className="block rounded-xl transition hover:bg-canvas">
                <p className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">{index + 1} · Trending</p>
                <p className="font-extrabold">#{tag.name}</p>
                <p className="text-xs text-ink-soft">{tag.count} {tag.count === 1 ? 'post' : 'posts'}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-line bg-card p-4 shadow-card">
        <h2 className="mb-3 text-sm font-extrabold">Popular posts</h2>
        <div className="space-y-3">
          {trendingPosts.map((post) => {
            const author = users.find((user) => user.id === post.userId);
            return (
              <Link key={post.id} to={`/post/${post.id}`} className="flex gap-3 rounded-xl transition hover:bg-canvas">
                <Thumb post={post} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{author?.name}</span>
                  <span className="line-clamp-2 text-xs leading-relaxed text-ink-soft">{post.text}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <p className="px-1 text-xs leading-relaxed text-ink-faint">Vesper · A quieter place to share what is worth seeing.</p>
    </div>
  );
}

function Thumb({ post }) {
  const src = post.media?.type === 'video' ? post.media.poster : post.media?.url;
  if (!src) {
    return <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand-50 text-[10px] font-bold text-brand-700">Note</span>;
  }
  return <img src={src} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />;
}

export function trendingTags(posts) {
  const counts = new Map();
  posts.forEach((post) => {
    post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
  });
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
