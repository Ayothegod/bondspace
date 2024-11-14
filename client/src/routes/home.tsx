import CustomLabel from "@/components/build/CustomLabel";
import { Button } from "@/components/ui/button";
import { MessagesSquare, Search } from "lucide-react";

export default function Home() {
  const chats = [];

  return (
    <div className="min-h-screen">
      <div className="sm:w-[16em] p-3 md:w-[20em] border h-f">
        <div>
          <h1 className="text-2xl text-white font-semibold">Chats</h1>
        </div>

        <div className="relative mt-4">
          <Search className="h-4 w-4 absolute top-2" />
          <input
            type="text"
            className="w-full bg-transparent border border-white/10 rounded-md h-10 outline-none focus:ring-2 focus:ring-background-top"
          />
        </div>

        <div className="mt-4">
          <CustomLabel>
            <MessagesSquare className="h-4 w-4" /> All Chats
          </CustomLabel>

          <div>
            {chats.length < 1 ? (
              <div>
                <p>You don't have any active chats yet</p>
                <Button>Get started</Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
