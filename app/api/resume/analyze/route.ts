import { NextResponse } from "next/server";
import { analyzeResume, calculateMetrics } from "@/lib/openai";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    const [analysis, metrics] = await Promise.all([
      analyzeResume(content.text),
      calculateMetrics(content.text),
    ]);

    const improvements = analysis
      ?.split("\n")
      ?.filter((line) => {
        const trimmedLine = line.trim();
        // Keep only lines that start with numbers and have actual content
        return /^\d+\.\s+\*\*[^*]+\*\*:/.test(trimmedLine);
      })
      .map((line) => {
        // Remove numbers and asterisks, clean up the text
        return line
          .replace(/^\d+\.\s+\*\*/, "") // Remove leading number and asterisks
          .replace(/\*\*:\s*/, "") // Remove trailing asterisks and colon
          .trim();
      });

    console.log("Improvements:", improvements);

    const id = nanoid();

    const record: typeof resumes.$inferInsert = {
      content: content.text,
      optimizedContent: analysis,
      wordCount: metrics.wordCount,
      atsScore: metrics.atsScore,
      industryRelevance: metrics.industryRelevance,
    };

    await db.insert(resumes).values(record);

    return NextResponse.json({
      id,
      content: record.content,
      optimizedContent: record.optimizedContent,
      metrics,
      improvements,
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
