import { useConfigurator } from '../../state/ConfiguratorContext.jsx';
import { ACTIONS } from '../../state/reducer.js';

export default function DrawWeightPicker({ optionDef }) {
  const { state, dispatch } = useConfigurator();
  const value = state.selections.draw_weight;
  const range = optionDef.values_range ?? { min: 20, max: 70, step: 1 };
  const values = [];
  for (let v = range.min; v <= range.max; v += range.step) values.push(v);

  return (
    <div className="space-y-2">
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value ?? optionDef.default ?? range.min}
        onChange={(e) =>
          dispatch({
            type: ACTIONS.SET_SELECTION,
            key: 'draw_weight',
            value: Number(e.target.value)
          })
        }
        className="w-full"
      />
      <div className="flex justify-between text-xs text-neutral-500">
        <span>{range.min} {optionDef.unit}</span>
        <span className="text-neutral-900 font-medium">{value} {optionDef.unit}</span>
        <span>{range.max} {optionDef.unit}</span>
      </div>
    </div>
  );
}
