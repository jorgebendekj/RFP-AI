'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Briefcase, Upload, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    tenders: 0,
    proposals: 0,
    documents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/auth/login');
      return;
    }

    loadStats();
  }, [router]);

  const loadStats = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      
      const [tendersRes, proposalsRes, documentsRes] = await Promise.all([
        fetch(`/api/tenders/list?companyId=${companyId}`),
        fetch(`/api/proposals/list?companyId=${companyId}`),
        fetch(`/api/documents/list?companyId=${companyId}`),
      ]);

      const [tenders, proposals, documents] = await Promise.all([
        tendersRes.json(),
        proposalsRes.json(),
        documentsRes.json(),
      ]);

      setStats({
        tenders: tenders.tenders?.length || 0,
        proposals: proposals.proposals?.length || 0,
        documents: documents.documents?.length || 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to PROPOSA AI</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tenders</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tenders}</div>
              <p className="text-xs text-muted-foreground">Active opportunities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proposals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.proposals}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.documents}</div>
              <p className="text-xs text-muted-foreground">Knowledge base</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/tenders/new">
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Tender
              </Button>
            </Link>
            <Link href="/dashboard/documents?tab=upload">
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload Documents
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Getting Started Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Follow these steps to generate your first proposal</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-3 text-sm">
              <li>Upload your model RFPs and company documents to build your knowledge base</li>
              <li>Upload a government tender document</li>
              <li>Create a tender record and link the uploaded documents</li>
              <li>Click &quot;Generate Proposal&quot; to let AI create a draft</li>
              <li>Edit and refine the proposal in the Canvas editor</li>
              <li>Export to PDF or DOCX when ready</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}


