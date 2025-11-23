'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { CanvasEditor } from '@/components/canvas-editor';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download, Loader2 } from 'lucide-react';

export default function ProposalEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const proposalId = params.id as string;
  const [proposal, setProposal] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (proposalId) {
      loadProposal();
    }
  }, [proposalId]);

  const loadProposal = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await fetch(`/api/proposals/list?companyId=${companyId}`);
      const data = await response.json();
      const foundProposal = data.proposals?.find((p: any) => p.id === proposalId);
      
      if (foundProposal) {
        setProposal(foundProposal);
        const editorState = JSON.parse(foundProposal.editorState || '{"sections":[]}');
        setSections(editorState.sections || []);
      }
    } catch (error) {
      console.error('Failed to load proposal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedSections: any[]) => {
    try {
      const userId = localStorage.getItem('userId');
      const editorState = { sections: updatedSections };

      const response = await fetch('/api/proposals/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId,
          editorState,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      setSections(updatedSections);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Save failed',
        description: error.message,
      });
    }
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    setExporting(true);

    try {
      const response = await fetch('/api/proposals/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId,
          format,
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proposal_${proposalId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Export successful',
        description: `Proposal exported as ${format.toUpperCase()}`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Export failed',
        description: error.message,
      });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!proposal) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Proposal not found</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{proposal.name}</h1>
            <p className="text-sm text-gray-600 mt-1">
              Status: <span className="capitalize">{proposal.status}</span>
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handleExport('docx')}
              disabled={exporting}
            >
              <Download className="h-4 w-4 mr-2" />
              Export DOCX
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              disabled={exporting}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <CanvasEditor
          proposalId={proposalId}
          initialSections={sections}
          onSave={handleSave}
        />
      </div>
    </DashboardLayout>
  );
}



