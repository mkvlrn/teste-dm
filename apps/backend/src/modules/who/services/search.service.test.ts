import type { Cache } from "@nestjs/cache-manager";
import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import type { AxiosInstance } from "axios";
import { afterEach, assert, beforeEach, describe, test, vi } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import { SearchService } from "#/modules/who/services/search.service";

describe("SearchService", () => {
  let service: SearchService;
  let mockCacheManager: DeepMockProxy<Cache>;
  let mockAxiosAuth: DeepMockProxy<AxiosInstance>;
  let mockAxiosSearch: DeepMockProxy<AxiosInstance>;

  beforeEach(() => {
    mockCacheManager = mockDeep();
    mockAxiosAuth = mockDeep();
    mockAxiosSearch = mockDeep();
    service = new SearchService(mockCacheManager, mockAxiosAuth, mockAxiosSearch);

    vi.restoreAllMocks();
  });

  afterEach(() => {
    mockReset(mockCacheManager);
    mockReset(mockAxiosAuth);
    mockReset(mockAxiosSearch);
  });

  describe("byCode", () => {
    test("returns the expected result", async () => {
      const mockToken = "mockToken";
      const mockResponse = { data: { title: { "@value": "expected result" } } };

      mockCacheManager.get.mockResolvedValue(mockToken);
      mockAxiosSearch.get.mockResolvedValue({ status: HttpStatus.OK, data: mockResponse.data });

      const result = await service.byCode("123456");

      assert.isUndefined(result.error);
      assert.strictEqual(result.value, "expected result");
    });

    test("handles token retrieval failure", async () => {
      const expectedError = new AppError(
        "BadGateway",
        `${ErrorCodes.domain.who.tokenFetchError}: Unable to retrieve token`,
        HttpStatus.BAD_GATEWAY,
      );

      mockCacheManager.get.mockRejectedValue(new Error("Unable to retrieve token"));

      const result = await service.byCode("123456");

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("handles API failure", async () => {
      const mockToken = "mockToken";
      const expectedError = new AppError(
        "BadGateway",
        `${ErrorCodes.domain.who.codeErrorResponse}: Bad Gateway`,
        HttpStatus.BAD_GATEWAY,
      );

      mockCacheManager.get.mockResolvedValue(mockToken);
      mockAxiosSearch.get.mockResolvedValue({
        status: HttpStatus.BAD_GATEWAY,
        statusText: "Bad Gateway",
      });

      const result = await service.byCode("123456");

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });

  describe("bySearch", () => {
    test("returns the expected unique results", async () => {
      const mockToken = "mockToken";
      const mockResponse = {
        data: {
          destinationEntities: [
            { id: "http://icd/1", title: "Title 1" },
            { id: "http://icd/2", title: "Title 1" },
            { id: "http://icd/3", title: "Title 2" },
          ],
        },
      };

      mockCacheManager.get.mockResolvedValue(mockToken);
      mockAxiosSearch.get.mockResolvedValue({ status: HttpStatus.OK, data: mockResponse.data });

      const result = await service.bySearch({ q: "test" });

      assert.isUndefined(result.error);
      assert.deepStrictEqual(result.value, [
        { id: "1", title: "Title 1" },
        { id: "2", title: "Title 1" },
        { id: "3", title: "Title 2" },
      ]);
    });

    test("handles invalid API response structure", async () => {
      const mockToken = "mockToken";
      const expectedError = new AppError(
        "BadGateway",
        `${ErrorCodes.domain.who.codeErrorResponse}: ${ErrorCodes.domain.who.searchResponseInvalid}`,
        HttpStatus.BAD_GATEWAY,
      );

      mockCacheManager.get.mockResolvedValue(mockToken);
      mockAxiosSearch.get.mockResolvedValue({ status: HttpStatus.OK, data: {} });

      const result = await service.bySearch({ q: "test" });

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("handles API failures", async () => {
      const mockToken = "mockToken";
      const expectedError = new AppError(
        "BadGateway",
        `${ErrorCodes.domain.who.codeErrorResponse}: Bad Gateway`,
        HttpStatus.BAD_GATEWAY,
      );

      mockCacheManager.get.mockResolvedValue(mockToken);
      mockAxiosSearch.get.mockResolvedValue({
        status: HttpStatus.BAD_GATEWAY,
        statusText: "Bad Gateway",
      });

      const result = await service.bySearch({ q: "test" });

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });

  describe("getTokenFromCache", () => {
    test("retrieves an existing token from the cache", async () => {
      const mockToken = "mockToken";
      mockCacheManager.get.mockResolvedValue(mockToken);

      const result = await service["getTokenFromCache"]();

      assert.isUndefined(result.error);
      assert.strictEqual(result.value, mockToken);
    });

    test("fetches a new token if none is cached", async () => {
      const mockNewToken = "newMockToken";
      const mockExpiresIn = 3600;
      mockCacheManager.get.mockResolvedValue(null);
      mockAxiosAuth.post.mockResolvedValue({
        status: HttpStatus.OK,
        // biome-ignore lint/style/useNamingConvention: it's the api format
        data: { access_token: mockNewToken, expires_in: mockExpiresIn, token_type: "Bearer" },
      });

      const result = await service["getTokenFromCache"]();

      assert.isUndefined(result.error);
      assert.strictEqual(result.value, mockNewToken);
    });

    test("returns an error if token fetching fails", async () => {
      mockCacheManager.get.mockRejectedValue(new Error("Token fetch error"));

      const expectedError = new AppError(
        "BadGateway",
        `${ErrorCodes.domain.who.tokenFetchError}: Token fetch error`,
        HttpStatus.BAD_GATEWAY,
      );

      const result = await service["getTokenFromCache"]();

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });
});
