export interface RelatedModel {
    _id: string;
    name: string;
}

export type DocumentCategory =
    | "Contrato"
    | "NDA"
    | "Cotizacion"
    | "Reporte Ejecutivo"
    | "Reporte Tecnico"
    | "Presentacion"
    | "Factura"
    | "Evidencia"
    | "Otro";

export interface CompanyDocument {
    _id: string;
    company: string | RelatedModel | null;
    project: string | RelatedModel | null;
    category: DocumentCategory;
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    version: number;
    s3Key: string;
    s3Bucket: string;
    notes: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetDocumentsResponse {
    documents: CompanyDocument[];
}

export interface UploadDocumentResponse {
    message: string;
    document: CompanyDocument;
}
