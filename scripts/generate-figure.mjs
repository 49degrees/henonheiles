import { writeFileSync } from 'node:fs';

const Ec = 1 / 6;
const onset = 9 / 64;
const D = (energy) => {
  const theta = Math.acos(1 - 12 * energy);
  const r = 0.5 + Math.cos(theta / 3 - 2 * Math.PI / 3);
  return 2 * r / (3 - 2 * r);
};

function panel(offset, comparison) {
  const maxY = comparison ? 1.1 : 2.2;
  const x = (e) => 65 + 470 * e / Ec;
  const y = (v) => 350 - v / maxY * 280;
  const curve = Array.from({ length: 500 }, (_, i) => {
    const energy = 0.000001 + i / 499 * (Ec - 0.000001001);
    return `${i ? 'L' : 'M'}${x(energy).toFixed(3)},${y(D(energy) * (comparison ? 0.5 : 1)).toFixed(3)}`;
  }).join(' ');
  let svg = `<g transform="translate(${offset},0)"><text x="65" y="36" class="heading">(${comparison ? 'b' : 'a'}) ${comparison ? 'Threshold comparison' : 'Geometric diagnostic'}</text>`;
  for (const value of [0, 0.5, 1, 1.5, 2].filter(v => v < maxY)) {
    svg += `<line x1="65" x2="535" y1="${y(value)}" y2="${y(value)}" class="grid"/><text x="52" y="${y(value) + 4}" text-anchor="end">${value.toFixed(1)}</text>`;
  }
  for (const energy of [0, 0.05, 0.1, 0.15]) {
    svg += `<line x1="${x(energy)}" x2="${x(energy)}" y1="70" y2="350" class="grid"/><text x="${x(energy)}" y="376" text-anchor="middle">${energy.toFixed(2)}</text>`;
  }
  svg += `<path d="M65 70V350H535" fill="none" stroke="#978d9e"/><path d="M${x(onset)} 70V350" class="onset"/><path d="M65 ${y(1)}H535" class="fixed"/><path d="${curve}" class="curve"/><circle cx="535" cy="${y(comparison ? 1 : 2)}" r="4" fill="#f7f6f2" stroke="#7954c5" stroke-width="2"/><text x="78" y="${y(1) - 12}" fill="#a76f4d">fixed alpha = 1</text><text x="${x(onset) - 8}" y="335" text-anchor="end">E = 9/64</text><text x="535" y="376" text-anchor="end">1/6-</text><text x="535" y="409" text-anchor="end">Energy E (dimensionless)</text><text x="65" y="442" fill="#7954c5">${comparison ? 'adaptive alpha(E) = 0.5 D(E)' : 'D(E) = 2 r_minus / (3 - 2 r_minus)'}</text></g>`;
  return svg;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="520" viewBox="0 0 1200 520" role="img" aria-labelledby="title description"><title id="title">Figure 1. Exact geometric calibration and threshold comparison</title><desc id="description">Recomputed from Equations 4 and 7. D grows strictly to the one-sided limit 2 at escape. D equals 1 at E = 9/64. A fixed alpha of 1 differs from adaptive alpha(E) = 0.5 D(E). No transport claim is made.</desc><rect width="1200" height="520" fill="#f7f6f2"/><style>text{font:12px monospace;fill:#786c82}.heading{font:20px sans-serif;fill:#262329}.grid{stroke:#d8d0de;stroke-width:.7}.curve{fill:none;stroke:#7954c5;stroke-width:2.5}.fixed{fill:none;stroke:#a76f4d;stroke-width:1.5;stroke-dasharray:7 6}.onset{stroke:#978d9e;stroke-width:1;stroke-dasharray:2 5}</style>${panel(10, false)}${panel(610, true)}<text x="75" y="493" font-size="10">The open endpoints denote one-sided limits. E = 1/6 is outside the bounded-well theorem. Recomputed companion figure.</text></svg>`;
writeFileSync('public/downloads/figure1.svg', svg);
console.log('Recomputed Figure 1 saved to public/downloads/figure1.svg');