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
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTenderDocuments();
  }, []);

  const loadTenderDocuments = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await fetch(`/api/documents/list?companyId=${companyId}&type=tender_document`);
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDocToggle = (docId: string) => {
    setSelectedDocs((prev) =>
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
          relatedDocumentIds: selectedDocs,
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

          <Card>
            <CardHeader>
              <CardTitle>Link Tender Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No tender documents uploaded yet. Upload documents from the Documents page first.
                </p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <label
                      key={doc.id}
                      className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => handleDocToggle(doc.id)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{doc.fileName}</span>
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



