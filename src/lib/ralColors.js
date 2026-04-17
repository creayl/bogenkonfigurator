import productsConfig from '../config/products.json';

const palette = productsConfig.palettes.ral_palette_placeholder;

const byId = new Map(palette.map((c) => [c.id, c]));

export function getRalColor(id) {
  return byId.get(id) || null;
}

export function ralToHex(id, fallback = '#0A0A0A') {
  return byId.get(id)?.hex ?? fallback;
}

export function ralName(id) {
  return byId.get(id)?.name_de ?? id;
}

export function listPalette() {
  return palette;
}
