/**
 * Result type to represent the outcome of an operation.
 * It can either be a success with a value or an error.
 * This is a generic type that can be used with any type of value and error (should extend Error).
 *
 * It is also an alias object containing the ok and error functions to
 * make it easier to create Result objects.
 */
export type Result<T, E extends Error> =
  | { readonly error: undefined; readonly value: T }
  | { readonly error: E };

/**
 * Async version of Result type that wraps a Result in a Promise.
 */
export type AsyncResult<T, E extends Error> = Promise<Result<T, E>>;

/**
 * Result utility functions for creating Result objects.
 */
export const R: {
  /**
   * Creates a successful Result with the given value.
   * @param value The success value
   * @returns A Result object representing success
   */
  ok<T>(value: T): Result<T, never>;
  /**
   * Creates an error Result with the given error.
   * @param error The error value
   * @returns A Result object representing error
   */
  error<E extends Error>(error: E): Result<never, E>;
} = {
  ok: <T>(value: T): Result<T, never> => ({ error: undefined, value }),
  error: <E extends Error>(error: E): Result<never, E> => ({ error }),
};
