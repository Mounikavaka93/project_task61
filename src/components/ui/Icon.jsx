const paths = {
  home: (
    <>
      <path d="M4 10.75 12 4l8 6.75" />
      <path d="M6.5 9.8V20h11V9.8" />
      <path d="M10 20v-5.2h4V20" />
    </>
  ),
  explore: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="m15.2 8.8-1.3 4.1-4.1 1.3 1.3-4.1 4.1-1.3Z" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9.5a6 6 0 0 1 12 0c0 4.2 1.2 5.5 1.2 5.5H4.8S6 13.7 6 9.5Z" />
      <path d="M10 18.5a2 2 0 0 0 4 0" />
    </>
  ),
  message: (
    <>
      <path d="M5 6.5h14v9.2H8.2L5 18.2V6.5Z" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.2" r="3.1" />
      <path d="M5.8 19c1.2-2.8 3.3-4.1 6.2-4.1s5 1.3 6.2 4.1" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.25" />
      <path d="m16 16 4 4" />
    </>
  ),
  heart: <path d="M12 19.2s-6.4-3.9-6.4-8.1A3.55 3.55 0 0 1 12 8.2a3.55 3.55 0 0 1 6.4 2.9c0 4.2-6.4 8.1-6.4 8.1Z" />,
  heartFill: <path d="M12 19.2s-6.4-3.9-6.4-8.1A3.55 3.55 0 0 1 12 8.2a3.55 3.55 0 0 1 6.4 2.9c0 4.2-6.4 8.1-6.4 8.1Z" />,
  comment: (
    <>
      <path d="M6 6.5h12v8.2H9.2L6 17.4V6.5Z" />
    </>
  ),
  share: (
    <>
      <circle cx="7" cy="12" r="2.1" />
      <circle cx="16.5" cy="7.2" r="2.1" />
      <circle cx="16.5" cy="16.8" r="2.1" />
      <path d="m8.9 11.1 5.6-2.8" />
      <path d="m8.9 12.9 5.6 2.8" />
    </>
  ),
  bookmark: <path d="M7.5 4.8h9v14.2L12 15.6l-4.5 3.4V4.8Z" />,
  bookmarkFill: <path d="M7.5 4.8h9v14.2L12 15.6l-4.5 3.4V4.8Z" />,
  image: (
    <>
      <rect x="4.5" y="5.5" width="15" height="13" rx="2" />
      <circle cx="9" cy="10" r="1.3" />
      <path d="m7 16 3.2-3.1 2.2 2 2.2-2.4L19 16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  send: (
    <>
      <path d="m4.5 12 15-7-4.2 14-3.2-5.2L4.5 12Z" />
      <path d="m12.1 13.8 7.4-8.8" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5.5v13" />
      <path d="M5.5 12h13" />
    </>
  ),
  logout: (
    <>
      <path d="M10 7V5.2A1.2 1.2 0 0 1 11.2 4H19v16h-7.8A1.2 1.2 0 0 1 10 18.8V17" />
      <path d="M4 12h9.5" />
      <path d="m10.5 8.8 3.2 3.2-3.2 3.2" />
    </>
  ),
  more: (
    <>
      <circle cx="6" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  eye: (
    <>
      <path d="M3.8 12S6.6 7.2 12 7.2 20.2 12 20.2 12 17.4 16.8 12 16.8 3.8 12 3.8 12Z" />
      <circle cx="12" cy="12" r="2.2" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M4 5.5 19 19" />
      <path d="M9.2 9.4A6 6 0 0 0 7 12c0 .2 0 .4.1.6" />
      <path d="M10.4 16.2c.5.2 1 .3 1.6.3 4.2 0 6.8-4.5 6.8-4.5a12 12 0 0 0-2.2-2.6" />
      <path d="M9.8 6.9A8 8 0 0 1 12 6.7c5.4 0 8.2 4.8 8.2 4.8a14 14 0 0 1-1.5 2" />
    </>
  ),
  edit: (
    <>
      <path d="M4.8 16.8 5.6 13 14.2 4.4a1.6 1.6 0 0 1 2.3 0l1.1 1.1a1.6 1.6 0 0 1 0 2.3L9 16.4l-4.2.4Z" />
      <path d="m12.8 5.8 3.4 3.4" />
    </>
  ),
  trash: (
    <>
      <path d="M5.5 7.5h13" />
      <path d="M9 7.4V5.8h6v1.6" />
      <path d="M8 7.5 8.7 18h6.6l.7-10.5" />
    </>
  ),
  link: (
    <>
      <path d="M10 13.5 8.6 14.9a3 3 0 0 1-4.2-4.2l2.4-2.4a3 3 0 0 1 4.2 0" />
      <path d="M14 10.5 15.4 9.1a3 3 0 0 1 4.2 4.2l-2.4 2.4a3 3 0 0 1-4.2 0" />
    </>
  ),
  back: <path d="M15 5.5 8.5 12l6.5 6.5" />,
  playFill: <path d="M9 7.2v9.6l8-4.8-8-4.8Z" />,
  trending: (
    <>
      <path d="M4 16.5 9.2 11l3.3 3.2L20 7" />
      <path d="M14.5 7H20v5.5" />
    </>
  ),
  check: <path d="m5.5 12.5 4.2 4.2 8.8-9.2" />,
  aperture: (
    <>
      <circle cx="12" cy="12" r="7.25" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
    </>
  ),
};

export function Icon({ name, filled = false, className = 'h-6 w-6' }) {
  const key = filled ? `${name}Fill` : name;
  const graphic = paths[key] || paths[name];
  const isFill = filled && Boolean(paths[key]);

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={isFill ? 'currentColor' : 'none'}
      stroke={isFill ? 'none' : 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {graphic}
    </svg>
  );
}
