import { useConfigurator } from '../../state/ConfiguratorContext.jsx';
import { ACTIONS } from '../../state/reducer.js';
import { listPalette } from '../../lib/ralColors.js';

export default function StripeCountPicker({ optionDef }) {
  const { state, dispatch } = useConfigurator();
  const value = state.selections.stripe_count;
  const palette = listPalette();
  const stripeColors = state.selections.stripe_colors ?? [];

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {optionDef.values.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() =>
              dispatch({
                type: ACTIONS.SET_SELECTION,
                key: 'stripe_count',
                value: v
              })
            }
            className={`flex-1 py-2 rounded-md border transition ${
              value === v
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 hover:border-neutral-500'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      {optionDef.note_de && value === 5 ? (
        <p className="text-xs text-neutral-500 italic">{optionDef.note_de}</p>
      ) : null}

      <div className="space-y-2">
        <p className="text-xs text-neutral-600">Farbe pro Streifen</p>
        {stripeColors.map((stripe, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-16 text-sm text-neutral-700">Streifen {i + 1}</span>
            <select
              value={stripe}
              onChange={(e) =>
                dispatch({
                  type: ACTIONS.SET_STRIPE_COLOR,
                  index: i,
                  ralId: e.target.value
                })
              }
              className="flex-1 border border-neutral-300 rounded px-2 py-1 text-sm"
            >
              {palette.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} – {c.name_de}
                </option>
              ))}
            </select>
            <span
              className="w-6 h-6 rounded border border-neutral-300"
              style={{
                backgroundColor:
                  palette.find((c) => c.id === stripe)?.hex ?? '#000'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
