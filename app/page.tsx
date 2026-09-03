import HomeClient from '@/components/HomeClient';
import ServerResults from '@/components/ServerResults';
import { getInitialResults } from '@/lib/server-api';

// Revalidate results periodically so the crawler-visible HTML stays fresh
export const revalidate = 60;

export default async function Home() {
  const initialData = await getInitialResults();

  return (
    <>
      {/* Server-rendered first page: crawler-visible content without client JS.
          Hidden from users once the interactive client app hydrates. */}
      <div className="hidden">
        <ServerResults users={initialData?.data ?? []} totalItems={initialData?.meta?.totalItems} />
      </div>
      <HomeClient initialData={initialData} />
    </>
  );
}
