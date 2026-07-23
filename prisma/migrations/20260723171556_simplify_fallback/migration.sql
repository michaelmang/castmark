/*
  Warnings:

  - You are about to drop the column `fallbackBehavior` on the `Link` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Link" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sponsorId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "destinationUrl" TEXT NOT NULL,
    "discountCode" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "fallbackUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Link_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Link" ("createdAt", "destinationUrl", "discountCode", "endDate", "fallbackUrl", "id", "slug", "sponsorId", "startDate", "updatedAt") SELECT "createdAt", "destinationUrl", "discountCode", "endDate", "fallbackUrl", "id", "slug", "sponsorId", "startDate", "updatedAt" FROM "Link";
DROP TABLE "Link";
ALTER TABLE "new_Link" RENAME TO "Link";
CREATE UNIQUE INDEX "Link_slug_key" ON "Link"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
