import { useConfigurator } from '../../state/ConfiguratorContext.jsx';
import { ACTIONS } from '../../state/reducer.js';
import WoodPicker from './WoodPicker.jsx';
import ColorPicker from './ColorPicker.jsx';
import StripeCountPicker from './StripeCountPicker.jsx';
import HandednessPicker from './HandednessPicker.jsx';
import LengthPicker from './LengthPicker.jsx';
import DrawWeightPicker from './DrawWeightPicker.jsx';
import TillerPicker from './TillerPicker.jsx';
import AccessoriesPicker from './AccessoriesPicker.jsx';

// Renders one option in the configured ui_flow order. The whole product
// option set is iterated; rendering a missing key is a no-op.
function OptionField({ optionKey, product }) {
  const optionDef = product.options[optionKey];
  if (!optionDef) return null;

  let body = null;
  switch (optionKey) {
    case 'wood':
      body = <WoodPicker optionDef={optionDef} />;
      break;
    case 'stripe_count':
      body = <StripeCountPicker optionDef={optionDef} />;
      break;
    case 'stripe_colors':
      // Rendered inline inside StripeCountPicker for tighter UX.
      return null;
    case 'limb_color':
    case 'wedge_color':
    case 'tip_color':
    case 'screw_color':
      body = <ColorPicker optionKey={optionKey} />;
      break;
    case 'handedness':
      body = <HandednessPicker optionDef={optionDef} />;
      break;
    case 'length':
      body = <LengthPicker optionDef={optionDef} />;
      break;
    case 'draw_weight':
      body = <DrawWeightPicker optionDef={optionDef} />;
      break;
    case 'tiller':
      body = <TillerPicker optionDef={optionDef} />;
      break;
    case 'accessories':
      body = <AccessoriesPicker optionDef={optionDef} />;
      break;
    case 'notes':
      body = <NotesField optionDef={optionDef} />;
      break;
    default:
      return null;
  }

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold text-neutral-800">{optionDef.label_de}</h3>
      {body}
    </section>
  );
}

function NotesField({ optionDef }) {
  const { state, dispatch } = useConfigurator();
  const value = state.selections.notes ?? '';
  return (
    <textarea
      value={value}
      maxLength={optionDef.max_length ?? 1000}
      onChange={(e) =>
        dispatch({ type: ACTIONS.SET_SELECTION, key: 'notes', value: e.target.value })
      }
      placeholder="Bemerkungen oder Sonderwünsche…"
      className="w-full min-h-24 border border-neutral-300 rounded p-2 text-sm"
    />
  );
}

export default function OptionsPanel() {
  const { product, config } = useConfigurator();
  if (!product) return null;
  const order = config.ui_flow.order.filter((k) => k in product.options);
  // Append any options not in the configured order so nothing gets dropped.
  const remaining = Object.keys(product.options).filter((k) => !order.includes(k));
  const finalOrder = [...order, ...remaining];

  return (
    <div className="space-y-6">
      {finalOrder.map((k) => (
        <OptionField key={k} optionKey={k} product={product} />
      ))}
    </div>
  );
}

export { OptionField };
