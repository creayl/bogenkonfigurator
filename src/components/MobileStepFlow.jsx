import { useConfigurator } from '../state/ConfiguratorContext.jsx';
import { ACTIONS } from '../state/reducer.js';
import { OptionField } from './OptionsPanel/OptionsPanel.jsx';

export default function MobileStepFlow() {
  const { product, config, state, dispatch } = useConfigurator();
  if (!product) return null;

  const order = config.ui_flow.order.filter(
    (k) => k in product.options && k !== 'stripe_colors'
  );
  const remaining = Object.keys(product.options).filter(
    (k) => !order.includes(k) && k !== 'stripe_colors'
  );
  const steps = [...order, ...remaining];
  const step = Math.min(state.ui.currentStep, steps.length - 1);
  const currentKey = steps[step];

  return (
    <div className="space-y-4">
      <div className="text-xs uppercase text-neutral-500 tracking-wide">
        Schritt {step + 1} von {steps.length}
      </div>
      <OptionField optionKey={currentKey} product={product} />
      <div className="flex justify-between pt-4">
        <button
          type="button"
          disabled={step === 0}
          onClick={() =>
            dispatch({ type: ACTIONS.SET_STEP, step: Math.max(0, step - 1) })
          }
          className="px-4 py-2 rounded border border-neutral-300 disabled:opacity-40"
        >
          Zurück
        </button>
        <button
          type="button"
          disabled={step >= steps.length - 1}
          onClick={() =>
            dispatch({
              type: ACTIONS.SET_STEP,
              step: Math.min(steps.length - 1, step + 1)
            })
          }
          className="px-4 py-2 rounded bg-neutral-900 text-white disabled:opacity-40"
        >
          Weiter
        </button>
      </div>
    </div>
  );
}
