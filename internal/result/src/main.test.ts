/** biome-ignore-all lint/style/noMagicNumbers: fine for tests */
import { setTimeout } from "node:timers/promises";
import { assert, describe, test } from "vitest";
import { type AsyncResult, R, type Result } from "#/main";

class CustomError extends Error {
  readonly customField: number;

  constructor(customField: number, message: string) {
    super(message);
    this.name = "CustomField";
    this.customField = customField;
  }
}

function division(a: number, b: number): Result<number, Error> {
  if (b === 0) {
    return R.error(new Error("cannot divide by zero"));
  }

  return R.ok(a / b);
}

async function longRunning(shouldFail: boolean): AsyncResult<number, CustomError> {
  await setTimeout(1);

  return shouldFail ? R.error(new CustomError(42, "wrong")) : R.ok(3);
}

describe("creates a valid result", () => {
  describe("default Error type", () => {
    test("ok result", () => {
      const result = division(4, 2);

      assert.isUndefined(result.error);
      assert.isDefined(result.value);
      assert.strictEqual(result.value, 2);
    });

    test("error result", () => {
      const result = division(4, 0);

      assert.isDefined(result.error);
      assert.instanceOf(result.error, Error);
      assert.strictEqual(result.error.message, "cannot divide by zero");
    });
  });

  describe("custom error", () => {
    test("ok result", async () => {
      const result = await longRunning(false);

      assert.isUndefined(result.error);
      assert.isDefined(result.value);
      assert.strictEqual(result.value, 3);
    });

    test("error result", async () => {
      const result = await longRunning(true);

      assert.isDefined(result.error);
      assert.instanceOf(result.error, CustomError);
      assert.strictEqual(result.error.message, "wrong");
      assert.strictEqual(result.error.customField, 42);
    });
  });
});
