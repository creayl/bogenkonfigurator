import { useConfigurator } from '../../state/ConfiguratorContext.jsx';
import { ACTIONS } from '../../state/reducer.js';
import { listPalette } from '../../lib/ralColors.js';

export default function ColorPicker({ optionKey }) {
  const { state, dispatch } = useConfigurator();
  const value = state.selections[optionKey];
  const palette = listPalette();

  return (
    <div className="flex flex-wrap gap-2">
      {palette.map((c) => {
        const selected = value === c.id;
        return (
          <button
            key={c.id}
            type="button"
            title={`${c.id} – ${c.name_de}`}
            onClick={() =>
              dispatch({ type: ACTIONS.SET_SELECTION, key: optionKey, value: c.id })
            }
            className={`w-9 h-9 rounded-full border-2 transition ${
              selected ? 'border-neutral-900 ring-2 ring-offset-1 ring-neutral-900' : 'border-neutral-300'
            }`}
            style={{ backgroundColor: c.hex }}
          />
        );
      })}
    </div>
  );
}
