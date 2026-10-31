"use client";

import { useState } from "react";
import { AlignCenter, AlignLeft, AlignRight, Bold, Heading2, Italic, List, Quote, Redo2, Undo2 } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

/**
 * GlassEditor — Tiptap with the library's default chrome removed entirely.
 * The toolbar is a glass strip of 44px buttons; content is styled with a
 * scoped `.sanad-prose` class (see globals.css).
 */
export function GlassEditor({
  initialContent = "",
  placeholder,
  onChange,
  className,
}: {
  initialContent?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
  className?: string;
}) {
  const { locale } = useLocale();
  const [empty, setEmpty] = useState(initialContent.length === 0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "sanad-prose min-h-40 focus:outline-none",
        dir: locale === "ar" ? "rtl" : "ltr",
      },
    },
    onUpdate: ({ editor: instance }) => {
      setEmpty(instance.isEmpty);
      onChange?.(instance.getHTML());
    },
  });

  const tools = editor
    ? [
        {
          label: "Bold",
          icon: Bold,
          active: editor.isActive("bold"),
          run: () => editor.chain().focus().toggleBold().run(),
        },
        {
          label: "Italic",
          icon: Italic,
          active: editor.isActive("italic"),
          run: () => editor.chain().focus().toggleItalic().run(),
        },
        {
          label: "Heading",
          icon: Heading2,
          active: editor.isActive("heading", { level: 2 }),
          run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          label: "List",
          icon: List,
          active: editor.isActive("bulletList"),
          run: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
          label: "Quote",
          icon: Quote,
          active: editor.isActive("blockquote"),
          run: () => editor.chain().focus().toggleBlockquote().run(),
        },
        {
          label: "Align start",
          icon: AlignLeft,
          active: editor.isActive({ textAlign: "left" }),
          run: () => editor.chain().focus().setTextAlign("left").run(),
        },
        {
          label: "Align center",
          icon: AlignCenter,
          active: editor.isActive({ textAlign: "center" }),
          run: () => editor.chain().focus().setTextAlign("center").run(),
        },
        {
          label: "Align end",
          icon: AlignRight,
          active: editor.isActive({ textAlign: "right" }),
          run: () => editor.chain().focus().setTextAlign("right").run(),
        },
      ]
    : [];

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/40 bg-white/70 shadow-glass backdrop-blur-xl dark:border-emerald-800/40 dark:bg-emerald-950/60", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-sanad-emerald-900/10 p-2 dark:border-white/10">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.label}
              type="button"
              onClick={tool.run}
              aria-label={tool.label}
              aria-pressed={tool.active}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-lg text-sanad-emerald-900/70 transition-all duration-200 hover:bg-sanad-emerald-900/5 dark:text-sanad-beige-100/70 dark:hover:bg-white/10",
                tool.active && "bg-sanad-emerald-900 text-sanad-beige-50 dark:bg-sanad-gold-400 dark:text-sanad-emerald-950",
                index === 5 && "ms-2",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
            </button>
          );
        })}
        <div className="ms-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor?.chain().focus().undo().run()}
            aria-label="Undo"
            className="inline-flex size-11 items-center justify-center rounded-lg text-sanad-emerald-900/70 hover:bg-sanad-emerald-900/5 dark:text-sanad-beige-100/70 dark:hover:bg-white/10"
          >
            <Undo2 aria-hidden="true" className="size-4 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().redo().run()}
            aria-label="Redo"
            className="inline-flex size-11 items-center justify-center rounded-lg text-sanad-emerald-900/70 hover:bg-sanad-emerald-900/5 dark:text-sanad-beige-100/70 dark:hover:bg-white/10"
          >
            <Redo2 aria-hidden="true" className="size-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      <div className="relative">
        {empty && placeholder ? (
          <p
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 top-4 text-sm text-sanad-emerald-900/40 dark:text-sanad-beige-100/40"
          >
            {placeholder}
          </p>
        ) : null}
        <EditorContent editor={editor} className="p-4" />
      </div>
    </div>
  );
}
