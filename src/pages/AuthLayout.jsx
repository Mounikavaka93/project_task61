import { Logo } from '../components/ui/Logo';

const points = [
  {
    title: 'A feed with a point of view',
    text: 'Posts from people you follow, with a few suggestions when you want something new.',
  },
  {
    title: 'Activity that stays readable',
    text: 'Likes, comments, follows, and mentions collected in one calm list.',
  },
  {
    title: 'Messages without the maze',
    text: 'A straightforward chat list and a composer that stays out of the way.',
  },
];

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="bg-sidebar px-5 pb-8 pt-8 text-white lg:hidden">
        <Logo light />
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">A quieter place to share what is worth seeing.</p>
      </div>
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-sidebar p-12 text-white lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="pointer-events-none absolute -left-16 top-24 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <Logo light />
        <div className="relative max-w-md">
          <p className="font-display text-4xl leading-tight xl:text-5xl">Share the frame, not the noise.</p>
          <ul className="mt-8 space-y-5">
            {points.map((point) => (
              <li key={point.title}>
                <p className="font-bold">{point.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/65">{point.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/50">Demo data stays in this browser. There is no server.</p>
      </section>
      <div className="flex items-center justify-center px-4 py-8 sm:px-8 sm:py-12">
        <div className="w-full max-w-[440px]">{children}</div>
      </div>
    </div>
  );
}
