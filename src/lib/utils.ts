import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PDFDocument} from 'pdf-lib'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const stringToURL = (urlString: string | null | undefined): URL | null => {
  try {
    return urlString ? new URL(urlString) : null;
  } catch{
    console.error("Invalid URL");
    return null;
  }
};

/**
 * Merges multiple PDF buffers into a single PDF.
 * @param pdfBuffers - An array of ArrayBuffer or Uint8Array representing the PDF files to merge.
 * @returns A Promise that resolves to a Uint8Array containing the merged PDF bytes.
 */
export const mergePDFs = async (pdfBuffers: (ArrayBuffer | Uint8Array)[]): Promise<Uint8Array> => {
  // Create a new empty PDF document
  const mergedPdf = await PDFDocument.create();

  // Iterate over each PDF buffer and merge its pages into the merged PDF
  for (const pdfBuffer of pdfBuffers) {
      const pdfDoc = await PDFDocument.load(pdfBuffer); // Load each PDF buffer
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page)); // Add each page to the merged document
  }

  // Save the merged PDF and return its bytes
  const mergedPdfBytes = await mergedPdf.save();
  return mergedPdfBytes;
};