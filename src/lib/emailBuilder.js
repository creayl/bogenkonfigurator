import { ralName } from './ralColors.js';
import { buildShareableUrl } from './urlState.js';

function formatValue(key, value, optionDef) {
  if (value === undefined || value === null) return '–';
  if (Array.isArray(value)) {
    if (key === 'stripe_colors') {
      return value.map((id, i) => `Streifen ${i + 1}: ${ralName(id)}`).join(', ');
    }
    if (optionDef?.type === 'multi_select') {
      const map = new Map((optionDef.values || []).map((v) => [v.id, v.label_de]));
      return value.map((id) => map.get(id) ?? id).join(', ') || '–';
    }
    return value.join(', ');
  }
  if (optionDef?.type === 'color' || (typeof value === 'string' && value.startsWith('RAL_'))) {
    return ralName(value);
  }
  if (optionDef?.type === 'radio') {
    const match = (optionDef.values || []).find((v) => v.id === value);
    return match?.label_de ?? value;
  }
  if (optionDef?.unit) return `${value} ${optionDef.unit}`;
  return String(value);
}

export function buildEmail({ product, state, recipient }) {
  const lines = [];
  lines.push(`Konfiguration: ${product.label_de}`);
  lines.push('');
  lines.push('Auswahl:');
  for (const [key, opt] of Object.entries(product.options)) {
    if (key === 'notes') continue;
    const v = state.selections[key];
    lines.push(`- ${opt.label_de}: ${formatValue(key, v, opt)}`);
  }

  const notes = state.selections.notes;
  if (notes && String(notes).trim()) {
    lines.push('');
    lines.push('Bemerkungen / Sonderwünsche:');
    lines.push(String(notes));
  }

  lines.push('');
  lines.push('Konfigurations-Link:');
  lines.push(buildShareableUrl({ productId: state.productId, selections: state.selections }));

  const body = lines.join('\n');
  const subject = `Konfigurationsanfrage: ${product.label_de}`;

  const params = new URLSearchParams();
  params.set('subject', subject);
  params.set('body', body);

  return `mailto:${recipient || ''}?${params.toString().replace(/\+/g, '%20')}`;
}
