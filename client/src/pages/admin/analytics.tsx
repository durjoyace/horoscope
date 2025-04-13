import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AnalyticsDashboard from "./analytics-dashboard";

export default function AnalyticsPage() {
  return (
    <AdminLayout title="Analytics">
      <AnalyticsDashboard />
    </AdminLayout>
  );
}