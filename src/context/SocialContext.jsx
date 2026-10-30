import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getInitialData, saveSocial } from '../data/storage';
import { useAuth } from './AuthContext';
import { extractTags, uid } from '../utils/format';

const SocialContext = createContext(null);
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message) => {
    const id = uid();
    setToasts((current) => [...current, { id, message }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="pointer-events-none fixed bottom-24 left-1/2 z-[80] flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2 lg:bottom-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="animate-rise rounded-2xl bg-ink px-4 py-3 text-center text-sm font-semibold text-white shadow-pop"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function SocialProvider({ children }) {
  const initial = getInitialData().social;
  const { currentUser, users, applyFollow } = useAuth();
  const [posts, setPosts] = useState(initial.posts);
  const [stories, setStories] = useState(initial.stories);
  const [notifications, setNotifications] = useState(initial.notifications);
  const [conversations, setConversations] = useState(initial.conversations);

  useEffect(() => {
    saveSocial({ posts, stories, notifications, conversations });
  }, [posts, stories, notifications, conversations]);

  const pushNotification = useCallback((note) => {
    setNotifications((current) => [
      {
        id: uid(),
        postId: null,
        text: '',
        createdAt: new Date().toISOString(),
        read: false,
        ...note,
      },
      ...current,
    ]);
  }, []);

  const createPost = useCallback(
    ({ text, media }) => {
      if (!currentUser) return;
      const post = {
        id: uid(),
        userId: currentUser.id,
        text: text.trim(),
        media,
        tags: extractTags(text),
        likes: [],
        comments: [],
        shares: 0,
        savedBy: [],
        createdAt: new Date().toISOString(),
      };
      setPosts((current) => [post, ...current]);
      return post;
    },
    [currentUser],
  );

  const toggleLike = useCallback(
    (postId) => {
      if (!currentUser) return;
      const post = posts.find((entry) => entry.id === postId);
      if (!post) return;
      const liked = post.likes.includes(currentUser.id);
      setPosts((current) =>
        current.map((entry) => {
          if (entry.id !== postId) return entry;
          return {
            ...entry,
            likes: liked ? entry.likes.filter((id) => id !== currentUser.id) : [...entry.likes, currentUser.id],
          };
        }),
      );
      if (post.userId === currentUser.id) return;
      if (liked) {
        setNotifications((current) =>
          current.filter(
            (note) => !(note.type === 'like' && note.postId === postId && note.fromUserId === currentUser.id),
          ),
        );
      } else {
        pushNotification({
          userId: post.userId,
          type: 'like',
          fromUserId: currentUser.id,
          postId,
        });
      }
    },
    [currentUser, posts, pushNotification],
  );

  const toggleSave = useCallback(
    (postId) => {
      if (!currentUser) return;
      setPosts((current) =>
        current.map((post) => {
          if (post.id !== postId) return post;
          const saved = post.savedBy.includes(currentUser.id);
          return {
            ...post,
            savedBy: saved ? post.savedBy.filter((id) => id !== currentUser.id) : [...post.savedBy, currentUser.id],
          };
        }),
      );
    },
    [currentUser],
  );

  const addComment = useCallback(
    (postId, text) => {
      if (!currentUser) return;
      const clean = text.trim();
      if (!clean) return;
      const post = posts.find((entry) => entry.id === postId);
      const comment = {
        id: uid(),
        userId: currentUser.id,
        text: clean,
        createdAt: new Date().toISOString(),
      };
      setPosts((current) =>
        current.map((entry) => (entry.id === postId ? { ...entry, comments: [...entry.comments, comment] } : entry)),
      );
      const mentions = (clean.match(/@([a-zA-Z0-9_]+)/g) || []).map((mention) => mention.slice(1).toLowerCase());
      const notified = new Set();
      if (post && post.userId !== currentUser.id) {
        const author = users.find((user) => user.id === post.userId);
        pushNotification({
          userId: post.userId,
          type: mentions.includes(author?.username) ? 'mention' : 'comment',
          fromUserId: currentUser.id,
          postId,
          text: clean,
        });
        notified.add(post.userId);
      }
      mentions.forEach((username) => {
        const person = users.find((user) => user.username === username);
        if (!person || person.id === currentUser.id || notified.has(person.id)) return;
        pushNotification({
          userId: person.id,
          type: 'mention',
          fromUserId: currentUser.id,
          postId,
          text: clean,
        });
        notified.add(person.id);
      });
    },
    [currentUser, posts, pushNotification, users],
  );

  const deleteComment = useCallback((postId, commentId) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) } : post,
      ),
    );
  }, []);

  const deletePost = useCallback((postId) => {
    setPosts((current) => current.filter((post) => post.id !== postId));
  }, []);

  const recordShare = useCallback(
    (postId) => {
      if (!currentUser) return;
      const post = posts.find((entry) => entry.id === postId);
      setPosts((current) => current.map((entry) => (entry.id === postId ? { ...entry, shares: entry.shares + 1 } : entry)));
      if (post && post.userId !== currentUser.id) {
        pushNotification({
          userId: post.userId,
          type: 'share',
          fromUserId: currentUser.id,
          postId,
        });
      }
    },
    [currentUser, posts, pushNotification],
  );

  const addStory = useCallback(
    (image) => {
      if (!currentUser) return null;
      const story = {
        id: uid(),
        userId: currentUser.id,
        mediaType: 'image',
        image,
        createdAt: new Date().toISOString(),
        seenBy: [currentUser.id],
      };
      setStories((current) => [story, ...current]);
      return story;
    },
    [currentUser],
  );

  const markStorySeen = useCallback(
    (storyId) => {
      if (!currentUser) return;
      setStories((current) => {
        const story = current.find((entry) => entry.id === storyId);
        if (!story || story.seenBy.includes(currentUser.id)) return current;
        return current.map((entry) =>
          entry.id === storyId ? { ...entry, seenBy: [...entry.seenBy, currentUser.id] } : entry,
        );
      });
    },
    [currentUser],
  );

  const markNotificationRead = useCallback((id) => {
    setNotifications((current) => current.map((note) => (note.id === id ? { ...note, read: true } : note)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    if (!currentUser) return;
    setNotifications((current) =>
      current.map((note) => (note.userId === currentUser.id ? { ...note, read: true } : note)),
    );
  }, [currentUser]);

  const getOrCreateConversation = useCallback(
    (otherUserId) => {
      if (!currentUser) return null;
      const existing = conversations.find(
        (conversation) =>
          conversation.participantIds.includes(currentUser.id) && conversation.participantIds.includes(otherUserId),
      );
      if (existing) return existing.id;
      const id = uid();
      setConversations((current) => [
        {
          id,
          participantIds: [currentUser.id, otherUserId],
          unreadBy: { [currentUser.id]: 0, [otherUserId]: 0 },
          messages: [],
        },
        ...current,
      ]);
      return id;
    },
    [conversations, currentUser],
  );

  const sendMessage = useCallback(
    (conversationId, text) => {
      if (!currentUser) return;
      const clean = text.trim();
      if (!clean) return;
      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.id !== conversationId) return conversation;
          const otherId = conversation.participantIds.find((id) => id !== currentUser.id);
          return {
            ...conversation,
            unreadBy: {
              ...conversation.unreadBy,
              [currentUser.id]: 0,
              [otherId]: (conversation.unreadBy?.[otherId] || 0) + 1,
            },
            messages: [
              ...conversation.messages,
              { id: uid(), senderId: currentUser.id, text: clean, createdAt: new Date().toISOString() },
            ],
          };
        }),
      );
    },
    [currentUser],
  );

  const markConversationRead = useCallback(
    (conversationId) => {
      if (!currentUser) return;
      setConversations((current) => {
        const conversation = current.find((entry) => entry.id === conversationId);
        if (!conversation || (conversation.unreadBy?.[currentUser.id] || 0) === 0) return current;
        return current.map((entry) =>
          entry.id === conversationId
            ? { ...entry, unreadBy: { ...entry.unreadBy, [currentUser.id]: 0 } }
            : entry,
        );
      });
    },
    [currentUser],
  );

  const toggleFollow = useCallback(
    (targetId) => {
      if (!currentUser || targetId === currentUser.id) return;
      const wasFollowing = currentUser.following.includes(targetId);
      applyFollow(targetId);
      if (wasFollowing) {
        setNotifications((current) =>
          current.filter(
            (note) => !(note.type === 'follow' && note.userId === targetId && note.fromUserId === currentUser.id),
          ),
        );
      } else {
        pushNotification({ userId: targetId, type: 'follow', fromUserId: currentUser.id });
      }
    },
    [applyFollow, currentUser, pushNotification],
  );

  const myNotifications = useMemo(
    () => notifications.filter((note) => note.userId === currentUser?.id),
    [notifications, currentUser],
  );

  const unreadNotifications = myNotifications.filter((note) => !note.read).length;
  const unreadMessages = conversations.reduce(
    (sum, conversation) => sum + (currentUser ? conversation.unreadBy?.[currentUser.id] || 0 : 0),
    0,
  );

  const value = {
    posts,
    stories,
    notifications: myNotifications,
    conversations,
    unreadNotifications,
    unreadMessages,
    createPost,
    toggleLike,
    toggleSave,
    addComment,
    deleteComment,
    deletePost,
    recordShare,
    addStory,
    markStorySeen,
    markNotificationRead,
    markAllNotificationsRead,
    getOrCreateConversation,
    sendMessage,
    markConversationRead,
    toggleFollow,
  };

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (!context) throw new Error('useSocial must be used within SocialProvider');
  return context;
}
