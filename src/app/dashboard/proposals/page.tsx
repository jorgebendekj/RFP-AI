'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Clock } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function ProposalsPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/auth/login');
      return;
    }

    loadProposals();
  }, [router]);

  const loadProposals = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await fetch(`/api/proposals/list?companyId=${companyId}`);
      const data = await response.json();
      setProposals(data.proposals || []);
    } catch (error) {
      console.error('Failed to load proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_review':
        return 'bg-blue-100 text-blue-800';
      case 'final':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Proposals</h1>
            <p className="text-gray-600 mt-2">Manage and edit your proposals</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : proposals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals yet</h3>
              <p className="text-gray-500 mb-4">
                Generate a proposal from a tender to get started
              </p>
              <Link href="/dashboard/tenders">
                <Button>View Tenders</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle>{proposal.name}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Updated: {formatDateTime(proposal.updatedAt)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            proposal.status
                          )}`}
                        >
                          {proposal.status}
                        </span>
                      </div>
                    </div>
                    <Link href={`/dashboard/proposals/${proposal.id}`}>
                      <Button>Edit Proposal</Button>
                    </Link>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}



