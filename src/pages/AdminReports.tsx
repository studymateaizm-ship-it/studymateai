import { motion } from "framer-motion";
import { ArrowLeft, Download, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const AdminReports = () => {
  const navigate = useNavigate();

  const reports = [
    {
      title: "User Performance Report",
      description: "Detailed analytics on user engagement and learning outcomes",
      period: "Monthly",
      lastGenerated: "2024-02-15",
      icon: "📊",
    },
    {
      title: "Content Analytics",
      description: "View and content usage statistics across all materials",
      period: "Weekly",
      lastGenerated: "2024-02-14",
      icon: "📈",
    },
    {
      title: "System Health Report",
      description: "Performance metrics, uptime, and system diagnostics",
      period: "Daily",
      lastGenerated: "2024-02-15",
      icon: "⚙️",
    },
    {
      title: "Financial Report",
      description: "Revenue, subscriptions, and payment analytics",
      period: "Monthly",
      lastGenerated: "2024-02-01",
      icon: "💰",
    },
    {
      title: "User Feedback & Issues",
      description: "Compiled feedback from users and reported issues",
      period: "Weekly",
      lastGenerated: "2024-02-14",
      icon: "💬",
    },
    {
      title: "Growth Report",
      description: "User growth trends and platform expansion metrics",
      period: "Monthly",
      lastGenerated: "2024-02-15",
      icon: "📈",
    },
  ];

  const metrics = [
    { label: "Total Page Views", value: "45,234", change: "+12%" },
    { label: "Avg Session Duration", value: "24m 32s", change: "+8%" },
    { label: "Bounce Rate", value: "32%", change: "-5%" },
    { label: "Conversion Rate", value: "8.2%", change: "+3%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {metrics.map((metric, idx) => (
            <Card key={idx} className="p-4">
              <p className="text-muted-foreground text-sm mb-1">{metric.label}</p>
              <p className="text-2xl font-bold mb-1">{metric.value}</p>
              <p className="text-xs text-green-600">{metric.change}</p>
            </Card>
          ))}
        </motion.div>

        {/* Alert Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Urgent Notice</h3>
              <p className="text-sm text-muted-foreground">
                System maintenance scheduled for Feb 20, 2-4 AM UTC. Expected downtime: 2 hours.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Available Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Available Reports</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report, idx) => (
              <motion.div
                key={report.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                  <div className="text-4xl mb-4">{report.icon}</div>
                  <h3 className="font-bold mb-1 flex-1">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {report.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{report.period}</span>
                    <span>Generated: {report.lastGenerated}</span>
                  </div>
                  <Button className="w-full mt-4 gap-2">
                    <Download className="h-4 w-4" />
                    Generate
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Custom Report Builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Create Custom Report</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Report Type</label>
                <select className="w-full px-4 py-2 rounded border border-border bg-background">
                  <option>User Analytics</option>
                  <option>Content Performance</option>
                  <option>Financial Data</option>
                  <option>System Performance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date Range</label>
                <select className="w-full px-4 py-2 rounded border border-border bg-background">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>Custom Range</option>
                </select>
              </div>
            </div>
            <Button className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Generate Custom Report
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminReports;
