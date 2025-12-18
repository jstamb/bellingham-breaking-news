import { Metadata } from 'next';
import TipForm from '@/components/forms/TipForm';

export const metadata: Metadata = {
  title: 'Submit a Tip',
  description: 'Send us a news tip. Share photos, videos, or information about stories we should cover in Bellingham and Whatcom County.',
};

export default function SubmitTipPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-16">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-secondary mb-4">
            Submit a Tip
          </h1>
          <p className="text-gray-600 text-lg font-serif">
            Seen something we should cover? Share your news tips, photos, videos, or documents directly with our news desk.
          </p>
        </header>

        <div className="bg-lightGray p-8 md:p-12 rounded-sm shadow-lg">
          <TipForm />
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            <strong>Your privacy matters.</strong> We protect the identity of our sources.
          </p>
        </div>
      </div>
    </div>
  );
}
