import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/instantdb-admin';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposalId, sectionId, instructions, currentContent, additionalContext } = body;

    if (!proposalId || !sectionId) {
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

    // Find the section
    const section = editorState.sections?.find((s: any) => s.id === sectionId);
    
    // If we have currentContent from the editor, use that instead
    const contentToImprove = currentContent || section?.content || '';
    const sectionTitle = section?.title || 'Section';
    
    if (!contentToImprove) {
      return NextResponse.json({ error: 'No content to improve' }, { status: 400 });
    }

    // Generate improved content using AI
    const prompt = `You are an expert proposal writer and document analyst specializing in extracting and replicating structured information from documents.
    
Current section title: ${sectionTitle}
Current content: ${contentToImprove}

${additionalContext ? `ADDITIONAL CONTEXT FROM UPLOADED DOCUMENT:
NOTE: If you see [HTML_CONTENT]...[/HTML_CONTENT] tags, extract and convert the HTML tables within them.
${additionalContext.substring(0, 10000)}

CRITICAL: Analyze this document carefully and extract:
1. Any tables - replicate them exactly using HTML table structure
2. Specific data: numbers, percentages, dates, names, specifications
3. Technical details, requirements, or standards mentioned
4. Examples, case studies, or project references
5. Any structured information (lists, hierarchies, processes)

Use ALL relevant information from this document to enhance the section.
` : ''}

User Instructions: ${instructions || 'Improve and enhance this section'}

REQUIREMENTS FOR IMPROVED CONTENT:

1. **ANALYZE AND EXTRACT**:
   - Read the current content and additional context thoroughly
   - Identify key information, data points, and requirements
   - Extract specific numbers, dates, percentages, names from the documents
   - Don't invent information - use what's provided

2. **REPLICATE TABLES**:
   - If you see tabular data in the context document, create HTML tables
   - Preserve ALL rows, columns, headers from the original
   - Use this structure:
   <table class="border-collapse border border-gray-300 w-full my-4">
     <thead>
       <tr>
         <th class="border border-gray-300 bg-gray-100 font-bold p-2">Header</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td class="border border-gray-300 p-2">Data</td>
       </tr>
     </tbody>
   </table>

3. **BE SPECIFIC AND CONCRETE**:
   - Use specific examples from the context
   - Include measurable details (quantities, timeframes, percentages)
   - Reference concrete projects, certifications, or experiences
   - Provide technical specifications when available

4. **MAINTAIN STRUCTURE**:
   - Keep professional formatting
   - Use appropriate headings for organization
   - Use bullet points or numbered lists when listing items
   - Ensure logical flow and coherence

5. **IMPLEMENT USER INSTRUCTIONS**:
   - Follow the specific improvement request
   - If asked to add technical details, extract them from the context
   - If asked to make it more formal, adjust tone accordingly
   - If asked to add examples, pull them from the documents

HTML FORMATTING:
- Use <p> for paragraphs
- Use <strong> for bold text (DO NOT use **text** markdown syntax)
- Use <em> for italic text
- Use <ul><li> for bullet lists
- Use <ol><li> for numbered lists
- Use <h2>, <h3> for sub-headings (NOT h1)
- Use <table> with proper classes for tabular data
- Use <br> for line breaks if needed

IMPORTANT: 
- Return ONLY HTML content (no markdown syntax like ** or ##)
- If there are tables in the context, YOU MUST include them in your response
- Use concrete data from the documents, don't make up information
- Be professional, clear, and compelling

Generate the improved section content now:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    let improvedContent = completion.choices[0].message.content || '';
    
    // Convert any remaining markdown bold to HTML (safety fallback)
    improvedContent = improvedContent
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>');

    // Update section in editor state
    let updatedSections = editorState.sections || [];
    
    // Find if section exists
    const sectionIndex = updatedSections.findIndex((s: any) => s.id === sectionId);
    
    if (sectionIndex >= 0) {
      // Update existing section
      updatedSections = updatedSections.map((s: any) =>
        s.id === sectionId ? { ...s, content: improvedContent } : s
      );
    } else if (section) {
      // Section exists but not in array, add it
      updatedSections.push({ ...section, content: improvedContent });
    }

    const updatedEditorState = {
      ...editorState,
      sections: updatedSections,
    };

    // Save updated editor state
    try {
      await adminDB.transact([
        adminDB.tx.proposals[proposalId].update({
          editorState: JSON.stringify(updatedEditorState),
          updatedAt: Date.now(),
        }),
      ]);
    } catch (dbError) {
      console.error('Database update error:', dbError);
      // Still return the content even if DB update fails
    }

    return NextResponse.json({
      content: improvedContent,
    });
  } catch (error: any) {
    console.error('Complete section error:', error);
    return NextResponse.json({ error: error.message || 'Failed to complete section' }, { status: 500 });
  }
}


