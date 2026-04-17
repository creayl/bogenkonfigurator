import { useRef } from 'react';
import { useConfigurator } from './state/ConfiguratorContext.jsx';
import { ACTIONS } from './state/reducer.js';
import { useMediaQuery } from './hooks/useMediaQuery.js';
import { useConfigValidation } from './hooks/useConfigValidation.js';
import ProductSelector from './components/ProductSelector.jsx';
import CanvasPreview from './components/Preview/CanvasPreview.jsx';
import OptionsPanel from './components/OptionsPanel/OptionsPanel.jsx';
import MobileStepFlow from './components/MobileStepFlow.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import PdfExport from './components/Actions/PdfExport.jsx';
import EmailInquiry from './components/Actions/EmailInquiry.jsx';
import ShareLink from './components/Actions/ShareLink.jsx';

export default function App() {
  const { state, product, dispatch } = useConfigurator();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const previewRef = useRef(null);
  const validation = useConfigValidation({
    product,
    selections: state.selections
  });

  if (!product) {
    return <ProductSelector />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold">{product.label_de}</h1>
            <p className="text-xs text-neutral-500">Bogenkonfigurator</p>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: ACTIONS.RESET })}
            className="text-sm text-neutral-600 hover:text-neutral-900 underline"
          >
            Produkt wechseln
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {isDesktop ? (
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8">
            <div className="lg:sticky lg:top-20 self-start">
              <CanvasPreview ref={previewRef} />
              <div className="mt-4 space-y-2">
                <PdfExport previewRef={previewRef} />
                <EmailInquiry />
                <ShareLink />
              </div>
            </div>
            <div className="space-y-6">
              <ProgressBar filled={validation.filled} total={validation.total} />
              <OptionsPanel />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <CanvasPreview ref={previewRef} />
            <ProgressBar filled={validation.filled} total={validation.total} />
            <MobileStepFlow />
            <div className="space-y-2 pt-4 border-t border-neutral-200">
              <PdfExport previewRef={previewRef} />
              <EmailInquiry />
              <ShareLink />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-500">
        Platzhalter-Vorschau – echte Produktbilder werden später eingebunden.
      </footer>
    </div>
  );
}
