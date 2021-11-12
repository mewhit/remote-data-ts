import { RemoteData, Loading, loading, fold, success, failure, notAsked } from "./remote-data";

describe("RemoteData", () => {
  describe("fold", () => {
    describe("when isLoading", () => {
      it("should return whenLoading", () => {
        const remoteData = loading();
        expect(
          fold(
            () => 1,
            () => 0,
            () => 1,
            () => 1
          )(remoteData)
        ).toBe(0);
      });
    });
    describe("when isSuccess", () => {
      it("should return whenLoading", () => {
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
      it("should return whenLoading", () => {
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
      it("should return whenLoading", () => {
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
