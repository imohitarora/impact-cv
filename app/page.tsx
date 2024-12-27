import { DashboardHeader } from "@/components/dashboard-header";
import { ResumeUploader } from "@/components/uploader";
import { ResumeWorkspace } from "@/components/workspace";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6">
          <ResumeUploader />
          <ResumeWorkspace />
        </div>
      </main>
    </div>
  );
}
