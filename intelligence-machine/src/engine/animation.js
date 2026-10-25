export class AnimationEngine {
  constructor(onFrame = () => {}) {
    this.onFrame = onFrame;
    this.raf = 0;
    this.elapsed = 0;
    this.duration = 0;
    this.paused = false;
    this.job = null;
    this.last = 0;
  }
  run(duration, update, complete) {
    this.cancel();
    this.duration = duration;
    this.elapsed = 0;
    this.job = { update, complete };
    this.paused = false;
    update(0);
    this.last = performance.now();
    this.tick(this.last);
  }
  tick = (now) => {
    if (!this.job || this.paused) return;
    const dt = Math.min(80, Math.max(0, now - this.last));
    this.last = now;
    this.elapsed = Math.min(this.duration, this.elapsed + dt);
    const p = this.duration ? this.elapsed / this.duration : 1;
    this.job.update(p);
    this.onFrame(this.elapsed);
    if (p >= 1) {
      const fn = this.job.complete;
      this.job = null;
      this.raf = 0;
      fn?.();
    } else this.raf = requestAnimationFrame(this.tick);
  };
  pause() {
    if (!this.job) return;
    this.paused = true;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
  resume() {
    if (!this.job || !this.paused) return;
    this.paused = false;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }
  finish() {
    if (!this.job) return;
    cancelAnimationFrame(this.raf);
    const job = this.job;
    this.job = null;
    this.raf = 0;
    this.paused = false;
    job.update(1);
    job.complete?.();
  }
  cancel() {
    cancelAnimationFrame(this.raf);
    this.job = null;
    this.raf = 0;
    this.paused = false;
  }
}
export const easeInOut = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
export function pointAlong(points, p) {
  const lengths = points
    .slice(1)
    .map((v, i) => Math.hypot(v.x - points[i].x, v.y - points[i].y));
  let target = p * lengths.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lengths.length; i++) {
    if (target <= lengths[i] || i === lengths.length - 1) {
      const t = lengths[i] ? Math.min(1, target / lengths[i]) : 0;
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * t,
        y: points[i].y + (points[i + 1].y - points[i].y) * t,
        dx: points[i + 1].x - points[i].x,
      };
    }
    target -= lengths[i];
  }
  return points.at(-1);
}
