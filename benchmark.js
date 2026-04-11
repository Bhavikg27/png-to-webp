import { Blob } from 'buffer';
import { URL } from 'url';

const blob = new Blob(['hello'.repeat(1000)]); // 5KB blob
const iterations = 100000;

console.log(`Running benchmark with ${iterations} iterations...`);

const startBaseline = performance.now();
for (let i = 0; i < iterations; i++) {
  URL.revokeObjectURL(URL.createObjectURL(blob));
}
const endBaseline = performance.now();
console.log(`Baseline (Redundant Create/Revoke): ${(endBaseline - startBaseline).toFixed(3)}ms`);

const startOptimized = performance.now();
for (let i = 0; i < iterations; i++) {
  // Do nothing
}
const endOptimized = performance.now();
console.log(`Optimized (No-op): ${(endOptimized - startOptimized).toFixed(3)}ms`);
