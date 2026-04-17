import { useConfigurator } from '../../state/ConfiguratorContext.jsx';
import { ACTIONS } from '../../state/reducer.js';

export default function WoodPicker({ optionDef }) {
  const { state, dispatch } = useConfigurator();
  const value = state.selections.wood;
  const options = optionDef.placeholder_values ?? [];

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() =>
              dispatch({ type: ACTIONS.SET_SELECTION, key: 'wood', value: opt.id })
            }
            className={`flex flex-col items-center p-2 rounded-md border transition ${
              selected
                ? 'border-neutral-900 ring-2 ring-neutral-900'
                : 'border-neutral-300 hover:border-neutral-500'
            }`}
          >
            <img
              src={opt.pattern}
              alt={opt.label_de}
              className="w-full h-12 object-cover rounded"
            />
            <span className="mt-1 text-xs">{opt.label_de}</span>
          </button>
        );
      })}
    </div>
  );
}
