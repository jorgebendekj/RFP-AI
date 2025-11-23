import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/instantdb-admin';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import jsPDF from 'jspdf';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposalId, format } = body;

    if (!proposalId || !format) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get proposal
    const proposalResult = await adminDB.query({
      proposals: {
        $: { where: { id: proposalId } },
      },
    });

    if (!proposalResult.proposals || proposalResult.proposals.length === 0) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const proposal = proposalResult.proposals[0];
    const editorState = JSON.parse(proposal.editorState || '{"sections":[]}');
    const sections = editorState.sections || [];

    if (format === 'docx') {
      return await exportDocx(sections, proposal.name);
    } else if (format === 'pdf') {
      return await exportPdf(sections, proposal.name);
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json({ error: error.message || 'Export failed' }, { status: 500 });
  }
}

async function exportDocx(sections: any[], proposalName: string) {
  const docSections = [];

  for (const section of sections) {
    // Add section title
    docSections.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    // Convert HTML to plain text (simple conversion)
    const plainText = stripHtml(section.content);
    const paragraphs = plainText.split('\n').filter((p) => p.trim());

    for (const para of paragraphs) {
      docSections.push(
        new Paragraph({
          children: [new TextRun(para)],
          spacing: { after: 200 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docSections,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  return new NextResponse(buffer as any, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${proposalName}.docx"`,
    },
  });
}

async function exportPdf(sections: any[], proposalName: string) {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 7;

  for (const section of sections) {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Add section title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, margin, yPosition);
    yPosition += lineHeight * 2;

    // Add section content
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const plainText = stripHtml(section.content);
    const lines = doc.splitTextToSize(plainText, 170);

    for (const line of lines) {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    }

    yPosition += lineHeight * 2;
  }

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

  return new NextResponse(pdfBuffer as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${proposalName}.pdf"`,
    },
  });
}

function stripHtml(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');
  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return text.trim();
}


