import { forwardRef } from 'react';
import { useConfigurator } from '../../state/ConfiguratorContext.jsx';
import { useLayerCompositor } from './useLayerCompositor.js';

// Inline SVG bow composition. Layer specs come from useLayerCompositor.
// Each "layer" is rendered as a JSX group; later the same specs can drive
// raster canvas tinting on real photos without touching this consumer.
const CanvasPreview = forwardRef(function CanvasPreview(_, ref) {
  const { product, state } = useConfigurator();
  const { layers, mirror } = useLayerCompositor({
    product,
    selections: state.selections
  });

  if (!product) return null;

  return (
    <div
      ref={ref}
      className="w-full max-w-md mx-auto bg-white rounded-lg border border-neutral-200 p-4 shadow-sm"
    >
      <svg
        viewBox="0 0 360 760"
        className="w-full h-auto"
        style={{ transform: mirror ? 'scaleX(-1)' : 'none' }}
        aria-label="Bogen-Vorschau"
      >
        <defs>
          <pattern
            id="wood-pattern"
            patternUnits="userSpaceOnUse"
            width="128"
            height="128"
          >
            {/* Wood pattern is referenced from the public placeholder set. */}
            {layers
              .filter((l) => l.kind === 'riser')
              .map((l, i) => (
                <image
                  key={i}
                  href={l.woodPattern}
                  x="0"
                  y="0"
                  width="128"
                  height="128"
                  preserveAspectRatio="xMidYMid slice"
                />
              ))}
          </pattern>
        </defs>

        {layers.map((layer, idx) => renderLayer(layer, idx))}
      </svg>
    </div>
  );
});

function renderLayer(layer, idx) {
  switch (layer.kind) {
    case 'limb':
      return <LimbLayer key={idx} position={layer.position} color={layer.color} />;
    case 'wedge':
      return <WedgeLayer key={idx} position={layer.position} color={layer.color} />;
    case 'tip':
      return <TipLayer key={idx} position={layer.position} color={layer.color} />;
    case 'riser':
      return <RiserLayer key={idx} />;
    case 'stripes':
      return <StripesLayer key={idx} count={layer.count} colors={layer.colors} />;
    default:
      return null;
  }
}

// All shapes mirror the placeholder SVGs in /public/assets/components.
// Coordinates are arranged so they form a recognizable bow silhouette.

function RiserLayer() {
  return (
    <g data-layer="riser" transform="translate(140 180)">
      <path
        data-color-region="wood"
        fill="url(#wood-pattern)"
        d="M30 0 H50 V60 Q60 80 60 120 Q60 160 40 200 Q60 240 60 280 Q60 320 50 340 V400 H30 V340 Q20 320 20 280 Q20 240 40 200 Q20 160 20 120 Q20 80 30 60 Z"
      />
    </g>
  );
}

function StripesLayer({ count, colors }) {
  // Visual: render up to 3 bands (per brief note: 5 stripes shown as 3 in preview).
  const bandCount = Math.min(count, 3);
  const baseY = 360;
  const gap = 10;
  const height = 6;
  const xs = 160;
  const w = 40;
  return (
    <g data-layer="stripes" transform="translate(0 0)">
      {Array.from({ length: bandCount }).map((_, i) => (
        <rect
          key={i}
          data-stripe-index={i}
          x={xs}
          y={baseY + i * gap}
          width={w}
          height={height}
          fill={colors[i] ?? colors[0] ?? '#0A0A0A'}
        />
      ))}
    </g>
  );
}

function LimbLayer({ position, color }) {
  // Limb native: 300x60. Rotated -90 (upper) or +90 (lower) so the limb
  // extends vertically away from the riser.
  const transform =
    position === 'upper'
      ? 'translate(180 200) rotate(-90) translate(0 -30)'
      : 'translate(180 560) rotate(90) translate(0 -30)';
  return (
    <g data-layer={`limb-${position}`} transform={transform}>
      <path
        data-color-region="limb"
        fill={color}
        d="M0 30 Q75 0 150 18 Q225 36 300 30 Q225 50 150 38 Q75 30 0 30 Z"
      />
    </g>
  );
}

function WedgeLayer({ position, color }) {
  const transform =
    position === 'upper'
      ? 'translate(165 180)'
      : 'translate(165 580) scale(1 -1)';
  return (
    <g data-layer={`wedge-${position}`} transform={transform}>
      <path
        data-color-region="wedge"
        fill={color}
        d="M2 22 L28 22 L20 6 L10 6 Z"
      />
    </g>
  );
}

function TipLayer({ position, color }) {
  const transform =
    position === 'upper'
      ? 'translate(160 -110)'
      : 'translate(160 690)';
  return (
    <g data-layer={`tip-${position}`} transform={transform}>
      <path
        data-color-region="tip"
        fill={color}
        d="M4 18 Q20 4 36 18 Q34 26 30 30 Q20 34 10 30 Q6 26 4 18 Z"
      />
    </g>
  );
}

export default CanvasPreview;
