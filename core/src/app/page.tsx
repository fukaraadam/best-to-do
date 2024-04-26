import { signIn } from '@/lib/auth';

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <div className="prose lg:prose-xl my-4 text-center">
        <h1>Best To-Do</h1>
        <form
          action={async () => {
            'use server';
            await signIn('github');
          }}
        >
          <button type="submit">Signin with GitHub</button>
        </form>
      </div>
    </main>
  );
}
