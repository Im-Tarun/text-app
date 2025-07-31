"use client";

import { signOut, useSession } from "next-auth/react";
// import Link from "";
import { Button } from "./ui/button";
import { memo } from "react";
import { ModeToggle } from "./ModeToggle";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";


const Navbar = () => {
  const { data: session, status } = useSession();
  

  return (
    <header className=" px-8 md:px-8  py-3 bg-[#d6d6d6] shadow-md text-black dark:bg-[#101828] dark:text-white">
      <nav className="flex  justify-between items-center gap-5 ">
        <Link className="font-extrabold text-2xl" href={"/"}>
          Anno-Text
        </Link>

        <div className="flex items-center gap-4">
        
          {status === "loading" ? (
            <>
               <Skeleton className="h-[35px] w-25 rounded-lg" />
               <Skeleton className="h-[35px] w-20 " />
            </>
          ) : session && session?.user ? (
            <>
              
                <div className="capitalize text-xl cursor-pointer">
                  {session.user?.name || session.user.username}
                </div>
                <Button variant={"secondary"} asChild>
                  <Link href={'/dashboard'} >
                  Dashboard
                </Link>
                </Button>
              
              <Button type="submit" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant={"ghost"} asChild>
                <Link href={"/sign-in"}>Log In</Link>
              </Button>
              <Button asChild>
                <Link href={"/sign-up"}>Sign Up</Link>
              </Button>
            </>
          )}
          
          <ModeToggle/>
        
        </div>
      </nav>
    </header>
  );
};

export default memo(Navbar);
