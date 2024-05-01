import Link from 'next/link';
import Image from 'next/image';
import todoList from '@/assets/images/todo-board.webp';

export default function Home() {
  return (
    <main className="container mx-auto flex flex-col flex-wrap items-center p-8 md:flex-row">
      {/* Left Col */}
      <div className="flex w-full flex-col justify-center overflow-y-hidden lg:items-start xl:w-2/5">
        <h1 className="my-4 text-center text-3xl font-bold leading-tight text-white opacity-75 md:text-left md:text-5xl">
          Best{' '}
          <span className="bg-gradient-to-r from-green-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            To-Do{' '}
          </span>
          app to track your list!
        </h1>
        <p className="mb-8 text-center text-base leading-normal md:text-left md:text-2xl">
          List, setup notifications, check your progress, and more!
        </p>
        <div className="flex w-full items-center justify-center">
          <Link href="/to-do" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>

      {/* Right Col */}
      <div className="w-full overflow-hidden p-12 xl:w-3/5">
        <Image
          src={todoList}
          alt="To-Do List Board"
          className="relative mx-auto w-full -rotate-6 transform transition duration-700 ease-in-out hover:rotate-6 hover:scale-105 md:w-4/5"
        />
      </div>
    </main>
  );
}
