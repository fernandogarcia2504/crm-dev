import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import s3Client, { S3_BUCKET } from "../config/s3.js";
import Company from "../models/company.model.js";
import Document from "../models/document.model.js";

const SIGNED_URL_EXPIRES_IN = 900; // 15 minutos

const sanitizeFileName = (fileName) =>
    fileName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.\-_]/g, "_");

const getCompanyPrefix = (companyId) => `companies/${companyId}/documents/`;

const withSignedUrl = async (document) => {

    const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
            Bucket: document.s3Bucket,
            Key: document.s3Key
        }),
        { expiresIn: SIGNED_URL_EXPIRES_IN }
    );

    return {
        ...document.toObject(),
        url
    };
};


// GET TODOS LOS DOCUMENTOS DE UNA EMPRESA
export const getDocuments = async (req, res) => {

    try {

        const { companyId } = req.params;

        const company = await Company.findById(companyId);

        if (!company) {

            return res.status(404).json({
                message: "El cliente no existe"
            });

        }

        const documents = await Document
            .find({ company: companyId })
            .sort({ createdAt: -1 });

        const documentsWithUrls = await Promise.all(
            documents.map(withSignedUrl)
        );

        return res.status(200).json({
            documents: documentsWithUrls
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener los documentos"
        });

    }

};


// SUBIR UN DOCUMENTO
export const uploadDocument = async (req, res) => {

    try {

        const { companyId } = req.params;
        const { category, notes } = req.body;

        if (!req.file) {

            return res.status(400).json({
                message: "No se proporciono ningun archivo"
            });

        }

        const company = await Company.findById(companyId);

        if (!company) {

            return res.status(404).json({
                message: "El cliente no existe"
            });

        }

        const prefix = getCompanyPrefix(companyId);

        // Si este cliente todavia no tiene documentos, se crea primero
        // el "folder" en S3 (un objeto vacio con la barra final) para
        // que la ruta quede visible y organizada en el bucket antes de
        // subir el primer archivo real.
        const isFirstDocument = (await Document.countDocuments({ company: companyId })) === 0;

        if (isFirstDocument) {

            await s3Client.send(
                new PutObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: prefix,
                    Body: ""
                })
            );

        }

        const safeName = sanitizeFileName(req.file.originalname);
        const s3Key = `${prefix}${Date.now()}-${safeName}`;

        await s3Client.send(
            new PutObjectCommand({
                Bucket: S3_BUCKET,
                Key: s3Key,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            })
        );

        const document = await Document.create({
            company: companyId,
            category: category || "Otro",
            fileName: safeName,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            s3Key,
            s3Bucket: S3_BUCKET,
            notes
        });

        const documentWithUrl = await withSignedUrl(document);

        return res.status(201).json({
            message: "Documento subido exitosamente",
            document: documentWithUrl
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al subir el documento"
        });

    }

};


// ELIMINAR UN DOCUMENTO
export const deleteDocument = async (req, res) => {

    try {

        const { documentId } = req.params;

        const document = await Document.findById(documentId);

        if (!document) {

            return res.status(404).json({
                message: "El documento no existe"
            });

        }

        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: document.s3Bucket,
                Key: document.s3Key
            })
        );

        await document.deleteOne();

        return res.status(200).json({
            message: "Documento eliminado exitosamente"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al eliminar el documento"
        });

    }

};
