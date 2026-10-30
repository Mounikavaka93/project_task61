import { useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from './Icon';

export function Bone({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-ink/[0.08]', className)} />;
}

export function FeedSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <div key={item} className="rounded-2xl border border-line bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <Bone className="h-11 w-11 rounded-full" />
            <div className="flex-1 space-y-2">
              <Bone className="h-3 w-32" />
              <Bone className="h-3 w-20" />
            </div>
          </div>
          <Bone className="mt-4 h-3.5 w-full" />
          <Bone className="mt-2 h-3.5 w-4/5" />
          <Bone className="mt-4 aspect-[5/4] w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function MediaImage({ src, alt, className, imgClassName }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          'grid place-items-center bg-gradient-to-br from-brand-100 via-rose-50 to-amber-100 px-3 text-center text-xs font-semibold text-ink-soft',
          className,
        )}
      >
        Preview unavailable
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden bg-ink/[0.05]', className)}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-ink/[0.08]" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </div>
  );
}

export function PostMedia({ media, alt, className }) {
  if (!media) return null;

  if (media.type === 'video') {
    return (
      <div className={cn('relative overflow-hidden bg-black', className)}>
        <video
          className="max-h-[540px] w-full bg-black"
          controls
          playsInline
          preload="metadata"
          poster={media.poster || undefined}
          src={media.url}
        />
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Video
        </span>
      </div>
    );
  }

  return <MediaImage src={media.url} alt={alt} className={cn('aspect-[4/5] sm:aspect-[5/4]', className)} />;
}

export function GridTile({ post }) {
  const src = post.media?.type === 'video' ? post.media.poster : post.media?.url;

  if (!src) {
    return (
      <div className="flex aspect-square items-center bg-gradient-to-br from-brand-600 via-fuchsia-500 to-amber-400 p-3">
        <p className="line-clamp-6 text-left text-[11px] font-semibold leading-snug text-white sm:text-sm">{post.text}</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-square">
      <MediaImage src={src} alt="" className="absolute inset-0 h-full w-full" imgClassName="group-hover:scale-105" />
      {post.media?.type === 'video' && (
        <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white">
          <Icon name="play" filled className="h-3.5 w-3.5" />
        </span>
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-2.5 py-2 text-[11px] font-bold text-white opacity-0 transition group-hover:opacity-100">
        <span>{post.likes.length} likes</span>
        <span>{post.comments.length} comments</span>
      </span>
    </div>
  );
}
