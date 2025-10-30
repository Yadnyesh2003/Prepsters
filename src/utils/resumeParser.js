// Lightweight resume parser using pdfjs to extract text from a PDF URL (Cloudinary or direct link)
// Falls back to fetching plain text if the resource is a text file.
// Use the legacy build which is more bundler-friendly and set workerSrc via URL.
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// Point pdfjs to the bundled worker file. Using `new URL(..., import.meta.url).toString()`
// works well with Vite and other ESM bundlers.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.js', import.meta.url).toString();

// Parse a resume from a URL. Returns a plain string with extracted text (trimmed).
export async function parseResumeFromUrl(url) {
  if (!url) return '';

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Failed to fetch resume:', res.status, res.statusText);
      return '';
    }

    const contentType = res.headers.get('content-type') || '';

    // If it's a PDF, use pdfjs to extract text
    if (contentType.includes('pdf') || url.toLowerCase().endsWith('.pdf')) {
      const arrayBuffer = await res.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const strings = content.items.map((it) => (it.str ? it.str : ''));
        fullText += strings.join(' ') + '\n\n';
      }

      return fullText.replace(/\s+/g, ' ').trim();
    }

    // If it's text (plain or json), return the text
    if (contentType.includes('text') || contentType.includes('json') || url.match(/\.txt$/i)) {
      const text = await res.text();
      return text.replace(/\s+/g, ' ').trim();
    }

    // For other content types (images, unknown), try to treat as binary and return empty
    console.warn('Unsupported resume content type for parsing:', contentType);
    return '';
  } catch (err) {
    console.error('Error parsing resume from URL:', err);
    return '';
  }
}
