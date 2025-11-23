'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Briefcase, Calendar, FileText, Loader2, Sparkles, File } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useClientTranslations } from '@/hooks/useClientTranslations';

export default function TenderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useClientTranslations();
  const tenderId = params.id as string;
  const [tender, setTender] = useState<any>(null);
  const [parsedRequirements, setParsedRequirements] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (tenderId) {
      loadTender();
    }
  }, [tenderId]);

  const loadTender = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await fetch(`/api/tenders/list?companyId=${companyId}`);
      const data = await response.json();
      const foundTender = data.tenders?.find((t: any) => t.id === tenderId);
      
      if (foundTender) {
        setTender(foundTender);
        if (foundTender.parsedRequirements) {
          setParsedRequirements(JSON.parse(foundTender.parsedRequirements));
        }
      }
    } catch (error) {
      console.error('Failed to load tender:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParseTender = async () => {
    setParsing(true);

    try {
      const response = await fetch('/api/ai/parse-tender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse tender');
      }

      setParsedRequirements(data.parsedRequirements);
      
      toast({
        title: t('tenders.tenderParsed', 'Tender parsed'),
        description: t('tenders.tenderParsedDesc', 'AI has analyzed the tender requirements'),
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setParsing(false);
    }
  };

  const handleGenerateProposal = async () => {
    setGenerating(true);

    try {
      const companyId = localStorage.getItem('companyId');
      const userId = localStorage.getItem('userId');

      const response = await fetch('/api/ai/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenderId, companyId, userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate proposal');
      }

      toast({
        title: t('tenders.proposalGenerated', 'Proposal generated'),
        description: t('tenders.proposalGeneratedDesc', 'AI has created a proposal draft'),
      });

      router.push(`/dashboard/proposals/${data.proposalId}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setGenerating(false);
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

  if (!tender) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Tender not found</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{tender.title}</h1>
          <div className="flex items-center space-x-4 mt-2 text-gray-600">
            <span className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              {tender.clientName}
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Due: {formatDate(tender.deadline)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <Button onClick={handleParseTender} disabled={parsing}>
            {parsing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('tenders.parsing', 'Parsing...')}
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                {t('tenders.parseTender', 'Parse Tender Requirements')}
              </>
            )}
          </Button>
          
          <Button onClick={handleGenerateProposal} disabled={generating || !parsedRequirements}>
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('tenders.generating', 'Generating...')}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {t('tenders.generateProposal', 'Generate Proposal')}
              </>
            )}
          </Button>
        </div>

        {/* Tender Details */}
        <Card>
          <CardHeader>
            <CardTitle>{t('tenders.tenderDetails', 'Tender Details')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tender.tenderCode && (
              <div>
                <p className="text-sm font-medium text-gray-500">{t('tenders.tenderCode', 'Tender Code')}</p>
                <p className="text-base">{tender.tenderCode}</p>
              </div>
            )}
            {tender.country && (
              <div>
                <p className="text-sm font-medium text-gray-500">{t('tenders.country', 'Country')}</p>
                <p className="text-base">{tender.country}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Linked Documents */}
        <LinkedDocuments tenderId={tenderId} />

        {/* Parsed Requirements */}
        {parsedRequirements && (
          <Card>
            <CardHeader>
              <CardTitle>{t('tenders.parsedRequirements', 'Parsed Requirements')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {parsedRequirements.requirements && (
                <div>
                  <h3 className="font-medium mb-2">{t('tenders.mandatoryRequirements', 'Mandatory Requirements')}</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {parsedRequirements.requirements.map((req: string, i: number) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {parsedRequirements.scopeOfWork && (
                <div>
                  <h3 className="font-medium mb-2">{t('tenders.scopeOfWork', 'Scope of Work')}</h3>
                  <p className="text-sm">{parsedRequirements.scopeOfWork}</p>
                </div>
              )}

              {parsedRequirements.evaluationCriteria && (
                <div>
                  <h3 className="font-medium mb-2">{t('tenders.evaluationCriteria', 'Evaluation Criteria')}</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {parsedRequirements.evaluationCriteria.map((criteria: any, i: number) => (
                      <li key={i}>
                        {typeof criteria === 'string' 
                          ? criteria 
                          : typeof criteria === 'object' && criteria.criterion
                          ? `${criteria.criterion}${criteria.weight ? ` (Weight: ${criteria.weight})` : ''}`
                          : JSON.stringify(criteria)
                        }
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {parsedRequirements.billOfQuantities && parsedRequirements.billOfQuantities.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Bill of Quantities</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2">Item</th>
                          <th className="text-left py-2 px-2">Unit</th>
                          <th className="text-right py-2 px-2">Quantity</th>
                          <th className="text-right py-2 px-2">Est. Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedRequirements.billOfQuantities.map((item: any, i: number) => (
                          <tr key={i} className="border-b">
                            <td className="py-2 px-2">{item.item || '-'}</td>
                            <td className="py-2 px-2">{item.unit || '-'}</td>
                            <td className="text-right py-2 px-2">{item.quantity || '-'}</td>
                            <td className="text-right py-2 px-2">{item.estimatedPrice ? `$${item.estimatedPrice}` : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {parsedRequirements.technicalSpecifications && parsedRequirements.technicalSpecifications.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Technical Specifications</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {parsedRequirements.technicalSpecifications.map((spec: any, i: number) => (
                      <li key={i}>{typeof spec === 'string' ? spec : JSON.stringify(spec)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {parsedRequirements.eligibilityCriteria && parsedRequirements.eligibilityCriteria.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Eligibility Criteria</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {parsedRequirements.eligibilityCriteria.map((criteria: any, i: number) => (
                      <li key={i}>{typeof criteria === 'string' ? criteria : JSON.stringify(criteria)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {parsedRequirements.documentationRequired && parsedRequirements.documentationRequired.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Documentation Required</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {parsedRequirements.documentationRequired.map((doc: any, i: number) => (
                      <li key={i}>{typeof doc === 'string' ? doc : JSON.stringify(doc)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

function LinkedDocuments({ tenderId }: { tenderId: string }) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [tenderId]);

  const loadDocuments = async () => {
    try {
      const companyId = localStorage.getItem('companyId');
      
      // Get tender to find related document IDs
      const tenderResponse = await fetch(`/api/tenders/list?companyId=${companyId}`);
      const tenderData = await tenderResponse.json();
      const tender = tenderData.tenders?.find((t: any) => t.id === tenderId);
      
      if (tender && tender.relatedDocumentIds) {
        const documentIds = JSON.parse(tender.relatedDocumentIds);
        
        if (documentIds.length > 0) {
          // Get all documents
          const docsResponse = await fetch(`/api/documents/list?companyId=${companyId}`);
          const docsData = await docsResponse.json();
          
          // Filter to only linked documents
          const linkedDocs = docsData.documents?.filter((doc: any) => 
            documentIds.includes(doc.id)
          ) || [];
          
          setDocuments(linkedDocs);
        }
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Linked Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Linked Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            No documents linked to this tender. Documents are required to parse requirements and generate proposals.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked Documents ({documents.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
            >
              <File className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">{doc.fileName}</p>
                <p className="text-xs text-gray-500">
                  {doc.status === 'processed' ? 'Processed' : doc.status === 'processing' ? 'Processing...' : 'Uploaded'}
                </p>
              </div>
              {doc.status === 'processed' && (
                <span className="text-xs text-green-600 font-medium">✓ Ready</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


