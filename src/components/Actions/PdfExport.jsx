import { useState } from 'react';
import { useConfigurator } from '../../state/ConfiguratorContext.jsx';
import { generatePdf } from '../../lib/pdfGenerator.js';

export default function PdfExport({ previewRef }) {
  const { product, state } = useConfigurator();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (!product) return;
    setBusy(true);
    try {
      await generatePdf({
        previewElement: previewRef?.current,
        product,
        state
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="w-full px-4 py-2 rounded border border-neutral-900 hover:bg-neutral-50 transition disabled:opacity-50"
    >
      {busy ? 'PDF wird erzeugt…' : 'PDF herunterladen'}
    </button>
  );
}
