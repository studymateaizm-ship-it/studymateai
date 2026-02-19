import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Content {
  id: number;
  title: string;
  type: "quiz" | "material" | "course";
  category: string;
  createdBy: string;
  createdDate: string;
  status: "published" | "draft" | "archived";
  views: number;  
}

const AdminContent = () => {
  const navigate = useNavigate();
  const [contents, setContents] = useState<Content[]>([
    {
      id: 1,
      title: "Biology - Photosynthesis",
      type: "material",
      category: "Science",
      createdBy: "Admin",
      createdDate: "2024-02-10",
      status: "published",
      views: 234,
    },
    {
      id: 2,
      title: "Math - Calculus Basics",
      type: "course",
      category: "Mathematics",
      createdBy: "Admin",
      createdDate: "2024-02-08",
      status: "published",
      views: 456,
    },
    {
      id: 3,
      title: "Physics Quiz - Chapter 5",
      type: "quiz",
      category: "Science",
      createdBy: "Admin",
      createdDate: "2024-02-05",
      status: "draft",
      views: 89,
    },
    {
      id: 4,
      title: "Chemistry - Elements",
      type: "material",
      category: "Science",
      createdBy: "Admin",
      createdDate: "2024-02-01",
      status: "published",
      views: 567,
    },
  ]);

  const toggleStatus = (id: number, newStatus: "published" | "draft" | "archived") => {
    setContents(
      contents.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const deleteContent = (id: number) => {
    setContents(contents.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
        <div className="flex items-center justify-between">
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
            <h1 className="text-3xl font-bold">Content Management</h1>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Content
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-4 gap-4"
        >
          <Card className="p-4 text-center">
            <p className="text-muted-foreground text-sm mb-1">Total Content</p>
            <p className="text-3xl font-bold">{contents.length}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-muted-foreground text-sm mb-1">Published</p>
            <p className="text-3xl font-bold text-green-600">
              {contents.filter((c) => c.status === "published").length}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-muted-foreground text-sm mb-1">Drafts</p>
            <p className="text-3xl font-bold text-yellow-600">
              {contents.filter((c) => c.status === "draft").length}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-muted-foreground text-sm mb-1">Total Views</p>
            <p className="text-3xl font-bold">
              {contents.reduce((sum, c) => sum + c.views, 0)}
            </p>
          </Card>
        </motion.div>

        {/* Content List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Views</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contents.map((content, idx) => (
                    <motion.tr
                      key={content.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border hover:bg-muted/50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium">{content.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                          {content.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{content.category}</td>
                      <td className="px-6 py-4">
                        <select
                          value={content.status}
                          onChange={(e) =>
                            toggleStatus(
                              content.id,
                              e.target.value as "published" | "draft" | "archived"
                            )
                          }
                          className={`px-3 py-1 rounded text-xs font-medium border-0 cursor-pointer ${
                            content.status === "published"
                              ? "bg-green-500/20 text-green-700 dark:text-green-400"
                              : content.status === "draft"
                              ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                              : "bg-gray-500/20 text-gray-700 dark:text-gray-400"
                          }`}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{content.views}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteContent(content.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminContent;
