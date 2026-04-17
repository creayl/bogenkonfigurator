import { useConfigurator } from '../../state/ConfiguratorContext.jsx';
import { ACTIONS } from '../../state/reducer.js';

export default function AccessoriesPicker({ optionDef }) {
  const { state, dispatch } = useConfigurator();
  const value = state.selections.accessories ?? [];

  function toggle(id) {
    const next = value.includes(id)
      ? value.filter((v) => v !== id)
      : [...value, id];
    dispatch({ type: ACTIONS.SET_SELECTION, key: 'accessories', value: next });
  }

  return (
    <div className="space-y-2">
      {optionDef.values.map((v) => {
        const checked = value.includes(v.id);
        return (
          <label
            key={v.id}
            className="flex items-center gap-2 p-2 border border-neutral-300 rounded cursor-pointer hover:bg-neutral-50"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(v.id)}
            />
            <span>{v.label_de}</span>
          </label>
        );
      })}
    </div>
  );
}
