import Link from 'next/link';

export default function TipSubmit() {
  return (
    <div className="bg-secondary p-12 rounded-sm text-white relative overflow-hidden group">
      <div className="relative z-10">
        <h4 className="font-headline text-3xl font-bold mb-4 italic tracking-tighter">
          Submit a Tip
        </h4>
        <p className="text-sm opacity-60 mb-10 font-serif leading-relaxed">
          Seen something we should cover? Upload photos, videos, or documents directly to our news desk.
        </p>
        <Link
          href="/submit-tip"
          className="inline-block bg-primary px-8 py-4 font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:bg-white hover:text-secondary transition-all"
        >
          Launch Upload Portal
        </Link>
      </div>
      <div className="absolute -right-20 -bottom-20 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000">
        <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0l-3.5 3.5H3.5V8.5L0 12l3.5 3.5v5h5L12 24l3.5-3.5h5v-5L24 12l-3.5-3.5v-5h-5L12 0z" />
        </svg>
      </div>
    </div>
  );
}
