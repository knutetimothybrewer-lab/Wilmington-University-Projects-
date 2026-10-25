/** A reusable host for future labs; no chapter lab is represented as implemented. */
export class SimulationController {
  constructor(definition) {
    if (
      !definition ||
      !["computational", "mathematical", "conceptual"].includes(
        definition.kind,
      ) ||
      typeof definition.evaluate !== "function"
    )
      throw new TypeError(
        "A simulation requires an explicit model kind and evaluate function.",
      );
    this.definition = definition;
    this.initial = structuredClone(definition.initial);
    this.inputs = structuredClone(this.initial);
    this.listeners = new Set();
    this.result = definition.evaluate(structuredClone(this.inputs));
  }
  snapshot() {
    return {
      kind: this.definition.kind,
      inputs: structuredClone(this.inputs),
      result: structuredClone(this.result),
    };
  }
  update(patch) {
    const candidate = { ...structuredClone(this.inputs), ...patch };
    this.definition.validate?.(candidate);
    const result = this.definition.evaluate(structuredClone(candidate));
    this.inputs = candidate;
    this.result = result;
    this.listeners.forEach((fn) => fn(this.snapshot()));
    return this.snapshot();
  }
  reset() {
    this.inputs = structuredClone(this.initial);
    this.result = this.definition.evaluate(structuredClone(this.inputs));
    this.listeners.forEach((fn) => fn(this.snapshot()));
    return this.snapshot();
  }
  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }
}
