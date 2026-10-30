export const NAV_ITEMS = [
  { id: 'home', to: '/', label: 'Home', short: 'Home', icon: 'home' },
  { id: 'explore', to: '/explore', label: 'Explore', short: 'Explore', icon: 'explore' },
  { id: 'notifications', to: '/notifications', label: 'Notifications', short: 'Alerts', icon: 'bell' },
  { id: 'messages', to: '/messages', label: 'Messages', short: 'Messages', icon: 'message' },
  { id: 'profile', to: '/profile', label: 'Profile', short: 'Profile', icon: 'user' },
];

export function isNavActive(id, pathname, username) {
  if (id === 'home') return pathname === '/' || pathname.startsWith('/post/');
  if (id === 'explore') return pathname.startsWith('/explore');
  if (id === 'notifications') return pathname.startsWith('/notifications');
  if (id === 'messages') return pathname.startsWith('/messages');
  if (id === 'profile') return pathname === '/profile' || pathname === `/profile/${username}`;
  return false;
}
