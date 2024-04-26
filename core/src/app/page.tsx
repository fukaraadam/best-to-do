import { signIn } from '@/lib/auth';

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
      </div>
    </main>
  );
}
