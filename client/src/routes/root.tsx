/* eslint-disable @typescript-eslint/no-explicit-any */
import ThemeToggle from "@/components/build/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Link, useRouteError } from "react-router-dom";

export default function Root() {
  const [count, setCount] = useState(0);
  const { toast } = useToast();

  return (
    <div>
      <main className="flex items-center justify-center my-20 flex-col gap-4">
        <Button
          onClick={() => {
            toast({
              title: "Scheduled: Catch up",
              description: "Friday, February 10, 2023 at 5:57 PM",
            });
          }}
        >
          Show Toast
        </Button>

        <p className="text-primary">Hello Primary</p>

        <h1 className="text-4xl font-bold">
          Welcome to React.js and Hono.dev Starter!
        </h1>
        <p className="">
          Get started by editing <code className="">Routes/Root.js</code>
        </p>
        <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>

        <p>To get started on data fetching and mutation, head to: </p>
        <Link to="/learnswr" className="underline">
          Data Mutation
        </Link>

        <ThemeToggle />
      </main>
    </div>
  );
}

export async function Loader() {
  return null;
}

export function RootError() {
  const error: any = useRouteError();
  // console.error(error);

  return (
    <div className="grid h-screen place-content-center bg-white dark:bg-black px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200">404</h1>

        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Uh-oh!
        </p>

        <p className="mt-4 text-gray-500">
          {error?.data ? error.data : " We can't find this page."}
        </p>

        <Link to="/">
          <Button className="mt-6">Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
}
