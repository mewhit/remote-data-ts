# RemoteData

#### Inspired by https://package.elm-lang.org/packages/krisajenkins/remotedata/latest/RemoteData#RemoteData

#### Compatible with https://github.com/gcanti/fp-ts

# Documentation

## The Type

Frequently when you're fetching data from an API, you want to represent four different states:

- NotAsked - We haven't asked for the data yet.
- Loading - We've asked, but haven't got an answer yet.
- Failure - We asked, but something went wrong. Here's the error.
- Success - Everything worked, and here's the data.

```typescript
export type RemoteData<A, E> = NotAsked | Loading | Success<A> | Failure<E>;
```

## Create

### NotAsked

```typescript
export const notAsked = <A, E>(): RemoteData<A, E>
```

```typescript
const items = notAsked();
```

### Loading

```typescript
export const loading = <A, E>(): RemoteData<A, E>
```

```typescript
const items = loading();
```

### Success

```typescript
export const success = <A, B>(value: A): RemoteData<A, B>
```

```typescript
const items = success("100");
```

### Failure

```typescript
export const failure = <A, E>(value: E): RemoteData<A, E>
```

```typescript
const items = failure(new Error());
```

## Utils

### map

Map a function into the Success value.

- @param whenSucceed Function to map the succeed value
- @returns Function thats take the remote data
- @param remoteData The remotedata to map
- @returns The return new states ,if succeed state return mapped state

```typescript
export const map = <A, R>(whenSucceed: (a: A) => R) => (rd: RemoteData<A, unknown>): RemoteData<R,unknown>
```

```typescript
const toNumber = (x: string) => +x;
map(toNumber)(loading()) === loading();
map(toNumber)(success("10")) === success(10);
// with fp-ts
pipe(loading(), map(toNumber)) === loading();
pipe(10, success, map(toNumber)) === success(10);
```

### map2

Combine two remote data sources with the given function. The result will succeed when (and if) both sources succeed. If not return de failure one and if its 2 failure return the first one.

- @param whenSucceed Function to map the succeed value
- @returns Function thats take the first RemoteData
- @param remoteData First RemoteData
- @returns Function thats take the remote second RemoteData
- @param remoteData2 Second RemoteData
- @returns The return new states ,if succeed state return mapped state

```typescript
export const map2 =
  <A, B, R>(whenSucceed: (a: A) => (b: B) => R) =>
  (rd: RemoteData<A, unknown>) =>
  (rd2: RemoteData<B, unknown>) : RemoteData<R, unknown>
```

```typescript
const add = (x: number, y: number) => x + y;
map2(add)(loading())(success(10)) === loading();
map2(add)(success(10))(success(10)) === success(20);
map2(add)(notAsked())(loading()) === notAsked();
// with fp-ts
pipe(10, success, map2(add)(success(10))) === success(20);
```

### withDefault

Return the Success value, or the default.

- @param defaultValue The value returned if is not Succeed
- @returns Function thats take the RemoteData
- @param remoteData RemoteData
- @returns The default value or the success value

```typescript
export const withDefault = <A>(defaultValue: A) => (rd: RemoteData<A, unknown>) : A
```

```typescript
withDefault("Not Success RemoteData")(loading()) === "Not Success RemoteData";
withDefault("Not Success RemoteData")(success("10")) === success("10");
// with fp-tx
pipe(loading(), withDefault("Not Success RemoteData")) === "Not Success RemoteData";
pipe("10", success, withDefault("Not Success RemoteData")) === success("10");
```

### fold

Extract data for each state.

- @param whenNotAsked Function when is state is NotAsked.
- @param whenLoading Function when is state is Loading.
- @param whenSuccess Function when is state is Success.
- @param whenFailure Function when is state is Failure.
- @returns Function thats take the remote data
- @param remoteData The remotedata to extract
- @returns The right result of the current state

```typescript
export const fold =
  <A, E, R>(whenNotAsked: () => R,
            whenLoading: () => R,
            whenSuccess: (a: A) => R,
            whenFailure: (e: E) => R
            ) => (rd: RemoteData<A, E>) : E
```

```typescript
fold(
  () => <p> Not Asked yet </p>,
  () => <Loader />,
  (items: List<Item>) => <> {items.map(\i -> <Item item={i}/>} </>,
  (\_ : AxiosError) => <p> Something bad happen! Call the 911 </p>
  )(notAsked()) === <p> Not Asked yet </p>;

 fold(
  () => <p> Not Asked yet </p>,
  () => <Loader />,
  (items: List<Item>) => <> {items.map(\i -> <Item item={i}/>} </>,
  (\_ : AxiosError) => <p> Something bad happen! Call the 911 </p>
  )(loading()) === <Loader />;

fold(
  () => <p> Not Asked yet </p>,
  () => <Loader />,
  (items: List<Item>) => <> {items.map(\i -> <Item item={i}/>} </>,
  (\_ : AxiosError) => <p> Something bad happen! Call the 911 </p>
  )(failure(anyError)) === <p> Something bad happen! Call the 911 </p>;

fold(
  () => <p> Not Asked yet </p>,
  () => <Loader />,
  (items: List<Item>) => <> {items.map(\i -> <Item item={i}/>} </>,
  (\_ : AxiosError) => <p> Something bad happen! Call the 911 </p>
  )(success([items1])) === <> {items.map(\i -> <Item item={i}/>)} </>;

```
