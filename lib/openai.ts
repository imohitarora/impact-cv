import axios from "axios";

export async function analyzeResume(content: string) {
  try {
    const response = await llama({
      model: "llama3.2",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume analyzer. Analyze the resume and provide improvements.",
        },
        {
          role: "user",
          content: `Analyze this resume and provide: 
        1. Content improvements
        2. Professional language enhancements
        3. Skills highlighting suggestions
        4. Action verb optimization
        5. Industry-specific keyword recommendations
        
        Resume content: ${content}`,
        },
      ],
    });

    const analysis = response ?? "";

    return analysis;
  } catch (error) {
    console.error("[analyzeResume] Error:", error);
    throw error;
  }
}

export async function calculateMetrics(content: string) {
  try {
    const wordCount = content.split(/\s+/).length;

    const response = await llama({
      model: "llama3.2",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS system analyzer.",
        },
        {
          role: "user",
          content: `Analyze this resume and provide scores (0-100) for:
        1. ATS compatibility
        2. Industry relevance
        
        Resume content: ${content}`,
        },
      ],
    });

    const atsScore = parseInt(
      response.match(/ATS Compatibility Score: (\d+)/)?.[1] || "0"
    );
    const industryRelevance = parseInt(
      response.match(/Industry Relevance Score: (\d+)/)?.[1] || "0"
    );

    console.log("[calculateMetrics] ATS Score:", atsScore);
    console.log("[calculateMetrics] Industry Relevance:", industryRelevance);

    const metrics = {
      wordCount,
      atsScore,
      industryRelevance,
    };

    return metrics;
  } catch (error) {
    console.error("[calculateMetrics] Error:", error);
    throw error;
  }
}

interface LlamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context: number[];
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

interface LlamaMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface LlamaPrompt {
  model: string; // Model name (e.g., "llama3.2")
  messages: LlamaMessage[]; // Conversation messages
  stream?: boolean; // Optional: Enable or disable streaming
}

interface LlamaResponse {
  message: {
    role: "assistant";
    content: string;
  };
}

async function llama(prompt: LlamaPrompt): Promise<string> {
  try {
    const response = await axios.post("http://localhost:11434/api/chat", {
      model: prompt.model,
      messages: prompt.messages,
      stream: prompt.stream ?? false, // Default to false if not provided
    });

    // console.log("[llama] Full Response:", response);

    const data = response.data as LlamaResponse;
    return data.message.content; // Return the assistant's response content
  } catch (error: unknown) {
    console.error(
      "Error calling Ollama API:",
      error instanceof Error ? error.message : String(error)
    );
    throw new Error("Failed to generate response from Ollama");
  }
}
