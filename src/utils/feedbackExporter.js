// src/utils/feedbackExporter.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <- default import of the plugin

export const exportFeedbackAsPDF = (interview) => {
  if (!interview) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const marginLeft = 40;
  let y = 60;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Interview Feedback Report', marginLeft, y);
  y += 20;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Role: ${interview.role || 'N/A'}`, marginLeft, y);
  y += 16;
  if (interview.jobDescription) {
    doc.text('Job Description:', marginLeft, y);
    y += 14;

    const jdText = doc.splitTextToSize(interview.jobDesc, 500);
    doc.text(jdText, marginLeft, y);
    y += jdText.length * 14 + 10;
  }

  // Feedback section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Feedback Summary', marginLeft, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  const feedbackText = doc.splitTextToSize(interview.feedback || 'No feedback available.', 500);
  doc.text(feedbackText, marginLeft, y);
  y += feedbackText.length * 14 + 10;

  // Questions / Transcript Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Interview Transcript', marginLeft, y);
  y += 20;

  const transcriptRows = (interview.transcript || []).map((msg, i) => [
    i + 1,
    msg.role === 'assistant' ? 'Interviewer' : msg.role === 'user' ? 'Candidate' : 'System',
    msg.content,
  ]);

  // ✅ Use the imported autoTable plugin directly
  autoTable(doc, {
    startY: y,
    head: [['#', 'Speaker', 'Message']],
    body: transcriptRows,
    styles: { fontSize: 10, cellPadding: 6, valign: 'middle' },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 80 },
      2: { cellWidth: 350 },
    },
    headStyles: { fillColor: [128, 90, 213] }, // Purple header
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${totalPages}`,
      doc.internal.pageSize.width - marginLeft,
      pageHeight - 20,
      { align: 'right' }
    );
  }

  // Save the PDF
  doc.save(`Interview_Feedback_${interview.role || 'Report'}.pdf`);
};