import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { label: "Total Users", value: "1,234", change: "+12%", icon: Users },
    { label: "Active Sessions", value: "156", change: "+8%", icon: TrendingUp },
    { label: "Materials Uploaded", value: "892", change: "+5%", icon: BookOpen },
    { label: "Quizzes Completed", value: "3,456", change: "+23%", icon: BarChart3 },
  ];

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: BookOpen, label: "Content", path: "/admin/content" },
    { icon: AlertCircle, label: "Reports", path: "/admin/reports" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const recentActivity = [
    { user: "John Doe", action: "Uploaded notes", time: "5 min ago", status: "success" },
    { user: "Jane Smith", action: "Completed quiz", time: "12 min ago", status: "success" },
    { user: "Mike Johnson", action: "Started chat session", time: "25 min ago", status: "success" },
    { user: "Sarah Williams", action: "Generated summary", time: "1 hour ago", status: "success" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border p-4 transition-all duration-300 fixed h-full md:relative z-40`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            className="text-xl font-bold"
          >
            StudyMate Admin
          </motion.div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8 p-0"
          >
            {sidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-3 h-10"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </Button>
          ))}
        </div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: sidebarOpen ? 1 : 0.5 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <Button
            variant="destructive"
            className="w-full justify-start gap-3"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Generate Report
            </Button>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold">A</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-xs text-green-600">{stat.change} from last month</p>
              </Card>
            ))}
          </motion.div>

          {/* Charts and Activity */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Usage Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">User Activity (Last 7 Days)</h3>
                <div className="space-y-4">
                  {[
                    { day: "Mon", value: 65 },
                    { day: "Tue", value: 78 },
                    { day: "Wed", value: 45 },
                    { day: "Thu", value: 82 },
                    { day: "Fri", value: 95 },
                    { day: "Sat", value: 70 },
                    { day: "Sun", value: 55 },
                  ].map((day, idx) => (
                    <div key={day.day} className="flex items-center gap-4">
                      <span className="w-12 text-sm font-medium">{day.day}</span>
                      <div className="flex-1 h-8 bg-muted rounded overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${day.value}%` }}
                          transition={{ duration: 0.5, delay: idx * 0.05 }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                      <span className="w-12 text-right text-sm">{day.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 sticky top-32">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button onClick={() => navigate("/admin/users")} className="w-full justify-start">
                    Add New User
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/admin/content")}
                    className="w-full justify-start"
                  >
                    Manage Content
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    View Reports
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/admin/settings")}
                    className="w-full justify-start"
                  >
                    Settings
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition"
                  >
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
