export type BufferEntry<T> = {
  fn: (state: T) => T, state: T
};
