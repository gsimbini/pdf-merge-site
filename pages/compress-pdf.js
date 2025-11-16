import ToolPage from '../ToolPage';

export default function CompressPdfPage() {
  return (
    <ToolPage
      title="Compress PDF"
      slug="compress-pdf"
      shortDescription="Reduce the size of your PDF files so they are easier to email, upload and share."
      longDescription="This tool will allow you to compress PDFs while maintaining good visual quality. The UI, drag-and-drop upload and ad placements are ready; you can later plug in real compression logic using a PDF processing library or API."
    />
  );
}
