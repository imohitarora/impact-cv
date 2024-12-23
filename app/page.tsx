import { DashboardHeader } from "@/components/dashboard-header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6"></div>
      </main>
    </div>
  );
}
