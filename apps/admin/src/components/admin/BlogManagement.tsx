import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

const BlogManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const blogPosts = [
    {
      id: 1,
      title: "كيفية التحقق من الأخبار المزيفة في عصر وسائل التواصل الاجتماعي",
      author: "أحمد محمد",
      date: "2025-06-20",
      status: "منشور",
      views: 1250,
    },
    {
      id: 2,
      title: "تحليل الصور المفبركة: دليل شامل للمستخدمين",
      author: "سارة أحمد",
      date: "2025-06-19",
      status: "مراجعة",
      views: 890,
    },
    {
      id: 3,
      title: "محو الأمية الإعلامية: المهارات الأساسية للقرن الواحد والعشرين",
      author: "محمد علي",
      date: "2025-06-18",
      status: "منشور",
      views: 2100,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            إدارة المقالات
          </h2>
          <p className="text-gray-600">إنشاء وتحرير مقالات المدونة</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="ml-2 h-4 w-4" />
          مقال جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>جميع المقالات</CardTitle>
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في المقالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">الكاتب</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">المشاهدات</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate">{post.title}</div>
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{post.date}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        post.status === "منشور"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.status}
                    </span>
                  </TableCell>
                  <TableCell>{post.views.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagement;
