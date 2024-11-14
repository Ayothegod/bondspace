/*
  Warnings:

  - You are about to drop the column `isGroupChat` on the `GameSession` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GameSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rounds" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "isGroupGame" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_GameSession" ("createdAt", "gameType", "id", "name", "rounds", "status") SELECT "createdAt", "gameType", "id", "name", "rounds", "status" FROM "GameSession";
DROP TABLE "GameSession";
ALTER TABLE "new_GameSession" RENAME TO "GameSession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
