import type { PlatformId } from '../data/appData'

/** Recognizable brand marks for connection cards (SVG, not generic icons). */
export function PlatformLogo({
  id,
  className = 'h-10 w-10',
}: {
  id: PlatformId
  className?: string
}) {
  const common = `${className} shrink-0 rounded-xl object-contain`
  switch (id) {
    case 'tiktok':
      return (
        <span className={`${common} flex items-center justify-center bg-black p-2`} aria-hidden>
          <svg viewBox="0 0 24 24" className="h-full w-full" fill="none">
            <path
              d="M14.5 3c.6 2.2 2.1 3.8 4.3 4.2v2.4c-1.5-.1-2.9-.6-4.1-1.5v6.6c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.3 0 .7 0 1 .1v2.5c-.3-.1-.7-.2-1-.2-1.9 0-3.5 1.6-3.5 3.5S8.6 18 10.5 18s3.5-1.6 3.5-3.5V3h.5z"
              fill="#fff"
            />
            <path
              d="M14.5 3c.6 2.2 2.1 3.8 4.3 4.2v2.4c-1.5-.1-2.9-.6-4.1-1.5"
              fill="#25F4EE"
              opacity=".85"
            />
            <path
              d="M14.2 14.5c0 1.9-1.6 3.5-3.5 3.5S7.2 16.4 7.2 14.5 8.8 11 10.7 11c.3 0 .7.1 1 .2"
              fill="#FE2C55"
              opacity=".85"
            />
          </svg>
        </span>
      )
    case 'instagram':
      return (
        <span
          className={`${common} flex items-center justify-center p-2`}
          style={{
            background:
              'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
          }}
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="h-full w-full" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="#fff" strokeWidth="2" />
            <circle cx="12" cy="12" r="4.2" stroke="#fff" strokeWidth="2" />
            <circle cx="17.2" cy="6.8" r="1.2" fill="#fff" />
          </svg>
        </span>
      )
    case 'shopify':
      return (
        <span className={`${common} flex items-center justify-center bg-[#96BF48] p-2`} aria-hidden>
          <svg viewBox="0 0 24 24" className="h-full w-full" fill="#fff">
            <path d="M15.3 4.2c-.1 0-.3 0-.4.1l-1.1.3c-.2-.5-.5-.9-1.1-1-.6-.1-1.1.1-1.4.5l-.3.1c-1-.3-1.9-.2-2.5.3-.7.6-.9 1.6-.7 2.8l-2.2.6c-.4.1-.4.2-.4.5l1.5 11.5c0 .2.2.3.4.3h9.8c.2 0 .4-.1.4-.3l1.7-12.3c0-.2-.1-.4-.3-.5l-2.4-.6c.1-.5.1-1-.1-1.4-.2-.4-.5-.7-.9-.9zm-2.8.9.8-.2c.1.4.1.9 0 1.4l-1.2.3c.1-.7.2-1.2.4-1.5zm-1.5-.3c.2.4.3 1 .2 1.8l-1.6.4c-.2-1.1 0-1.9.5-2.3.3-.3.6-.3.9.1zm5.8 2.3-1.2 9.9H7.8L6.5 7.1l8.3-2.2.4.1c.3.1.5.3.6.7.1.4 0 .8-.2 1.4z" />
          </svg>
        </span>
      )
    case 'amazon':
      return (
        <span className={`${common} flex items-center justify-center bg-[#232F3E] p-1.5`} aria-hidden>
          <svg viewBox="0 0 48 24" className="h-full w-full">
            <text
              x="4"
              y="15"
              fill="#fff"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="12"
              fontWeight="700"
            >
              amazon
            </text>
            <path
              d="M8 18c6 3 18 3 28-2"
              fill="none"
              stroke="#FF9900"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )
    case 'whatsapp':
      return (
        <span className={`${common} flex items-center justify-center bg-[#25D366] p-2`} aria-hidden>
          <svg viewBox="0 0 24 24" className="h-full w-full" fill="#fff">
            <path d="M12 2a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l5.3-1.4A9.5 9.5 0 1 0 12 2zm5.3 13.5c-.2.6-1.2 1.1-1.9 1.2-.5.1-1.1.2-3.5-.7-3-1.2-4.9-4.3-5.1-4.5-.2-.2-1.4-1.9-1.4-3.6 0-1.7.9-2.5 1.2-2.8.3-.3.7-.4 1-.4h.7c.2 0 .5 0 .7.6l1 2.4c.1.2.1.5 0 .7l-.4.7c-.1.2-.3.4-.1.7.2.4.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.6 1.6.3.1.5.1.7-.1l.9-1.2c.2-.2.4-.2.7-.1l2.1 1c.3.1.5.2.5.4 0 .1 0 .6-.2 1.2z" />
          </svg>
        </span>
      )
    case 'stripe':
      return (
        <span className={`${common} flex items-center justify-center bg-[#635BFF] p-2`} aria-hidden>
          <svg viewBox="0 0 24 24" className="h-full w-full" fill="#fff">
            <path d="M13.6 10.4c-.8-.3-1.3-.5-1.3-.9 0-.4.4-.6 1-.6.8 0 1.6.3 2.3.8V7.3c-.7-.3-1.5-.5-2.4-.5-1.9 0-3.2 1-3.2 2.6 0 1.8 1.6 2.4 2.7 2.9.9.4 1.2.6 1.2 1 0 .4-.4.7-1.1.7-.9 0-1.9-.4-2.7-1v2.5c.8.4 1.8.6 2.8.6 2 0 3.4-1 3.4-2.7 0-1.9-1.6-2.5-2.7-2.9z" />
          </svg>
        </span>
      )
    case 'gmail':
      return (
        <span className={`${common} flex items-center justify-center bg-white ring-1 ring-line p-2`} aria-hidden>
          <svg viewBox="0 0 24 24" className="h-full w-full">
            <path fill="#EA4335" d="M3 6.5v11l5-3.8V9.2L3 6.5z" />
            <path fill="#34A853" d="M21 6.5v11l-5-3.8V9.2l5-2.7z" />
            <path fill="#FBBC05" d="M3 6.5 12 13l9-6.5H3z" />
            <path fill="#C5221F" d="M8 13.7v4.3l4-3 4 3v-4.3l-4 3-4-3z" />
            <path fill="#4285F4" d="M3 17.5h5v-3.8l-5 3.8zm13 0h5l-5-3.8v3.8z" />
          </svg>
        </span>
      )
    default:
      return (
        <span className={`${common} flex items-center justify-center bg-slate-200 text-xs font-bold`}>
          ?
        </span>
      )
  }
}
