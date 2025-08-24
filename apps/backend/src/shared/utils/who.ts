/** biome-ignore-all lint/style/useNamingConvention: axios and baseURL... */

import axios from "axios";
import { env } from "#/app/env";

const authClient = axios.create({
  baseURL: "https://icdaccessmanagement.who.int/connect/token",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  auth: { username: env.icdApiClientId, password: env.icdApiClientSecret },
  transformRequest: [(data) => new URLSearchParams(data).toString()],
});

const searchClient = axios.create({
  baseURL: "https://id.who.int/icd/entity",
  headers: { "Content-Type": "application/json", "API-Version": "v2", "Accept-Language": "pt" },
});

export { authClient, searchClient };
