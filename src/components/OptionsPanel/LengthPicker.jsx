import { useConfigurator } from '../../state/ConfiguratorContext.jsx';
import { ACTIONS } from '../../state/reducer.js';

export default function LengthPicker({ optionDef }) {
  const { state, dispatch } = useConfigurator();
  const value = state.selections.length;

  return (
    <select
      value={value ?? ''}
      onChange={(e) =>
        dispatch({
          type: ACTIONS.SET_SELECTION,
          key: 'length',
          value: Number(e.target.value)
        })
      }
      className="w-full border border-neutral-300 rounded px-3 py-2"
    >
      {optionDef.values.map((v) => (
        <option key={v} value={v}>
          {v} {optionDef.unit ?? ''}
        </option>
      ))}
    </select>
  );
}
