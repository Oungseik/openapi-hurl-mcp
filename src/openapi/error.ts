export type Success<T> = { error?: null; data: T };
export type Failure<E> = { error: E; data?: null };
export type Result<T, E = Error> = Success<T> | Failure<E>;

// error handling utility, like GoLang or TanStack Query
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data };
  } catch (e) {
    return { error: e as E };
  }
}

export function ok<T>(val: T): Success<T> {
  return { data: val };
}

export function err<E = Error>(e: E): Failure<E> {
  return { error: e };
}

