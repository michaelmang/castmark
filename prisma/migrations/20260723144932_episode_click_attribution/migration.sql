/*
  Warnings:

  - Added the required column `slug` to the `LinkEpisode` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Click" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "linkId" TEXT NOT NULL,
    "episodeId" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrer" TEXT,
    "deviceType" TEXT,
    "country" TEXT,
    "userAgentRaw" TEXT,
    CONSTRAINT "Click_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Click_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Click" ("country", "deviceType", "id", "linkId", "referrer", "timestamp", "userAgentRaw") SELECT "country", "deviceType", "id", "linkId", "referrer", "timestamp", "userAgentRaw" FROM "Click";
DROP TABLE "Click";
ALTER TABLE "new_Click" RENAME TO "Click";
CREATE INDEX "Click_linkId_timestamp_idx" ON "Click"("linkId", "timestamp");
CREATE INDEX "Click_episodeId_timestamp_idx" ON "Click"("episodeId", "timestamp");
CREATE TABLE "new_LinkEpisode" (
    "linkId" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    PRIMARY KEY ("linkId", "episodeId"),
    CONSTRAINT "LinkEpisode_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LinkEpisode_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LinkEpisode" ("episodeId", "linkId") SELECT "episodeId", "linkId" FROM "LinkEpisode";
DROP TABLE "LinkEpisode";
ALTER TABLE "new_LinkEpisode" RENAME TO "LinkEpisode";
CREATE UNIQUE INDEX "LinkEpisode_slug_key" ON "LinkEpisode"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
