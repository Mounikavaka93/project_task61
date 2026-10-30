import { Link } from 'react-router-dom';

export function RichText({ text, users = [] }) {
  if (!text) return null;
  const parts = text.split(/([#@][a-zA-Z0-9_]+)/g);

  return (
    <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink">
      {parts.map((part, index) => {
        if (part.startsWith('#')) {
          return (
            <Link
              key={`${part}-${index}`}
              to={`/explore?q=${encodeURIComponent(part)}`}
              className="font-bold text-brand-700 hover:underline"
            >
              {part}
            </Link>
          );
        }
        if (part.startsWith('@')) {
          const user = users.find((entry) => entry.username.toLowerCase() === part.slice(1).toLowerCase());
          if (user) {
            return (
              <Link
                key={`${part}-${index}`}
                to={`/profile/${user.username}`}
                className="font-bold text-brand-700 hover:underline"
              >
                {part}
              </Link>
            );
          }
        }
        return <span key={`${part}-${index}`}>{part}</span>;
      })}
    </p>
  );
}

export function MessageBody({ text }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);

  return (
    <p className="whitespace-pre-wrap break-words">
      {parts.map((part, index) => {
        if (!part.startsWith('http')) return <span key={index}>{part}</span>;
        let internal = null;
        try {
          const url = new URL(part);
          if (url.origin === window.location.origin) internal = `${url.pathname}${url.search}`;
        } catch {
          internal = null;
        }
        if (internal) {
          return (
            <Link key={index} to={internal} className="font-semibold underline">
              {part}
            </Link>
          );
        }
        return (
          <a key={index} href={part} target="_blank" rel="noreferrer" className="font-semibold underline">
            {part}
          </a>
        );
      })}
    </p>
  );
}
