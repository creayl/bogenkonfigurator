import { useState } from 'react';
import { useConfigurator } from '../../state/ConfiguratorContext.jsx';
import { buildShareableUrl } from '../../lib/urlState.js';

export default function ShareLink() {
  const { product, state } = useConfigurator();
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    if (!product) return;
    const url = buildShareableUrl({
      productId: state.productId,
      selections: state.selections
    });
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API blocked (insecure context, permissions). Fall back to
      // a prompt so the user can still grab the URL.
      window.prompt('Link kopieren:', url);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="w-full px-4 py-2 rounded border border-neutral-300 hover:bg-neutral-50 transition"
    >
      {copied ? 'Link kopiert ✓' : 'Link kopieren'}
    </button>
  );
}
