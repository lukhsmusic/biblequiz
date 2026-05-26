function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateSeed(date) {
  const d = date || new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function dailyList(totalVerses, count, date) {
  const rng = mulberry32(dateSeed(date));
  const indices = new Set();
  while (indices.size < count && indices.size < totalVerses) {
    indices.add(Math.floor(rng() * totalVerses));
  }
  return Array.from(indices);
}
