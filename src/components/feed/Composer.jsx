import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocial, useToast } from '../../context/SocialContext';
import { readFileAsDataURL } from '../../utils/files';
import { wait } from '../../utils/format';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { MediaImage } from '../ui/Media';

const MAX_LENGTH = 500;

export function Composer() {
  const { currentUser } = useAuth();
  const { createPost } = useSocial();
  const showToast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const textRef = useRef(null);
  const fileRef = useRef(null);
  const [text, setText] = useState('');
  const [media, setMedia] = useState(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!location.state?.compose) return;
    textRef.current?.focus();
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  async function onFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      showToast('Choose a photo or video');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('Please choose a file under 8 MB');
      return;
    }
    const url = await readFileAsDataURL(file);
    setMedia({
      type: file.type.startsWith('video/') ? 'video' : 'image',
      url,
    });
  }

  async function publish() {
    if (posting || (!text.trim() && !media)) return;
    setPosting(true);
    await wait(450);
    createPost({ text, media });
    setText('');
    setMedia(null);
    setPosting(false);
    showToast('Posted');
  }

  const remaining = MAX_LENGTH - text.length;

  return (
    <section className="rounded-2xl border border-line bg-card p-4 shadow-card">
      <div className="flex gap-3">
        <Avatar user={currentUser} size="md" />
        <label className="min-w-0 flex-1">
          <span className="sr-only">Create a post</span>
          <textarea
            ref={textRef}
            value={text}
            maxLength={MAX_LENGTH}
            rows={3}
            placeholder="Share what is worth seeing"
            onChange={(event) => setText(event.target.value)}
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-faint"
          />
        </label>
      </div>
      {media && (
        <div className="relative mt-3 overflow-hidden rounded-xl border border-line">
          {media.type === 'video' ? (
            <video src={media.url} className="max-h-80 w-full bg-black" controls playsInline />
          ) : (
            <MediaImage src={media.url} alt="Selected media preview" className="aspect-[5/4]" />
          )}
          <button
            type="button"
            onClick={() => setMedia(null)}
            aria-label="Remove media"
            className="absolute right-2 top-2 rounded-full bg-ink/70 p-1.5 text-white"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex min-w-0 items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
        >
          <Icon name="image" className="h-5 w-5" />
          Photo / video
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={onFile} />
        <span className={`ml-auto shrink-0 text-xs font-semibold tabular-nums ${remaining < 40 ? 'text-rose-600' : 'text-ink-faint'}`}>{remaining}</span>
        <Button size="sm" className="shrink-0" loading={posting} disabled={!text.trim() && !media} onClick={publish}>
          Post
        </Button>
      </div>
    </section>
  );
}
