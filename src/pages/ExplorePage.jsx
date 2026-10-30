import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { trendingTags } from '../components/layout/RightRail';
import { GridTile } from '../components/ui/Media';
import { EmptyState, PageHeader } from '../components/ui/EmptyState';
import { Icon } from '../components/ui/Icon';
import { inputClass } from '../components/ui/Button';
import { UserRow } from '../components/users/UserRow';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { useTitle } from '../hooks/useTitle';
import { engagement } from '../utils/format';
import { cn } from '../utils/cn';

export function ExplorePage() {
  useTitle('Explore');
  const { users, currentUser } = useAuth();
  const { posts } = useSocial();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const [draft, setDraft] = useState(query);
  const [searching, setSearching] = useState(false);
  const ownUpdate = useRef(false);
  const trimmed = draft.trim();

  useEffect(() => {
    if (ownUpdate.current) {
      ownUpdate.current = false;
      return;
    }
    setDraft(query);
  }, [query]);

  useEffect(() => {
    if (trimmed === query) {
      setSearching(false);
      return undefined;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      ownUpdate.current = true;
      setParams(trimmed ? { q: trimmed } : {}, { replace: true });
    }, 320);
    return () => clearTimeout(timer);
  }, [trimmed, query, setParams]);

  const normalized = query.trim().toLowerCase().replace(/^#/, '');
  const people = useMemo(() => {
    if (!normalized) return [];
    return users.filter(
      (user) =>
        user.id !== currentUser.id &&
        [user.name, user.username, user.bio, user.location].join(' ').toLowerCase().includes(normalized),
    );
  }, [users, currentUser.id, normalized]);

  const matchedPosts = useMemo(() => {
    const list = [...posts].sort((a, b) => engagement(b) - engagement(a));
    if (!normalized) return list;
    return list.filter((post) => {
      const author = users.find((user) => user.id === post.userId);
      const haystack = [post.text, post.tags.join(' '), author?.name, author?.username, ...post.comments.map((comment) => comment.text)]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [posts, normalized, users]);

  const suggested = users.filter((user) => user.id !== currentUser.id && !currentUser.following.includes(user.id)).slice(0, 4);
  const tags = trendingTags(posts);

  return (
    <div className="animate-rise">
      <PageHeader title="Explore" subtitle="Search people and posts, or browse what is moving." />
      <label className="relative mb-5 block">
        <span className="sr-only">Search users and posts</span>
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" />
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Search users, posts, or #tags"
          className={cn(inputClass(false), 'pl-10 pr-10')}
        />
        {draft && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setDraft('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-faint hover:text-ink"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        )}
      </label>
      {searching && <p className="mb-4 text-sm font-semibold text-ink-soft">Searching…</p>}

      {normalized ? (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-ink-faint">People</h2>
            {people.length === 0 ? (
              <p className="text-sm text-ink-soft">No people match that search.</p>
            ) : (
              <div className="space-y-3 rounded-2xl border border-line bg-card p-4 shadow-card">
                {people.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}
              </div>
            )}
          </section>
          <section>
            <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-ink-faint">Posts</h2>
            {matchedPosts.length === 0 ? (
              <EmptyState title="No posts found" text="Try a name, a word from a caption, or a tag." />
            ) : (
              <PostGrid posts={matchedPosts} />
            )}
          </section>
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold">
              <Icon name="trending" className="h-5 w-5 text-brand-600" />
              Trending
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {tags.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => setDraft(`#${tag.name}`)}
                  className="shrink-0 rounded-full border border-line bg-card px-3 py-1.5 text-sm font-bold transition hover:border-brand-200 hover:bg-brand-50"
                >
                  #{tag.name}
                  <span className="ml-1.5 text-xs font-semibold text-ink-faint">{tag.count}</span>
                </button>
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-3 text-lg font-extrabold">Suggested users</h2>
            {suggested.length === 0 ? (
              <p className="text-sm text-ink-soft">You are following everyone in this demo.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {suggested.map((user) => (
                  <div key={user.id} className="rounded-2xl border border-line bg-card p-4 shadow-card">
                    <UserRow user={user} />
                    <p className="mt-3 line-clamp-2 pl-12 text-sm text-ink-soft">{user.bio}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section>
            <h2 className="mb-3 text-lg font-extrabold">Trending posts</h2>
            <PostGrid posts={matchedPosts} />
          </section>
        </div>
      )}
    </div>
  );
}

function PostGrid({ posts }) {
  return (
    <div className="columns-2 gap-2 md:columns-3 md:gap-3">
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/post/${post.id}`}
          className="group mb-2 block break-inside-avoid overflow-hidden rounded-xl md:mb-3"
        >
          <GridTile post={post} />
        </Link>
      ))}
    </div>
  );
}
