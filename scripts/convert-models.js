/**
 * Converts separate glTF (.gltf + .bin + textures/) folders into single,
 * self-contained .glb files with all geometry and textures embedded.
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

// Source folder -> output name
const MAP = [
  { src: '2007_koenigsegg_ccxr', out: 'car1.glb' },
  { src: '2025_bmw_m4_gt3_evo_g82', out: 'car2.glb' },
  { src: 'mazda_lm_vision__www.vecarz.com', out: 'car3.glb' },
];

const GLTF_MAGIC = 0x46546c67; // "glTF"
const GLTF_VERSION = 2;
const CHUNK_JSON = 0x0;
const CHUNK_BIN = 0x1;

function align4(n) {
  return Math.ceil(n / 4) * 4;
}

function mimeTypeFor(uri) {
  const ext = path.extname(uri).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.bmp') return 'image/bmp';
  return 'image/png';
}

function convert(srcDir, outFile) {
  const gltfPath = path.join(srcDir, 'scene.gltf');
  const binPath = path.join(srcDir, 'scene.bin');

  if (!fs.existsSync(gltfPath)) {
    throw new Error(`Missing scene.gltf in ${srcDir}`);
  }

  const gltf = JSON.parse(fs.readFileSync(gltfPath, 'utf8'));
  const binData = fs.existsSync(binPath) ? fs.readFileSync(binPath) : null;

  // Collect texture image files referenced by image.uri (relative to srcDir).
  const images = (gltf.images || []).map((img) => {
    const uri = img.uri;
    const abs = uri ? path.join(srcDir, uri) : null;
    const exists = abs && fs.existsSync(abs);
    return {
      ...img,
      _abs: abs,
      _exists: exists,
      _data: exists ? fs.readFileSync(abs) : null,
    };
  });

  // Build one binary blob: [scene.bin][texture1][texture2]...
  const parts = [];
  const bufferViews = [];

  // Existing bufferViews from geometry reference buffer 0 at offsets into scene.bin.
  // We preserve them as long as scene.bin starts at offset 0.
  let cursor = 0;

  if (binData) {
    parts.push(binData);
    cursor += binData.length;
  }

  // Add texture chunks after geometry.
  const textureBufferViewStart = (gltf.bufferViews || []).length;
  images.forEach((img, i) => {
    if (!img._data) return;
    const bvIndex = textureBufferViewStart + i;
    bufferViews[bvIndex] = {
      buffer: 0,
      byteOffset: cursor,
      byteLength: img._data.length,
    };
    parts.push(img._data);
    cursor += img._data.length;
  });

  const binaryBlob = Buffer.concat(parts);
  const totalByteLength = binaryBlob.length;

  // Mutate gltf JSON for embedded storage.
  if (gltf.buffers && gltf.buffers[0]) {
    gltf.buffers[0].byteLength = totalByteLength;
    gltf.buffers[0].uri = undefined;
  }

  // Preserve existing geometry bufferViews (they reference buffer 0 offsets into scene.bin).
  const existingBVs = gltf.bufferViews || [];
  const mergedBufferViews = [...existingBVs];

  // Attach texture bufferViews (they were computed above).
  images.forEach((img, i) => {
    if (!img._data) return;
    const bvIndex = textureBufferViewStart + i;
    mergedBufferViews[bvIndex] = bufferViews[bvIndex];
  });
  gltf.bufferViews = mergedBufferViews;

  images.forEach((img, i) => {
    if (!img._data) return;
    const bvIndex = textureBufferViewStart + i;
    delete img._abs;
    delete img._exists;
    delete img._data;
    img.bufferView = bvIndex;
    img.mimeType = mimeTypeFor(img.uri || '');
    img.uri = undefined;
  });

  const jsonBytes = Buffer.from(JSON.stringify(gltf), 'utf8');

  // Build glb file.
  const jsonPadded = align4(jsonBytes.length);
  const binPadded = align4(totalByteLength);

  const headerSize = 12;
  const chunk0Size = 8 + jsonPadded;
  const chunk1Size = 8 + binPadded;
  const fileLength = headerSize + chunk0Size + chunk1Size;

  const out = Buffer.alloc(fileLength);
  let o = 0;
  // Header
  out.writeUInt32LE(GLTF_MAGIC, o); o += 4;
  out.writeUInt32LE(GLTF_VERSION, o); o += 4;
  out.writeUInt32LE(fileLength, o); o += 4;
  // Chunk 0: JSON
  out.writeUInt32LE(jsonBytes.length, o); o += 4;
  out.writeUInt32LE(CHUNK_JSON, o); o += 4;
  jsonBytes.copy(out, o); o += jsonBytes.length;
  // pad JSON with spaces
  for (let i = jsonBytes.length; i < jsonPadded; i++) out[o++] = 0x20;
  // Chunk 1: BIN
  out.writeUInt32LE(totalByteLength, o); o += 4;
  out.writeUInt32LE(CHUNK_BIN, o); o += 4;
  binaryBlob.copy(out, o); o += totalByteLength;
  // pad BIN with zeros
  for (let i = totalByteLength; i < binPadded; i++) out[o++] = 0x00;

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, out);
  console.log(
    `✓ ${path.basename(srcDir)} -> ${outFile} (${(fileLength / 1024 / 1024).toFixed(2)} MB, ${images.length} images embedded)`,
  );
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const { src, out } of MAP) {
  convert(path.join(MODELS_SRC, src), path.join(OUT_DIR, out));
}

console.log('\nDone. Model paths:');
for (const { out } of MAP) {
  console.log(`  /models/${out}`);
}
