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
      return <RiserLayer key={idx} woodBase={layer.woodBase} />;
    case 'stripes':
      return <StripesLayer key={idx} count={layer.count} colors={layer.colors} />;
    default:
      return null;
  }
}

// All shapes mirror the placeholder SVGs in /public/assets/components.
// Coordinates are arranged so they form a recognizable bow silhouette.

function RiserLayer({ woodBase = '#D4A574' }) {
  // Zwei Pfade auf identischer Geometrie: der erste liefert eine solide
  // Holz-Grundfarbe als Silhouette (und bleibt sichtbar, wenn das externe
  // Pattern-Bild in html2canvas nicht geladen wird), der zweite legt das
  // SVG-Pattern darüber, sobald es verfügbar ist.
  const d =
    'M30 0 H50 V60 Q60 80 60 120 Q60 160 40 200 Q60 240 60 280 Q60 320 50 340 V400 H30 V340 Q20 320 20 280 Q20 240 40 200 Q20 160 20 120 Q20 80 30 60 Z';
  return (
    <g data-layer="riser" transform="translate(140 180)">
      <path data-color-region="wood-base" fill={woodBase} d={d} />
      <path data-color-region="wood" fill="url(#wood-pattern)" d={d} />
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
  // Limb: vertikal verlaufende Schwinge, die von der Wedge-Position am
  // Riser bis kurz vor den Tip läuft. Als eigener vertikaler Pfad statt
  // gedrehtem Rechteck gezeichnet, damit die ausgewählte Farbe auf einer
  // klar sichtbaren Fläche landet.
  const d =
    position === 'upper'
      ? 'M150 170 Q165 100 170 40 Q175 100 190 170 Z'
      : 'M150 590 Q165 660 170 720 Q175 660 190 590 Z';
  return (
    <g data-layer={`limb-${position}`}>
      <path data-color-region="limb" fill={color} d={d} />
    </g>
  );
}

function WedgeLayer({ position, color }) {
  // Wedges sitzen sichtbar an der Außenkante des Risers, dort wo der Limb
  // ansetzt. Vorher wurden sie mitten im Riser gezeichnet und dadurch von
  // der Riser-Silhouette komplett überdeckt.
  const transform =
    position === 'upper'
      ? 'translate(150 160)'
      : 'translate(150 620) scale(1 -1)';
  return (
    <g data-layer={`wedge-${position}`} transform={transform}>
      <path
        data-color-region="wedge"
        fill={color}
        d="M0 22 L44 22 L34 4 L10 4 Z"
      />
    </g>
  );
}

function TipLayer({ position, color }) {
  // Tips sitzen an den äußeren Enden der Limbs und müssen innerhalb des
  // viewBox (0–760) liegen, damit die Farbwahl sichtbar ist. Der obere
  // Tip lag zuvor bei y=-110 und war dadurch komplett außerhalb.
  const transform =
    position === 'upper'
      ? 'translate(150 20)'
      : 'translate(150 720)';
  return (
    <g data-layer={`tip-${position}`} transform={transform}>
      <path
        data-color-region="tip"
        fill={color}
        d="M6 20 Q22 4 38 20 Q36 30 30 34 Q22 38 14 34 Q8 30 6 20 Z"
      />
    </g>
  );
}

export default CanvasPreview;
