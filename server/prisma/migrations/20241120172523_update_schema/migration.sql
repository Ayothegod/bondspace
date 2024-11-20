/*
  Warnings:

  - You are about to drop the column `chatId` on the `Space` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Avatar` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Avatar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "imageURL" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Avatar_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Avatar" ("createdAt", "description", "id", "imageURL", "ownerId") SELECT "createdAt", "description", "id", "imageURL", "ownerId" FROM "Avatar";
DROP TABLE "Avatar";
ALTER TABLE "new_Avatar" RENAME TO "Avatar";
CREATE UNIQUE INDEX "Avatar_ownerId_key" ON "Avatar"("ownerId");
CREATE TABLE "new_Space" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "spaceDuration" DATETIME,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "endedAt" DATETIME
);
INSERT INTO "new_Space" ("createdAt", "endedAt", "id", "name", "spaceDuration", "status", "updatedAt") SELECT "createdAt", "endedAt", "id", "name", "spaceDuration", "status", "updatedAt" FROM "Space";
DROP TABLE "Space";
ALTER TABLE "new_Space" RENAME TO "Space";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
