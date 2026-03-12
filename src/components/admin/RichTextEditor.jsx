import React, { useRef, useEffect, useCallback } from "react";

const TOOLBAR = [
  { cmd: "bold", label: "<b>B</b>", title: "Bold" },
  { cmd: "italic", label: "<i>I</i>", title: "Italic" },
  { cmd: "underline", label: "<u>U</u>", title: "Underline" },
  { cmd: "separator" },
  { cmd: "insertOrderedList", label: "1.", title: "Ordered list" },
  { cmd: "insertUnorderedList", label: "•", title: "Bullet list" },
  { cmd: "separator" },
  { cmd: "h2", label: "H2", title: "Heading 2", isBlock: true },
  { cmd: "h3", label: "H3", title: "Heading 3", isBlock: true },
  { cmd: "p", label: "¶", title: "Paragraph", isBlock: true },
  { cmd: "separator" },
  { cmd: "createLink", label: "🔗", title: "Insert link" },
  { cmd: "removeFormat", label: "✕", title: "Clear formatting" },
];

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const isInternalChange = useRef(false);

  // Set initial content only on mount or when value changes externally
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    // Only update DOM if content differs (avoid resetting cursor)
    if (el.innerHTML !== (value || "")) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = useCallback(() => {
    isInternalChange.current = true;
    onChange(editorRef.current?.innerHTML || "");
  }, [onChange]);

  const exec = (btn) => {
    editorRef.current?.focus();
    if (btn.isBlock) {
      document.execCommand("formatBlock", false, btn.cmd);
    } else if (btn.cmd === "createLink") {
      const url = prompt("Enter URL:");
      if (url) document.execCommand("createLink", false, url);
    } else {
      document.execCommand(btn.cmd, false, null);
    }
    // Trigger onChange after exec
    setTimeout(() => {
      isInternalChange.current = true;
      onChange(editorRef.current?.innerHTML || "");
    }, 0);
  };

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: "0.75rem", overflow: "visible", background: "#fff" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "2px", padding: "6px 8px",
        borderBottom: "1px solid #e2e8f0", background: "#f8fafc",
        borderRadius: "0.75rem 0.75rem 0 0",
      }}>
        {TOOLBAR.map((btn, i) =>
          btn.cmd === "separator" ? (
            <div key={i} style={{ width: 1, height: 24, background: "#e2e8f0", margin: "0 4px" }} />
          ) : (
            <button
              key={btn.cmd}
              type="button"
              title={btn.title}
              onMouseDown={(e) => { e.preventDefault(); exec(btn); }}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minWidth: 28, height: 28, padding: "0 6px",
                border: "1px solid transparent", borderRadius: 4,
                background: "transparent", cursor: "pointer",
                fontSize: "0.8rem", fontFamily: "inherit", color: "#334155",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#e2e8f0"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              dangerouslySetInnerHTML={{ __html: btn.label }}
            />
          )
        )}
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{
          minHeight: 280, padding: "12px 16px", outline: "none",
          fontSize: "0.9rem", lineHeight: 1.7, color: "#1e293b",
          borderRadius: "0 0 0.75rem 0.75rem",
          overflowY: "auto",
        }}
        data-placeholder="Write your story content here..."
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
        [contenteditable] h2 { font-size: 1.3rem; font-weight: 700; margin: 0.8em 0 0.3em; }
        [contenteditable] h3 { font-size: 1.1rem; font-weight: 600; margin: 0.7em 0 0.3em; }
        [contenteditable] p { margin: 0.4em 0; }
        [contenteditable] ul, [contenteditable] ol { padding-left: 1.5em; margin: 0.4em 0; }
        [contenteditable] a { color: #0ea5e9; text-decoration: underline; }
        [contenteditable] b, [contenteditable] strong { font-weight: 700; }
        [contenteditable] i, [contenteditable] em { font-style: italic; }
        [contenteditable] u { text-decoration: underline; }
      `}</style>
    </div>
  );
}