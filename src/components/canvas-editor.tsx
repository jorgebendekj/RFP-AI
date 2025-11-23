'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Plus,
  Trash,
  Save,
  Sparkles,
  ChevronUp,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Unlink,
  Image as ImageIcon,
  Table as TableIcon,
  Strikethrough,
  Code,
  Quote,
  Undo,
  Redo,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  CheckSquare,
  Palette,
  Upload,
  Loader2,
} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface CanvasEditorProps {
  proposalId: string;
  initialSections: Section[];
  onSave: (sections: Section[]) => void;
}

export function CanvasEditor({ proposalId, initialSections, onSave }: CanvasEditorProps) {
  const { toast } = useToast();
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [activeSection, setActiveSection] = useState<string | null>(
    initialSections[0]?.id || null
  );
  const [aiInstructions, setAiInstructions] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const currentSection = sections.find((s) => s.id === activeSection);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Table.configure({ 
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 bg-gray-100 font-bold p-2',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: currentSection?.content || '',
    onUpdate: ({ editor }) => {
      if (activeSection) {
        updateSectionContent(activeSection, editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] max-w-none',
      },
    },
  });

  useEffect(() => {
    if (editor && currentSection) {
      editor.commands.setContent(currentSection.content || '');
    }
  }, [activeSection, editor]);

  const updateSectionContent = (sectionId: string, content: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, content } : s))
    );
  };

  const addSection = () => {
    const newSection: Section = {
      id: `section_${Date.now()}`,
      title: 'New Section',
      content: '<p>Enter content here...</p>',
      order: sections.length,
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    if (activeSection === sectionId) {
      setActiveSection(sections[0]?.id || null);
    }
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setSections(newSections.map((s, i) => ({ ...s, order: i })));
  };

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    setSections(newSections.map((s, i) => ({ ...s, order: i })));
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, title } : s)));
  };

  const handleSave = () => {
    onSave(sections);
    toast({
      title: 'Saved',
      description: 'Proposal has been saved',
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: 'File attached',
        description: `${file.name} will be used for context`,
      });
    }
  };

  const handleAiImprovement = async () => {
    if (!activeSection || !aiInstructions) return;

    setAiLoading(true);

    try {
      let additionalContext = '';
      
      // If there's an uploaded file, extract its text first
      if (uploadedFile) {
        setUploadingFile(true);
        const formData = new FormData();
        formData.append('file', uploadedFile);
        
        // Upload and extract text from file
        const uploadResponse = await fetch('/api/documents/extract-text', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          additionalContext = uploadData.text || '';
        }
        setUploadingFile(false);
      }

      const response = await fetch('/api/ai/complete-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId,
          sectionId: activeSection,
          instructions: aiInstructions,
          currentContent: currentSection?.content,
          additionalContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to improve section');
      }

      updateSectionContent(activeSection, data.content);
      if (editor) {
        editor.commands.setContent(data.content);
      }

      toast({
        title: 'Section improved',
        description: 'AI has updated the section',
      });

      setAiInstructions('');
      setUploadedFile(null);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setAiLoading(false);
      setUploadingFile(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-4">
      {/* Sections List */}
      <aside className="w-64 bg-white border rounded-lg p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Sections</h3>
          <Button size="sm" variant="ghost" onClick={addSection}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div key={section.id} className="group">
              <button
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left p-2 rounded text-sm transition-colors ${
                  activeSection === section.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`}
              >
                {section.title}
              </button>
              <div className="flex items-center space-x-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveSectionUp(index)}
                  disabled={index === 0}
                  className="h-6 px-2"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveSectionDown(index)}
                  disabled={index === sections.length - 1}
                  className="h-6 px-2"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeSection(section.id)}
                  className="h-6 px-2 text-red-600 hover:text-red-700"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Section Title */}
        {currentSection && (
          <Card className="p-4">
            <Input
              value={currentSection.title}
              onChange={(e) => updateSectionTitle(currentSection.id, e.target.value)}
              className="text-xl font-bold border-none focus-visible:ring-0"
              placeholder="Section Title"
            />
          </Card>
        )}

        {/* Toolbar */}
        {editor && (
          <Card className="p-2">
            {/* Row 1: Text Formatting & Undo/Redo */}
            <div className="flex items-center space-x-1 mb-2 pb-2 border-b flex-wrap gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-gray-300 mx-1" />

              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'paragraph') {
                    editor.chain().focus().setParagraph().run();
                  } else {
                    editor.chain().focus().toggleHeading({ level: parseInt(value) as any }).run();
                  }
                }}
                value={
                  editor.isActive('heading', { level: 1 }) ? '1' :
                  editor.isActive('heading', { level: 2 }) ? '2' :
                  editor.isActive('heading', { level: 3 }) ? '3' : 'paragraph'
                }
                className="h-8 px-2 text-sm border rounded"
              >
                <option value="paragraph">Normal</option>
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
              </select>

              <select
                onChange={(e) => {
                  if (e.target.value === 'default') {
                    editor.chain().focus().unsetFontFamily().run();
                  } else {
                    editor.chain().focus().setFontFamily(e.target.value).run();
                  }
                }}
                className="h-8 px-2 text-sm border rounded"
              >
                <option value="default">Default Font</option>
                <option value="Arial">Arial</option>
                <option value="'Times New Roman'">Times New Roman</option>
                <option value="'Courier New'">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>

              <div className="w-px h-6 bg-gray-300 mx-1" />

              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-gray-200' : ''}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-gray-200' : ''}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'bg-gray-200' : ''}
                title="Underline"
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'bg-gray-200' : ''}
                title="Strikethrough"
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
              
              <div className="w-px h-6 bg-gray-300 mx-1" />

              <input
                type="color"
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                value={editor.getAttributes('textStyle').color || '#000000'}
                className="h-8 w-12 cursor-pointer border rounded"
                title="Text Color"
              />
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const color = prompt('Enter highlight color (e.g., yellow, #ffff00):');
                  if (color) {
                    editor.chain().focus().toggleHighlight({ color }).run();
                  }
                }}
                className={editor.isActive('highlight') ? 'bg-gray-200' : ''}
                title="Highlight"
              >
                <Highlighter className="h-4 w-4" />
              </Button>

              <div className="flex-1" />

              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>

            {/* Row 2: Alignment, Lists & More */}
            <div className="flex items-center space-x-1 flex-wrap gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''}
                title="Justify"
              >
                <AlignJustify className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-gray-300 mx-1" />

              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                className={editor.isActive('taskList') ? 'bg-gray-200' : ''}
                title="Task List"
              >
                <CheckSquare className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-gray-300 mx-1" />

              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={editor.isActive('code') ? 'bg-gray-200' : ''}
                title="Inline Code"
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? 'bg-gray-200' : ''}
                title="Code Block"
              >
                {'{ }'}
              </Button>

              <div className="w-px h-6 bg-gray-300 mx-1" />

              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                className={editor.isActive('subscript') ? 'bg-gray-200' : ''}
                title="Subscript"
              >
                <SubscriptIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                className={editor.isActive('superscript') ? 'bg-gray-200' : ''}
                title="Superscript"
              >
                <SuperscriptIcon className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-gray-300 mx-1" />

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const url = prompt('Enter URL:');
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                }}
                className={editor.isActive('link') ? 'bg-gray-200' : ''}
                title="Insert Link"
              >
                <Link2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().unsetLink().run()}
                disabled={!editor.isActive('link')}
                title="Remove Link"
              >
                <Unlink className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const url = prompt('Enter image URL:');
                  if (url) {
                    editor.chain().focus().setImage({ src: url }).run();
                  }
                }}
                title="Insert Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                }}
                title="Insert Table"
              >
                <TableIcon className="h-4 w-4" />
              </Button>

              {editor.isActive('table') && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                    title="Add Column Before"
                  >
                    Col+
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                    title="Add Row Before"
                  >
                    Row+
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editor.chain().focus().deleteTable().run()}
                    title="Delete Table"
                  >
                    Del Table
                  </Button>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Editor Content */}
        <Card className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto py-8 px-6">
            <EditorContent editor={editor} />
          </div>
        </Card>

        {/* Keyboard Shortcuts Help */}
        <Card className="p-3 bg-gray-50">
          <details className="text-xs text-gray-600">
            <summary className="cursor-pointer font-medium">⌨️ Keyboard Shortcuts</summary>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              <div><kbd className="px-1 bg-white border rounded">Ctrl+B</kbd> Bold</div>
              <div><kbd className="px-1 bg-white border rounded">Ctrl+I</kbd> Italic</div>
              <div><kbd className="px-1 bg-white border rounded">Ctrl+U</kbd> Underline</div>
              <div><kbd className="px-1 bg-white border rounded">Ctrl+Z</kbd> Undo</div>
              <div><kbd className="px-1 bg-white border rounded">Ctrl+Y</kbd> Redo</div>
              <div><kbd className="px-1 bg-white border rounded">Ctrl+K</kbd> Link</div>
              <div><kbd className="px-1 bg-white border rounded">Ctrl+Shift+L</kbd> Align Left</div>
              <div><kbd className="px-1 bg-white border rounded">Ctrl+Shift+E</kbd> Align Center</div>
            </div>
          </details>
        </Card>

        {/* AI Improvement */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Input
                value={aiInstructions}
                onChange={(e) => setAiInstructions(e.target.value)}
                placeholder="Ask AI to improve this section... (e.g., 'make it more formal', 'add more technical details')"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && aiInstructions) {
                    e.preventDefault();
                    handleAiImprovement();
                  }
                }}
              />
              <Button onClick={handleAiImprovement} disabled={aiLoading || uploadingFile || !aiInstructions}>
                {aiLoading || uploadingFile ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {uploadingFile ? 'Processing file...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Improve
                  </>
                )}
              </Button>
            </div>
            
            {/* File Upload */}
            <div className="flex items-center space-x-2">
              <label htmlFor="context-file" className="cursor-pointer">
                <div className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>{uploadedFile ? uploadedFile.name : 'Attach file for context (PDF, Excel, Word)'}</span>
                </div>
                <input
                  id="context-file"
                  type="file"
                  accept=".pdf,.xlsx,.xls,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {uploadedFile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setUploadedFile(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {uploadedFile && (
              <p className="text-xs text-gray-500">
                📎 {uploadedFile.name} will be used as additional context for AI improvement
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

