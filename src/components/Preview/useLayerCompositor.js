import { useMemo } from 'react';
import productsConfig from '../../config/products.json';
import { ralToHex } from '../../lib/ralColors.js';

// Siehe PROJECT_BRIEF.md (Wood patterns): die SVG-Patterns basieren auf
// diesen Grundtönen. Wir ziehen sie hier raus, damit die Canvas-Vorschau
// eine solide Fallback-Farbe kennt, wenn das Pattern nicht geladen werden
// kann (z.B. bei html2canvas-Rasterung für den PDF-Export).
const WOOD_BASE_COLORS = {
  oak: '#C8A877',
  walnut: '#5C4033',
  maple: '#E8D4A8'
};

// Builds an array of layer specs from the current selections. Each spec is
// renderer-agnostic: today CanvasPreview interprets them as inline SVG groups,
// later the same specs will drive a raster canvas tinting routine.
export function useLayerCompositor({ product, selections }) {
  return useMemo(() => {
    if (!product) return { layers: [], mirror: false };

    const woodId = selections.wood ?? 'oak';
    const woodOpt = product.options.wood;
    const woodEntry = (woodOpt?.placeholder_values ?? []).find((w) => w.id === woodId);
    const woodPattern = woodEntry?.pattern ?? '/assets/wood-patterns/oak.svg';
    // Basis-Farbton pro Holzart. Wird als solide Fallback-Füllung unter dem
    // Pattern gerendert, damit die Silhouette auch dann sichtbar ist, wenn
    // html2canvas (PDF-Export) externe SVG-Pattern-Referenzen nicht auflöst.
    const woodBase = WOOD_BASE_COLORS[woodId] ?? WOOD_BASE_COLORS.oak;

    const stripeCount = Number(selections.stripe_count ?? 3);
    const stripeColors = (selections.stripe_colors ?? []).map((id) => ralToHex(id));

    const limbColor = ralToHex(selections.limb_color ?? 'RAL_9005');
    const wedgeColor = ralToHex(selections.wedge_color ?? 'RAL_9005');
    const tipColor = ralToHex(selections.tip_color ?? 'RAL_9005');

    const isTakedown = product.id === 'takedown_bogen';
    const mirror = (selections.handedness ?? 'RH') === 'LH';

    const layers = [];

    // Back to front: limbs, wedges, riser, tips, stripes overlay.
    if (isTakedown) {
      layers.push({ kind: 'limb', position: 'upper', color: limbColor });
      layers.push({ kind: 'limb', position: 'lower', color: limbColor });
      layers.push({ kind: 'wedge', position: 'upper', color: wedgeColor });
      layers.push({ kind: 'wedge', position: 'lower', color: wedgeColor });
    }
    layers.push({ kind: 'riser', woodPattern, woodBase });
    if (isTakedown) {
      layers.push({ kind: 'tip', position: 'upper', color: tipColor });
      layers.push({ kind: 'tip', position: 'lower', color: tipColor });
    }
    layers.push({ kind: 'stripes', count: stripeCount, colors: stripeColors });

    return { layers, mirror, productId: product.id };
  }, [product, selections]);
}

// Useful for non-React consumers (e.g. PDF generator pre-render).
export function getProductLayout(productId) {
  const isTakedown = productId === 'takedown_bogen';
  return { isTakedown };
}

// Re-export so consumers can pull palette helpers if needed without
// reaching into the config directly.
export { productsConfig };
