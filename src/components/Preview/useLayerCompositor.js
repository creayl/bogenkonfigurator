import { useMemo } from 'react';
import productsConfig from '../../config/products.json';
import { ralToHex } from '../../lib/ralColors.js';

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
    layers.push({ kind: 'riser', woodPattern });
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
