import { PDFDocument } from 'pdf-lib';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb'
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { files } = req.body;

    if (!Array.isArray(files) || files.length < 2) {
      return res
        .status(400)
        .json({ error: 'At least two PDF files are required.' });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const { data } = file;
      if (typeof data !== 'string') continue;

      const binaryString = Buffer.from(data, 'base64');
      const pdf = await PDFDocument.load(binaryString);
      const copiedPages = await mergedPdf.copyPages(
        pdf,
        pdf.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const mergedBase64 = Buffer.from(mergedBytes).toString('base64');

    return res.status(200).json({ mergedBase64 });
  } catch (error) {
    console.error('Error merging PDFs:', error);
    return res
      .status(500)
      .json({ error: 'Failed to merge PDFs. Please try again.' });
  }
}
