'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileText, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';

export default function DocumentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<'model_rfp' | 'company_data' | 'tender_document'>('model_rfp');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/auth/login');
      return;
    }

    loadDocuments();
  }, [router]);

  const loadDocuments = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await fetch(`/api/documents/list?companyId=${companyId}`);
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const companyId = localStorage.getItem('companyId');
      const userId = localStorage.getItem('userId');

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('companyId', companyId || '');
      formData.append('userId', userId || '');
      formData.append('type', documentType);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      toast({
        title: 'Upload successful',
        description: 'Document is being processed',
      });

      setSelectedFile(null);
      await loadDocuments();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/delete?documentId=${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      toast({
        title: 'Document deleted',
        description: 'Document has been removed',
      });

      await loadDocuments();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: error.message,
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'model_rfp':
        return 'Model RFP';
      case 'company_data':
        return 'Company Data';
      case 'tender_document':
        return 'Tender Document';
      default:
        return type;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-gray-600 mt-2">Upload and manage your documents</p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <select
                id="documentType"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="model_rfp">Model RFP / Previous Proposal</option>
                <option value="company_data">Company Data / Internal Document</option>
                <option value="tender_document">Tender Document</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.xlsm"
                onChange={handleFileSelect}
              />
              {selectedFile && (
                <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
              )}
            </div>

            <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="w-full">
              {uploading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Documents List - Organized by Type */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : documents.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                No documents uploaded yet
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Model RFP / Previous Proposals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Model RFP / Previous Proposals</span>
                  <span className="text-sm font-normal text-gray-500">
                    {documents.filter(d => d.type === 'model_rfp').length} documents
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents.filter(d => d.type === 'model_rfp').length === 0 ? (
                  <p className="text-sm text-gray-500 py-4">No model RFP documents uploaded yet</p>
                ) : (
                  <div className="space-y-3">
                    {documents.filter(d => d.type === 'model_rfp').map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium">{doc.fileName}</p>
                            <p className="text-sm text-gray-500">
                              {getTypeLabel(doc.type)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(doc.status)}
                          <span className="text-sm text-gray-600 capitalize">{doc.status}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.id, doc.fileName)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Company Data / Internal Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Company Data / Internal Documents</span>
                  <span className="text-sm font-normal text-gray-500">
                    {documents.filter(d => d.type === 'company_data').length} documents
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents.filter(d => d.type === 'company_data').length === 0 ? (
                  <p className="text-sm text-gray-500 py-4">No company data documents uploaded yet</p>
                ) : (
                  <div className="space-y-3">
                    {documents.filter(d => d.type === 'company_data').map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-medium">{doc.fileName}</p>
                            <p className="text-sm text-gray-500">
                              {getTypeLabel(doc.type)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(doc.status)}
                          <span className="text-sm text-gray-600 capitalize">{doc.status}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.id, doc.fileName)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tender Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Tender Documents</span>
                  <span className="text-sm font-normal text-gray-500">
                    {documents.filter(d => d.type === 'tender_document').length} documents
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents.filter(d => d.type === 'tender_document').length === 0 ? (
                  <p className="text-sm text-gray-500 py-4">No tender documents uploaded yet</p>
                ) : (
                  <div className="space-y-3">
                    {documents.filter(d => d.type === 'tender_document').map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium">{doc.fileName}</p>
                            <p className="text-sm text-gray-500">
                              {getTypeLabel(doc.type)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(doc.status)}
                          <span className="text-sm text-gray-600 capitalize">{doc.status}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.id, doc.fileName)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


