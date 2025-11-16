'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface ReactQuillInstance {
  getEditor: () => {
    root: HTMLElement;
  };
}

const RichTextEditor = ({ value, onChange, placeholder, className = '' }: RichTextEditorProps) => {
  const quillRef = useRef<ReactQuillInstance | null>(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'color', 'background',
    'align',
    'link', 'image', 'video'
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Write your content here...'}
        className="bg-white dark:bg-zinc-900"
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 300px;
          font-size: 16px;
          color: #18181b;
        }
        .dark .rich-text-editor .ql-container {
          color: #fafafa;
        }
        .rich-text-editor .ql-editor {
          min-height: 300px;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          border: 2px solid #e5e7eb;
          background-color: #ffffff;
        }
        .dark .rich-text-editor .ql-toolbar {
          border-color: #3f3f46;
          background-color: #18181b;
        }
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          border: 2px solid #e5e7eb;
          border-top: none;
        }
        .dark .rich-text-editor .ql-container {
          border-color: #3f3f46;
        }
        .rich-text-editor .ql-stroke {
          stroke: #52525b;
        }
        .dark .rich-text-editor .ql-stroke {
          stroke: #a1a1aa;
        }
        .rich-text-editor .ql-fill {
          fill: #52525b;
        }
        .dark .rich-text-editor .ql-fill {
          fill: #a1a1aa;
        }
        .rich-text-editor .ql-picker-label {
          color: #52525b;
        }
        .dark .rich-text-editor .ql-picker-label {
          color: #a1a1aa;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .dark .rich-text-editor .ql-editor.ql-blank::before {
          color: #71717a;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;

