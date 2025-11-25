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

  // Determine if we are in "Single Document Mode"
  // If there's only 1 section and it's labeled "Full Proposal" or "Document", we treat it as a single doc
  const isSingleDocumentMode = sections.length === 1;

  const currentSection = sections.find((s) => s.id === activeSection) || sections[0];

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
      if (currentSection) {
        updateSectionContent(currentSection.id, editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[600px] max-w-none p-8 bg-white shadow-sm',
      },
    },
  });

  useEffect(() => {
    if (editor && currentSection && editor.getHTML() !== currentSection.content) {
      editor.commands.setContent(currentSection.content || '');
    }
  }, [currentSection?.id, editor]); // Only update when switching sections

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
    // If we were in single mode, we are not anymore
    if (isSingleDocumentMode) {
        setActiveSection(newSection.id);
    }
  };

  const removeSection = (sectionId: string) => {
    if (sections.length <= 1) {
        toast({ title: "Cannot delete last section", variant: "destructive" });
        return;
    }
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
    if (!currentSection || !aiInstructions) return;

    setAiLoading(true);

    try {
      let additionalContext = '';
      
      if (uploadedFile) {
        setUploadingFile(true);
        const formData = new FormData();
        formData.append('file', uploadedFile);
        
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
          sectionId: currentSection.id,
          instructions: aiInstructions,
          currentContent: currentSection?.content,
          additionalContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to improve section');
      }

      updateSectionContent(currentSection.id, data.content);
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
      {/* Sections List - Hidden in Single Document Mode */}
      {!isSingleDocumentMode && (
        <aside className="w-64 bg-white border rounded-lg p-4 overflow-y-auto flex-shrink-0">
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
      )}

      {/* Editor Area */}
      <div className="flex-1 flex flex-col space-y-4 h-full overflow-hidden">
        {/* Section Title - Only show if multiple sections */}
        {!isSingleDocumentMode && currentSection && (
          <Card className="p-4 flex-shrink-0">
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
          <Card className="p-2 flex-shrink-0">
            {/* Toolbar Content */}
            <div className="flex items-center space-x-1 mb-2 pb-2 border-b flex-wrap gap-1">
              {/* ... (standard toolbar buttons) ... */}
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

              {/* ... (More toolbar buttons - Bold, Italic, etc.) ... */}
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-gray-200' : ''}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-gray-200' : ''}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'bg-gray-200' : ''}
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>
              
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                }}
              >
                <TableIcon className="h-4 w-4" />
              </Button>

              <div className="flex-1" />
              <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </Card>
        )}

        {/* Editor Content */}
        <Card className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-[210mm] mx-auto min-h-[297mm] bg-white shadow-md mb-4 print:shadow-none print:mb-0">
            <EditorContent editor={editor} />
          </div>
        </Card>

        {/* AI Improvement */}
        <Card className="p-4 flex-shrink-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Input
                value={aiInstructions}
                onChange={(e) => setAiInstructions(e.target.value)}
                placeholder="Ask AI to improve the document... (e.g., 'Expand the methodology section', 'Fix formatting')"
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
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Improve
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
