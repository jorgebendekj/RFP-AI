'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Briefcase, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TendersPage() {
  const router = useRouter();
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/auth/login');
      return;
    }

    loadTenders();
  }, [router]);

  const loadTenders = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await fetch(`/api/tenders/list?companyId=${companyId}`);
      const data = await response.json();
      setTenders(data.tenders || []);
    } catch (error) {
      console.error('Failed to load tenders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Tenders</h1>
            <p className="text-gray-600 mt-2">Manage government tender opportunities</p>
          </div>
          <Link href="/dashboard/tenders/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Tender
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : tenders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tenders yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first tender</p>
              <Link href="/dashboard/tenders/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Tender
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {tenders.map((tender) => (
              <Card key={tender.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle>{tender.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {tender.clientName}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due: {formatDate(tender.deadline)}
                        </span>
                      </div>
                      {tender.tenderCode && (
                        <p className="text-sm text-gray-500">Code: {tender.tenderCode}</p>
                      )}
                    </div>
                    <Link href={`/dashboard/tenders/${tender.id}`}>
                      <Button>View Details</Button>
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



