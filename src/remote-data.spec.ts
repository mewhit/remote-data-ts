import { loading, fold, success, failure, notAsked, RemoteData, map, map2, withDefault } from "./remote-data";

describe("RemoteData", () => {
  describe("map", () => {
    describe("when Succeed", () => it("should return Success", () => expect(map((x) => +x)(success("10"))).toEqual(success(10))));
    describe("when NotAsked", () => it("should return NotAsked", () => expect(map((x) => +x)(notAsked())).toEqual(notAsked())));
    describe("when Failure", () => it("should return Failure", () => expect(map((x) => +x)(failure("10"))).toEqual(failure("10"))));
    describe("when Loading", () => it("should return Success", () => expect(map((x) => +x)(loading())).toEqual(loading())));
  });
  describe("map2", () => {
    describe("when all are Succeed", () =>
      it("should return Success", () => expect(map2((x, y) => x + y)(success(10))(success(10))).toEqual(success(20))));
    describe("when one is NotAsked", () => it("should return NotAsked", () => expect(map2((x) => +x)(success(10))(notAsked())).toEqual(notAsked())));
    describe("when one is  Failure", () =>
      it("should return Failure", () => expect(map2((x) => +x)(failure(10))(success("10"))).toEqual(failure(10))));
    describe("when one is Loading", () => it("should return Loading", () => expect(map2((x) => +x)(success(10))(loading())).toEqual(loading())));
    describe("when all are FailState", () =>
      it("should return the first remotedata", () => expect(map2((x) => +x)(loading())(notAsked())).toEqual(loading())));
  });
  describe("withDefault", () => {
    describe("when Succeed", () => it("should return Success value", () => expect(withDefault("10")(success("20"))).toEqual("20")));
    describe("when NotAsked", () => it("should return defaultValue", () => expect(withDefault("10")(notAsked())).toEqual("10")));
    describe("when Failure", () => it("should return defaultValue", () => expect(withDefault("10")(failure("20"))).toEqual("10")));
    describe("when Loading", () => it("should return defaultValue", () => expect(withDefault("10")(loading())).toEqual("10")));
  });
  describe("fold", () => {
    describe("when isLoading", () =>
      it("should return whenLoading", () =>
        expect(
          fold(
            () => 1,
            () => 0,
            () => 1,
            () => 1
          )(loading())
        ).toBe(0)));
    describe("when isSuccess", () => {
      it("should return whenSucceed", () => {
        const expectedValue = "Youpi";
        const remoteData = success("Youpi");
        expect(
          fold(
            () => 1,
            () => 1,
            (value) => value,
            () => 1
          )(remoteData)
        ).toBe(expectedValue);
      });
    });
    describe("when isFailure", () => {
      it("should return whenFailure", () => {
        const expectedValue = "fail";
        const remoteData = failure(expectedValue);
        expect(
          fold(
            () => "any string",
            () => "any string",
            () => "any string",
            (fail: string) => fail
          )(remoteData)
        ).toBe(expectedValue);
      });
    });
    describe("when isNotAsked", () => {
      it("should return whenNotAsked", () => {
        const remoteData = notAsked();
        expect(
          fold(
            () => 0,
            () => 1,
            () => 1,
            () => 1
          )(remoteData)
        ).toBe(0);
      });
    });
  });
});
