import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Composer } from '../components/feed/Composer';
import { PostCard } from '../components/feed/PostCard';
import { StoriesBar } from '../components/feed/StoriesBar';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { FeedSkeleton } from '../components/ui/Media';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { useTitle } from '../hooks/useTitle';
import { engagement } from '../utils/format';

export function HomePage() {
  useTitle('Home');
  const { currentUser } = useAuth();
  const { posts } = useSocial();
  const [loading, setLoading] = useState(() => {
    try {
      return sessionStorage.getItem('lumina_feed_seen') !== '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!loading) return undefined;
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem('lumina_feed_seen', '1');
      } catch {
        /* ignore private-mode storage errors */
      }
      setLoading(false);
    }, 550);
    return () => clearTimeout(timer);
  }, [loading]);

  const { followingPosts, suggested } = useMemo(() => {
    const followed = new Set([currentUser.id, ...currentUser.following]);
    const chronological = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return {
      followingPosts: chronological.filter((post) => followed.has(post.userId)),
      suggested: chronological
        .filter((post) => !followed.has(post.userId))
        .sort((a, b) => engagement(b) - engagement(a))
        .slice(0, 3),
    };
  }, [posts, currentUser]);

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
      <h1 className="sr-only">Home</h1>
      <StoriesBar />
      <Composer />
      {loading ? (
        <div aria-busy="true" aria-live="polite">
          <span className="sr-only">Loading feed</span>
          <FeedSkeleton />
        </div>
      ) : (
        <>
          {followingPosts.length === 0 && (
            <EmptyState
              title="Your feed is quiet"
              text="Follow a few people, or start with the suggestions below."
              action={
                <Link to="/explore">
                  <Button>Find people</Button>
                </Link>
              }
            />
          )}
          <div className="space-y-4">
            {followingPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          {suggested.length > 0 && (
            <section className="space-y-4">
              <div>
                <h2 className="font-display text-2xl text-ink">Suggested posts</h2>
                <p className="mt-1 text-sm text-ink-soft">From people you do not follow yet.</p>
              </div>
              {suggested.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
