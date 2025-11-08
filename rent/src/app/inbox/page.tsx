import { Suspense } from 'react';
import InboxPage from './InboxPage';

export const dynamic = 'force-dynamic'; // Prevents static prerender

export default function Page() {
  return (
    <Suspense fallback={<div>Loading inbox...</div>}>
      <InboxPage />
    </Suspense>
  );
}
