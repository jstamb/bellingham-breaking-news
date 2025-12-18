interface NewsTickerProps {
  headlines?: string[];
}

const defaultHeadlines = [
  'Port of Bellingham Approves Waterfront Expansion',
  'WWU Sustainability Fund Reaches New Milestone',
  'Fairhaven Paving Project Enters Phase 2',
  'Traffic Alert: I-5 Northbound Delay at Samish Exit',
  'New Restaurant Opening on Holly Street',
];

export default function NewsTicker({ headlines = defaultHeadlines }: NewsTickerProps) {
  const tickerText = headlines.map(h => `• ${h}`).join(' ');

  return (
    <div className="bg-lightGray border-b border-gray-200 py-3 px-4 md:px-10 flex items-center gap-6">
      <span className="bg-primary text-white text-[10px] font-black uppercase px-3 py-1 rounded shadow-sm flex-shrink-0 tracking-widest">
        Flash News
      </span>
      <div className="overflow-hidden flex-1 relative h-5">
        <p className="absolute whitespace-nowrap animate-scroll text-[12px] font-bold text-secondary uppercase tracking-tight opacity-80">
          {tickerText} {tickerText}
        </p>
      </div>
    </div>
  );
}
