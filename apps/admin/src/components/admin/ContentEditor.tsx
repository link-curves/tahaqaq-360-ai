import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Code, Italic, Link, List, ListOrdered } from "lucide-react";
import { useState } from "react";

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const ContentEditor = ({
  value,
  onChange,
  placeholder = "اكتب المحتوى هنا...",
  minHeight = "400px",
}: ContentEditorProps) => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.getElementById(
      "content-editor"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const markdownButtons = [
    {
      icon: Bold,
      label: "عريض",
      action: () => insertMarkdown("**", "**"),
    },
    {
      icon: Italic,
      label: "مائل",
      action: () => insertMarkdown("*", "*"),
    },
    {
      icon: Link,
      label: "رابط",
      action: () => insertMarkdown("[", "](url)"),
    },
    {
      icon: List,
      label: "قائمة",
      action: () => insertMarkdown("\n- ", ""),
    },
    {
      icon: ListOrdered,
      label: "قائمة مرقمة",
      action: () => insertMarkdown("\n1. ", ""),
    },
    {
      icon: Code,
      label: "كود",
      action: () => insertMarkdown("`", "`"),
    },
  ];

  // Simple markdown to HTML converter for preview
  const renderMarkdown = (markdown: string) => {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // Lists
    html = html.replace(/^\- (.*$)/gim, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

    // Paragraphs
    html = html.replace(/\n\n/g, "</p><p>");
    html = "<p>" + html + "</p>";

    return html;
  };

  return (
    <div className="space-y-2">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="edit">تحرير</TabsTrigger>
            <TabsTrigger value="preview">معاينة</TabsTrigger>
          </TabsList>

          {activeTab === "edit" && (
            <div className="flex gap-1">
              {markdownButtons.map((btn, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={btn.action}
                  title={btn.label}
                >
                  <btn.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="edit" className="mt-2">
          <Textarea
            id="content-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="font-mono"
            style={{ minHeight }}
          />
          <p className="text-xs text-muted-foreground mt-2">
            يدعم صيغة Markdown للتنسيق
          </p>
        </TabsContent>

        <TabsContent value="preview" className="mt-2">
          <Card className="p-4" style={{ minHeight }}>
            {value ? (
              <div
                className="prose prose-sm max-w-none"
                dir="rtl"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
              />
            ) : (
              <p className="text-muted-foreground">لا يوجد محتوى للمعاينة</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
