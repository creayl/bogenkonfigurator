import { useConfigurator } from '../../state/ConfiguratorContext.jsx';
import { ACTIONS } from '../../state/reducer.js';

export default function TillerPicker({ optionDef }) {
  const { state, dispatch } = useConfigurator();
  const value = state.selections.tiller;

  return (
    <div className="flex gap-2">
      {optionDef.values.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() =>
            dispatch({
              type: ACTIONS.SET_SELECTION,
              key: 'tiller',
              value: v.id
            })
          }
          className={`flex-1 py-2 rounded-md border transition ${
            value === v.id
              ? 'border-neutral-900 bg-neutral-900 text-white'
              : 'border-neutral-300 hover:border-neutral-500'
          }`}
        >
          {v.label_de}
        </button>
      ))}
    </div>
  );
}
