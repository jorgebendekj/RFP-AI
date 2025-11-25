/**
 * Extended document categorization system for RFP AI
 * Allows precise classification of uploaded documents for better AI processing
 */

export enum DocumentType {
  // ===== COMPANY DATA =====
  // Information about the company submitting the proposal
  
  /** General company profile and background */
  COMPANY_PROFILE = 'company_profile',
  
  /** Pricing tables and rate cards */
  PRICE_TABLE = 'price_table',
  
  /** Methodology for calculating costs and estimates */
  CALCULATION_METHOD = 'calculation_method',
  
  /** Company certifications and accreditations */
  CERTIFICATIONS = 'certifications',
  
  /** Team member CVs and qualifications */
  TEAM_CVS = 'team_cvs',
  
  /** Portfolio of past projects */
  PROJECT_PORTFOLIO = 'project_portfolio',
  
  /** Financial statements and balance sheets */
  FINANCIAL_STATEMENTS = 'financial_statements',
  
  // ===== TENDER DOCUMENTS =====
  // Documents provided by the client defining the tender requirements
  
  /** Main tender/RFP document */
  TENDER_DOCUMENT = 'tender_document',
  
  /** Detailed technical specifications */
  TECHNICAL_SPECS = 'technical_specifications',
  
  /** Bolivian RUPE Form A-1: Bidder Identification */
  FORMULARIO_A1 = 'formulario_a1_identificacion',
  
  /** Bolivian RUPE Form A-3: Economic Proposal */
  FORMULARIO_A3 = 'formulario_a3_propuesta_economica',
  
  /** Bolivian RUPE Form A-4: Indicative Price Model */
  FORMULARIO_A4 = 'formulario_a4_modelo_precios',
  
  /** Bolivian RUPE Form B-2: Specific Experience */
  FORMULARIO_B2 = 'formulario_b2_experiencia_especifica',
  
  /** Bolivian RUPE Form B-3: General Experience */
  FORMULARIO_B3 = 'formulario_b3_experiencia_general',
  
  /** Bolivian RUPE Annex 1: Technical Specifications */
  ANEXO_1 = 'anexo_1_especificaciones',
  
  /** Bill of Quantities */
  BILL_OF_QUANTITIES = 'bill_of_quantities',
  
  // ===== PROPOSAL EXAMPLES =====
  // Previously submitted proposals to learn format and structure from
  
  /** Any previous proposal submitted by the company */
  PREVIOUS_PROPOSAL = 'previous_proposal',
  
  /** A proposal that won the tender */
  WINNING_PROPOSAL = 'winning_proposal',
  
  // ===== OTHER =====
  
  /** Miscellaneous or uncategorized document */
  OTHER = 'other',
}

export interface DocumentTypeInfo {
  type: DocumentType;
  label: string;
  category: 'company_data' | 'tender_documents' | 'proposal_examples' | 'other';
  description: string;
  extractionPriority: 'high' | 'medium' | 'low';
}

export const DOCUMENT_TYPE_INFO: Record<DocumentType, DocumentTypeInfo> = {
  // Company Data
  [DocumentType.COMPANY_PROFILE]: {
    type: DocumentType.COMPANY_PROFILE,
    label: 'Company Profile',
    category: 'company_data',
    description: 'General company information, history, and capabilities',
    extractionPriority: 'high',
  },
  [DocumentType.PRICE_TABLE]: {
    type: DocumentType.PRICE_TABLE,
    label: 'Price Table / Rate Card',
    category: 'company_data',
    description: 'Pricing information for services, materials, or labor',
    extractionPriority: 'high',
  },
  [DocumentType.CALCULATION_METHOD]: {
    type: DocumentType.CALCULATION_METHOD,
    label: 'Calculation Methodology',
    category: 'company_data',
    description: 'Methods and formulas for cost calculations',
    extractionPriority: 'medium',
  },
  [DocumentType.CERTIFICATIONS]: {
    type: DocumentType.CERTIFICATIONS,
    label: 'Certifications',
    category: 'company_data',
    description: 'Company certifications, licenses, and accreditations',
    extractionPriority: 'medium',
  },
  [DocumentType.TEAM_CVS]: {
    type: DocumentType.TEAM_CVS,
    label: 'Team CVs',
    category: 'company_data',
    description: 'Curriculum vitae of team members',
    extractionPriority: 'medium',
  },
  [DocumentType.PROJECT_PORTFOLIO]: {
    type: DocumentType.PROJECT_PORTFOLIO,
    label: 'Project Portfolio',
    category: 'company_data',
    description: 'Past projects, case studies, and references',
    extractionPriority: 'high',
  },
  [DocumentType.FINANCIAL_STATEMENTS]: {
    type: DocumentType.FINANCIAL_STATEMENTS,
    label: 'Financial Statements',
    category: 'company_data',
    description: 'Balance sheets, income statements, financial reports',
    extractionPriority: 'low',
  },
  
  // Tender Documents
  [DocumentType.TENDER_DOCUMENT]: {
    type: DocumentType.TENDER_DOCUMENT,
    label: 'Tender Document (DCD/RFP)',
    category: 'tender_documents',
    description: 'Main tender or RFP document with requirements',
    extractionPriority: 'high',
  },
  [DocumentType.TECHNICAL_SPECS]: {
    type: DocumentType.TECHNICAL_SPECS,
    label: 'Technical Specifications',
    category: 'tender_documents',
    description: 'Detailed technical requirements and specifications',
    extractionPriority: 'high',
  },
  [DocumentType.FORMULARIO_A1]: {
    type: DocumentType.FORMULARIO_A1,
    label: 'Formulario A-1 (Identificación)',
    category: 'tender_documents',
    description: 'RUPE Form A-1: Bidder identification and declarations',
    extractionPriority: 'high',
  },
  [DocumentType.FORMULARIO_A3]: {
    type: DocumentType.FORMULARIO_A3,
    label: 'Formulario A-3 (Propuesta Económica)',
    category: 'tender_documents',
    description: 'RUPE Form A-3: Economic proposal',
    extractionPriority: 'high',
  },
  [DocumentType.FORMULARIO_A4]: {
    type: DocumentType.FORMULARIO_A4,
    label: 'Formulario A-4 (Modelo de Precios)',
    category: 'tender_documents',
    description: 'RUPE Form A-4: Indicative price model with cost breakdown',
    extractionPriority: 'high',
  },
  [DocumentType.FORMULARIO_B2]: {
    type: DocumentType.FORMULARIO_B2,
    label: 'Formulario B-2 (Experiencia Específica)',
    category: 'tender_documents',
    description: 'RUPE Form B-2: Specific experience',
    extractionPriority: 'medium',
  },
  [DocumentType.FORMULARIO_B3]: {
    type: DocumentType.FORMULARIO_B3,
    label: 'Formulario B-3 (Experiencia General)',
    category: 'tender_documents',
    description: 'RUPE Form B-3: General experience',
    extractionPriority: 'medium',
  },
  [DocumentType.ANEXO_1]: {
    type: DocumentType.ANEXO_1,
    label: 'Anexo 1 (Especificaciones Técnicas)',
    category: 'tender_documents',
    description: 'RUPE Annex 1: Technical specifications for services',
    extractionPriority: 'high',
  },
  [DocumentType.BILL_OF_QUANTITIES]: {
    type: DocumentType.BILL_OF_QUANTITIES,
    label: 'Bill of Quantities (BOQ)',
    category: 'tender_documents',
    description: 'Detailed list of materials and quantities',
    extractionPriority: 'high',
  },
  
  // Proposal Examples
  [DocumentType.PREVIOUS_PROPOSAL]: {
    type: DocumentType.PREVIOUS_PROPOSAL,
    label: 'Previous Proposal',
    category: 'proposal_examples',
    description: 'Previously submitted proposal (won or lost)',
    extractionPriority: 'high',
  },
  [DocumentType.WINNING_PROPOSAL]: {
    type: DocumentType.WINNING_PROPOSAL,
    label: 'Winning Proposal',
    category: 'proposal_examples',
    description: 'A proposal that successfully won a tender',
    extractionPriority: 'high',
  },
  
  // Other
  [DocumentType.OTHER]: {
    type: DocumentType.OTHER,
    label: 'Other Document',
    category: 'other',
    description: 'Miscellaneous document',
    extractionPriority: 'low',
  },
};

/**
 * Get document types grouped by category for UI display
 */
export function getDocumentTypesByCategory() {
  const grouped: Record<string, DocumentTypeInfo[]> = {
    company_data: [],
    tender_documents: [],
    proposal_examples: [],
    other: [],
  };
  
  Object.values(DOCUMENT_TYPE_INFO).forEach((info) => {
    grouped[info.category].push(info);
  });
  
  return grouped;
}

/**
 * Detect document type from filename and content
 */
export function detectDocumentType(
  filename: string,
  content: string
): DocumentType {
  const lowerFilename = filename.toLowerCase();
  const lowerContent = content.toLowerCase().substring(0, 5000);
  
  // Check for Bolivian RUPE forms by filename
  if (/formulario[_\s-]*a[_\s-]*1/i.test(lowerFilename)) {
    return DocumentType.FORMULARIO_A1;
  }
  if (/formulario[_\s-]*a[_\s-]*3/i.test(lowerFilename)) {
    return DocumentType.FORMULARIO_A3;
  }
  if (/formulario[_\s-]*a[_\s-]*4/i.test(lowerFilename)) {
    return DocumentType.FORMULARIO_A4;
  }
  if (/formulario[_\s-]*b[_\s-]*2/i.test(lowerFilename)) {
    return DocumentType.FORMULARIO_B2;
  }
  if (/formulario[_\s-]*b[_\s-]*3/i.test(lowerFilename)) {
    return DocumentType.FORMULARIO_B3;
  }
  if (/anexo[_\s-]*1/i.test(lowerFilename)) {
    return DocumentType.ANEXO_1;
  }
  
  // Check for RUPE forms by content
  if (lowerContent.includes('identificación del oferente')) {
    return DocumentType.FORMULARIO_A1;
  }
  if (lowerContent.includes('propuesta económica')) {
    return DocumentType.FORMULARIO_A3;
  }
  if (lowerContent.includes('modelo indicativo de precios')) {
    return DocumentType.FORMULARIO_A4;
  }
  
  // Check for other document types
  if (lowerFilename.includes('price') || lowerFilename.includes('precio')) {
    return DocumentType.PRICE_TABLE;
  }
  if (lowerFilename.includes('cv') || lowerFilename.includes('resume')) {
    return DocumentType.TEAM_CVS;
  }
  if (lowerFilename.includes('project') || lowerFilename.includes('proyecto') || 
      lowerFilename.includes('portfolio') || lowerFilename.includes('portafolio')) {
    return DocumentType.PROJECT_PORTFOLIO;
  }
  if (lowerFilename.includes('certification') || lowerFilename.includes('certificación')) {
    return DocumentType.CERTIFICATIONS;
  }
  if (lowerFilename.includes('proposal') || lowerFilename.includes('propuesta')) {
    return DocumentType.PREVIOUS_PROPOSAL;
  }
  if (lowerFilename.includes('specification') || lowerFilename.includes('especificación')) {
    return DocumentType.TECHNICAL_SPECS;
  }
  if (lowerFilename.includes('tender') || lowerFilename.includes('licitación') || 
      lowerFilename.includes('rfp') || lowerFilename.includes('dcd')) {
    return DocumentType.TENDER_DOCUMENT;
  }
  
  return DocumentType.OTHER;
}



