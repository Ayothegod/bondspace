

// const getChats = async () => {
//   const { error, data, isLoading } = await fetcher(async () => await getUserChats());

//   if (error) {
//     return toast({
//       description: `${error}`,
//       variant: "destructive",
//     });
//   }
//   setLoadingChats(isLoading)
//   // console.log("All user chat:", data?.data);
//   setChats("updateChat", undefined, data?.data);
// };