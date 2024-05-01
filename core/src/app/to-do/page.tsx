import { signIn, auth } from '@/lib/auth';
import { TodoContext } from './todo-context';
import { TodoMenu } from './todo-menu';
import { TodoList } from './todo-list';
import { TodoModal } from './todo-modal';

export default async function ToDo() {
  const session = await auth();
  if (!session) {
    await signIn();
    return;
  }
  return (
    <main className="flex w-full flex-col items-center">
      <TodoContext>
        <TodoMenu />
        <TodoList />
        <TodoModal />
      </TodoContext>
    </main>
  );
}
