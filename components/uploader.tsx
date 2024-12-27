"use client";

// import { useResume } from "@/components/resume-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useResume } from "./resume-provider";

export function ResumeUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { setResumeData } = useResume();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/parse", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      const data = await res.json();

      const analyzed = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: data }),
      });

      const resumeData = await analyzed.json();
      setResumeData(resumeData);

      toast({
        title: "Resume analyzed",
        description: "Your resume has been successfully analyzed",
      });
    } catch (error) {
      console.error("Error processing resume:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to process resume",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const file = files[0];
    if (!file || !validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      });
      return;
    }

    await processFile(file);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.docx"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={handleFileSelect}
            disabled={isLoading}
          />
          <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
          <p className="mb-2 text-sm font-medium">
            {isLoading ? "Processing..." : "Drag and drop your resume here"}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports PDF and DOCX files
          </p>
          {isLoading && (
            <div className="mt-4">
              <Button disabled>
                <span className="animate-spin mr-2">⌛</span>
                Analyzing...
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
