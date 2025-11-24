'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function NewTenderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    tenderCode: '',
    country: '',
    deadline: '',
  });
  const [tenderDocuments, setTenderDocuments] = useState<any[]>([]);
  const [companyDocuments, setCompanyDocuments] = useState<any[]>([]);
  const [rfpSamples, setRfpSamples] = useState<any[]>([]);
  const [selectedTenderDocs, setSelectedTenderDocs] = useState<string[]>([]);
  const [selectedCompanyDocs, setSelectedCompanyDocs] = useState<string[]>([]);
  const [selectedRfpSamples, setSelectedRfpSamples] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllDocuments();
  }, []);

  const loadAllDocuments = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      
      // Load tender documents
      const tenderResponse = await fetch(`/api/documents/list?companyId=${companyId}&type=tender_document`);
      const tenderData = await tenderResponse.json();
      setTenderDocuments(tenderData.documents || []);
      
      // Load company data documents
      const companyResponse = await fetch(`/api/documents/list?companyId=${companyId}&type=company_data`);
      const companyData = await companyResponse.json();
      setCompanyDocuments(companyData.documents || []);
      
      // Load RFP proposal samples
      const rfpResponse = await fetch(`/api/documents/list?companyId=${companyId}&type=model_rfp`);
      const rfpData = await rfpResponse.json();
      setRfpSamples(rfpData.documents || []);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTenderDocToggle = (docId: string) => {
    setSelectedTenderDocs((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleCompanyDocToggle = (docId: string) => {
    setSelectedCompanyDocs((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleRfpSampleToggle = (docId: string) => {
    setSelectedRfpSamples((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const companyId = localStorage.getItem('companyId');
      const deadlineTimestamp = formData.deadline
        ? new Date(formData.deadline).getTime()
        : Date.now() + 30 * 24 * 60 * 60 * 1000;

      const response = await fetch('/api/tenders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          ...formData,
          deadline: deadlineTimestamp,
          relatedDocumentIds: selectedTenderDocs, // Tender documents (from government)
          companyDocumentIds: selectedCompanyDocs, // Company data documents
          rfpSampleIds: selectedRfpSamples, // RFP proposal samples
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create tender');
      }

      toast({
        title: 'Tender created',
        description: 'Tender has been created successfully',
      });

      router.push(`/dashboard/tenders/${data.tenderId}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Tender</h1>
          <p className="text-gray-600 mt-2">Enter details for the government tender</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tender Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tender Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Bridge Construction Project"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientName">Client/Agency Name *</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  placeholder="Ministry of Public Works"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenderCode">Tender Code/Reference</Label>
                <Input
                  id="tenderCode"
                  name="tenderCode"
                  placeholder="RFP-2024-001"
                  value={formData.tenderCode}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="United States"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Submission Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tender Documents (from government) */}
          <Card>
            <CardHeader>
              <CardTitle>Link Tender Documents</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Documents from the government/client defining requirements
              </p>
            </CardHeader>
            <CardContent>
              {tenderDocuments.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No tender documents uploaded yet. Upload documents from the Documents page first.
                </p>
              ) : (
                <div className="space-y-2">
                  {tenderDocuments.map((doc) => (
                    <label
                      key={doc.id}
                      className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTenderDocs.includes(doc.id)}
                        onChange={() => handleTenderDocToggle(doc.id)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{doc.fileName}</span>
                      {doc.status === 'processed' && (
                        <span className="text-xs text-green-600 ml-auto">✓ Ready</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Data Documents (optional but recommended) */}
          <Card>
            <CardHeader>
              <CardTitle>Company Data Documents (Optional)</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Your company information, prices, team, projects - helps AI create personalized proposals
              </p>
            </CardHeader>
            <CardContent>
              {companyDocuments.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No company data documents uploaded yet. Upload price tables, company profiles, etc. from the Documents page.
                </p>
              ) : (
                <div className="space-y-2">
                  {companyDocuments.map((doc) => (
                    <label
                      key={doc.id}
                      className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCompanyDocs.includes(doc.id)}
                        onChange={() => handleCompanyDocToggle(doc.id)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{doc.fileName}</span>
                      {doc.documentType && (
                        <span className="text-xs text-blue-600 ml-2">({doc.documentType})</span>
                      )}
                      {doc.status === 'processed' && (
                        <span className="text-xs text-green-600 ml-auto">✓ Ready</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* RFP Proposal Samples (optional but recommended) */}
          <Card>
            <CardHeader>
              <CardTitle>RFP Proposal Samples (Optional)</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Your previous successful proposals - helps AI replicate format and structure
              </p>
            </CardHeader>
            <CardContent>
              {rfpSamples.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No RFP proposal samples uploaded yet. Upload your previous winning proposals from the Documents page.
                </p>
              ) : (
                <div className="space-y-2">
                  {rfpSamples.map((doc) => (
                    <label
                      key={doc.id}
                      className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRfpSamples.includes(doc.id)}
                        onChange={() => handleRfpSampleToggle(doc.id)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{doc.fileName}</span>
                      {doc.documentType && (
                        <span className="text-xs text-blue-600 ml-2">({doc.documentType})</span>
                      )}
                      {doc.status === 'processed' && (
                        <span className="text-xs text-green-600 ml-auto">✓ Ready</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Tender'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/tenders')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}



