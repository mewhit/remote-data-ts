export const notAsked = (): RemoteData<unknown, unknown> => ({
  _tag: "NotAsked",
});
export const loading = (): RemoteData<unknown, unknown> => ({
  _tag: "Loading",
});
export const success = <A>(value: A): RemoteData<A, unknown> => ({
  _tag: "Success",
  value,
});
export const failure = <E>(value: E): RemoteData<unknown, E> => ({
  _tag: "Failure",
  value,
});

export type Success<A> = { value: A; _tag: "Success" };
export type Failure<E> = { value: E; _tag: "Failure" };
export type NotAsked = { _tag: "NotAsked" };
export type Loading = { _tag: "Loading" };

export type RemoteData<A, E> = NotAsked | Loading | Success<A> | Failure<E>;

export const foldw =
  <A, E, R>(whenNotAsked: () => R, whenLoading: () => R, whenSuccess: (a: A) => R, whenFailure: (e: E) => R) =>
  (rd: RemoteData<A, E>) => {
    if (isNotAsked(rd)) return whenNotAsked();
    if (isLoading(rd)) return whenLoading();
    if (isSuccess(rd)) return whenSuccess(rd.value);
    if (isFailure(rd)) return whenFailure(rd.value);
  };

export const fold: <A, E, R>(
  whenNotAsked: () => R,
  whenLoading: () => R,
  whenSuccess: (a: A) => R,
  whenFailure: (e: E) => R
) => (rd: RemoteData<A, E>) => R = foldw;

const _isSuccess = <A>(ma: RemoteData<A, unknown>): ma is Success<A> => ma._tag === "Success";

const isSuccess: <A>(rd: RemoteData<A, unknown>) => rd is Success<A> = _isSuccess;

const _isFailure = <E>(ma: RemoteData<unknown, E>): ma is Failure<E> => ma._tag === "Failure";

const isFailure: <E>(rd: RemoteData<unknown, E>) => rd is Failure<E> = _isFailure;

const _isLoading = (ma: RemoteData<unknown, unknown>): ma is Loading => ma._tag === "Loading";

const isLoading: (rd: RemoteData<unknown, unknown>) => rd is Loading = _isLoading;

const _isNotAsked = (ma: RemoteData<unknown, unknown>): ma is NotAsked => ma._tag === "NotAsked";

const isNotAsked: (rd: RemoteData<unknown, unknown>) => rd is NotAsked = _isNotAsked;
