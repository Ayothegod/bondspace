export default function Space() {
  // const [chatName, setChatName] = useState("");
  // const [startChatNameUpdate, setStartChatNameUpdate] = useState(false);

  // const renameChat = async () => {
  //   const { error, data, isLoading } = await fetcher(
  //     async () => await updateChatName(chat?.id as string, chatName)
  //   );
  //   if (error) {
  //     return toast({
  //       description: `${error}`,
  //       variant: "destructive",
  //     });
  //   }
  //   toast({
  //     description: `${data?.message}`,
  //   });

  //   setStartChatNameUpdate(!startChatNameUpdate);
  //   setChatName("");
  //   setLoadingChat(isLoading);
  //   setChat("updateChat", data?.data);
  // };

  // update chat name
  {
    /* <Pen
                    className="h-4 w-4 text-special cursor-pointer"
                    onClick={() => setStartChatNameUpdate(!startChatNameUpdate)}
                {startChatNameUpdate && (
                  <aside className="flex items-center flex-col gap-1 flex-grow">
                    <Input
                      value={chatName}
                      placeholder="Update Chat name"
                      type="text"
                      onChange={(e) => setChatName(e.target.value)}
                    />
                    <Button onClick={renameChat}>Update name</Button>
                  </aside>
                )}
                  /> */
  }

  return <div>Space</div>;
}
