import { signIn, auth } from '@/lib/auth';
import { TodoList, TodoMenu } from './todo-client';

export default async function ToDo() {
  const session = await auth();
  if (!session) {
    await signIn();
    return;
  }
  return (
    <main className="flex w-full flex-col items-center">
      <TodoMenu />
      <TodoList />
    </main>
  );
}
