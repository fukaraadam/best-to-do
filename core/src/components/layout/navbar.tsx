import Link from 'next/link';
import Image from 'next/image';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/floating-ui/popover';
import { signIn, signOut, auth } from '@/lib/auth';
import { UserAvatar } from './user-avatar';
// Images
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import logo from '@/app/icon3.png';

export default function Navbar() {
  return (
    <div className="px-1 pt-2">
      <nav className="navbar bg-base-300 rounded-3xl">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            <Image
              src={logo}
              alt="Cupapp logo"
              className="h-full w-fit rounded-xl"
            />
            Best To-Do
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal flex">
            <li>
              <User />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export async function User() {
  const session = await auth();

  if (!session)
    return (
      <form
        action={async () => {
          'use server';
          await signIn();
        }}
      >
        <button type="submit" className="btn-link whitespace-nowrap">
          Sign In
        </button>
      </form>
    );

  return (
    <Popover duration={{ open: 300, close: 100 }}>
      <PopoverTrigger className="data-[state=open]:bg-base-content group px-2 py-0 data-[state=open]:bg-opacity-10">
        <UserAvatar image={session.user?.image} />
        <ChevronDownIcon className="inline-block h-5 w-5 duration-300 ease-in-out group-data-[state=open]:rotate-180" />
      </PopoverTrigger>
      <PopoverContent
        as="ul"
        className="bg-base-200 menu rounded-box ms-0 opacity-0 duration-100 ease-out data-[status=open]:opacity-100 data-[status=open]:duration-300"
      >
        <li>
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <button
              type="submit"
              className="btn btn-primary btn-sm whitespace-nowrap"
            >
              Sign Out
            </button>
          </form>
        </li>
      </PopoverContent>
    </Popover>
  );
}
