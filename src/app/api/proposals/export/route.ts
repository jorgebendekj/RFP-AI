import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/instantdb-admin';
import HTMLtoDOCX from 'html-to-docx';
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

    // Combine all sections into one HTML string for processing
    let fullHtmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${proposal.name}</title>
        <style>
            body { font-family: 'Arial', sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 8px; }
            h1, h2, h3 { color: #333; }
        </style>
    </head>
    <body>
        <h1>${proposal.name}</h1>
    `;

    for (const section of sections) {
        if (section.title && section.title !== 'Full Proposal') {
            fullHtmlContent += `<h2>${section.title}</h2>`;
        }
        fullHtmlContent += section.content;
        fullHtmlContent += '<br/><hr/><br/>'; // Page break simulation or spacing
    }
    
    fullHtmlContent += '</body></html>';

    if (format === 'docx') {
      return await exportDocx(fullHtmlContent, proposal.name);
    } else if (format === 'pdf') {
      // For PDF, we'll stick to the basic text extractor for now as robust Node PDF is hard,
      // OR we can try to be clever. But DOCX is the priority fix.
      // Let's use the crude text extractor but slightly improved as a fallback for PDF.
      return await exportPdf(sections, proposal.name);
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json({ error: error.message || 'Export failed' }, { status: 500 });
  }
}

async function exportDocx(htmlContent: string, proposalName: string) {
  // Use html-to-docx to generate a proper Word document with formatting
  try {
    const fileBuffer = await HTMLtoDOCX(htmlContent, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });

    return new NextResponse(fileBuffer as any, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${proposalName}.docx"`,
      },
    });
  } catch (e) {
    console.error('HTML to DOCX conversion failed:', e);
    throw new Error('Failed to generate DOCX');
  }
}

async function exportPdf(sections: any[], proposalName: string) {
  // Improved PDF generation (still text-based but structured)
  const doc = new jsPDF();
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(proposalName, margin, yPosition);
  yPosition += 15;

  for (const section of sections) {
    // Check page break
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Section Title
    if (section.title && section.title !== 'Full Proposal') {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        
        // Wrap title if long
        const titleLines = doc.splitTextToSize(section.title, contentWidth);
        doc.text(titleLines, margin, yPosition);
        yPosition += (titleLines.length * 8) + 5;
    }

    // Content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);

    // Split content into vaguely paragraph-like chunks to preserve some spacing
    const content = section.content || '';
    const paragraphs = content.replace(/<\/p>/gi, '\n\n')
                             .replace(/<br\s*\/?>/gi, '\n')
                             .replace(/<\/h[1-6]>/gi, '\n\n')
                             .replace(/<\/li>/gi, '\n')
                             .replace(/<\/tr>/gi, '\n')
                             .split('\n');

    for (const para of paragraphs) {
        const plainText = stripHtml(para).trim();
        if (!plainText) continue;

        // Check page break
        if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = 20;
        }

        const lines = doc.splitTextToSize(plainText, contentWidth);
        doc.text(lines, margin, yPosition);
        yPosition += (lines.length * 6) + 2;
    }
    
    yPosition += 5;
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
  if (!html) return '';
  let text = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                 .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                 .replace(/<[^>]*>/g, ' '); 
  
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ');
    
  return text.trim();
}
