import { CACHE_MANAGER, type Cache } from "@nestjs/cache-manager";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import {
  WhoAuthSchema,
  WhoCodeResponseSchema,
  type WhoQuerySchema,
  WhoSearchResponseSchema,
} from "@repo/schemas/who";
import type { AxiosInstance } from "axios";
import { parse } from "node-html-parser";
import type { ZodType } from "zod";
import { AppError } from "#/app/app-error";
import { axiosAuthSymbol, axiosSearchSymbol } from "#/shared/utils/symbols";

const tokenKey = "/who/access_token";

@Injectable()
export class SearchService {
  @Inject(CACHE_MANAGER) private readonly cacheManager: Cache;
  @Inject(axiosAuthSymbol) private readonly axiosAuth: AxiosInstance;
  @Inject(axiosSearchSymbol) private readonly axiosSearch: AxiosInstance;

  constructor(cacheManager: Cache, axiosAuth: AxiosInstance, axiosSearch: AxiosInstance) {
    this.cacheManager = cacheManager;
    this.axiosAuth = axiosAuth;
    this.axiosSearch = axiosSearch;
  }

  byCode(code: string): AsyncResult<string, AppError> {
    return this.performSearchRequest(
      `/${code}`,
      WhoCodeResponseSchema,
      (data) => data.title["@value"],
    );
  }

  bySearch(query: WhoQuerySchema): AsyncResult<{ id: string; title: string }[], AppError> {
    return this.performSearchRequest(
      `/search?q=${query.q}&useFlexisearch=false&flatResults=true`,
      WhoSearchResponseSchema,
      (data) => {
        const formatted: { id: string; title: string }[] = [];
        for (const entry of data.destinationEntities) {
          const id = entry.id.split("/").pop() ?? "";
          const title = parse(entry.title).textContent;
          formatted.push({ id, title });
        }

        return formatted;
      },
    );
  }

  private async performSearchRequest<T, R>(
    url: string,
    schema: ZodType<T>,
    extractData: (data: T) => R,
  ): AsyncResult<R, AppError> {
    const token = await this.getTokenFromCache();
    if (token.error) {
      return R.error(token.error);
    }

    const response = await this.axiosSearch.get(url, {
      headers: {
        authorization: `Bearer ${token.value}`,
      },
    });

    if (response.status !== HttpStatus.OK) {
      const error = new AppError(
        "BadGateway",
        `${ErrorCodes.domain.who.codeErrorResponse}: ${response.statusText}`,
        HttpStatus.BAD_GATEWAY,
      );
      return R.error(error);
    }

    const parsed = schema.safeParse(response.data);
    if (parsed.error) {
      const error = new AppError(
        "BadGateway",
        `${ErrorCodes.domain.who.codeErrorResponse}: ${ErrorCodes.domain.who.searchResponseInvalid}`,
        HttpStatus.BAD_GATEWAY,
      );
      return R.error(error);
    }

    return R.ok(extractData(parsed.data));
  }

  private async getTokenFromCache(): AsyncResult<string, AppError> {
    try {
      const token = await this.cacheManager.get<string>(tokenKey);
      if (!token) {
        const newToken = await this.getTokenFromApi();
        if (newToken.error) {
          return R.error(newToken.error);
        }

        const [accessToken, expiresIn] = newToken.value;
        await this.cacheManager.set<string>(tokenKey, accessToken, expiresIn * 1000);

        return R.ok(accessToken);
      }

      return R.ok(token);
    } catch (err) {
      const error = new AppError(
        "BadGateway",
        `${ErrorCodes.domain.who.tokenFetchError}: ${(err as Error).message}`,
        HttpStatus.BAD_GATEWAY,
      );
      return R.error(error);
    }
  }

  private async getTokenFromApi(): AsyncResult<[string, number], AppError> {
    const response = await this.axiosAuth.post<WhoAuthSchema>("", {
      grant_type: "client_credentials",
      scope: "icdapi_access",
    });
    if (response.status !== HttpStatus.OK) {
      const error = new AppError(
        "BadGateway",
        `${ErrorCodes.domain.who.tokenFetchError}: ${response.statusText}`,
        HttpStatus.BAD_GATEWAY,
      );
      return R.error(error);
    }

    const parsed = WhoAuthSchema.safeParse(response.data);
    if (!parsed.success) {
      const error = new AppError(
        "BadGateway",
        `${ErrorCodes.domain.who.tokenFetchError}: ${parsed.error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
      return R.error(error);
    }

    return R.ok([parsed.data.access_token, parsed.data.expires_in]);
  }
}
