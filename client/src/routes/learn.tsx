import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { useRouteError } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LearnSwr() {
  const [dataLoading, setDataLoading] = useState(false);

  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR(
    "http://localhost:3000/api/todo",
    fetcher
  ); 

  const createTodo = async () => {
    setDataLoading(!dataLoading);
    const response = await axios.post("http://localhost:3000/api/todo", {
      id: "sdhhs6788",
      title: "Fetch Works",
    });
    console.log(response);

    mutate("http://localhost:3000/api/todo");
    setDataLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      <p>Click on the button below 👇</p>
      <div className="text-3xl font-bold">Create TODO</div>
      <Button disabled={dataLoading} onClick={createTodo}>
        Create User
      </Button>

      <div className="debug p-10">
        <p>Fetched data here</p>
        <div>{JSON.stringify(data, null, 2)}</div>

        <div>
          {isLoading && <div>loading...</div>}
          {error && <div>failed to load</div>}
        </div>
      </div>
    </div>
  );
}

export async function Loader() {
  return null;
  // throw new Response('Could not fetch data', { status: 404 })
}

export function ErrorBoundary() {
  let error: any = useRouteError();
  return (
    <div className="grid h-screen place-content-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200">{error.status}</h1>

        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Uh-oh!
        </p>

        <p className="mt-4 text-gray-500">{error.data}</p>

        <div className="flex gap-8">
          <Button className="mt-6" variant="outline">
            Go Home
          </Button>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
