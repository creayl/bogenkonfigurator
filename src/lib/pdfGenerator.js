import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ralName } from './ralColors.js';

function formatValue(key, value, optionDef) {
  if (value === undefined || value === null) return '–';
  if (Array.isArray(value)) {
    if (key === 'stripe_colors') {
      return value.map((id, i) => `S${i + 1}: ${ralName(id)}`).join(', ');
    }
    if (optionDef?.type === 'multi_select') {
      const map = new Map((optionDef.values || []).map((v) => [v.id, v.label_de]));
      return value.map((id) => map.get(id) ?? id).join(', ') || '–';
    }
    return value.join(', ');
  }
  if (typeof value === 'string' && value.startsWith('RAL_')) return ralName(value);
  if (optionDef?.type === 'radio') {
    const match = (optionDef.values || []).find((v) => v.id === value);
    return match?.label_de ?? value;
  }
  if (optionDef?.unit) return `${value} ${optionDef.unit}`;
  return String(value);
}

export async function generatePdf({ previewElement, product, state }) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 15;
  let cursorY = margin;

  pdf.setFontSize(18);
  pdf.text(`Konfiguration: ${product.label_de}`, margin, cursorY);
  cursorY += 10;

  if (previewElement) {
    try {
      const canvas = await html2canvas(previewElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const maxW = pageWidth - margin * 2;
      const imgW = Math.min(maxW, 100);
      const imgH = (canvas.height / canvas.width) * imgW;
      pdf.addImage(imgData, 'PNG', margin, cursorY, imgW, imgH);
      cursorY += imgH + 8;
    } catch (e) {
      console.warn('Preview rasterization failed:', e);
    }
  }

  pdf.setFontSize(13);
  pdf.text('Auswahl', margin, cursorY);
  cursorY += 6;

  pdf.setFontSize(10);
  for (const [key, opt] of Object.entries(product.options)) {
    if (key === 'notes') continue;
    const v = state.selections[key];
    const line = `${opt.label_de}: ${formatValue(key, v, opt)}`;
    const wrapped = pdf.splitTextToSize(line, pdf.internal.pageSize.getWidth() - margin * 2);
    if (cursorY + wrapped.length * 5 > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      cursorY = margin;
    }
    pdf.text(wrapped, margin, cursorY);
    cursorY += wrapped.length * 5;
  }

  const notes = state.selections.notes;
  if (notes && String(notes).trim()) {
    cursorY += 4;
    pdf.setFontSize(13);
    pdf.text('Bemerkungen', margin, cursorY);
    cursorY += 6;
    pdf.setFontSize(10);
    const wrapped = pdf.splitTextToSize(
      String(notes),
      pdf.internal.pageSize.getWidth() - margin * 2
    );
    pdf.text(wrapped, margin, cursorY);
  }

  pdf.save(`konfiguration-${product.id}.pdf`);
}
