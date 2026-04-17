import { useConfigurator } from '../state/ConfiguratorContext.jsx';
import { ACTIONS } from '../state/reducer.js';

export default function ProductSelector() {
  const { config, dispatch } = useConfigurator();
  const products = Object.values(config.products);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Bogenkonfigurator</h1>
      <p className="text-center text-neutral-600 mb-8">
        Wähle ein Produkt, um zu starten.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {products.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() =>
              dispatch({ type: ACTIONS.SET_PRODUCT, productId: p.id })
            }
            className="p-6 border-2 border-neutral-300 rounded-lg hover:border-neutral-900 hover:shadow-md transition text-left bg-white"
          >
            <h2 className="text-xl font-semibold mb-1">{p.label_de}</h2>
            <p className="text-sm text-neutral-500">
              Konfiguration starten →
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
