export function softmax(logits, temperature = 1) {
  if (!Number.isFinite(temperature) || temperature <= 0)
    throw new RangeError("Temperature must be positive.");
  if (!logits.length || logits.some((x) => !Number.isFinite(x)))
    throw new TypeError("Finite logits required.");
  const scaled = logits.map((z) => z / temperature),
    max = Math.max(...scaled),
    exps = scaled.map((z) => Math.exp(z - max)),
    sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((x) => x / sum);
}
export function nearestCentroid(a, b, x) {
  if (
    !a.length ||
    !b.length ||
    [...a, ...b, x].some((v) => !Number.isFinite(v))
  )
    throw new TypeError("Both classes need finite examples.");
  const mean = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length,
    ca = mean(a),
    cb = mean(b),
    da = Math.abs(x - ca),
    db = Math.abs(x - cb);
  return {
    a: ca,
    b: cb,
    boundary: (ca + cb) / 2,
    label: da === db ? "tie" : da < db ? "A" : "B",
  };
}
export function forwardNetwork(x1, x2, w) {
  const h1 = Math.max(0, w * x1 + 0.5 * x2 - 0.5),
    h2 = Math.max(0, -0.7 * x1 + 0.8 * x2 + 0.2),
    z = h1 - 0.6 * h2;
  return { h1, h2, z, y: 1 / (1 + Math.exp(-z)) };
}
export function approximateTokens(text) {
  return (text.match(/\s+|[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu) || [])
    .flatMap((s) => (s.trim() && s.length > 7 ? s.match(/.{1,4}/gu) : [s]))
    .slice(0, 500)
    .map((piece) => ({
      piece,
      id: [...piece].reduce((a, c) => (a * 31 + c.codePointAt(0)) % 10007, 7),
    }));
}
export function seededRandom(seed) {
  let n = seed >>> 0;
  return () => {
    n = (1664525 * n + 1013904223) >>> 0;
    return n / 4294967296;
  };
}
export function sampleIndex(probabilities, rng = Math.random) {
  const draw = rng();
  let sum = 0;
  for (let i = 0; i < probabilities.length; i++) {
    sum += probabilities[i];
    if (draw < sum) return i;
  }
  return probabilities.length - 1;
}
