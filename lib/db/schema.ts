import { sql } from "drizzle-orm";
import { sqliteTable, text, int, index } from "drizzle-orm/sqlite-core";

export const resumes = sqliteTable(
  "resumes",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    content: text().notNull(),
    optimizedContent: text(),
    wordCount: int(),
    atsScore: int(),
    industryRelevance: int(),
    createdAt: text("timestamp")
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text("timestamp")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [index("resume_idx").on(t.id)]
);
