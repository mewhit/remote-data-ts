/**
 * Frequently when you're fetching data from an API, you want to represent four different states:
 *
 * NotAsked - We haven't asked for the data yet.
 *
 * Loading - We've asked, but haven't got an answer yet.
 *
 * Failure - We asked, but something went wrong. Here's the error.
 *
 * Success - Everything worked, and here's the data.
 */
export type RemoteData<A, E> = NotAsked | Loading | Success<A> | Failure<E>;

/**   Initial NotAsked into the realm of RemoteData.
 **/
export const notAsked = <A, E>(): RemoteData<A, E> => ({
  _tag: "NotAsked",
});
/**  Initial Loading into the realm of RemoteData.
 **/
export const loading = <A, E>(): RemoteData<A, E> => ({
  _tag: "Loading",
});

/**  Lift an ordinary value into the realm of RemoteData.
 **/
export const success = <A, B>(value: A): RemoteData<A, B> => ({
  _tag: "Success",
  value,
});

/**  Lift an error into the realm of RemoteData.
 **/
export const failure = <A, E>(value: E): RemoteData<A, E> => ({
  _tag: "Failure",
  value,
});

type Success<A> = { value: A; _tag: "Success" };
type Failure<E> = { value: E; _tag: "Failure" };
type NotAsked = { _tag: "NotAsked" };
type Loading = { _tag: "Loading" };

/** Map a function into the Success value.
 * @param whenSucceed Function to map the succeed value
 * @returns Function thats take the remote data
 * @param remoteData The remotedata to map
 * @returns The return new states ,if succeed state return mapped state
 * @example map(item => items.filter(predicate)))(loading()) === loading()
 * @example map(item => +item)(success("10")) === success(10)
 */
export const map =
  <A, R>(whenSucceed: (A) => R) =>
  (rd: RemoteData<A, unknown>) => {
    if (isSuccess(rd)) return success(whenSucceed(rd.value));
    return rd;
  };

/** Combine two remote data sources with the given function. The result will succeed when (and if) both sources succeed. If not return de failure one and if its 2 failure return the first one.
 * @param whenSucceed Function to map the succeed value
 * @returns Function thats take the first RemoteData
 * @param remoteData First RemoteData
 * @returns Function thats take the remote second RemoteData
 * @param remoteData2 Second RemoteData
 * @returns The return new states ,if succeed state return mapped state
 * @example map2((item1, item2) => item1 + item2)(loading())(success(10)) === loading()
 * @example map2((item1, item2) => item1 + item2)(success(10))(success(10)) === success(20)
 * @example map2((item1, item2) => item1 + item2)(notAsked())(loading()) === notAsked()
 */
export const map2 =
  <A, B, R>(whenSucceed: (A, B) => R) =>
  (rd: RemoteData<A, unknown>) =>
  (rd2: RemoteData<B, unknown>) => {
    if (isSuccess(rd) && isSuccess(rd2)) return success(whenSucceed(rd.value, rd2.value));
    if (isNotAsked(rd) || isLoading(rd) || isFailure(rd)) return rd;
    return rd2;
  };

/** Return the Success value, or the default.
 * @param defaultValue The value returned if is not Succeed
 * @returns Function thats take the RemoteData
 * @param remoteData RemoteData
 * @returns The default value or the success value
 * @example withDefault("Not Success RemoteData")(loading()) === "Not Success RemoteData"
 * @example withDefault("Not Success RemoteData")(success("10")) === success("10")
 */
export const withDefault =
  <A>(defaultValue: A) =>
  (rd: RemoteData<A, unknown>) =>
    isSuccess(rd) ? rd.value : defaultValue;

const foldw =
  <A, E, R>(whenNotAsked: () => R, whenLoading: () => R, whenSuccess: (a: A) => R, whenFailure: (e: E) => R) =>
  (rd: RemoteData<A, E>) => {
    if (isNotAsked(rd)) return whenNotAsked();
    if (isLoading(rd)) return whenLoading();
    if (isSuccess(rd)) return whenSuccess(rd.value);
    if (isFailure(rd)) return whenFailure(rd.value);
  };

/** Extract data for each state.
 * @param whenNotAsked Function when is state is NotAsked.
 * @param whenLoading Function when is state is Loading.
 * @param whenSuccess Function when is state is Success.
 * @param whenFailure Function when is state is Failure.
 * @returns Function thats take the remote data
 * @param remoteData The remotedata to extract
 * @returns The right result of the current state
 * @example fold(
                () => <p> Not Asked yet </p>, 
                () => <Loader />,
                (items: List<Item>) => <> {items.map(\i -> <Item item={i}/>} </>,
                (_ : AxiosError) => <p> Something bad happen! Call the 911 </p> 
          )(notAsked()) === <p> Not Asked yet </p>
 * @example fold(
                () => <p> Not Asked yet </p>, 
                () => <Loader />,
                (items: List<Item>) => <> {items.map(\i -> <Item item={i}/>} </>,
                (_ : AxiosError) => <p> Something bad happen! Call the 911 </p> 
          )(loading()) === <Loader />,
 * @example fold(
                () => <p> Not Asked yet </p>, // imposible state comme ça
                () => <Loader />,
                (items: List<Item>) => <> {items.map(\i -> <Item item={i}/>} </>,
                (_ : AxiosError) => <p> Something bad happen! Call the 911 </p> 
          )(success([items1])) === <> {items.map(\i -> <Item item={i}/>} </>
 * @example fold(
                () => <p> Not Asked yet </p>, // imposible state comme ça
                () => <Loader />,
                (items: List<Item>) => <> {items.map(\i -> <Item item={i}/>} </>,
                (_ : AxiosError) => <p> Something bad happen! Call the 911 </p> 
          )(failure(anyError)) === <p> Something bad happen! Call the 911 </p> 

 */
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
