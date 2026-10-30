import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearSession, getInitialData, readSession, saveUsers, writeSession } from '../data/storage';
import { uid } from '../utils/format';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => getInitialData().users);
  const [session, setSession] = useState(() => readSession());

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  const currentUser = useMemo(
    () => users.find((user) => user.id === session?.userId) || null,
    [users, session],
  );

  const login = ({ email, password, remember }) => {
    const match = users.find(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password,
    );
    if (!match) return { ok: false, error: 'Those credentials do not match our records.' };
    const next = { userId: match.id };
    writeSession(next, remember);
    setSession(next);
    return { ok: true };
  };

  const signup = (fields, remember) => {
    const user = {
      id: uid(),
      name: fields.name.trim(),
      username: fields.username.trim().toLowerCase(),
      email: fields.email.trim().toLowerCase(),
      password: fields.password,
      avatar: '',
      cover: '',
      bio: '',
      location: '',
      website: '',
      following: [],
      followers: [],
      online: true,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, user]);
    const next = { userId: user.id };
    writeSession(next, remember);
    setSession(next);
    return user;
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  const updateProfile = (patch) => {
    if (!currentUser) return;
    setUsers((prev) => prev.map((user) => (user.id === currentUser.id ? { ...user, ...patch } : user)));
  };

  const applyFollow = (targetId) => {
    if (!currentUser || targetId === currentUser.id) return;
    setUsers((prev) => {
      const me = prev.find((user) => user.id === currentUser.id);
      if (!me) return prev;
      const isFollowing = me.following.includes(targetId);
      return prev.map((user) => {
        if (user.id === me.id) {
          return {
            ...user,
            following: isFollowing ? user.following.filter((id) => id !== targetId) : [...user.following, targetId],
          };
        }
        if (user.id === targetId) {
          return {
            ...user,
            followers: isFollowing
              ? user.followers.filter((id) => id !== me.id)
              : [...new Set([...user.followers, me.id])],
          };
        }
        return user;
      });
    });
  };

  const value = {
    users,
    currentUser,
    login,
    signup,
    logout,
    updateProfile,
    applyFollow,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
