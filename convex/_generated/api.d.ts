/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_cityCoords from "../lib/cityCoords.js";
import type * as lib_mappers from "../lib/mappers.js";
import type * as lib_moderation from "../lib/moderation.js";
import type * as lib_sellerSignal from "../lib/sellerSignal.js";
import type * as lib_slugify from "../lib/slugify.js";
import type * as meetupReports from "../meetupReports.js";
import type * as r2 from "../r2.js";
import type * as reports from "../reports.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  "lib/auth": typeof lib_auth;
  "lib/cityCoords": typeof lib_cityCoords;
  "lib/mappers": typeof lib_mappers;
  "lib/moderation": typeof lib_moderation;
  "lib/sellerSignal": typeof lib_sellerSignal;
  "lib/slugify": typeof lib_slugify;
  meetupReports: typeof meetupReports;
  r2: typeof r2;
  reports: typeof reports;
  seed: typeof seed;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
