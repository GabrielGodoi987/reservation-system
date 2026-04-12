export type Left<L> = { _tag: 'Left'; left: L };
export type Right<R> = { _tag: 'Right'; right: R };
export type Either<L, R> = Left<L> | Right<R>;

export const left = <L>(left: L): Either<L, never> => ({ _tag: 'Left', left });
export const right = <R>(right: R): Either<never, R> => ({ _tag: 'Right', right });

export const isLeft = <L, R>(either: Either<L, R>): either is Left<L> =>
  either._tag === 'Left';

export const isRight = <L, R>(either: Either<L, R>): either is Right<R> =>
  either._tag === 'Right';

export const map = <L, R, R2>(
  either: Either<L, R>,
  fn: (right: R) => R2
): Either<L, R2> => {
  if (isLeft(either)) return either;
  return right(fn(either.right));
};

export const mapLeft = <L, L2, R>(
  either: Either<L, R>,
  fn: (left: L) => L2
): Either<L2, R> => {
  if (isLeft(either)) return left(fn(either.left));
  return either;
};

export const fold = <L, R, T>(
  either: Either<L, R>,
  onLeft: (left: L) => T,
  onRight: (right: R) => T
): T => {
  if (isLeft(either)) return onLeft(either.left);
  return onRight(either.right);
};

export const chain = <L, R, R2>(
  either: Either<L, R>,
  fn: (right: R) => Either<L, R2>
): Either<L, R2> => {
  if (isLeft(either)) return either;
  return fn(either.right);
};

export const chainLeft = <L, L2, R>(
  either: Either<L, R>,
  fn: (left: L) => Either<L2, R>
): Either<L2, R> => {
  if (isLeft(either)) return fn(either.left);
  return either;
};

export type AppError =
  | { _tag: 'NotFoundError'; message: string }
  | { _tag: 'ValidationError'; message: string }
  | { _tag: 'DatabaseError'; message: string };

export const notFound = (message: string): AppError => ({
  _tag: 'NotFoundError',
  message,
});

export const validationError = (message: string): AppError => ({
  _tag: 'ValidationError',
  message,
});

export const databaseError = (message: string): AppError => ({
  _tag: 'DatabaseError',
  message,
});

export const toAppError = (error: unknown): AppError => {
  if (error instanceof Error) {
    return { _tag: 'DatabaseError', message: error.message };
  }
  return { _tag: 'DatabaseError', message: 'Unknown error' };
};