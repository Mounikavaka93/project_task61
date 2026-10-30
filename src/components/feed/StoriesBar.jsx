import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocial, useToast } from '../../context/SocialContext';
import { readFileAsDataURL } from '../../utils/files';
import { timeAgo } from '../../utils/format';
import { cn } from '../../utils/cn';
import { Avatar } from '../ui/Avatar';
import { Icon } from '../ui/Icon';
import { MediaImage } from '../ui/Media';

export function StoriesBar() {
  const { currentUser, users } = useAuth();
  const { stories, addStory, markStorySeen } = useSocial();
  const showToast = useToast();
  const fileRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [adding, setAdding] = useState(false);

  const groups = useMemo(() => {
    const map = new Map();
    stories.forEach((story) => {
      const list = map.get(story.userId) || [];
      list.push(story);
      map.set(story.userId, list);
    });
    map.forEach((list) => list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    return map;
  }, [stories]);

  const otherIds = [...groups.keys()].filter((id) => id !== currentUser.id);
  const unseen = otherIds.filter((id) => groups.get(id).some((story) => !story.seenBy.includes(currentUser.id)));
  const seen = otherIds.filter((id) => !unseen.includes(id));
  const byRecent = (a, b) => {
    const aTime = new Date(groups.get(a).at(-1).createdAt);
    const bTime = new Date(groups.get(b).at(-1).createdAt);
    return bTime - aTime;
  };
  unseen.sort(byRecent);
  seen.sort(byRecent);

  const orderedIds = [...(groups.has(currentUser.id) ? [currentUser.id] : []), ...unseen, ...seen];

  function openViewer(userId) {
    const queue = orderedIds.flatMap((id) => groups.get(id));
    setViewer({
      stories: queue,
      startIndex: Math.max(0, queue.findIndex((story) => story.userId === userId)),
    });
  }

  async function onFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Stories use photos');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Choose a photo under 5 MB');
      return;
    }
    setAdding(true);
    try {
      const image = await readFileAsDataURL(file);
      const story = addStory(image);
      const own = [...(groups.get(currentUser.id) || []), story].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
      const rest = orderedIds.filter((id) => id !== currentUser.id).flatMap((id) => groups.get(id));
      const queue = [...own, ...rest];
      setViewer({
        stories: queue,
        startIndex: Math.max(0, queue.findIndex((entry) => entry.id === story.id)),
      });
      showToast('Story added');
    } finally {
      setAdding(false);
    }
  }

  const ownStories = groups.get(currentUser.id) || [];

  return (
    <section aria-label="Stories" className="rounded-2xl border border-line bg-card px-3 py-3 shadow-card">
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        <div className="flex w-[72px] shrink-0 flex-col items-center gap-1.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => (ownStories.length ? openViewer(currentUser.id) : fileRef.current?.click())}
              className="rounded-full"
              aria-label={ownStories.length ? 'View your story' : 'Add a story'}
            >
              <StoryRing active={ownStories.length > 0} dashed={!ownStories.length}>
                <Avatar user={currentUser} size="story" />
              </StoryRing>
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Add to your story"
              className="absolute bottom-0 right-0 grid h-6 w-6 place-items-center rounded-full border-2 border-card bg-brand-600 text-white"
            >
              {adding ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-r-transparent" /> : <Icon name="plus" className="h-3.5 w-3.5" />}
            </button>
          </div>
          <span className="w-full truncate text-center text-[11px] font-semibold text-ink-soft">Your story</span>
        </div>
        {[...unseen, ...seen].map((id) => {
          const user = users.find((entry) => entry.id === id);
          if (!user) return null;
          const viewed = seen.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => openViewer(id)}
              className="flex w-[72px] shrink-0 flex-col items-center gap-1.5"
            >
              <StoryRing active={!viewed}>
                <Avatar user={user} size="story" />
              </StoryRing>
              <span className="w-full truncate text-center text-[11px] font-semibold text-ink-soft">{user.username}</span>
            </button>
          );
        })}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      {viewer && (
        <StoryViewer
          key={viewer.stories[viewer.startIndex]?.id || 'story'}
          stories={viewer.stories}
          users={users}
          startIndex={viewer.startIndex}
          onSeen={markStorySeen}
          onClose={() => setViewer(null)}
        />
      )}
    </section>
  );
}

function StoryRing({ children, active, dashed = false }) {
  return (
    <span
      className={cn(
        'grid h-16 w-16 place-items-center rounded-full p-[2px]',
        dashed ? 'border-2 border-dashed border-ink-faint/50' : active ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-brand-600' : 'bg-line',
      )}
    >
      <span className="grid h-full w-full place-items-center rounded-full bg-card p-[2px]">{children}</span>
    </span>
  );
}

function StoryViewer({ stories, users, startIndex, onClose, onSeen }) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const lengthRef = useRef(stories.length);
  const onCloseRef = useRef(onClose);
  const onSeenRef = useRef(onSeen);
  lengthRef.current = stories.length;
  onCloseRef.current = onClose;
  onSeenRef.current = onSeen;
  const story = stories[index];
  const user = users.find((entry) => entry.id === story?.userId);
  const mine = stories.filter((entry) => entry.userId === story?.userId);
  const localIndex = mine.findIndex((entry) => entry.id === story?.id);

  useEffect(() => {
    if (story) onSeenRef.current(story.id);
  }, [story]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const started = Date.now();
    let frame;
    const tick = () => {
      const value = Math.min(1, (Date.now() - started) / 4500);
      setProgress(value);
      if (value >= 1) {
        if (index >= lengthRef.current - 1) onCloseRef.current();
        else setIndex(index + 1);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [index]);

  function go(step) {
    setIndex((current) => {
      const next = current + step;
      if (next < 0) return current;
      if (next >= lengthRef.current) {
        onCloseRef.current();
        return current;
      }
      return next;
    });
  }

  if (!story || !user) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] bg-black text-white" role="dialog" aria-modal="true" aria-label={`${user.name} story`}>
      <div className="mx-auto flex h-full max-w-md flex-col">
        <div className="relative z-20 px-3 pb-3 pt-3">
          <div className="mb-3 flex gap-1">
            {mine.map((entry, barIndex) => (
              <span key={entry.id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
                <span
                  className="block h-full bg-white"
                  style={{
                    width: barIndex < localIndex ? '100%' : barIndex === localIndex ? `${progress * 100}%` : '0%',
                  }}
                />
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Avatar user={user} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{user.username}</p>
              <p className="text-xs text-white/70">{timeAgo(story.createdAt)}</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close story" className="rounded-full p-2 hover:bg-white/10">
              <Icon name="close" />
            </button>
          </div>
        </div>
        <div className="relative min-h-0 flex-1">
          <MediaImage src={story.image} alt="" className="absolute inset-0 h-full w-full" />
          <button type="button" aria-label="Previous story" className="absolute inset-y-0 left-0 z-10 w-1/3" onClick={() => go(-1)} />
          <button type="button" aria-label="Next story" className="absolute inset-y-0 right-0 z-10 w-1/3" onClick={() => go(1)} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
