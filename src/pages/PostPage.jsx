import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PostCard } from '../components/feed/PostCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Icon } from '../components/ui/Icon';
import { useSocial } from '../context/SocialContext';
import { useTitle } from '../hooks/useTitle';

export function PostPage() {
  const { postId } = useParams();
  const { posts } = useSocial();
  const navigate = useNavigate();
  const location = useLocation();
  const post = posts.find((entry) => entry.id === postId);
  useTitle(post ? 'Post' : 'Post not found');

  function back() {
    if (location.key === 'default') navigate('/');
    else navigate(-1);
  }

  if (!post) {
    return (
      <EmptyState
        title="This post is unavailable"
        text="It may have been deleted."
        action={
          <button type="button" onClick={back} className="font-bold text-brand-700">
            Go back
          </button>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-[640px] animate-rise">
      <button type="button" onClick={back} className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-ink-soft hover:text-ink">
        <Icon name="back" className="h-4 w-4" />
        Back
      </button>
      <PostCard post={post} defaultCommentsOpen />
    </div>
  );
}
