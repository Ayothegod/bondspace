
  

  async function removeUserFromSpace(userId: string, spaceId: string) {
    await prisma.userSpace.delete({
      where: {
        userId_spaceId: {
          userId,
          spaceId,
        },
      },
    });
  
    console.log('User removed from space');
  }
  
  // Example usage
  await removeUserFromSpace("user-id-123", "space-id-456");

  
  async function getUsersInSpace(spaceId: string) {
    const users = await prisma.userSpace.findMany({
      where: {
        spaceId: spaceId,
      },
      include: {
        user: true, // Including the user details
      },
    });
  
    return users.map(userSpace => userSpace.user); // Return only user data
  }

  

  // ❓ Consider: Add constraints for chips to prevent negative values (can be enforced in code logic).

  // type String @db.VarChar(10) // Replace with enum in application code: ["fold", "bet", "raise", "call", "check"]