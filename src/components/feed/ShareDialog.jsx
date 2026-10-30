import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocial, useToast } from '../../context/SocialContext';
import { copyText } from '../../utils/clipboard';
import { Modal } from '../ui/Modal';
import { Avatar } from '../ui/Avatar';

export function ShareDialog({ post, open, onClose }) {
  const { users, currentUser } = useAuth();
  const { getOrCreateConversation, sendMessage, recordShare } = useSocial();
  const showToast = useToast();
  const navigate = useNavigate();
  const link = `${window.location.origin}/post/${post.id}`;
  const preview = post.text?.trim()
    ? post.text.trim().slice(0, 90)
    : post.media?.type === 'video'
      ? 'a video'
      : 'a photo';

  async function copy() {
    const ok = await copyText(link);
    if (ok) {
      recordShare(post.id);
      showToast('Link copied');
      onClose();
    } else {
      showToast('Could not copy the link');
    }
  }

  function sendTo(user) {
    const conversationId = getOrCreateConversation(user.id);
    sendMessage(conversationId, `Shared a post: ${preview}\n${link}`);
    recordShare(post.id);
    onClose();
    navigate(`/messages/${conversationId}`);
  }

  const people = users.filter((user) => user.id !== currentUser.id);

  return (
    <Modal open={open} onClose={onClose} title="Share">
      <button
        type="button"
        onClick={copy}
        className="mb-4 w-full rounded-xl border border-line px-4 py-3 text-left text-sm font-bold transition hover:bg-canvas"
      >
        Copy link
        <span className="mt-1 block truncate text-xs font-medium text-ink-soft">{link}</span>
      </button>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-faint">Send in a message</p>
      <ul className="space-y-1">
        {people.map((user) => (
          <li key={user.id}>
            <button
              type="button"
              onClick={() => sendTo(user)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-canvas"
            >
              <Avatar user={user} size="sm" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{user.name}</span>
                <span className="block truncate text-xs text-ink-soft">@{user.username}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
