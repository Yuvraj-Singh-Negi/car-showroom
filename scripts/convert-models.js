/**
 * Converts separate glTF (.gltf + .bin + textures/) folders into single,
 * self-contained .glb files using gltf-pipeline (the industry-standard tool).
 *
 * Output: public/models/car1.glb, car2.glb, car3.glb
 *
 * Run: node scripts/convert-models.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MODELS_SRC = path.join(ROOT, 'models');
const OUT_DIR = path.join(ROOT, 'public', 'models');

const MAP = [
  { src: '2007_koenigsegg_ccxr', out: 'car1.glb' },
  { src: '2025_bmw_m4_gt3_evo_g82', out: 'car2.glb' },
  { src: 'mazda_lm_vision__www.vecarz.com', out: 'car3.glb' },
];

async function convert(srcDir, outFile) {
  const gltfPath = path.join(srcDir, 'scene.gltf');
  const gltf = JSON.parse(fs.readFileSync(gltfPath, 'utf8'));

  const { default: gltfPipeline } = await import('gltf-pipeline');

  const { glb } = await gltfPipeline.gltfToGlb(gltf, {
    resourceDirectory: srcDir,
    separate: false,
  });

  const buffer = Buffer.from(glb);

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, buffer);
  console.log(
    `✓ ${path.basename(srcDir)} -> ${outFile} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`,
  );
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const { src, out } of MAP) {
    await convert(path.join(MODELS_SRC, src), path.join(OUT_DIR, out));
  }
  console.log('\nDone. Model paths:');
  for (const { out } of MAP) {
    console.log(`  /models/${out}`);
  }
})();
