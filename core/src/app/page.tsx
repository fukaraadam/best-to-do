import { signIn, signOut, auth } from '@/lib/auth';
import { sendTestMail } from '@/lib/mailer';

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <div className="prose lg:prose-xl my-4 text-center">
        <h1>Best To-Do</h1>
        <form
          action={async () => {
            'use server';
            await signIn();
          }}
        >
          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
        </form>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button type="submit" className="btn btn-primary">
            Sign Out
          </button>
        </form>
        <form
          action={async () => {
            'use server';
            await sendTestMail();
          }}
        >
          <button type="submit" className="btn btn-primary">
            Test Mail
          </button>
        </form>
        <User />
      </div>
    </main>
  );
}

export async function User() {
  const session = await auth();

  // const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
