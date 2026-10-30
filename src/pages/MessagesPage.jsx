import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { useTitle } from '../hooks/useTitle';
import { formatDay, formatTime, sameDay } from '../utils/format';
import { cn } from '../utils/cn';
import { Avatar } from '../components/ui/Avatar';
import { Icon } from '../components/ui/Icon';
import { inputClass } from '../components/ui/Button';
import { MessageBody } from '../components/ui/RichText';

export function MessagesPage() {
  useTitle('Messages');
  const { conversationId } = useParams();
  const { users, currentUser } = useAuth();
  const { conversations, sendMessage, markConversationRead } = useSocial();
  const [filter, setFilter] = useState('');
  const [draft, setDraft] = useState('');
  const endRef = useRef(null);

  const mine = useMemo(
    () =>
      conversations
        .filter((conversation) => conversation.participantIds.includes(currentUser.id))
        .sort((a, b) => lastActivity(b) - lastActivity(a)),
    [conversations, currentUser.id],
  );

  const visible = mine.filter((conversation) => {
    const other = otherUser(conversation, users, currentUser.id);
    const preview = conversation.messages.at(-1)?.text || '';
    const needle = filter.trim().toLowerCase();
    if (!needle) return true;
    return [other?.name, other?.username, preview].join(' ').toLowerCase().includes(needle);
  });

  const active = mine.find((conversation) => conversation.id === conversationId) || null;
  const partner = active ? otherUser(active, users, currentUser.id) : null;

  useEffect(() => {
    if (conversationId) markConversationRead(conversationId);
  }, [conversationId, markConversationRead]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [active?.messages.length, conversationId]);

  function submit() {
    if (!active || !draft.trim()) return;
    sendMessage(active.id, draft);
    setDraft('');
  }

  return (
    <div className="flex h-[calc(100dvh-7.5rem)] overflow-hidden bg-card sm:h-[calc(100dvh-10rem)] sm:rounded-2xl sm:border sm:border-line sm:shadow-card lg:h-[calc(100dvh-3rem)]">
      <section className={cn('w-full flex-col lg:flex lg:w-[320px] lg:border-r lg:border-line', conversationId ? 'hidden' : 'flex')}>
        <header className="border-b border-line px-4 py-3">
          <h1 className="text-lg font-extrabold">Messages</h1>
          <label className="relative mt-3 block">
            <span className="sr-only">Search conversations</span>
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Search chats"
              className={cn(inputClass(false), 'h-10 py-2 pl-9')}
            />
          </label>
        </header>
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {visible.length === 0 && <li className="px-4 py-8 text-sm text-ink-soft">No conversations found.</li>}
          {visible.map((conversation) => {
            const person = otherUser(conversation, users, currentUser.id);
            const last = conversation.messages.at(-1);
            const unread = conversation.unreadBy?.[currentUser.id] || 0;
            if (!person) return null;
            return (
              <li key={conversation.id}>
                <Link
                  to={`/messages/${conversation.id}`}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 transition hover:bg-canvas',
                    conversation.id === conversationId && 'bg-brand-50',
                  )}
                >
                  <Avatar user={person} size="md" online={person.online} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={cn('truncate text-sm', unread ? 'font-extrabold' : 'font-bold')}>{person.name}</span>
                      {last && <span className="shrink-0 text-[11px] font-semibold text-ink-faint">{formatTime(last.createdAt)}</span>}
                    </span>
                    <span className={cn('block truncate text-xs', unread ? 'font-bold text-ink' : 'text-ink-soft')}>
                      {last ? last.text : 'No messages yet'}
                    </span>
                  </span>
                  {unread > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={cn('min-w-0 flex-1 flex-col', conversationId ? 'flex' : 'hidden lg:flex')}>
        {!active || !partner ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <h2 className="font-display text-3xl">Your messages</h2>
              <p className="mt-2 text-sm text-ink-soft">Choose a conversation, or start one from someone’s profile.</p>
            </div>
          </div>
        ) : (
          <>
            <header className="flex items-center gap-3 border-b border-line px-3 py-3 sm:px-4">
              <Link to="/messages" aria-label="Back to messages" className="rounded-xl p-2 text-ink hover:bg-canvas lg:hidden">
                <Icon name="back" />
              </Link>
              <Link to={`/profile/${partner.username}`} className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar user={partner} size="sm" online={partner.online} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-extrabold">{partner.name}</span>
                  <span className="block truncate text-xs text-ink-soft">@{partner.username}</span>
                </span>
              </Link>
            </header>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-4">
              {active.messages.length === 0 && (
                <p className="text-center text-sm text-ink-soft">No messages yet. Say hello.</p>
              )}
              {active.messages.map((message, index) => {
                const mineMessage = message.senderId === currentUser.id;
                const previous = active.messages[index - 1];
                const showDay = !previous || !sameDay(previous.createdAt, message.createdAt);
                return (
                  <div key={message.id}>
                    {showDay && (
                      <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                        {formatDay(message.createdAt)}
                      </p>
                    )}
                    <div className={cn('flex', mineMessage ? 'justify-end' : 'justify-start')}>
                      <div
                        className={cn(
                          'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed sm:max-w-[70%]',
                          mineMessage ? 'rounded-br-md bg-brand-600 text-white' : 'rounded-bl-md bg-canvas text-ink',
                        )}
                      >
                        <MessageBody text={message.text} />
                        <p className={cn('mt-1 text-[10px] font-semibold', mineMessage ? 'text-white/70' : 'text-ink-faint')}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>
            <form
              className="flex items-end gap-2 border-t border-line p-3"
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              <label className="min-w-0 flex-1">
                <span className="sr-only">Message</span>
                <textarea
                  rows={1}
                  value={draft}
                  maxLength={1000}
                  placeholder="Write a message"
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      submit();
                    }
                  }}
                  className="max-h-32 min-h-11 w-full resize-none rounded-2xl border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
                />
              </label>
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send message"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-40"
              >
                <Icon name="send" className="h-5 w-5" />
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

function otherUser(conversation, users, currentId) {
  const id = conversation.participantIds.find((participant) => participant !== currentId);
  return users.find((user) => user.id === id) || null;
}

function lastActivity(conversation) {
  const last = conversation.messages.at(-1);
  return last ? new Date(last.createdAt).getTime() : 0;
}
