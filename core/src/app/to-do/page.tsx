import { signIn, auth } from '@/lib/auth';
import { FileUploaderForm } from './client';

export default async function ToDo() {
  const session = await auth();
  if (!session) {
    await signIn();
    return;
  }
  return (
    <main className="flex flex-col items-center">
      <FileUploaderForm />
    </main>
  );
}
