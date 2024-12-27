"use client";

import { useResume } from "@/components/resume-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResumeWorkspace() {
  const { resumeData } = useResume();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Workspace</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Original</h3>
                <div className="h-[600px] rounded-lg border p-4 overflow-auto">
                  {resumeData ? (
                    <pre className="whitespace-pre-wrap font-sans">
                      {resumeData.content}
                    </pre>
                  ) : (
                    <p className="text-muted-foreground">
                      Upload a resume to begin editing
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Optimized</h3>
                <div className="h-[600px] rounded-lg border p-4 overflow-auto">
                  {resumeData ? (
                    <pre className="whitespace-pre-wrap font-sans">
                      {resumeData.optimizedContent}
                    </pre>
                  ) : (
                    <p className="text-muted-foreground">
                      AI suggestions will appear here
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <p className="text-sm font-medium">Word Count</p>
                        <p className="text-sm text-muted-foreground">
                          {resumeData?.metrics.wordCount || 0}
                        </p>
                      </div>
                      <Progress
                        value={Math.min(
                          ((resumeData?.metrics.wordCount || 0) / 500) * 100,
                          100
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <p className="text-sm font-medium">ATS Compatibility</p>
                        <p className="text-sm text-muted-foreground">
                          {resumeData?.metrics.atsScore || "N/A"}%
                        </p>
                      </div>
                      <Progress
                        value={resumeData?.metrics.atsScore || 0}
                        className="bg-primary/20"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <p className="text-sm font-medium">
                          Industry Relevance
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {resumeData?.metrics.industryRelevance || "N/A"}%
                        </p>
                      </div>
                      <Progress
                        value={resumeData?.metrics.industryRelevance || 0}
                        className="bg-primary/20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  {resumeData?.improvements ? (
                    <div className="space-y-4">
                      <p className="text-sm">
                        Based on our analysis, here are the key areas for
                        improvement:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        {resumeData.improvements.map((improvement, index) => (
                          <li key={index}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Upload a resume to see AI-powered suggestions
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
