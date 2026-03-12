import { Suspense } from "react";
import TasksClient from "@/components/TasksClient";

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-slate-900 border-t-transparent"></div></div>}>
      <TasksClient />
    </Suspense>
  );
}
