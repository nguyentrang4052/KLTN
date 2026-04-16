
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserProfile
 * 
 */
export type UserProfile = $Result.DefaultSelection<Prisma.$UserProfilePayload>
/**
 * Model UserSkill
 * 
 */
export type UserSkill = $Result.DefaultSelection<Prisma.$UserSkillPayload>
/**
 * Model CV
 * 
 */
export type CV = $Result.DefaultSelection<Prisma.$CVPayload>
/**
 * Model Company
 * 
 */
export type Company = $Result.DefaultSelection<Prisma.$CompanyPayload>
/**
 * Model Job
 * 
 */
export type Job = $Result.DefaultSelection<Prisma.$JobPayload>
/**
 * Model JobRecommendation
 * 
 */
export type JobRecommendation = $Result.DefaultSelection<Prisma.$JobRecommendationPayload>
/**
 * Model JobSkill
 * 
 */
export type JobSkill = $Result.DefaultSelection<Prisma.$JobSkillPayload>
/**
 * Model SavedJob
 * 
 */
export type SavedJob = $Result.DefaultSelection<Prisma.$SavedJobPayload>
/**
 * Model Industry
 * 
 */
export type Industry = $Result.DefaultSelection<Prisma.$IndustryPayload>
/**
 * Model Skill
 * 
 */
export type Skill = $Result.DefaultSelection<Prisma.$SkillPayload>
/**
 * Model UserBehavior
 * 
 */
export type UserBehavior = $Result.DefaultSelection<Prisma.$UserBehaviorPayload>
/**
 * Model ApplyHistory
 * 
 */
export type ApplyHistory = $Result.DefaultSelection<Prisma.$ApplyHistoryPayload>
/**
 * Model JobSourceTracking
 * 
 */
export type JobSourceTracking = $Result.DefaultSelection<Prisma.$JobSourceTrackingPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.userProfile`: Exposes CRUD operations for the **UserProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserProfiles
    * const userProfiles = await prisma.userProfile.findMany()
    * ```
    */
  get userProfile(): Prisma.UserProfileDelegate<ExtArgs>;

  /**
   * `prisma.userSkill`: Exposes CRUD operations for the **UserSkill** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserSkills
    * const userSkills = await prisma.userSkill.findMany()
    * ```
    */
  get userSkill(): Prisma.UserSkillDelegate<ExtArgs>;

  /**
   * `prisma.cV`: Exposes CRUD operations for the **CV** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CVS
    * const cVS = await prisma.cV.findMany()
    * ```
    */
  get cV(): Prisma.CVDelegate<ExtArgs>;

  /**
   * `prisma.company`: Exposes CRUD operations for the **Company** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Companies
    * const companies = await prisma.company.findMany()
    * ```
    */
  get company(): Prisma.CompanyDelegate<ExtArgs>;

  /**
   * `prisma.job`: Exposes CRUD operations for the **Job** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Jobs
    * const jobs = await prisma.job.findMany()
    * ```
    */
  get job(): Prisma.JobDelegate<ExtArgs>;

  /**
   * `prisma.jobRecommendation`: Exposes CRUD operations for the **JobRecommendation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JobRecommendations
    * const jobRecommendations = await prisma.jobRecommendation.findMany()
    * ```
    */
  get jobRecommendation(): Prisma.JobRecommendationDelegate<ExtArgs>;

  /**
   * `prisma.jobSkill`: Exposes CRUD operations for the **JobSkill** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JobSkills
    * const jobSkills = await prisma.jobSkill.findMany()
    * ```
    */
  get jobSkill(): Prisma.JobSkillDelegate<ExtArgs>;

  /**
   * `prisma.savedJob`: Exposes CRUD operations for the **SavedJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SavedJobs
    * const savedJobs = await prisma.savedJob.findMany()
    * ```
    */
  get savedJob(): Prisma.SavedJobDelegate<ExtArgs>;

  /**
   * `prisma.industry`: Exposes CRUD operations for the **Industry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Industries
    * const industries = await prisma.industry.findMany()
    * ```
    */
  get industry(): Prisma.IndustryDelegate<ExtArgs>;

  /**
   * `prisma.skill`: Exposes CRUD operations for the **Skill** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Skills
    * const skills = await prisma.skill.findMany()
    * ```
    */
  get skill(): Prisma.SkillDelegate<ExtArgs>;

  /**
   * `prisma.userBehavior`: Exposes CRUD operations for the **UserBehavior** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserBehaviors
    * const userBehaviors = await prisma.userBehavior.findMany()
    * ```
    */
  get userBehavior(): Prisma.UserBehaviorDelegate<ExtArgs>;

  /**
   * `prisma.applyHistory`: Exposes CRUD operations for the **ApplyHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ApplyHistories
    * const applyHistories = await prisma.applyHistory.findMany()
    * ```
    */
  get applyHistory(): Prisma.ApplyHistoryDelegate<ExtArgs>;

  /**
   * `prisma.jobSourceTracking`: Exposes CRUD operations for the **JobSourceTracking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JobSourceTrackings
    * const jobSourceTrackings = await prisma.jobSourceTracking.findMany()
    * ```
    */
  get jobSourceTracking(): Prisma.JobSourceTrackingDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Account: 'Account',
    User: 'User',
    UserProfile: 'UserProfile',
    UserSkill: 'UserSkill',
    CV: 'CV',
    Company: 'Company',
    Job: 'Job',
    JobRecommendation: 'JobRecommendation',
    JobSkill: 'JobSkill',
    SavedJob: 'SavedJob',
    Industry: 'Industry',
    Skill: 'Skill',
    UserBehavior: 'UserBehavior',
    ApplyHistory: 'ApplyHistory',
    JobSourceTracking: 'JobSourceTracking'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "account" | "user" | "userProfile" | "userSkill" | "cV" | "company" | "job" | "jobRecommendation" | "jobSkill" | "savedJob" | "industry" | "skill" | "userBehavior" | "applyHistory" | "jobSourceTracking"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserProfile: {
        payload: Prisma.$UserProfilePayload<ExtArgs>
        fields: Prisma.UserProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findFirst: {
            args: Prisma.UserProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findMany: {
            args: Prisma.UserProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          create: {
            args: Prisma.UserProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          createMany: {
            args: Prisma.UserProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          delete: {
            args: Prisma.UserProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          update: {
            args: Prisma.UserProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          deleteMany: {
            args: Prisma.UserProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          aggregate: {
            args: Prisma.UserProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserProfile>
          }
          groupBy: {
            args: Prisma.UserProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserProfileCountArgs<ExtArgs>
            result: $Utils.Optional<UserProfileCountAggregateOutputType> | number
          }
        }
      }
      UserSkill: {
        payload: Prisma.$UserSkillPayload<ExtArgs>
        fields: Prisma.UserSkillFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserSkillFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserSkillFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillPayload>
          }
          findFirst: {
            args: Prisma.UserSkillFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserSkillFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillPayload>
          }
          findMany: {
            args: Prisma.UserSkillFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillPayload>[]
          }
          create: {
            args: Prisma.UserSkillCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillPayload>
          }
          createMany: {
            args: Prisma.UserSkillCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserSkillCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillPayload>[]
          }
          delete: {
            args: Prisma.UserSkillDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillPayload>
          }
          update: {
            args: Prisma.UserSkillUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillPayload>
          }
          deleteMany: {
            args: Prisma.UserSkillDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserSkillUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserSkillUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillPayload>
          }
          aggregate: {
            args: Prisma.UserSkillAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserSkill>
          }
          groupBy: {
            args: Prisma.UserSkillGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserSkillGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserSkillCountArgs<ExtArgs>
            result: $Utils.Optional<UserSkillCountAggregateOutputType> | number
          }
        }
      }
      CV: {
        payload: Prisma.$CVPayload<ExtArgs>
        fields: Prisma.CVFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CVFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CVFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>
          }
          findFirst: {
            args: Prisma.CVFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CVFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>
          }
          findMany: {
            args: Prisma.CVFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>[]
          }
          create: {
            args: Prisma.CVCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>
          }
          createMany: {
            args: Prisma.CVCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CVCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>[]
          }
          delete: {
            args: Prisma.CVDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>
          }
          update: {
            args: Prisma.CVUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>
          }
          deleteMany: {
            args: Prisma.CVDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CVUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CVUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CVPayload>
          }
          aggregate: {
            args: Prisma.CVAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCV>
          }
          groupBy: {
            args: Prisma.CVGroupByArgs<ExtArgs>
            result: $Utils.Optional<CVGroupByOutputType>[]
          }
          count: {
            args: Prisma.CVCountArgs<ExtArgs>
            result: $Utils.Optional<CVCountAggregateOutputType> | number
          }
        }
      }
      Company: {
        payload: Prisma.$CompanyPayload<ExtArgs>
        fields: Prisma.CompanyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompanyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompanyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findFirst: {
            args: Prisma.CompanyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompanyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findMany: {
            args: Prisma.CompanyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          create: {
            args: Prisma.CompanyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          createMany: {
            args: Prisma.CompanyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompanyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          delete: {
            args: Prisma.CompanyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          update: {
            args: Prisma.CompanyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          deleteMany: {
            args: Prisma.CompanyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompanyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CompanyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          aggregate: {
            args: Prisma.CompanyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompany>
          }
          groupBy: {
            args: Prisma.CompanyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompanyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompanyCountArgs<ExtArgs>
            result: $Utils.Optional<CompanyCountAggregateOutputType> | number
          }
        }
      }
      Job: {
        payload: Prisma.$JobPayload<ExtArgs>
        fields: Prisma.JobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          findFirst: {
            args: Prisma.JobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          findMany: {
            args: Prisma.JobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          create: {
            args: Prisma.JobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          createMany: {
            args: Prisma.JobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          delete: {
            args: Prisma.JobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          update: {
            args: Prisma.JobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          deleteMany: {
            args: Prisma.JobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.JobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          aggregate: {
            args: Prisma.JobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJob>
          }
          groupBy: {
            args: Prisma.JobGroupByArgs<ExtArgs>
            result: $Utils.Optional<JobGroupByOutputType>[]
          }
          count: {
            args: Prisma.JobCountArgs<ExtArgs>
            result: $Utils.Optional<JobCountAggregateOutputType> | number
          }
        }
      }
      JobRecommendation: {
        payload: Prisma.$JobRecommendationPayload<ExtArgs>
        fields: Prisma.JobRecommendationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JobRecommendationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobRecommendationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JobRecommendationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobRecommendationPayload>
          }
          findFirst: {
            args: Prisma.JobRecommendationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobRecommendationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JobRecommendationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobRecommendationPayload>
          }
          findMany: {
            args: Prisma.JobRecommendationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobRecommendationPayload>[]
          }
          create: {
            args: Prisma.JobRecommendationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobRecommendationPayload>
          }
          createMany: {
            args: Prisma.JobRecommendationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JobRecommendationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobRecommendationPayload>[]
          }
          delete: {
            args: Prisma.JobRecommendationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobRecommendationPayload>
          }
          update: {
            args: Prisma.JobRecommendationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobRecommendationPayload>
          }
          deleteMany: {
            args: Prisma.JobRecommendationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JobRecommendationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.JobRecommendationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobRecommendationPayload>
          }
          aggregate: {
            args: Prisma.JobRecommendationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJobRecommendation>
          }
          groupBy: {
            args: Prisma.JobRecommendationGroupByArgs<ExtArgs>
            result: $Utils.Optional<JobRecommendationGroupByOutputType>[]
          }
          count: {
            args: Prisma.JobRecommendationCountArgs<ExtArgs>
            result: $Utils.Optional<JobRecommendationCountAggregateOutputType> | number
          }
        }
      }
      JobSkill: {
        payload: Prisma.$JobSkillPayload<ExtArgs>
        fields: Prisma.JobSkillFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JobSkillFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSkillPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JobSkillFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSkillPayload>
          }
          findFirst: {
            args: Prisma.JobSkillFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSkillPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JobSkillFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSkillPayload>
          }
          findMany: {
            args: Prisma.JobSkillFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSkillPayload>[]
          }
          create: {
            args: Prisma.JobSkillCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSkillPayload>
          }
          createMany: {
            args: Prisma.JobSkillCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JobSkillCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSkillPayload>[]
          }
          delete: {
            args: Prisma.JobSkillDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSkillPayload>
          }
          update: {
            args: Prisma.JobSkillUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSkillPayload>
          }
          deleteMany: {
            args: Prisma.JobSkillDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JobSkillUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.JobSkillUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSkillPayload>
          }
          aggregate: {
            args: Prisma.JobSkillAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJobSkill>
          }
          groupBy: {
            args: Prisma.JobSkillGroupByArgs<ExtArgs>
            result: $Utils.Optional<JobSkillGroupByOutputType>[]
          }
          count: {
            args: Prisma.JobSkillCountArgs<ExtArgs>
            result: $Utils.Optional<JobSkillCountAggregateOutputType> | number
          }
        }
      }
      SavedJob: {
        payload: Prisma.$SavedJobPayload<ExtArgs>
        fields: Prisma.SavedJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SavedJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SavedJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>
          }
          findFirst: {
            args: Prisma.SavedJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SavedJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>
          }
          findMany: {
            args: Prisma.SavedJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>[]
          }
          create: {
            args: Prisma.SavedJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>
          }
          createMany: {
            args: Prisma.SavedJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SavedJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>[]
          }
          delete: {
            args: Prisma.SavedJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>
          }
          update: {
            args: Prisma.SavedJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>
          }
          deleteMany: {
            args: Prisma.SavedJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SavedJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SavedJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>
          }
          aggregate: {
            args: Prisma.SavedJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSavedJob>
          }
          groupBy: {
            args: Prisma.SavedJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<SavedJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.SavedJobCountArgs<ExtArgs>
            result: $Utils.Optional<SavedJobCountAggregateOutputType> | number
          }
        }
      }
      Industry: {
        payload: Prisma.$IndustryPayload<ExtArgs>
        fields: Prisma.IndustryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IndustryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndustryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IndustryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndustryPayload>
          }
          findFirst: {
            args: Prisma.IndustryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndustryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IndustryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndustryPayload>
          }
          findMany: {
            args: Prisma.IndustryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndustryPayload>[]
          }
          create: {
            args: Prisma.IndustryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndustryPayload>
          }
          createMany: {
            args: Prisma.IndustryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IndustryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndustryPayload>[]
          }
          delete: {
            args: Prisma.IndustryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndustryPayload>
          }
          update: {
            args: Prisma.IndustryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndustryPayload>
          }
          deleteMany: {
            args: Prisma.IndustryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IndustryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.IndustryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndustryPayload>
          }
          aggregate: {
            args: Prisma.IndustryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIndustry>
          }
          groupBy: {
            args: Prisma.IndustryGroupByArgs<ExtArgs>
            result: $Utils.Optional<IndustryGroupByOutputType>[]
          }
          count: {
            args: Prisma.IndustryCountArgs<ExtArgs>
            result: $Utils.Optional<IndustryCountAggregateOutputType> | number
          }
        }
      }
      Skill: {
        payload: Prisma.$SkillPayload<ExtArgs>
        fields: Prisma.SkillFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SkillFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SkillFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          findFirst: {
            args: Prisma.SkillFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SkillFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          findMany: {
            args: Prisma.SkillFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>[]
          }
          create: {
            args: Prisma.SkillCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          createMany: {
            args: Prisma.SkillCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SkillCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>[]
          }
          delete: {
            args: Prisma.SkillDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          update: {
            args: Prisma.SkillUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          deleteMany: {
            args: Prisma.SkillDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SkillUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SkillUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          aggregate: {
            args: Prisma.SkillAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSkill>
          }
          groupBy: {
            args: Prisma.SkillGroupByArgs<ExtArgs>
            result: $Utils.Optional<SkillGroupByOutputType>[]
          }
          count: {
            args: Prisma.SkillCountArgs<ExtArgs>
            result: $Utils.Optional<SkillCountAggregateOutputType> | number
          }
        }
      }
      UserBehavior: {
        payload: Prisma.$UserBehaviorPayload<ExtArgs>
        fields: Prisma.UserBehaviorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserBehaviorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBehaviorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserBehaviorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBehaviorPayload>
          }
          findFirst: {
            args: Prisma.UserBehaviorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBehaviorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserBehaviorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBehaviorPayload>
          }
          findMany: {
            args: Prisma.UserBehaviorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBehaviorPayload>[]
          }
          create: {
            args: Prisma.UserBehaviorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBehaviorPayload>
          }
          createMany: {
            args: Prisma.UserBehaviorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserBehaviorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBehaviorPayload>[]
          }
          delete: {
            args: Prisma.UserBehaviorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBehaviorPayload>
          }
          update: {
            args: Prisma.UserBehaviorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBehaviorPayload>
          }
          deleteMany: {
            args: Prisma.UserBehaviorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserBehaviorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserBehaviorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBehaviorPayload>
          }
          aggregate: {
            args: Prisma.UserBehaviorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserBehavior>
          }
          groupBy: {
            args: Prisma.UserBehaviorGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserBehaviorGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserBehaviorCountArgs<ExtArgs>
            result: $Utils.Optional<UserBehaviorCountAggregateOutputType> | number
          }
        }
      }
      ApplyHistory: {
        payload: Prisma.$ApplyHistoryPayload<ExtArgs>
        fields: Prisma.ApplyHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApplyHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplyHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApplyHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplyHistoryPayload>
          }
          findFirst: {
            args: Prisma.ApplyHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplyHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApplyHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplyHistoryPayload>
          }
          findMany: {
            args: Prisma.ApplyHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplyHistoryPayload>[]
          }
          create: {
            args: Prisma.ApplyHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplyHistoryPayload>
          }
          createMany: {
            args: Prisma.ApplyHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApplyHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplyHistoryPayload>[]
          }
          delete: {
            args: Prisma.ApplyHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplyHistoryPayload>
          }
          update: {
            args: Prisma.ApplyHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplyHistoryPayload>
          }
          deleteMany: {
            args: Prisma.ApplyHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApplyHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ApplyHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplyHistoryPayload>
          }
          aggregate: {
            args: Prisma.ApplyHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApplyHistory>
          }
          groupBy: {
            args: Prisma.ApplyHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApplyHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApplyHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<ApplyHistoryCountAggregateOutputType> | number
          }
        }
      }
      JobSourceTracking: {
        payload: Prisma.$JobSourceTrackingPayload<ExtArgs>
        fields: Prisma.JobSourceTrackingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JobSourceTrackingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSourceTrackingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JobSourceTrackingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSourceTrackingPayload>
          }
          findFirst: {
            args: Prisma.JobSourceTrackingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSourceTrackingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JobSourceTrackingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSourceTrackingPayload>
          }
          findMany: {
            args: Prisma.JobSourceTrackingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSourceTrackingPayload>[]
          }
          create: {
            args: Prisma.JobSourceTrackingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSourceTrackingPayload>
          }
          createMany: {
            args: Prisma.JobSourceTrackingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JobSourceTrackingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSourceTrackingPayload>[]
          }
          delete: {
            args: Prisma.JobSourceTrackingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSourceTrackingPayload>
          }
          update: {
            args: Prisma.JobSourceTrackingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSourceTrackingPayload>
          }
          deleteMany: {
            args: Prisma.JobSourceTrackingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JobSourceTrackingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.JobSourceTrackingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobSourceTrackingPayload>
          }
          aggregate: {
            args: Prisma.JobSourceTrackingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJobSourceTracking>
          }
          groupBy: {
            args: Prisma.JobSourceTrackingGroupByArgs<ExtArgs>
            result: $Utils.Optional<JobSourceTrackingGroupByOutputType>[]
          }
          count: {
            args: Prisma.JobSourceTrackingCountArgs<ExtArgs>
            result: $Utils.Optional<JobSourceTrackingCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    profiles: number
    skills: number
    cvs: number
    savedJobs: number
    behaviors: number
    applications: number
    jobRecommendations: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profiles?: boolean | UserCountOutputTypeCountProfilesArgs
    skills?: boolean | UserCountOutputTypeCountSkillsArgs
    cvs?: boolean | UserCountOutputTypeCountCvsArgs
    savedJobs?: boolean | UserCountOutputTypeCountSavedJobsArgs
    behaviors?: boolean | UserCountOutputTypeCountBehaviorsArgs
    applications?: boolean | UserCountOutputTypeCountApplicationsArgs
    jobRecommendations?: boolean | UserCountOutputTypeCountJobRecommendationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProfilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProfileWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSkillsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSkillWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCvsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CVWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSavedJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedJobWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBehaviorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserBehaviorWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplyHistoryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountJobRecommendationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobRecommendationWhereInput
  }


  /**
   * Count Type CVCountOutputType
   */

  export type CVCountOutputType = {
    applications: number
  }

  export type CVCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | CVCountOutputTypeCountApplicationsArgs
  }

  // Custom InputTypes
  /**
   * CVCountOutputType without action
   */
  export type CVCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CVCountOutputType
     */
    select?: CVCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CVCountOutputType without action
   */
  export type CVCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplyHistoryWhereInput
  }


  /**
   * Count Type CompanyCountOutputType
   */

  export type CompanyCountOutputType = {
    jobs: number
  }

  export type CompanyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobs?: boolean | CompanyCountOutputTypeCountJobsArgs
  }

  // Custom InputTypes
  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyCountOutputType
     */
    select?: CompanyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobWhereInput
  }


  /**
   * Count Type JobCountOutputType
   */

  export type JobCountOutputType = {
    skills: number
    savedJobs: number
    behaviors: number
    applyHistories: number
    sourceTrackings: number
    recommendations: number
  }

  export type JobCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skills?: boolean | JobCountOutputTypeCountSkillsArgs
    savedJobs?: boolean | JobCountOutputTypeCountSavedJobsArgs
    behaviors?: boolean | JobCountOutputTypeCountBehaviorsArgs
    applyHistories?: boolean | JobCountOutputTypeCountApplyHistoriesArgs
    sourceTrackings?: boolean | JobCountOutputTypeCountSourceTrackingsArgs
    recommendations?: boolean | JobCountOutputTypeCountRecommendationsArgs
  }

  // Custom InputTypes
  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobCountOutputType
     */
    select?: JobCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeCountSkillsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobSkillWhereInput
  }

  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeCountSavedJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedJobWhereInput
  }

  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeCountBehaviorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserBehaviorWhereInput
  }

  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeCountApplyHistoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplyHistoryWhereInput
  }

  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeCountSourceTrackingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobSourceTrackingWhereInput
  }

  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeCountRecommendationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobRecommendationWhereInput
  }


  /**
   * Count Type IndustryCountOutputType
   */

  export type IndustryCountOutputType = {
    skills: number
    jobs: number
    userProfiles: number
  }

  export type IndustryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skills?: boolean | IndustryCountOutputTypeCountSkillsArgs
    jobs?: boolean | IndustryCountOutputTypeCountJobsArgs
    userProfiles?: boolean | IndustryCountOutputTypeCountUserProfilesArgs
  }

  // Custom InputTypes
  /**
   * IndustryCountOutputType without action
   */
  export type IndustryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndustryCountOutputType
     */
    select?: IndustryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * IndustryCountOutputType without action
   */
  export type IndustryCountOutputTypeCountSkillsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillWhereInput
  }

  /**
   * IndustryCountOutputType without action
   */
  export type IndustryCountOutputTypeCountJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobWhereInput
  }

  /**
   * IndustryCountOutputType without action
   */
  export type IndustryCountOutputTypeCountUserProfilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProfileWhereInput
  }


  /**
   * Count Type SkillCountOutputType
   */

  export type SkillCountOutputType = {
    users: number
    jobs: number
  }

  export type SkillCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | SkillCountOutputTypeCountUsersArgs
    jobs?: boolean | SkillCountOutputTypeCountJobsArgs
  }

  // Custom InputTypes
  /**
   * SkillCountOutputType without action
   */
  export type SkillCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCountOutputType
     */
    select?: SkillCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SkillCountOutputType without action
   */
  export type SkillCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSkillWhereInput
  }

  /**
   * SkillCountOutputType without action
   */
  export type SkillCountOutputTypeCountJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobSkillWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    accountID: number | null
  }

  export type AccountSumAggregateOutputType = {
    accountID: number | null
  }

  export type AccountMinAggregateOutputType = {
    accountID: number | null
    email: string | null
    password: string | null
    provider: string | null
    createdAt: Date | null
    active: boolean | null
  }

  export type AccountMaxAggregateOutputType = {
    accountID: number | null
    email: string | null
    password: string | null
    provider: string | null
    createdAt: Date | null
    active: boolean | null
  }

  export type AccountCountAggregateOutputType = {
    accountID: number
    email: number
    password: number
    provider: number
    createdAt: number
    active: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    accountID?: true
  }

  export type AccountSumAggregateInputType = {
    accountID?: true
  }

  export type AccountMinAggregateInputType = {
    accountID?: true
    email?: true
    password?: true
    provider?: true
    createdAt?: true
    active?: true
  }

  export type AccountMaxAggregateInputType = {
    accountID?: true
    email?: true
    password?: true
    provider?: true
    createdAt?: true
    active?: true
  }

  export type AccountCountAggregateInputType = {
    accountID?: true
    email?: true
    password?: true
    provider?: true
    createdAt?: true
    active?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    accountID: number
    email: string
    password: string
    provider: string
    createdAt: Date
    active: boolean
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    accountID?: boolean
    email?: boolean
    password?: boolean
    provider?: boolean
    createdAt?: boolean
    active?: boolean
    user?: boolean | Account$userArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    accountID?: boolean
    email?: boolean
    password?: boolean
    provider?: boolean
    createdAt?: boolean
    active?: boolean
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    accountID?: boolean
    email?: boolean
    password?: boolean
    provider?: boolean
    createdAt?: boolean
    active?: boolean
  }

  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Account$userArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      accountID: number
      email: string
      password: string
      provider: string
      createdAt: Date
      active: boolean
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `accountID`
     * const accountWithAccountIDOnly = await prisma.account.findMany({ select: { accountID: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `accountID`
     * const accountWithAccountIDOnly = await prisma.account.createManyAndReturn({ 
     *   select: { accountID: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Account$userArgs<ExtArgs> = {}>(args?: Subset<T, Account$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */ 
  interface AccountFieldRefs {
    readonly accountID: FieldRef<"Account", 'Int'>
    readonly email: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly active: FieldRef<"Account", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
  }

  /**
   * Account.user
   */
  export type Account$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    userID: number | null
    birthYear: number | null
    accountID: number | null
  }

  export type UserSumAggregateOutputType = {
    userID: number | null
    birthYear: number | null
    accountID: number | null
  }

  export type UserMinAggregateOutputType = {
    userID: number | null
    fullName: string | null
    birthYear: number | null
    phone: string | null
    gender: string | null
    address: string | null
    accountID: number | null
  }

  export type UserMaxAggregateOutputType = {
    userID: number | null
    fullName: string | null
    birthYear: number | null
    phone: string | null
    gender: string | null
    address: string | null
    accountID: number | null
  }

  export type UserCountAggregateOutputType = {
    userID: number
    fullName: number
    birthYear: number
    phone: number
    gender: number
    address: number
    accountID: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    userID?: true
    birthYear?: true
    accountID?: true
  }

  export type UserSumAggregateInputType = {
    userID?: true
    birthYear?: true
    accountID?: true
  }

  export type UserMinAggregateInputType = {
    userID?: true
    fullName?: true
    birthYear?: true
    phone?: true
    gender?: true
    address?: true
    accountID?: true
  }

  export type UserMaxAggregateInputType = {
    userID?: true
    fullName?: true
    birthYear?: true
    phone?: true
    gender?: true
    address?: true
    accountID?: true
  }

  export type UserCountAggregateInputType = {
    userID?: true
    fullName?: true
    birthYear?: true
    phone?: true
    gender?: true
    address?: true
    accountID?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    userID: number
    fullName: string | null
    birthYear: number | null
    phone: string | null
    gender: string | null
    address: string | null
    accountID: number
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userID?: boolean
    fullName?: boolean
    birthYear?: boolean
    phone?: boolean
    gender?: boolean
    address?: boolean
    accountID?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
    profiles?: boolean | User$profilesArgs<ExtArgs>
    skills?: boolean | User$skillsArgs<ExtArgs>
    cvs?: boolean | User$cvsArgs<ExtArgs>
    savedJobs?: boolean | User$savedJobsArgs<ExtArgs>
    behaviors?: boolean | User$behaviorsArgs<ExtArgs>
    applications?: boolean | User$applicationsArgs<ExtArgs>
    jobRecommendations?: boolean | User$jobRecommendationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userID?: boolean
    fullName?: boolean
    birthYear?: boolean
    phone?: boolean
    gender?: boolean
    address?: boolean
    accountID?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    userID?: boolean
    fullName?: boolean
    birthYear?: boolean
    phone?: boolean
    gender?: boolean
    address?: boolean
    accountID?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
    profiles?: boolean | User$profilesArgs<ExtArgs>
    skills?: boolean | User$skillsArgs<ExtArgs>
    cvs?: boolean | User$cvsArgs<ExtArgs>
    savedJobs?: boolean | User$savedJobsArgs<ExtArgs>
    behaviors?: boolean | User$behaviorsArgs<ExtArgs>
    applications?: boolean | User$applicationsArgs<ExtArgs>
    jobRecommendations?: boolean | User$jobRecommendationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      account: Prisma.$AccountPayload<ExtArgs>
      profiles: Prisma.$UserProfilePayload<ExtArgs>[]
      skills: Prisma.$UserSkillPayload<ExtArgs>[]
      cvs: Prisma.$CVPayload<ExtArgs>[]
      savedJobs: Prisma.$SavedJobPayload<ExtArgs>[]
      behaviors: Prisma.$UserBehaviorPayload<ExtArgs>[]
      applications: Prisma.$ApplyHistoryPayload<ExtArgs>[]
      jobRecommendations: Prisma.$JobRecommendationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      userID: number
      fullName: string | null
      birthYear: number | null
      phone: string | null
      gender: string | null
      address: string | null
      accountID: number
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `userID`
     * const userWithUserIDOnly = await prisma.user.findMany({ select: { userID: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `userID`
     * const userWithUserIDOnly = await prisma.user.createManyAndReturn({ 
     *   select: { userID: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends AccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AccountDefaultArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    profiles<T extends User$profilesArgs<ExtArgs> = {}>(args?: Subset<T, User$profilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findMany"> | Null>
    skills<T extends User$skillsArgs<ExtArgs> = {}>(args?: Subset<T, User$skillsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSkillPayload<ExtArgs>, T, "findMany"> | Null>
    cvs<T extends User$cvsArgs<ExtArgs> = {}>(args?: Subset<T, User$cvsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findMany"> | Null>
    savedJobs<T extends User$savedJobsArgs<ExtArgs> = {}>(args?: Subset<T, User$savedJobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "findMany"> | Null>
    behaviors<T extends User$behaviorsArgs<ExtArgs> = {}>(args?: Subset<T, User$behaviorsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBehaviorPayload<ExtArgs>, T, "findMany"> | Null>
    applications<T extends User$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, User$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplyHistoryPayload<ExtArgs>, T, "findMany"> | Null>
    jobRecommendations<T extends User$jobRecommendationsArgs<ExtArgs> = {}>(args?: Subset<T, User$jobRecommendationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobRecommendationPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly userID: FieldRef<"User", 'Int'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly birthYear: FieldRef<"User", 'Int'>
    readonly phone: FieldRef<"User", 'String'>
    readonly gender: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly accountID: FieldRef<"User", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.profiles
   */
  export type User$profilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    where?: UserProfileWhereInput
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    cursor?: UserProfileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * User.skills
   */
  export type User$skillsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkill
     */
    select?: UserSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSkillInclude<ExtArgs> | null
    where?: UserSkillWhereInput
    orderBy?: UserSkillOrderByWithRelationInput | UserSkillOrderByWithRelationInput[]
    cursor?: UserSkillWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserSkillScalarFieldEnum | UserSkillScalarFieldEnum[]
  }

  /**
   * User.cvs
   */
  export type User$cvsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    where?: CVWhereInput
    orderBy?: CVOrderByWithRelationInput | CVOrderByWithRelationInput[]
    cursor?: CVWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CVScalarFieldEnum | CVScalarFieldEnum[]
  }

  /**
   * User.savedJobs
   */
  export type User$savedJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    where?: SavedJobWhereInput
    orderBy?: SavedJobOrderByWithRelationInput | SavedJobOrderByWithRelationInput[]
    cursor?: SavedJobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SavedJobScalarFieldEnum | SavedJobScalarFieldEnum[]
  }

  /**
   * User.behaviors
   */
  export type User$behaviorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBehavior
     */
    select?: UserBehaviorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBehaviorInclude<ExtArgs> | null
    where?: UserBehaviorWhereInput
    orderBy?: UserBehaviorOrderByWithRelationInput | UserBehaviorOrderByWithRelationInput[]
    cursor?: UserBehaviorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserBehaviorScalarFieldEnum | UserBehaviorScalarFieldEnum[]
  }

  /**
   * User.applications
   */
  export type User$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplyHistory
     */
    select?: ApplyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplyHistoryInclude<ExtArgs> | null
    where?: ApplyHistoryWhereInput
    orderBy?: ApplyHistoryOrderByWithRelationInput | ApplyHistoryOrderByWithRelationInput[]
    cursor?: ApplyHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplyHistoryScalarFieldEnum | ApplyHistoryScalarFieldEnum[]
  }

  /**
   * User.jobRecommendations
   */
  export type User$jobRecommendationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobRecommendation
     */
    select?: JobRecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobRecommendationInclude<ExtArgs> | null
    where?: JobRecommendationWhereInput
    orderBy?: JobRecommendationOrderByWithRelationInput | JobRecommendationOrderByWithRelationInput[]
    cursor?: JobRecommendationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobRecommendationScalarFieldEnum | JobRecommendationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model UserProfile
   */

  export type AggregateUserProfile = {
    _count: UserProfileCountAggregateOutputType | null
    _avg: UserProfileAvgAggregateOutputType | null
    _sum: UserProfileSumAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  export type UserProfileAvgAggregateOutputType = {
    id: number | null
    experienceYear: number | null
    userID: number | null
    industryID: number | null
  }

  export type UserProfileSumAggregateOutputType = {
    id: number | null
    experienceYear: number | null
    userID: number | null
    industryID: number | null
  }

  export type UserProfileMinAggregateOutputType = {
    id: number | null
    jobTitle: string | null
    experienceYear: number | null
    careerLevel: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userID: number | null
    industryID: number | null
  }

  export type UserProfileMaxAggregateOutputType = {
    id: number | null
    jobTitle: string | null
    experienceYear: number | null
    careerLevel: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userID: number | null
    industryID: number | null
  }

  export type UserProfileCountAggregateOutputType = {
    id: number
    jobTitle: number
    experienceYear: number
    careerLevel: number
    createdAt: number
    updatedAt: number
    userID: number
    industryID: number
    _all: number
  }


  export type UserProfileAvgAggregateInputType = {
    id?: true
    experienceYear?: true
    userID?: true
    industryID?: true
  }

  export type UserProfileSumAggregateInputType = {
    id?: true
    experienceYear?: true
    userID?: true
    industryID?: true
  }

  export type UserProfileMinAggregateInputType = {
    id?: true
    jobTitle?: true
    experienceYear?: true
    careerLevel?: true
    createdAt?: true
    updatedAt?: true
    userID?: true
    industryID?: true
  }

  export type UserProfileMaxAggregateInputType = {
    id?: true
    jobTitle?: true
    experienceYear?: true
    careerLevel?: true
    createdAt?: true
    updatedAt?: true
    userID?: true
    industryID?: true
  }

  export type UserProfileCountAggregateInputType = {
    id?: true
    jobTitle?: true
    experienceYear?: true
    careerLevel?: true
    createdAt?: true
    updatedAt?: true
    userID?: true
    industryID?: true
    _all?: true
  }

  export type UserProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfile to aggregate.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserProfiles
    **/
    _count?: true | UserProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserProfileMaxAggregateInputType
  }

  export type GetUserProfileAggregateType<T extends UserProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateUserProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserProfile[P]>
      : GetScalarType<T[P], AggregateUserProfile[P]>
  }




  export type UserProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProfileWhereInput
    orderBy?: UserProfileOrderByWithAggregationInput | UserProfileOrderByWithAggregationInput[]
    by: UserProfileScalarFieldEnum[] | UserProfileScalarFieldEnum
    having?: UserProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserProfileCountAggregateInputType | true
    _avg?: UserProfileAvgAggregateInputType
    _sum?: UserProfileSumAggregateInputType
    _min?: UserProfileMinAggregateInputType
    _max?: UserProfileMaxAggregateInputType
  }

  export type UserProfileGroupByOutputType = {
    id: number
    jobTitle: string | null
    experienceYear: number | null
    careerLevel: string | null
    createdAt: Date
    updatedAt: Date
    userID: number
    industryID: number | null
    _count: UserProfileCountAggregateOutputType | null
    _avg: UserProfileAvgAggregateOutputType | null
    _sum: UserProfileSumAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  type GetUserProfileGroupByPayload<T extends UserProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
            : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
        }
      >
    >


  export type UserProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobTitle?: boolean
    experienceYear?: boolean
    careerLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userID?: boolean
    industryID?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    industry?: boolean | UserProfile$industryArgs<ExtArgs>
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobTitle?: boolean
    experienceYear?: boolean
    careerLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userID?: boolean
    industryID?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    industry?: boolean | UserProfile$industryArgs<ExtArgs>
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectScalar = {
    id?: boolean
    jobTitle?: boolean
    experienceYear?: boolean
    careerLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userID?: boolean
    industryID?: boolean
  }

  export type UserProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    industry?: boolean | UserProfile$industryArgs<ExtArgs>
  }
  export type UserProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    industry?: boolean | UserProfile$industryArgs<ExtArgs>
  }

  export type $UserProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      industry: Prisma.$IndustryPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      jobTitle: string | null
      experienceYear: number | null
      careerLevel: string | null
      createdAt: Date
      updatedAt: Date
      userID: number
      industryID: number | null
    }, ExtArgs["result"]["userProfile"]>
    composites: {}
  }

  type UserProfileGetPayload<S extends boolean | null | undefined | UserProfileDefaultArgs> = $Result.GetResult<Prisma.$UserProfilePayload, S>

  type UserProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserProfileFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserProfileCountAggregateInputType | true
    }

  export interface UserProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserProfile'], meta: { name: 'UserProfile' } }
    /**
     * Find zero or one UserProfile that matches the filter.
     * @param {UserProfileFindUniqueArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserProfileFindUniqueArgs>(args: SelectSubset<T, UserProfileFindUniqueArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserProfile that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserProfileFindUniqueOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, UserProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserProfileFindFirstArgs>(args?: SelectSubset<T, UserProfileFindFirstArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, UserProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserProfiles
     * const userProfiles = await prisma.userProfile.findMany()
     * 
     * // Get first 10 UserProfiles
     * const userProfiles = await prisma.userProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserProfileFindManyArgs>(args?: SelectSubset<T, UserProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserProfile.
     * @param {UserProfileCreateArgs} args - Arguments to create a UserProfile.
     * @example
     * // Create one UserProfile
     * const UserProfile = await prisma.userProfile.create({
     *   data: {
     *     // ... data to create a UserProfile
     *   }
     * })
     * 
     */
    create<T extends UserProfileCreateArgs>(args: SelectSubset<T, UserProfileCreateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserProfiles.
     * @param {UserProfileCreateManyArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserProfileCreateManyArgs>(args?: SelectSubset<T, UserProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserProfiles and returns the data saved in the database.
     * @param {UserProfileCreateManyAndReturnArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserProfiles and only return the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, UserProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserProfile.
     * @param {UserProfileDeleteArgs} args - Arguments to delete one UserProfile.
     * @example
     * // Delete one UserProfile
     * const UserProfile = await prisma.userProfile.delete({
     *   where: {
     *     // ... filter to delete one UserProfile
     *   }
     * })
     * 
     */
    delete<T extends UserProfileDeleteArgs>(args: SelectSubset<T, UserProfileDeleteArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserProfile.
     * @param {UserProfileUpdateArgs} args - Arguments to update one UserProfile.
     * @example
     * // Update one UserProfile
     * const userProfile = await prisma.userProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserProfileUpdateArgs>(args: SelectSubset<T, UserProfileUpdateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserProfiles.
     * @param {UserProfileDeleteManyArgs} args - Arguments to filter UserProfiles to delete.
     * @example
     * // Delete a few UserProfiles
     * const { count } = await prisma.userProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserProfileDeleteManyArgs>(args?: SelectSubset<T, UserProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserProfiles
     * const userProfile = await prisma.userProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserProfileUpdateManyArgs>(args: SelectSubset<T, UserProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserProfile.
     * @param {UserProfileUpsertArgs} args - Arguments to update or create a UserProfile.
     * @example
     * // Update or create a UserProfile
     * const userProfile = await prisma.userProfile.upsert({
     *   create: {
     *     // ... data to create a UserProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserProfile we want to update
     *   }
     * })
     */
    upsert<T extends UserProfileUpsertArgs>(args: SelectSubset<T, UserProfileUpsertArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileCountArgs} args - Arguments to filter UserProfiles to count.
     * @example
     * // Count the number of UserProfiles
     * const count = await prisma.userProfile.count({
     *   where: {
     *     // ... the filter for the UserProfiles we want to count
     *   }
     * })
    **/
    count<T extends UserProfileCountArgs>(
      args?: Subset<T, UserProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserProfileAggregateArgs>(args: Subset<T, UserProfileAggregateArgs>): Prisma.PrismaPromise<GetUserProfileAggregateType<T>>

    /**
     * Group by UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserProfileGroupByArgs['orderBy'] }
        : { orderBy?: UserProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserProfile model
   */
  readonly fields: UserProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    industry<T extends UserProfile$industryArgs<ExtArgs> = {}>(args?: Subset<T, UserProfile$industryArgs<ExtArgs>>): Prisma__IndustryClient<$Result.GetResult<Prisma.$IndustryPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserProfile model
   */ 
  interface UserProfileFieldRefs {
    readonly id: FieldRef<"UserProfile", 'Int'>
    readonly jobTitle: FieldRef<"UserProfile", 'String'>
    readonly experienceYear: FieldRef<"UserProfile", 'Int'>
    readonly careerLevel: FieldRef<"UserProfile", 'String'>
    readonly createdAt: FieldRef<"UserProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"UserProfile", 'DateTime'>
    readonly userID: FieldRef<"UserProfile", 'Int'>
    readonly industryID: FieldRef<"UserProfile", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * UserProfile findUnique
   */
  export type UserProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findUniqueOrThrow
   */
  export type UserProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findFirst
   */
  export type UserProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findFirstOrThrow
   */
  export type UserProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findMany
   */
  export type UserProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfiles to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile create
   */
  export type UserProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a UserProfile.
     */
    data: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
  }

  /**
   * UserProfile createMany
   */
  export type UserProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProfile createManyAndReturn
   */
  export type UserProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProfile update
   */
  export type UserProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a UserProfile.
     */
    data: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
    /**
     * Choose, which UserProfile to update.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile updateMany
   */
  export type UserProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserProfiles.
     */
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserProfiles to update
     */
    where?: UserProfileWhereInput
  }

  /**
   * UserProfile upsert
   */
  export type UserProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the UserProfile to update in case it exists.
     */
    where: UserProfileWhereUniqueInput
    /**
     * In case the UserProfile found by the `where` argument doesn't exist, create a new UserProfile with this data.
     */
    create: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
    /**
     * In case the UserProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
  }

  /**
   * UserProfile delete
   */
  export type UserProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter which UserProfile to delete.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile deleteMany
   */
  export type UserProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfiles to delete
     */
    where?: UserProfileWhereInput
  }

  /**
   * UserProfile.industry
   */
  export type UserProfile$industryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Industry
     */
    select?: IndustrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndustryInclude<ExtArgs> | null
    where?: IndustryWhereInput
  }

  /**
   * UserProfile without action
   */
  export type UserProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
  }


  /**
   * Model UserSkill
   */

  export type AggregateUserSkill = {
    _count: UserSkillCountAggregateOutputType | null
    _avg: UserSkillAvgAggregateOutputType | null
    _sum: UserSkillSumAggregateOutputType | null
    _min: UserSkillMinAggregateOutputType | null
    _max: UserSkillMaxAggregateOutputType | null
  }

  export type UserSkillAvgAggregateOutputType = {
    id: number | null
    userID: number | null
    skillID: number | null
  }

  export type UserSkillSumAggregateOutputType = {
    id: number | null
    userID: number | null
    skillID: number | null
  }

  export type UserSkillMinAggregateOutputType = {
    id: number | null
    userID: number | null
    skillID: number | null
  }

  export type UserSkillMaxAggregateOutputType = {
    id: number | null
    userID: number | null
    skillID: number | null
  }

  export type UserSkillCountAggregateOutputType = {
    id: number
    userID: number
    skillID: number
    _all: number
  }


  export type UserSkillAvgAggregateInputType = {
    id?: true
    userID?: true
    skillID?: true
  }

  export type UserSkillSumAggregateInputType = {
    id?: true
    userID?: true
    skillID?: true
  }

  export type UserSkillMinAggregateInputType = {
    id?: true
    userID?: true
    skillID?: true
  }

  export type UserSkillMaxAggregateInputType = {
    id?: true
    userID?: true
    skillID?: true
  }

  export type UserSkillCountAggregateInputType = {
    id?: true
    userID?: true
    skillID?: true
    _all?: true
  }

  export type UserSkillAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSkill to aggregate.
     */
    where?: UserSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSkills to fetch.
     */
    orderBy?: UserSkillOrderByWithRelationInput | UserSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSkills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserSkills
    **/
    _count?: true | UserSkillCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserSkillAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSkillSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserSkillMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserSkillMaxAggregateInputType
  }

  export type GetUserSkillAggregateType<T extends UserSkillAggregateArgs> = {
        [P in keyof T & keyof AggregateUserSkill]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserSkill[P]>
      : GetScalarType<T[P], AggregateUserSkill[P]>
  }




  export type UserSkillGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSkillWhereInput
    orderBy?: UserSkillOrderByWithAggregationInput | UserSkillOrderByWithAggregationInput[]
    by: UserSkillScalarFieldEnum[] | UserSkillScalarFieldEnum
    having?: UserSkillScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserSkillCountAggregateInputType | true
    _avg?: UserSkillAvgAggregateInputType
    _sum?: UserSkillSumAggregateInputType
    _min?: UserSkillMinAggregateInputType
    _max?: UserSkillMaxAggregateInputType
  }

  export type UserSkillGroupByOutputType = {
    id: number
    userID: number
    skillID: number
    _count: UserSkillCountAggregateOutputType | null
    _avg: UserSkillAvgAggregateOutputType | null
    _sum: UserSkillSumAggregateOutputType | null
    _min: UserSkillMinAggregateOutputType | null
    _max: UserSkillMaxAggregateOutputType | null
  }

  type GetUserSkillGroupByPayload<T extends UserSkillGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserSkillGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserSkillGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserSkillGroupByOutputType[P]>
            : GetScalarType<T[P], UserSkillGroupByOutputType[P]>
        }
      >
    >


  export type UserSkillSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    skillID?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSkill"]>

  export type UserSkillSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    skillID?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSkill"]>

  export type UserSkillSelectScalar = {
    id?: boolean
    userID?: boolean
    skillID?: boolean
  }

  export type UserSkillInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }
  export type UserSkillIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }

  export type $UserSkillPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserSkill"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      skill: Prisma.$SkillPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userID: number
      skillID: number
    }, ExtArgs["result"]["userSkill"]>
    composites: {}
  }

  type UserSkillGetPayload<S extends boolean | null | undefined | UserSkillDefaultArgs> = $Result.GetResult<Prisma.$UserSkillPayload, S>

  type UserSkillCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserSkillFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserSkillCountAggregateInputType | true
    }

  export interface UserSkillDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserSkill'], meta: { name: 'UserSkill' } }
    /**
     * Find zero or one UserSkill that matches the filter.
     * @param {UserSkillFindUniqueArgs} args - Arguments to find a UserSkill
     * @example
     * // Get one UserSkill
     * const userSkill = await prisma.userSkill.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserSkillFindUniqueArgs>(args: SelectSubset<T, UserSkillFindUniqueArgs<ExtArgs>>): Prisma__UserSkillClient<$Result.GetResult<Prisma.$UserSkillPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserSkill that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserSkillFindUniqueOrThrowArgs} args - Arguments to find a UserSkill
     * @example
     * // Get one UserSkill
     * const userSkill = await prisma.userSkill.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserSkillFindUniqueOrThrowArgs>(args: SelectSubset<T, UserSkillFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserSkillClient<$Result.GetResult<Prisma.$UserSkillPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserSkill that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSkillFindFirstArgs} args - Arguments to find a UserSkill
     * @example
     * // Get one UserSkill
     * const userSkill = await prisma.userSkill.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserSkillFindFirstArgs>(args?: SelectSubset<T, UserSkillFindFirstArgs<ExtArgs>>): Prisma__UserSkillClient<$Result.GetResult<Prisma.$UserSkillPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserSkill that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSkillFindFirstOrThrowArgs} args - Arguments to find a UserSkill
     * @example
     * // Get one UserSkill
     * const userSkill = await prisma.userSkill.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserSkillFindFirstOrThrowArgs>(args?: SelectSubset<T, UserSkillFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserSkillClient<$Result.GetResult<Prisma.$UserSkillPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserSkills that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSkillFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserSkills
     * const userSkills = await prisma.userSkill.findMany()
     * 
     * // Get first 10 UserSkills
     * const userSkills = await prisma.userSkill.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userSkillWithIdOnly = await prisma.userSkill.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserSkillFindManyArgs>(args?: SelectSubset<T, UserSkillFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSkillPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserSkill.
     * @param {UserSkillCreateArgs} args - Arguments to create a UserSkill.
     * @example
     * // Create one UserSkill
     * const UserSkill = await prisma.userSkill.create({
     *   data: {
     *     // ... data to create a UserSkill
     *   }
     * })
     * 
     */
    create<T extends UserSkillCreateArgs>(args: SelectSubset<T, UserSkillCreateArgs<ExtArgs>>): Prisma__UserSkillClient<$Result.GetResult<Prisma.$UserSkillPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserSkills.
     * @param {UserSkillCreateManyArgs} args - Arguments to create many UserSkills.
     * @example
     * // Create many UserSkills
     * const userSkill = await prisma.userSkill.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserSkillCreateManyArgs>(args?: SelectSubset<T, UserSkillCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserSkills and returns the data saved in the database.
     * @param {UserSkillCreateManyAndReturnArgs} args - Arguments to create many UserSkills.
     * @example
     * // Create many UserSkills
     * const userSkill = await prisma.userSkill.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserSkills and only return the `id`
     * const userSkillWithIdOnly = await prisma.userSkill.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserSkillCreateManyAndReturnArgs>(args?: SelectSubset<T, UserSkillCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSkillPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserSkill.
     * @param {UserSkillDeleteArgs} args - Arguments to delete one UserSkill.
     * @example
     * // Delete one UserSkill
     * const UserSkill = await prisma.userSkill.delete({
     *   where: {
     *     // ... filter to delete one UserSkill
     *   }
     * })
     * 
     */
    delete<T extends UserSkillDeleteArgs>(args: SelectSubset<T, UserSkillDeleteArgs<ExtArgs>>): Prisma__UserSkillClient<$Result.GetResult<Prisma.$UserSkillPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserSkill.
     * @param {UserSkillUpdateArgs} args - Arguments to update one UserSkill.
     * @example
     * // Update one UserSkill
     * const userSkill = await prisma.userSkill.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserSkillUpdateArgs>(args: SelectSubset<T, UserSkillUpdateArgs<ExtArgs>>): Prisma__UserSkillClient<$Result.GetResult<Prisma.$UserSkillPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserSkills.
     * @param {UserSkillDeleteManyArgs} args - Arguments to filter UserSkills to delete.
     * @example
     * // Delete a few UserSkills
     * const { count } = await prisma.userSkill.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserSkillDeleteManyArgs>(args?: SelectSubset<T, UserSkillDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSkills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSkillUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserSkills
     * const userSkill = await prisma.userSkill.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserSkillUpdateManyArgs>(args: SelectSubset<T, UserSkillUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserSkill.
     * @param {UserSkillUpsertArgs} args - Arguments to update or create a UserSkill.
     * @example
     * // Update or create a UserSkill
     * const userSkill = await prisma.userSkill.upsert({
     *   create: {
     *     // ... data to create a UserSkill
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserSkill we want to update
     *   }
     * })
     */
    upsert<T extends UserSkillUpsertArgs>(args: SelectSubset<T, UserSkillUpsertArgs<ExtArgs>>): Prisma__UserSkillClient<$Result.GetResult<Prisma.$UserSkillPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserSkills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSkillCountArgs} args - Arguments to filter UserSkills to count.
     * @example
     * // Count the number of UserSkills
     * const count = await prisma.userSkill.count({
     *   where: {
     *     // ... the filter for the UserSkills we want to count
     *   }
     * })
    **/
    count<T extends UserSkillCountArgs>(
      args?: Subset<T, UserSkillCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserSkillCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserSkill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSkillAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserSkillAggregateArgs>(args: Subset<T, UserSkillAggregateArgs>): Prisma.PrismaPromise<GetUserSkillAggregateType<T>>

    /**
     * Group by UserSkill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSkillGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserSkillGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserSkillGroupByArgs['orderBy'] }
        : { orderBy?: UserSkillGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserSkillGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserSkillGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserSkill model
   */
  readonly fields: UserSkillFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserSkill.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserSkillClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    skill<T extends SkillDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SkillDefaultArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserSkill model
   */ 
  interface UserSkillFieldRefs {
    readonly id: FieldRef<"UserSkill", 'Int'>
    readonly userID: FieldRef<"UserSkill", 'Int'>
    readonly skillID: FieldRef<"UserSkill", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * UserSkill findUnique
   */
  export type UserSkillFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkill
     */
    select?: UserSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSkillInclude<ExtArgs> | null
    /**
     * Filter, which UserSkill to fetch.
     */
    where: UserSkillWhereUniqueInput
  }

  /**
   * UserSkill findUniqueOrThrow
   */
  export type UserSkillFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkill
     */
    select?: UserSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSkillInclude<ExtArgs> | null
    /**
     * Filter, which UserSkill to fetch.
     */
    where: UserSkillWhereUniqueInput
  }

  /**
   * UserSkill findFirst
   */
  export type UserSkillFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkill
     */
    select?: UserSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSkillInclude<ExtArgs> | null
    /**
     * Filter, which UserSkill to fetch.
     */
    where?: UserSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSkills to fetch.
     */
    orderBy?: UserSkillOrderByWithRelationInput | UserSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSkills.
     */
    cursor?: UserSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSkills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSkills.
     */
    distinct?: UserSkillScalarFieldEnum | UserSkillScalarFieldEnum[]
  }

  /**
   * UserSkill findFirstOrThrow
   */
  export type UserSkillFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkill
     */
    select?: UserSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSkillInclude<ExtArgs> | null
    /**
     * Filter, which UserSkill to fetch.
     */
    where?: UserSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSkills to fetch.
     */
    orderBy?: UserSkillOrderByWithRelationInput | UserSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSkills.
     */
    cursor?: UserSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSkills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSkills.
     */
    distinct?: UserSkillScalarFieldEnum | UserSkillScalarFieldEnum[]
  }

  /**
   * UserSkill findMany
   */
  export type UserSkillFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkill
     */
    select?: UserSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSkillInclude<ExtArgs> | null
    /**
     * Filter, which UserSkills to fetch.
     */
    where?: UserSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSkills to fetch.
     */
    orderBy?: UserSkillOrderByWithRelationInput | UserSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserSkills.
     */
    cursor?: UserSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSkills.
     */
    skip?: number
    distinct?: UserSkillScalarFieldEnum | UserSkillScalarFieldEnum[]
  }

  /**
   * UserSkill create
   */
  export type UserSkillCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkill
     */
    select?: UserSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSkillInclude<ExtArgs> | null
    /**
     * The data needed to create a UserSkill.
     */
    data: XOR<UserSkillCreateInput, UserSkillUncheckedCreateInput>
  }

  /**
   * UserSkill createMany
   */
  export type UserSkillCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserSkills.
     */
    data: UserSkillCreateManyInput | UserSkillCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserSkill createManyAndReturn
   */
  export type UserSkillCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkill
     */
    select?: UserSkillSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserSkills.
     */
    data: UserSkillCreateManyInput | UserSkillCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSkillIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSkill update
   */
  export type UserSkillUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkill
     */
    select?: UserSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSkillInclude<ExtArgs> | null
    /**
     * The data needed to update a UserSkill.
     */
    data: XOR<UserSkillUpdateInput, UserSkillUncheckedUpdateInput>
    /**
     * Choose, which UserSkill to update.
     */
    where: UserSkillWhereUniqueInput
  }

  /**
   * UserSkill updateMany
   */
  export type UserSkillUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserSkills.
     */
    data: XOR<UserSkillUpdateManyMutationInput, UserSkillUncheckedUpdateManyInput>
    /**
     * Filter which UserSkills to update
     */
    where?: UserSkillWhereInput
  }

  /**
   * UserSkill upsert
   */
  export type UserSkillUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkill
     */
    select?: UserSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSkillInclude<ExtArgs> | null
    /**
     * The filter to search for the UserSkill to update in case it exists.
     */
    where: UserSkillWhereUniqueInput
    /**
     * In case the UserSkill found by the `where` argument doesn't exist, create a new UserSkill with this data.
     */
    create: XOR<UserSkillCreateInput, UserSkillUncheckedCreateInput>
    /**
     * In case the UserSkill was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserSkillUpdateInput, UserSkillUncheckedUpdateInput>
  }

  /**
   * UserSkill delete
   */
  export type UserSkillDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkill
     */
    select?: UserSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSkillInclude<ExtArgs> | null
    /**
     * Filter which UserSkill to delete.
     */
    where: UserSkillWhereUniqueInput
  }

  /**
   * UserSkill deleteMany
   */
  export type UserSkillDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSkills to delete
     */
    where?: UserSkillWhereInput
  }

  /**
   * UserSkill without action
   */
  export type UserSkillDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkill
     */
    select?: UserSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSkillInclude<ExtArgs> | null
  }


  /**
   * Model CV
   */

  export type AggregateCV = {
    _count: CVCountAggregateOutputType | null
    _avg: CVAvgAggregateOutputType | null
    _sum: CVSumAggregateOutputType | null
    _min: CVMinAggregateOutputType | null
    _max: CVMaxAggregateOutputType | null
  }

  export type CVAvgAggregateOutputType = {
    id: number | null
    userID: number | null
  }

  export type CVSumAggregateOutputType = {
    id: number | null
    userID: number | null
  }

  export type CVMinAggregateOutputType = {
    id: number | null
    userID: number | null
    title: string | null
  }

  export type CVMaxAggregateOutputType = {
    id: number | null
    userID: number | null
    title: string | null
  }

  export type CVCountAggregateOutputType = {
    id: number
    userID: number
    title: number
    _all: number
  }


  export type CVAvgAggregateInputType = {
    id?: true
    userID?: true
  }

  export type CVSumAggregateInputType = {
    id?: true
    userID?: true
  }

  export type CVMinAggregateInputType = {
    id?: true
    userID?: true
    title?: true
  }

  export type CVMaxAggregateInputType = {
    id?: true
    userID?: true
    title?: true
  }

  export type CVCountAggregateInputType = {
    id?: true
    userID?: true
    title?: true
    _all?: true
  }

  export type CVAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CV to aggregate.
     */
    where?: CVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CVS to fetch.
     */
    orderBy?: CVOrderByWithRelationInput | CVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CVS
    **/
    _count?: true | CVCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CVAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CVSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CVMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CVMaxAggregateInputType
  }

  export type GetCVAggregateType<T extends CVAggregateArgs> = {
        [P in keyof T & keyof AggregateCV]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCV[P]>
      : GetScalarType<T[P], AggregateCV[P]>
  }




  export type CVGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CVWhereInput
    orderBy?: CVOrderByWithAggregationInput | CVOrderByWithAggregationInput[]
    by: CVScalarFieldEnum[] | CVScalarFieldEnum
    having?: CVScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CVCountAggregateInputType | true
    _avg?: CVAvgAggregateInputType
    _sum?: CVSumAggregateInputType
    _min?: CVMinAggregateInputType
    _max?: CVMaxAggregateInputType
  }

  export type CVGroupByOutputType = {
    id: number
    userID: number
    title: string
    _count: CVCountAggregateOutputType | null
    _avg: CVAvgAggregateOutputType | null
    _sum: CVSumAggregateOutputType | null
    _min: CVMinAggregateOutputType | null
    _max: CVMaxAggregateOutputType | null
  }

  type GetCVGroupByPayload<T extends CVGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CVGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CVGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CVGroupByOutputType[P]>
            : GetScalarType<T[P], CVGroupByOutputType[P]>
        }
      >
    >


  export type CVSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    title?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    applications?: boolean | CV$applicationsArgs<ExtArgs>
    _count?: boolean | CVCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cV"]>

  export type CVSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    title?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cV"]>

  export type CVSelectScalar = {
    id?: boolean
    userID?: boolean
    title?: boolean
  }

  export type CVInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    applications?: boolean | CV$applicationsArgs<ExtArgs>
    _count?: boolean | CVCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CVIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CVPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CV"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      applications: Prisma.$ApplyHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userID: number
      title: string
    }, ExtArgs["result"]["cV"]>
    composites: {}
  }

  type CVGetPayload<S extends boolean | null | undefined | CVDefaultArgs> = $Result.GetResult<Prisma.$CVPayload, S>

  type CVCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CVFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CVCountAggregateInputType | true
    }

  export interface CVDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CV'], meta: { name: 'CV' } }
    /**
     * Find zero or one CV that matches the filter.
     * @param {CVFindUniqueArgs} args - Arguments to find a CV
     * @example
     * // Get one CV
     * const cV = await prisma.cV.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CVFindUniqueArgs>(args: SelectSubset<T, CVFindUniqueArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CV that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CVFindUniqueOrThrowArgs} args - Arguments to find a CV
     * @example
     * // Get one CV
     * const cV = await prisma.cV.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CVFindUniqueOrThrowArgs>(args: SelectSubset<T, CVFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CV that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVFindFirstArgs} args - Arguments to find a CV
     * @example
     * // Get one CV
     * const cV = await prisma.cV.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CVFindFirstArgs>(args?: SelectSubset<T, CVFindFirstArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CV that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVFindFirstOrThrowArgs} args - Arguments to find a CV
     * @example
     * // Get one CV
     * const cV = await prisma.cV.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CVFindFirstOrThrowArgs>(args?: SelectSubset<T, CVFindFirstOrThrowArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CVS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CVS
     * const cVS = await prisma.cV.findMany()
     * 
     * // Get first 10 CVS
     * const cVS = await prisma.cV.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cVWithIdOnly = await prisma.cV.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CVFindManyArgs>(args?: SelectSubset<T, CVFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CV.
     * @param {CVCreateArgs} args - Arguments to create a CV.
     * @example
     * // Create one CV
     * const CV = await prisma.cV.create({
     *   data: {
     *     // ... data to create a CV
     *   }
     * })
     * 
     */
    create<T extends CVCreateArgs>(args: SelectSubset<T, CVCreateArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CVS.
     * @param {CVCreateManyArgs} args - Arguments to create many CVS.
     * @example
     * // Create many CVS
     * const cV = await prisma.cV.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CVCreateManyArgs>(args?: SelectSubset<T, CVCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CVS and returns the data saved in the database.
     * @param {CVCreateManyAndReturnArgs} args - Arguments to create many CVS.
     * @example
     * // Create many CVS
     * const cV = await prisma.cV.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CVS and only return the `id`
     * const cVWithIdOnly = await prisma.cV.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CVCreateManyAndReturnArgs>(args?: SelectSubset<T, CVCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CV.
     * @param {CVDeleteArgs} args - Arguments to delete one CV.
     * @example
     * // Delete one CV
     * const CV = await prisma.cV.delete({
     *   where: {
     *     // ... filter to delete one CV
     *   }
     * })
     * 
     */
    delete<T extends CVDeleteArgs>(args: SelectSubset<T, CVDeleteArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CV.
     * @param {CVUpdateArgs} args - Arguments to update one CV.
     * @example
     * // Update one CV
     * const cV = await prisma.cV.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CVUpdateArgs>(args: SelectSubset<T, CVUpdateArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CVS.
     * @param {CVDeleteManyArgs} args - Arguments to filter CVS to delete.
     * @example
     * // Delete a few CVS
     * const { count } = await prisma.cV.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CVDeleteManyArgs>(args?: SelectSubset<T, CVDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CVS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CVS
     * const cV = await prisma.cV.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CVUpdateManyArgs>(args: SelectSubset<T, CVUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CV.
     * @param {CVUpsertArgs} args - Arguments to update or create a CV.
     * @example
     * // Update or create a CV
     * const cV = await prisma.cV.upsert({
     *   create: {
     *     // ... data to create a CV
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CV we want to update
     *   }
     * })
     */
    upsert<T extends CVUpsertArgs>(args: SelectSubset<T, CVUpsertArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CVS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVCountArgs} args - Arguments to filter CVS to count.
     * @example
     * // Count the number of CVS
     * const count = await prisma.cV.count({
     *   where: {
     *     // ... the filter for the CVS we want to count
     *   }
     * })
    **/
    count<T extends CVCountArgs>(
      args?: Subset<T, CVCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CVCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CV.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CVAggregateArgs>(args: Subset<T, CVAggregateArgs>): Prisma.PrismaPromise<GetCVAggregateType<T>>

    /**
     * Group by CV.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CVGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CVGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CVGroupByArgs['orderBy'] }
        : { orderBy?: CVGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CVGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCVGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CV model
   */
  readonly fields: CVFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CV.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CVClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    applications<T extends CV$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, CV$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplyHistoryPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CV model
   */ 
  interface CVFieldRefs {
    readonly id: FieldRef<"CV", 'Int'>
    readonly userID: FieldRef<"CV", 'Int'>
    readonly title: FieldRef<"CV", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CV findUnique
   */
  export type CVFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * Filter, which CV to fetch.
     */
    where: CVWhereUniqueInput
  }

  /**
   * CV findUniqueOrThrow
   */
  export type CVFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * Filter, which CV to fetch.
     */
    where: CVWhereUniqueInput
  }

  /**
   * CV findFirst
   */
  export type CVFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * Filter, which CV to fetch.
     */
    where?: CVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CVS to fetch.
     */
    orderBy?: CVOrderByWithRelationInput | CVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CVS.
     */
    cursor?: CVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CVS.
     */
    distinct?: CVScalarFieldEnum | CVScalarFieldEnum[]
  }

  /**
   * CV findFirstOrThrow
   */
  export type CVFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * Filter, which CV to fetch.
     */
    where?: CVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CVS to fetch.
     */
    orderBy?: CVOrderByWithRelationInput | CVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CVS.
     */
    cursor?: CVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CVS.
     */
    distinct?: CVScalarFieldEnum | CVScalarFieldEnum[]
  }

  /**
   * CV findMany
   */
  export type CVFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * Filter, which CVS to fetch.
     */
    where?: CVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CVS to fetch.
     */
    orderBy?: CVOrderByWithRelationInput | CVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CVS.
     */
    cursor?: CVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CVS.
     */
    skip?: number
    distinct?: CVScalarFieldEnum | CVScalarFieldEnum[]
  }

  /**
   * CV create
   */
  export type CVCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * The data needed to create a CV.
     */
    data: XOR<CVCreateInput, CVUncheckedCreateInput>
  }

  /**
   * CV createMany
   */
  export type CVCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CVS.
     */
    data: CVCreateManyInput | CVCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CV createManyAndReturn
   */
  export type CVCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CVS.
     */
    data: CVCreateManyInput | CVCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CV update
   */
  export type CVUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * The data needed to update a CV.
     */
    data: XOR<CVUpdateInput, CVUncheckedUpdateInput>
    /**
     * Choose, which CV to update.
     */
    where: CVWhereUniqueInput
  }

  /**
   * CV updateMany
   */
  export type CVUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CVS.
     */
    data: XOR<CVUpdateManyMutationInput, CVUncheckedUpdateManyInput>
    /**
     * Filter which CVS to update
     */
    where?: CVWhereInput
  }

  /**
   * CV upsert
   */
  export type CVUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * The filter to search for the CV to update in case it exists.
     */
    where: CVWhereUniqueInput
    /**
     * In case the CV found by the `where` argument doesn't exist, create a new CV with this data.
     */
    create: XOR<CVCreateInput, CVUncheckedCreateInput>
    /**
     * In case the CV was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CVUpdateInput, CVUncheckedUpdateInput>
  }

  /**
   * CV delete
   */
  export type CVDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
    /**
     * Filter which CV to delete.
     */
    where: CVWhereUniqueInput
  }

  /**
   * CV deleteMany
   */
  export type CVDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CVS to delete
     */
    where?: CVWhereInput
  }

  /**
   * CV.applications
   */
  export type CV$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplyHistory
     */
    select?: ApplyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplyHistoryInclude<ExtArgs> | null
    where?: ApplyHistoryWhereInput
    orderBy?: ApplyHistoryOrderByWithRelationInput | ApplyHistoryOrderByWithRelationInput[]
    cursor?: ApplyHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplyHistoryScalarFieldEnum | ApplyHistoryScalarFieldEnum[]
  }

  /**
   * CV without action
   */
  export type CVDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CV
     */
    select?: CVSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CVInclude<ExtArgs> | null
  }


  /**
   * Model Company
   */

  export type AggregateCompany = {
    _count: CompanyCountAggregateOutputType | null
    _avg: CompanyAvgAggregateOutputType | null
    _sum: CompanySumAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  export type CompanyAvgAggregateOutputType = {
    companyID: number | null
  }

  export type CompanySumAggregateOutputType = {
    companyID: number | null
  }

  export type CompanyMinAggregateOutputType = {
    companyID: number | null
    companyName: string | null
    companyWebsite: string | null
    companyProfile: string | null
    address: string | null
    companySize: string | null
    companyLogo: string | null
  }

  export type CompanyMaxAggregateOutputType = {
    companyID: number | null
    companyName: string | null
    companyWebsite: string | null
    companyProfile: string | null
    address: string | null
    companySize: string | null
    companyLogo: string | null
  }

  export type CompanyCountAggregateOutputType = {
    companyID: number
    companyName: number
    companyWebsite: number
    companyProfile: number
    address: number
    companySize: number
    companyLogo: number
    _all: number
  }


  export type CompanyAvgAggregateInputType = {
    companyID?: true
  }

  export type CompanySumAggregateInputType = {
    companyID?: true
  }

  export type CompanyMinAggregateInputType = {
    companyID?: true
    companyName?: true
    companyWebsite?: true
    companyProfile?: true
    address?: true
    companySize?: true
    companyLogo?: true
  }

  export type CompanyMaxAggregateInputType = {
    companyID?: true
    companyName?: true
    companyWebsite?: true
    companyProfile?: true
    address?: true
    companySize?: true
    companyLogo?: true
  }

  export type CompanyCountAggregateInputType = {
    companyID?: true
    companyName?: true
    companyWebsite?: true
    companyProfile?: true
    address?: true
    companySize?: true
    companyLogo?: true
    _all?: true
  }

  export type CompanyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Company to aggregate.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Companies
    **/
    _count?: true | CompanyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CompanyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CompanySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompanyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompanyMaxAggregateInputType
  }

  export type GetCompanyAggregateType<T extends CompanyAggregateArgs> = {
        [P in keyof T & keyof AggregateCompany]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompany[P]>
      : GetScalarType<T[P], AggregateCompany[P]>
  }




  export type CompanyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyWhereInput
    orderBy?: CompanyOrderByWithAggregationInput | CompanyOrderByWithAggregationInput[]
    by: CompanyScalarFieldEnum[] | CompanyScalarFieldEnum
    having?: CompanyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompanyCountAggregateInputType | true
    _avg?: CompanyAvgAggregateInputType
    _sum?: CompanySumAggregateInputType
    _min?: CompanyMinAggregateInputType
    _max?: CompanyMaxAggregateInputType
  }

  export type CompanyGroupByOutputType = {
    companyID: number
    companyName: string
    companyWebsite: string | null
    companyProfile: string | null
    address: string | null
    companySize: string | null
    companyLogo: string | null
    _count: CompanyCountAggregateOutputType | null
    _avg: CompanyAvgAggregateOutputType | null
    _sum: CompanySumAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  type GetCompanyGroupByPayload<T extends CompanyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompanyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompanyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompanyGroupByOutputType[P]>
            : GetScalarType<T[P], CompanyGroupByOutputType[P]>
        }
      >
    >


  export type CompanySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    companyID?: boolean
    companyName?: boolean
    companyWebsite?: boolean
    companyProfile?: boolean
    address?: boolean
    companySize?: boolean
    companyLogo?: boolean
    jobs?: boolean | Company$jobsArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["company"]>

  export type CompanySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    companyID?: boolean
    companyName?: boolean
    companyWebsite?: boolean
    companyProfile?: boolean
    address?: boolean
    companySize?: boolean
    companyLogo?: boolean
  }, ExtArgs["result"]["company"]>

  export type CompanySelectScalar = {
    companyID?: boolean
    companyName?: boolean
    companyWebsite?: boolean
    companyProfile?: boolean
    address?: boolean
    companySize?: boolean
    companyLogo?: boolean
  }

  export type CompanyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobs?: boolean | Company$jobsArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CompanyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Company"
    objects: {
      jobs: Prisma.$JobPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      companyID: number
      companyName: string
      companyWebsite: string | null
      companyProfile: string | null
      address: string | null
      companySize: string | null
      companyLogo: string | null
    }, ExtArgs["result"]["company"]>
    composites: {}
  }

  type CompanyGetPayload<S extends boolean | null | undefined | CompanyDefaultArgs> = $Result.GetResult<Prisma.$CompanyPayload, S>

  type CompanyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CompanyFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CompanyCountAggregateInputType | true
    }

  export interface CompanyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Company'], meta: { name: 'Company' } }
    /**
     * Find zero or one Company that matches the filter.
     * @param {CompanyFindUniqueArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompanyFindUniqueArgs>(args: SelectSubset<T, CompanyFindUniqueArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Company that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CompanyFindUniqueOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompanyFindUniqueOrThrowArgs>(args: SelectSubset<T, CompanyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Company that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompanyFindFirstArgs>(args?: SelectSubset<T, CompanyFindFirstArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Company that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompanyFindFirstOrThrowArgs>(args?: SelectSubset<T, CompanyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Companies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Companies
     * const companies = await prisma.company.findMany()
     * 
     * // Get first 10 Companies
     * const companies = await prisma.company.findMany({ take: 10 })
     * 
     * // Only select the `companyID`
     * const companyWithCompanyIDOnly = await prisma.company.findMany({ select: { companyID: true } })
     * 
     */
    findMany<T extends CompanyFindManyArgs>(args?: SelectSubset<T, CompanyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Company.
     * @param {CompanyCreateArgs} args - Arguments to create a Company.
     * @example
     * // Create one Company
     * const Company = await prisma.company.create({
     *   data: {
     *     // ... data to create a Company
     *   }
     * })
     * 
     */
    create<T extends CompanyCreateArgs>(args: SelectSubset<T, CompanyCreateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Companies.
     * @param {CompanyCreateManyArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompanyCreateManyArgs>(args?: SelectSubset<T, CompanyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Companies and returns the data saved in the database.
     * @param {CompanyCreateManyAndReturnArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Companies and only return the `companyID`
     * const companyWithCompanyIDOnly = await prisma.company.createManyAndReturn({ 
     *   select: { companyID: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompanyCreateManyAndReturnArgs>(args?: SelectSubset<T, CompanyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Company.
     * @param {CompanyDeleteArgs} args - Arguments to delete one Company.
     * @example
     * // Delete one Company
     * const Company = await prisma.company.delete({
     *   where: {
     *     // ... filter to delete one Company
     *   }
     * })
     * 
     */
    delete<T extends CompanyDeleteArgs>(args: SelectSubset<T, CompanyDeleteArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Company.
     * @param {CompanyUpdateArgs} args - Arguments to update one Company.
     * @example
     * // Update one Company
     * const company = await prisma.company.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompanyUpdateArgs>(args: SelectSubset<T, CompanyUpdateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Companies.
     * @param {CompanyDeleteManyArgs} args - Arguments to filter Companies to delete.
     * @example
     * // Delete a few Companies
     * const { count } = await prisma.company.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompanyDeleteManyArgs>(args?: SelectSubset<T, CompanyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Companies
     * const company = await prisma.company.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompanyUpdateManyArgs>(args: SelectSubset<T, CompanyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Company.
     * @param {CompanyUpsertArgs} args - Arguments to update or create a Company.
     * @example
     * // Update or create a Company
     * const company = await prisma.company.upsert({
     *   create: {
     *     // ... data to create a Company
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Company we want to update
     *   }
     * })
     */
    upsert<T extends CompanyUpsertArgs>(args: SelectSubset<T, CompanyUpsertArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyCountArgs} args - Arguments to filter Companies to count.
     * @example
     * // Count the number of Companies
     * const count = await prisma.company.count({
     *   where: {
     *     // ... the filter for the Companies we want to count
     *   }
     * })
    **/
    count<T extends CompanyCountArgs>(
      args?: Subset<T, CompanyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompanyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompanyAggregateArgs>(args: Subset<T, CompanyAggregateArgs>): Prisma.PrismaPromise<GetCompanyAggregateType<T>>

    /**
     * Group by Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompanyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompanyGroupByArgs['orderBy'] }
        : { orderBy?: CompanyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompanyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Company model
   */
  readonly fields: CompanyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Company.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompanyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    jobs<T extends Company$jobsArgs<ExtArgs> = {}>(args?: Subset<T, Company$jobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Company model
   */ 
  interface CompanyFieldRefs {
    readonly companyID: FieldRef<"Company", 'Int'>
    readonly companyName: FieldRef<"Company", 'String'>
    readonly companyWebsite: FieldRef<"Company", 'String'>
    readonly companyProfile: FieldRef<"Company", 'String'>
    readonly address: FieldRef<"Company", 'String'>
    readonly companySize: FieldRef<"Company", 'String'>
    readonly companyLogo: FieldRef<"Company", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Company findUnique
   */
  export type CompanyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findUniqueOrThrow
   */
  export type CompanyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findFirst
   */
  export type CompanyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findFirstOrThrow
   */
  export type CompanyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findMany
   */
  export type CompanyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Companies to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company create
   */
  export type CompanyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to create a Company.
     */
    data: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
  }

  /**
   * Company createMany
   */
  export type CompanyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Company createManyAndReturn
   */
  export type CompanyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Company update
   */
  export type CompanyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to update a Company.
     */
    data: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
    /**
     * Choose, which Company to update.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company updateMany
   */
  export type CompanyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Companies.
     */
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>
    /**
     * Filter which Companies to update
     */
    where?: CompanyWhereInput
  }

  /**
   * Company upsert
   */
  export type CompanyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The filter to search for the Company to update in case it exists.
     */
    where: CompanyWhereUniqueInput
    /**
     * In case the Company found by the `where` argument doesn't exist, create a new Company with this data.
     */
    create: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
    /**
     * In case the Company was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
  }

  /**
   * Company delete
   */
  export type CompanyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter which Company to delete.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company deleteMany
   */
  export type CompanyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Companies to delete
     */
    where?: CompanyWhereInput
  }

  /**
   * Company.jobs
   */
  export type Company$jobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    where?: JobWhereInput
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    cursor?: JobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Company without action
   */
  export type CompanyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
  }


  /**
   * Model Job
   */

  export type AggregateJob = {
    _count: JobCountAggregateOutputType | null
    _avg: JobAvgAggregateOutputType | null
    _sum: JobSumAggregateOutputType | null
    _min: JobMinAggregateOutputType | null
    _max: JobMaxAggregateOutputType | null
  }

  export type JobAvgAggregateOutputType = {
    jobID: number | null
    companyID: number | null
    industryID: number | null
    experienceYear: number | null
  }

  export type JobSumAggregateOutputType = {
    jobID: number | null
    companyID: number | null
    industryID: number | null
    experienceYear: number | null
  }

  export type JobMinAggregateOutputType = {
    jobID: number | null
    companyID: number | null
    industryID: number | null
    title: string | null
    location: string | null
    salary: string | null
    description: string | null
    requirement: string | null
    benefit: string | null
    jobType: string | null
    workingTime: string | null
    experienceYear: number | null
    postedAt: Date | null
    deadline: Date | null
    sourcePlatform: string | null
    sourceLink: string | null
    isActive: boolean | null
  }

  export type JobMaxAggregateOutputType = {
    jobID: number | null
    companyID: number | null
    industryID: number | null
    title: string | null
    location: string | null
    salary: string | null
    description: string | null
    requirement: string | null
    benefit: string | null
    jobType: string | null
    workingTime: string | null
    experienceYear: number | null
    postedAt: Date | null
    deadline: Date | null
    sourcePlatform: string | null
    sourceLink: string | null
    isActive: boolean | null
  }

  export type JobCountAggregateOutputType = {
    jobID: number
    companyID: number
    industryID: number
    title: number
    location: number
    salary: number
    description: number
    requirement: number
    benefit: number
    jobType: number
    workingTime: number
    experienceYear: number
    postedAt: number
    deadline: number
    sourcePlatform: number
    sourceLink: number
    isActive: number
    _all: number
  }


  export type JobAvgAggregateInputType = {
    jobID?: true
    companyID?: true
    industryID?: true
    experienceYear?: true
  }

  export type JobSumAggregateInputType = {
    jobID?: true
    companyID?: true
    industryID?: true
    experienceYear?: true
  }

  export type JobMinAggregateInputType = {
    jobID?: true
    companyID?: true
    industryID?: true
    title?: true
    location?: true
    salary?: true
    description?: true
    requirement?: true
    benefit?: true
    jobType?: true
    workingTime?: true
    experienceYear?: true
    postedAt?: true
    deadline?: true
    sourcePlatform?: true
    sourceLink?: true
    isActive?: true
  }

  export type JobMaxAggregateInputType = {
    jobID?: true
    companyID?: true
    industryID?: true
    title?: true
    location?: true
    salary?: true
    description?: true
    requirement?: true
    benefit?: true
    jobType?: true
    workingTime?: true
    experienceYear?: true
    postedAt?: true
    deadline?: true
    sourcePlatform?: true
    sourceLink?: true
    isActive?: true
  }

  export type JobCountAggregateInputType = {
    jobID?: true
    companyID?: true
    industryID?: true
    title?: true
    location?: true
    salary?: true
    description?: true
    requirement?: true
    benefit?: true
    jobType?: true
    workingTime?: true
    experienceYear?: true
    postedAt?: true
    deadline?: true
    sourcePlatform?: true
    sourceLink?: true
    isActive?: true
    _all?: true
  }

  export type JobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Job to aggregate.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Jobs
    **/
    _count?: true | JobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JobMaxAggregateInputType
  }

  export type GetJobAggregateType<T extends JobAggregateArgs> = {
        [P in keyof T & keyof AggregateJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJob[P]>
      : GetScalarType<T[P], AggregateJob[P]>
  }




  export type JobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobWhereInput
    orderBy?: JobOrderByWithAggregationInput | JobOrderByWithAggregationInput[]
    by: JobScalarFieldEnum[] | JobScalarFieldEnum
    having?: JobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JobCountAggregateInputType | true
    _avg?: JobAvgAggregateInputType
    _sum?: JobSumAggregateInputType
    _min?: JobMinAggregateInputType
    _max?: JobMaxAggregateInputType
  }

  export type JobGroupByOutputType = {
    jobID: number
    companyID: number
    industryID: number | null
    title: string | null
    location: string | null
    salary: string | null
    description: string | null
    requirement: string | null
    benefit: string | null
    jobType: string | null
    workingTime: string | null
    experienceYear: number | null
    postedAt: Date
    deadline: Date | null
    sourcePlatform: string | null
    sourceLink: string | null
    isActive: boolean
    _count: JobCountAggregateOutputType | null
    _avg: JobAvgAggregateOutputType | null
    _sum: JobSumAggregateOutputType | null
    _min: JobMinAggregateOutputType | null
    _max: JobMaxAggregateOutputType | null
  }

  type GetJobGroupByPayload<T extends JobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JobGroupByOutputType[P]>
            : GetScalarType<T[P], JobGroupByOutputType[P]>
        }
      >
    >


  export type JobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    jobID?: boolean
    companyID?: boolean
    industryID?: boolean
    title?: boolean
    location?: boolean
    salary?: boolean
    description?: boolean
    requirement?: boolean
    benefit?: boolean
    jobType?: boolean
    workingTime?: boolean
    experienceYear?: boolean
    postedAt?: boolean
    deadline?: boolean
    sourcePlatform?: boolean
    sourceLink?: boolean
    isActive?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    industry?: boolean | Job$industryArgs<ExtArgs>
    skills?: boolean | Job$skillsArgs<ExtArgs>
    savedJobs?: boolean | Job$savedJobsArgs<ExtArgs>
    behaviors?: boolean | Job$behaviorsArgs<ExtArgs>
    applyHistories?: boolean | Job$applyHistoriesArgs<ExtArgs>
    sourceTrackings?: boolean | Job$sourceTrackingsArgs<ExtArgs>
    recommendations?: boolean | Job$recommendationsArgs<ExtArgs>
    _count?: boolean | JobCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["job"]>

  export type JobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    jobID?: boolean
    companyID?: boolean
    industryID?: boolean
    title?: boolean
    location?: boolean
    salary?: boolean
    description?: boolean
    requirement?: boolean
    benefit?: boolean
    jobType?: boolean
    workingTime?: boolean
    experienceYear?: boolean
    postedAt?: boolean
    deadline?: boolean
    sourcePlatform?: boolean
    sourceLink?: boolean
    isActive?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    industry?: boolean | Job$industryArgs<ExtArgs>
  }, ExtArgs["result"]["job"]>

  export type JobSelectScalar = {
    jobID?: boolean
    companyID?: boolean
    industryID?: boolean
    title?: boolean
    location?: boolean
    salary?: boolean
    description?: boolean
    requirement?: boolean
    benefit?: boolean
    jobType?: boolean
    workingTime?: boolean
    experienceYear?: boolean
    postedAt?: boolean
    deadline?: boolean
    sourcePlatform?: boolean
    sourceLink?: boolean
    isActive?: boolean
  }

  export type JobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    industry?: boolean | Job$industryArgs<ExtArgs>
    skills?: boolean | Job$skillsArgs<ExtArgs>
    savedJobs?: boolean | Job$savedJobsArgs<ExtArgs>
    behaviors?: boolean | Job$behaviorsArgs<ExtArgs>
    applyHistories?: boolean | Job$applyHistoriesArgs<ExtArgs>
    sourceTrackings?: boolean | Job$sourceTrackingsArgs<ExtArgs>
    recommendations?: boolean | Job$recommendationsArgs<ExtArgs>
    _count?: boolean | JobCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type JobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    industry?: boolean | Job$industryArgs<ExtArgs>
  }

  export type $JobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Job"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs>
      industry: Prisma.$IndustryPayload<ExtArgs> | null
      skills: Prisma.$JobSkillPayload<ExtArgs>[]
      savedJobs: Prisma.$SavedJobPayload<ExtArgs>[]
      behaviors: Prisma.$UserBehaviorPayload<ExtArgs>[]
      applyHistories: Prisma.$ApplyHistoryPayload<ExtArgs>[]
      sourceTrackings: Prisma.$JobSourceTrackingPayload<ExtArgs>[]
      recommendations: Prisma.$JobRecommendationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      jobID: number
      companyID: number
      industryID: number | null
      title: string | null
      location: string | null
      salary: string | null
      description: string | null
      requirement: string | null
      benefit: string | null
      jobType: string | null
      workingTime: string | null
      experienceYear: number | null
      postedAt: Date
      deadline: Date | null
      sourcePlatform: string | null
      sourceLink: string | null
      isActive: boolean
    }, ExtArgs["result"]["job"]>
    composites: {}
  }

  type JobGetPayload<S extends boolean | null | undefined | JobDefaultArgs> = $Result.GetResult<Prisma.$JobPayload, S>

  type JobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<JobFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: JobCountAggregateInputType | true
    }

  export interface JobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Job'], meta: { name: 'Job' } }
    /**
     * Find zero or one Job that matches the filter.
     * @param {JobFindUniqueArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JobFindUniqueArgs>(args: SelectSubset<T, JobFindUniqueArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Job that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {JobFindUniqueOrThrowArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JobFindUniqueOrThrowArgs>(args: SelectSubset<T, JobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Job that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindFirstArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JobFindFirstArgs>(args?: SelectSubset<T, JobFindFirstArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Job that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindFirstOrThrowArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JobFindFirstOrThrowArgs>(args?: SelectSubset<T, JobFindFirstOrThrowArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Jobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Jobs
     * const jobs = await prisma.job.findMany()
     * 
     * // Get first 10 Jobs
     * const jobs = await prisma.job.findMany({ take: 10 })
     * 
     * // Only select the `jobID`
     * const jobWithJobIDOnly = await prisma.job.findMany({ select: { jobID: true } })
     * 
     */
    findMany<T extends JobFindManyArgs>(args?: SelectSubset<T, JobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Job.
     * @param {JobCreateArgs} args - Arguments to create a Job.
     * @example
     * // Create one Job
     * const Job = await prisma.job.create({
     *   data: {
     *     // ... data to create a Job
     *   }
     * })
     * 
     */
    create<T extends JobCreateArgs>(args: SelectSubset<T, JobCreateArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Jobs.
     * @param {JobCreateManyArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const job = await prisma.job.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JobCreateManyArgs>(args?: SelectSubset<T, JobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Jobs and returns the data saved in the database.
     * @param {JobCreateManyAndReturnArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const job = await prisma.job.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Jobs and only return the `jobID`
     * const jobWithJobIDOnly = await prisma.job.createManyAndReturn({ 
     *   select: { jobID: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JobCreateManyAndReturnArgs>(args?: SelectSubset<T, JobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Job.
     * @param {JobDeleteArgs} args - Arguments to delete one Job.
     * @example
     * // Delete one Job
     * const Job = await prisma.job.delete({
     *   where: {
     *     // ... filter to delete one Job
     *   }
     * })
     * 
     */
    delete<T extends JobDeleteArgs>(args: SelectSubset<T, JobDeleteArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Job.
     * @param {JobUpdateArgs} args - Arguments to update one Job.
     * @example
     * // Update one Job
     * const job = await prisma.job.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JobUpdateArgs>(args: SelectSubset<T, JobUpdateArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Jobs.
     * @param {JobDeleteManyArgs} args - Arguments to filter Jobs to delete.
     * @example
     * // Delete a few Jobs
     * const { count } = await prisma.job.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JobDeleteManyArgs>(args?: SelectSubset<T, JobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Jobs
     * const job = await prisma.job.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JobUpdateManyArgs>(args: SelectSubset<T, JobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Job.
     * @param {JobUpsertArgs} args - Arguments to update or create a Job.
     * @example
     * // Update or create a Job
     * const job = await prisma.job.upsert({
     *   create: {
     *     // ... data to create a Job
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Job we want to update
     *   }
     * })
     */
    upsert<T extends JobUpsertArgs>(args: SelectSubset<T, JobUpsertArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobCountArgs} args - Arguments to filter Jobs to count.
     * @example
     * // Count the number of Jobs
     * const count = await prisma.job.count({
     *   where: {
     *     // ... the filter for the Jobs we want to count
     *   }
     * })
    **/
    count<T extends JobCountArgs>(
      args?: Subset<T, JobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Job.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JobAggregateArgs>(args: Subset<T, JobAggregateArgs>): Prisma.PrismaPromise<GetJobAggregateType<T>>

    /**
     * Group by Job.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JobGroupByArgs['orderBy'] }
        : { orderBy?: JobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Job model
   */
  readonly fields: JobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Job.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends CompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompanyDefaultArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    industry<T extends Job$industryArgs<ExtArgs> = {}>(args?: Subset<T, Job$industryArgs<ExtArgs>>): Prisma__IndustryClient<$Result.GetResult<Prisma.$IndustryPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    skills<T extends Job$skillsArgs<ExtArgs> = {}>(args?: Subset<T, Job$skillsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobSkillPayload<ExtArgs>, T, "findMany"> | Null>
    savedJobs<T extends Job$savedJobsArgs<ExtArgs> = {}>(args?: Subset<T, Job$savedJobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "findMany"> | Null>
    behaviors<T extends Job$behaviorsArgs<ExtArgs> = {}>(args?: Subset<T, Job$behaviorsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBehaviorPayload<ExtArgs>, T, "findMany"> | Null>
    applyHistories<T extends Job$applyHistoriesArgs<ExtArgs> = {}>(args?: Subset<T, Job$applyHistoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplyHistoryPayload<ExtArgs>, T, "findMany"> | Null>
    sourceTrackings<T extends Job$sourceTrackingsArgs<ExtArgs> = {}>(args?: Subset<T, Job$sourceTrackingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobSourceTrackingPayload<ExtArgs>, T, "findMany"> | Null>
    recommendations<T extends Job$recommendationsArgs<ExtArgs> = {}>(args?: Subset<T, Job$recommendationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobRecommendationPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Job model
   */ 
  interface JobFieldRefs {
    readonly jobID: FieldRef<"Job", 'Int'>
    readonly companyID: FieldRef<"Job", 'Int'>
    readonly industryID: FieldRef<"Job", 'Int'>
    readonly title: FieldRef<"Job", 'String'>
    readonly location: FieldRef<"Job", 'String'>
    readonly salary: FieldRef<"Job", 'String'>
    readonly description: FieldRef<"Job", 'String'>
    readonly requirement: FieldRef<"Job", 'String'>
    readonly benefit: FieldRef<"Job", 'String'>
    readonly jobType: FieldRef<"Job", 'String'>
    readonly workingTime: FieldRef<"Job", 'String'>
    readonly experienceYear: FieldRef<"Job", 'Int'>
    readonly postedAt: FieldRef<"Job", 'DateTime'>
    readonly deadline: FieldRef<"Job", 'DateTime'>
    readonly sourcePlatform: FieldRef<"Job", 'String'>
    readonly sourceLink: FieldRef<"Job", 'String'>
    readonly isActive: FieldRef<"Job", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Job findUnique
   */
  export type JobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job findUniqueOrThrow
   */
  export type JobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job findFirst
   */
  export type JobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job findFirstOrThrow
   */
  export type JobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job findMany
   */
  export type JobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Jobs to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job create
   */
  export type JobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The data needed to create a Job.
     */
    data: XOR<JobCreateInput, JobUncheckedCreateInput>
  }

  /**
   * Job createMany
   */
  export type JobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Jobs.
     */
    data: JobCreateManyInput | JobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Job createManyAndReturn
   */
  export type JobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Jobs.
     */
    data: JobCreateManyInput | JobCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Job update
   */
  export type JobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The data needed to update a Job.
     */
    data: XOR<JobUpdateInput, JobUncheckedUpdateInput>
    /**
     * Choose, which Job to update.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job updateMany
   */
  export type JobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Jobs.
     */
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyInput>
    /**
     * Filter which Jobs to update
     */
    where?: JobWhereInput
  }

  /**
   * Job upsert
   */
  export type JobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The filter to search for the Job to update in case it exists.
     */
    where: JobWhereUniqueInput
    /**
     * In case the Job found by the `where` argument doesn't exist, create a new Job with this data.
     */
    create: XOR<JobCreateInput, JobUncheckedCreateInput>
    /**
     * In case the Job was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JobUpdateInput, JobUncheckedUpdateInput>
  }

  /**
   * Job delete
   */
  export type JobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter which Job to delete.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job deleteMany
   */
  export type JobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Jobs to delete
     */
    where?: JobWhereInput
  }

  /**
   * Job.industry
   */
  export type Job$industryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Industry
     */
    select?: IndustrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndustryInclude<ExtArgs> | null
    where?: IndustryWhereInput
  }

  /**
   * Job.skills
   */
  export type Job$skillsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSkill
     */
    select?: JobSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSkillInclude<ExtArgs> | null
    where?: JobSkillWhereInput
    orderBy?: JobSkillOrderByWithRelationInput | JobSkillOrderByWithRelationInput[]
    cursor?: JobSkillWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobSkillScalarFieldEnum | JobSkillScalarFieldEnum[]
  }

  /**
   * Job.savedJobs
   */
  export type Job$savedJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    where?: SavedJobWhereInput
    orderBy?: SavedJobOrderByWithRelationInput | SavedJobOrderByWithRelationInput[]
    cursor?: SavedJobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SavedJobScalarFieldEnum | SavedJobScalarFieldEnum[]
  }

  /**
   * Job.behaviors
   */
  export type Job$behaviorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBehavior
     */
    select?: UserBehaviorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBehaviorInclude<ExtArgs> | null
    where?: UserBehaviorWhereInput
    orderBy?: UserBehaviorOrderByWithRelationInput | UserBehaviorOrderByWithRelationInput[]
    cursor?: UserBehaviorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserBehaviorScalarFieldEnum | UserBehaviorScalarFieldEnum[]
  }

  /**
   * Job.applyHistories
   */
  export type Job$applyHistoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplyHistory
     */
    select?: ApplyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplyHistoryInclude<ExtArgs> | null
    where?: ApplyHistoryWhereInput
    orderBy?: ApplyHistoryOrderByWithRelationInput | ApplyHistoryOrderByWithRelationInput[]
    cursor?: ApplyHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplyHistoryScalarFieldEnum | ApplyHistoryScalarFieldEnum[]
  }

  /**
   * Job.sourceTrackings
   */
  export type Job$sourceTrackingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSourceTracking
     */
    select?: JobSourceTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSourceTrackingInclude<ExtArgs> | null
    where?: JobSourceTrackingWhereInput
    orderBy?: JobSourceTrackingOrderByWithRelationInput | JobSourceTrackingOrderByWithRelationInput[]
    cursor?: JobSourceTrackingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobSourceTrackingScalarFieldEnum | JobSourceTrackingScalarFieldEnum[]
  }

  /**
   * Job.recommendations
   */
  export type Job$recommendationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobRecommendation
     */
    select?: JobRecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobRecommendationInclude<ExtArgs> | null
    where?: JobRecommendationWhereInput
    orderBy?: JobRecommendationOrderByWithRelationInput | JobRecommendationOrderByWithRelationInput[]
    cursor?: JobRecommendationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobRecommendationScalarFieldEnum | JobRecommendationScalarFieldEnum[]
  }

  /**
   * Job without action
   */
  export type JobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
  }


  /**
   * Model JobRecommendation
   */

  export type AggregateJobRecommendation = {
    _count: JobRecommendationCountAggregateOutputType | null
    _avg: JobRecommendationAvgAggregateOutputType | null
    _sum: JobRecommendationSumAggregateOutputType | null
    _min: JobRecommendationMinAggregateOutputType | null
    _max: JobRecommendationMaxAggregateOutputType | null
  }

  export type JobRecommendationAvgAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
    matchPercent: number | null
  }

  export type JobRecommendationSumAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
    matchPercent: number | null
  }

  export type JobRecommendationMinAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
    matchPercent: number | null
    createdAt: Date | null
  }

  export type JobRecommendationMaxAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
    matchPercent: number | null
    createdAt: Date | null
  }

  export type JobRecommendationCountAggregateOutputType = {
    id: number
    userID: number
    jobID: number
    matchPercent: number
    createdAt: number
    _all: number
  }


  export type JobRecommendationAvgAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    matchPercent?: true
  }

  export type JobRecommendationSumAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    matchPercent?: true
  }

  export type JobRecommendationMinAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    matchPercent?: true
    createdAt?: true
  }

  export type JobRecommendationMaxAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    matchPercent?: true
    createdAt?: true
  }

  export type JobRecommendationCountAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    matchPercent?: true
    createdAt?: true
    _all?: true
  }

  export type JobRecommendationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JobRecommendation to aggregate.
     */
    where?: JobRecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobRecommendations to fetch.
     */
    orderBy?: JobRecommendationOrderByWithRelationInput | JobRecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JobRecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobRecommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobRecommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JobRecommendations
    **/
    _count?: true | JobRecommendationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JobRecommendationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JobRecommendationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JobRecommendationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JobRecommendationMaxAggregateInputType
  }

  export type GetJobRecommendationAggregateType<T extends JobRecommendationAggregateArgs> = {
        [P in keyof T & keyof AggregateJobRecommendation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJobRecommendation[P]>
      : GetScalarType<T[P], AggregateJobRecommendation[P]>
  }




  export type JobRecommendationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobRecommendationWhereInput
    orderBy?: JobRecommendationOrderByWithAggregationInput | JobRecommendationOrderByWithAggregationInput[]
    by: JobRecommendationScalarFieldEnum[] | JobRecommendationScalarFieldEnum
    having?: JobRecommendationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JobRecommendationCountAggregateInputType | true
    _avg?: JobRecommendationAvgAggregateInputType
    _sum?: JobRecommendationSumAggregateInputType
    _min?: JobRecommendationMinAggregateInputType
    _max?: JobRecommendationMaxAggregateInputType
  }

  export type JobRecommendationGroupByOutputType = {
    id: number
    userID: number
    jobID: number
    matchPercent: number
    createdAt: Date
    _count: JobRecommendationCountAggregateOutputType | null
    _avg: JobRecommendationAvgAggregateOutputType | null
    _sum: JobRecommendationSumAggregateOutputType | null
    _min: JobRecommendationMinAggregateOutputType | null
    _max: JobRecommendationMaxAggregateOutputType | null
  }

  type GetJobRecommendationGroupByPayload<T extends JobRecommendationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JobRecommendationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JobRecommendationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JobRecommendationGroupByOutputType[P]>
            : GetScalarType<T[P], JobRecommendationGroupByOutputType[P]>
        }
      >
    >


  export type JobRecommendationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    jobID?: boolean
    matchPercent?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jobRecommendation"]>

  export type JobRecommendationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    jobID?: boolean
    matchPercent?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jobRecommendation"]>

  export type JobRecommendationSelectScalar = {
    id?: boolean
    userID?: boolean
    jobID?: boolean
    matchPercent?: boolean
    createdAt?: boolean
  }

  export type JobRecommendationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
  }
  export type JobRecommendationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
  }

  export type $JobRecommendationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JobRecommendation"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      job: Prisma.$JobPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userID: number
      jobID: number
      matchPercent: number
      createdAt: Date
    }, ExtArgs["result"]["jobRecommendation"]>
    composites: {}
  }

  type JobRecommendationGetPayload<S extends boolean | null | undefined | JobRecommendationDefaultArgs> = $Result.GetResult<Prisma.$JobRecommendationPayload, S>

  type JobRecommendationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<JobRecommendationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: JobRecommendationCountAggregateInputType | true
    }

  export interface JobRecommendationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JobRecommendation'], meta: { name: 'JobRecommendation' } }
    /**
     * Find zero or one JobRecommendation that matches the filter.
     * @param {JobRecommendationFindUniqueArgs} args - Arguments to find a JobRecommendation
     * @example
     * // Get one JobRecommendation
     * const jobRecommendation = await prisma.jobRecommendation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JobRecommendationFindUniqueArgs>(args: SelectSubset<T, JobRecommendationFindUniqueArgs<ExtArgs>>): Prisma__JobRecommendationClient<$Result.GetResult<Prisma.$JobRecommendationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one JobRecommendation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {JobRecommendationFindUniqueOrThrowArgs} args - Arguments to find a JobRecommendation
     * @example
     * // Get one JobRecommendation
     * const jobRecommendation = await prisma.jobRecommendation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JobRecommendationFindUniqueOrThrowArgs>(args: SelectSubset<T, JobRecommendationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JobRecommendationClient<$Result.GetResult<Prisma.$JobRecommendationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first JobRecommendation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobRecommendationFindFirstArgs} args - Arguments to find a JobRecommendation
     * @example
     * // Get one JobRecommendation
     * const jobRecommendation = await prisma.jobRecommendation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JobRecommendationFindFirstArgs>(args?: SelectSubset<T, JobRecommendationFindFirstArgs<ExtArgs>>): Prisma__JobRecommendationClient<$Result.GetResult<Prisma.$JobRecommendationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first JobRecommendation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobRecommendationFindFirstOrThrowArgs} args - Arguments to find a JobRecommendation
     * @example
     * // Get one JobRecommendation
     * const jobRecommendation = await prisma.jobRecommendation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JobRecommendationFindFirstOrThrowArgs>(args?: SelectSubset<T, JobRecommendationFindFirstOrThrowArgs<ExtArgs>>): Prisma__JobRecommendationClient<$Result.GetResult<Prisma.$JobRecommendationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more JobRecommendations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobRecommendationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JobRecommendations
     * const jobRecommendations = await prisma.jobRecommendation.findMany()
     * 
     * // Get first 10 JobRecommendations
     * const jobRecommendations = await prisma.jobRecommendation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jobRecommendationWithIdOnly = await prisma.jobRecommendation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JobRecommendationFindManyArgs>(args?: SelectSubset<T, JobRecommendationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobRecommendationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a JobRecommendation.
     * @param {JobRecommendationCreateArgs} args - Arguments to create a JobRecommendation.
     * @example
     * // Create one JobRecommendation
     * const JobRecommendation = await prisma.jobRecommendation.create({
     *   data: {
     *     // ... data to create a JobRecommendation
     *   }
     * })
     * 
     */
    create<T extends JobRecommendationCreateArgs>(args: SelectSubset<T, JobRecommendationCreateArgs<ExtArgs>>): Prisma__JobRecommendationClient<$Result.GetResult<Prisma.$JobRecommendationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many JobRecommendations.
     * @param {JobRecommendationCreateManyArgs} args - Arguments to create many JobRecommendations.
     * @example
     * // Create many JobRecommendations
     * const jobRecommendation = await prisma.jobRecommendation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JobRecommendationCreateManyArgs>(args?: SelectSubset<T, JobRecommendationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JobRecommendations and returns the data saved in the database.
     * @param {JobRecommendationCreateManyAndReturnArgs} args - Arguments to create many JobRecommendations.
     * @example
     * // Create many JobRecommendations
     * const jobRecommendation = await prisma.jobRecommendation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JobRecommendations and only return the `id`
     * const jobRecommendationWithIdOnly = await prisma.jobRecommendation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JobRecommendationCreateManyAndReturnArgs>(args?: SelectSubset<T, JobRecommendationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobRecommendationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a JobRecommendation.
     * @param {JobRecommendationDeleteArgs} args - Arguments to delete one JobRecommendation.
     * @example
     * // Delete one JobRecommendation
     * const JobRecommendation = await prisma.jobRecommendation.delete({
     *   where: {
     *     // ... filter to delete one JobRecommendation
     *   }
     * })
     * 
     */
    delete<T extends JobRecommendationDeleteArgs>(args: SelectSubset<T, JobRecommendationDeleteArgs<ExtArgs>>): Prisma__JobRecommendationClient<$Result.GetResult<Prisma.$JobRecommendationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one JobRecommendation.
     * @param {JobRecommendationUpdateArgs} args - Arguments to update one JobRecommendation.
     * @example
     * // Update one JobRecommendation
     * const jobRecommendation = await prisma.jobRecommendation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JobRecommendationUpdateArgs>(args: SelectSubset<T, JobRecommendationUpdateArgs<ExtArgs>>): Prisma__JobRecommendationClient<$Result.GetResult<Prisma.$JobRecommendationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more JobRecommendations.
     * @param {JobRecommendationDeleteManyArgs} args - Arguments to filter JobRecommendations to delete.
     * @example
     * // Delete a few JobRecommendations
     * const { count } = await prisma.jobRecommendation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JobRecommendationDeleteManyArgs>(args?: SelectSubset<T, JobRecommendationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JobRecommendations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobRecommendationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JobRecommendations
     * const jobRecommendation = await prisma.jobRecommendation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JobRecommendationUpdateManyArgs>(args: SelectSubset<T, JobRecommendationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one JobRecommendation.
     * @param {JobRecommendationUpsertArgs} args - Arguments to update or create a JobRecommendation.
     * @example
     * // Update or create a JobRecommendation
     * const jobRecommendation = await prisma.jobRecommendation.upsert({
     *   create: {
     *     // ... data to create a JobRecommendation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JobRecommendation we want to update
     *   }
     * })
     */
    upsert<T extends JobRecommendationUpsertArgs>(args: SelectSubset<T, JobRecommendationUpsertArgs<ExtArgs>>): Prisma__JobRecommendationClient<$Result.GetResult<Prisma.$JobRecommendationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of JobRecommendations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobRecommendationCountArgs} args - Arguments to filter JobRecommendations to count.
     * @example
     * // Count the number of JobRecommendations
     * const count = await prisma.jobRecommendation.count({
     *   where: {
     *     // ... the filter for the JobRecommendations we want to count
     *   }
     * })
    **/
    count<T extends JobRecommendationCountArgs>(
      args?: Subset<T, JobRecommendationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JobRecommendationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JobRecommendation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobRecommendationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JobRecommendationAggregateArgs>(args: Subset<T, JobRecommendationAggregateArgs>): Prisma.PrismaPromise<GetJobRecommendationAggregateType<T>>

    /**
     * Group by JobRecommendation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobRecommendationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JobRecommendationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JobRecommendationGroupByArgs['orderBy'] }
        : { orderBy?: JobRecommendationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JobRecommendationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJobRecommendationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JobRecommendation model
   */
  readonly fields: JobRecommendationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JobRecommendation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JobRecommendationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    job<T extends JobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobDefaultArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JobRecommendation model
   */ 
  interface JobRecommendationFieldRefs {
    readonly id: FieldRef<"JobRecommendation", 'Int'>
    readonly userID: FieldRef<"JobRecommendation", 'Int'>
    readonly jobID: FieldRef<"JobRecommendation", 'Int'>
    readonly matchPercent: FieldRef<"JobRecommendation", 'Float'>
    readonly createdAt: FieldRef<"JobRecommendation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * JobRecommendation findUnique
   */
  export type JobRecommendationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobRecommendation
     */
    select?: JobRecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobRecommendationInclude<ExtArgs> | null
    /**
     * Filter, which JobRecommendation to fetch.
     */
    where: JobRecommendationWhereUniqueInput
  }

  /**
   * JobRecommendation findUniqueOrThrow
   */
  export type JobRecommendationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobRecommendation
     */
    select?: JobRecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobRecommendationInclude<ExtArgs> | null
    /**
     * Filter, which JobRecommendation to fetch.
     */
    where: JobRecommendationWhereUniqueInput
  }

  /**
   * JobRecommendation findFirst
   */
  export type JobRecommendationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobRecommendation
     */
    select?: JobRecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobRecommendationInclude<ExtArgs> | null
    /**
     * Filter, which JobRecommendation to fetch.
     */
    where?: JobRecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobRecommendations to fetch.
     */
    orderBy?: JobRecommendationOrderByWithRelationInput | JobRecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JobRecommendations.
     */
    cursor?: JobRecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobRecommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobRecommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JobRecommendations.
     */
    distinct?: JobRecommendationScalarFieldEnum | JobRecommendationScalarFieldEnum[]
  }

  /**
   * JobRecommendation findFirstOrThrow
   */
  export type JobRecommendationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobRecommendation
     */
    select?: JobRecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobRecommendationInclude<ExtArgs> | null
    /**
     * Filter, which JobRecommendation to fetch.
     */
    where?: JobRecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobRecommendations to fetch.
     */
    orderBy?: JobRecommendationOrderByWithRelationInput | JobRecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JobRecommendations.
     */
    cursor?: JobRecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobRecommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobRecommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JobRecommendations.
     */
    distinct?: JobRecommendationScalarFieldEnum | JobRecommendationScalarFieldEnum[]
  }

  /**
   * JobRecommendation findMany
   */
  export type JobRecommendationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobRecommendation
     */
    select?: JobRecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobRecommendationInclude<ExtArgs> | null
    /**
     * Filter, which JobRecommendations to fetch.
     */
    where?: JobRecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobRecommendations to fetch.
     */
    orderBy?: JobRecommendationOrderByWithRelationInput | JobRecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JobRecommendations.
     */
    cursor?: JobRecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobRecommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobRecommendations.
     */
    skip?: number
    distinct?: JobRecommendationScalarFieldEnum | JobRecommendationScalarFieldEnum[]
  }

  /**
   * JobRecommendation create
   */
  export type JobRecommendationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobRecommendation
     */
    select?: JobRecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobRecommendationInclude<ExtArgs> | null
    /**
     * The data needed to create a JobRecommendation.
     */
    data: XOR<JobRecommendationCreateInput, JobRecommendationUncheckedCreateInput>
  }

  /**
   * JobRecommendation createMany
   */
  export type JobRecommendationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JobRecommendations.
     */
    data: JobRecommendationCreateManyInput | JobRecommendationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * JobRecommendation createManyAndReturn
   */
  export type JobRecommendationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobRecommendation
     */
    select?: JobRecommendationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many JobRecommendations.
     */
    data: JobRecommendationCreateManyInput | JobRecommendationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobRecommendationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * JobRecommendation update
   */
  export type JobRecommendationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobRecommendation
     */
    select?: JobRecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobRecommendationInclude<ExtArgs> | null
    /**
     * The data needed to update a JobRecommendation.
     */
    data: XOR<JobRecommendationUpdateInput, JobRecommendationUncheckedUpdateInput>
    /**
     * Choose, which JobRecommendation to update.
     */
    where: JobRecommendationWhereUniqueInput
  }

  /**
   * JobRecommendation updateMany
   */
  export type JobRecommendationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JobRecommendations.
     */
    data: XOR<JobRecommendationUpdateManyMutationInput, JobRecommendationUncheckedUpdateManyInput>
    /**
     * Filter which JobRecommendations to update
     */
    where?: JobRecommendationWhereInput
  }

  /**
   * JobRecommendation upsert
   */
  export type JobRecommendationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobRecommendation
     */
    select?: JobRecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobRecommendationInclude<ExtArgs> | null
    /**
     * The filter to search for the JobRecommendation to update in case it exists.
     */
    where: JobRecommendationWhereUniqueInput
    /**
     * In case the JobRecommendation found by the `where` argument doesn't exist, create a new JobRecommendation with this data.
     */
    create: XOR<JobRecommendationCreateInput, JobRecommendationUncheckedCreateInput>
    /**
     * In case the JobRecommendation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JobRecommendationUpdateInput, JobRecommendationUncheckedUpdateInput>
  }

  /**
   * JobRecommendation delete
   */
  export type JobRecommendationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobRecommendation
     */
    select?: JobRecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobRecommendationInclude<ExtArgs> | null
    /**
     * Filter which JobRecommendation to delete.
     */
    where: JobRecommendationWhereUniqueInput
  }

  /**
   * JobRecommendation deleteMany
   */
  export type JobRecommendationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JobRecommendations to delete
     */
    where?: JobRecommendationWhereInput
  }

  /**
   * JobRecommendation without action
   */
  export type JobRecommendationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobRecommendation
     */
    select?: JobRecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobRecommendationInclude<ExtArgs> | null
  }


  /**
   * Model JobSkill
   */

  export type AggregateJobSkill = {
    _count: JobSkillCountAggregateOutputType | null
    _avg: JobSkillAvgAggregateOutputType | null
    _sum: JobSkillSumAggregateOutputType | null
    _min: JobSkillMinAggregateOutputType | null
    _max: JobSkillMaxAggregateOutputType | null
  }

  export type JobSkillAvgAggregateOutputType = {
    id: number | null
    jobID: number | null
    skillID: number | null
  }

  export type JobSkillSumAggregateOutputType = {
    id: number | null
    jobID: number | null
    skillID: number | null
  }

  export type JobSkillMinAggregateOutputType = {
    id: number | null
    jobID: number | null
    skillID: number | null
  }

  export type JobSkillMaxAggregateOutputType = {
    id: number | null
    jobID: number | null
    skillID: number | null
  }

  export type JobSkillCountAggregateOutputType = {
    id: number
    jobID: number
    skillID: number
    _all: number
  }


  export type JobSkillAvgAggregateInputType = {
    id?: true
    jobID?: true
    skillID?: true
  }

  export type JobSkillSumAggregateInputType = {
    id?: true
    jobID?: true
    skillID?: true
  }

  export type JobSkillMinAggregateInputType = {
    id?: true
    jobID?: true
    skillID?: true
  }

  export type JobSkillMaxAggregateInputType = {
    id?: true
    jobID?: true
    skillID?: true
  }

  export type JobSkillCountAggregateInputType = {
    id?: true
    jobID?: true
    skillID?: true
    _all?: true
  }

  export type JobSkillAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JobSkill to aggregate.
     */
    where?: JobSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobSkills to fetch.
     */
    orderBy?: JobSkillOrderByWithRelationInput | JobSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JobSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobSkills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JobSkills
    **/
    _count?: true | JobSkillCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JobSkillAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JobSkillSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JobSkillMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JobSkillMaxAggregateInputType
  }

  export type GetJobSkillAggregateType<T extends JobSkillAggregateArgs> = {
        [P in keyof T & keyof AggregateJobSkill]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJobSkill[P]>
      : GetScalarType<T[P], AggregateJobSkill[P]>
  }




  export type JobSkillGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobSkillWhereInput
    orderBy?: JobSkillOrderByWithAggregationInput | JobSkillOrderByWithAggregationInput[]
    by: JobSkillScalarFieldEnum[] | JobSkillScalarFieldEnum
    having?: JobSkillScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JobSkillCountAggregateInputType | true
    _avg?: JobSkillAvgAggregateInputType
    _sum?: JobSkillSumAggregateInputType
    _min?: JobSkillMinAggregateInputType
    _max?: JobSkillMaxAggregateInputType
  }

  export type JobSkillGroupByOutputType = {
    id: number
    jobID: number
    skillID: number
    _count: JobSkillCountAggregateOutputType | null
    _avg: JobSkillAvgAggregateOutputType | null
    _sum: JobSkillSumAggregateOutputType | null
    _min: JobSkillMinAggregateOutputType | null
    _max: JobSkillMaxAggregateOutputType | null
  }

  type GetJobSkillGroupByPayload<T extends JobSkillGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JobSkillGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JobSkillGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JobSkillGroupByOutputType[P]>
            : GetScalarType<T[P], JobSkillGroupByOutputType[P]>
        }
      >
    >


  export type JobSkillSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobID?: boolean
    skillID?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jobSkill"]>

  export type JobSkillSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobID?: boolean
    skillID?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jobSkill"]>

  export type JobSkillSelectScalar = {
    id?: boolean
    jobID?: boolean
    skillID?: boolean
  }

  export type JobSkillInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }
  export type JobSkillIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }

  export type $JobSkillPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JobSkill"
    objects: {
      job: Prisma.$JobPayload<ExtArgs>
      skill: Prisma.$SkillPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      jobID: number
      skillID: number
    }, ExtArgs["result"]["jobSkill"]>
    composites: {}
  }

  type JobSkillGetPayload<S extends boolean | null | undefined | JobSkillDefaultArgs> = $Result.GetResult<Prisma.$JobSkillPayload, S>

  type JobSkillCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<JobSkillFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: JobSkillCountAggregateInputType | true
    }

  export interface JobSkillDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JobSkill'], meta: { name: 'JobSkill' } }
    /**
     * Find zero or one JobSkill that matches the filter.
     * @param {JobSkillFindUniqueArgs} args - Arguments to find a JobSkill
     * @example
     * // Get one JobSkill
     * const jobSkill = await prisma.jobSkill.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JobSkillFindUniqueArgs>(args: SelectSubset<T, JobSkillFindUniqueArgs<ExtArgs>>): Prisma__JobSkillClient<$Result.GetResult<Prisma.$JobSkillPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one JobSkill that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {JobSkillFindUniqueOrThrowArgs} args - Arguments to find a JobSkill
     * @example
     * // Get one JobSkill
     * const jobSkill = await prisma.jobSkill.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JobSkillFindUniqueOrThrowArgs>(args: SelectSubset<T, JobSkillFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JobSkillClient<$Result.GetResult<Prisma.$JobSkillPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first JobSkill that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobSkillFindFirstArgs} args - Arguments to find a JobSkill
     * @example
     * // Get one JobSkill
     * const jobSkill = await prisma.jobSkill.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JobSkillFindFirstArgs>(args?: SelectSubset<T, JobSkillFindFirstArgs<ExtArgs>>): Prisma__JobSkillClient<$Result.GetResult<Prisma.$JobSkillPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first JobSkill that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobSkillFindFirstOrThrowArgs} args - Arguments to find a JobSkill
     * @example
     * // Get one JobSkill
     * const jobSkill = await prisma.jobSkill.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JobSkillFindFirstOrThrowArgs>(args?: SelectSubset<T, JobSkillFindFirstOrThrowArgs<ExtArgs>>): Prisma__JobSkillClient<$Result.GetResult<Prisma.$JobSkillPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more JobSkills that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobSkillFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JobSkills
     * const jobSkills = await prisma.jobSkill.findMany()
     * 
     * // Get first 10 JobSkills
     * const jobSkills = await prisma.jobSkill.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jobSkillWithIdOnly = await prisma.jobSkill.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JobSkillFindManyArgs>(args?: SelectSubset<T, JobSkillFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobSkillPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a JobSkill.
     * @param {JobSkillCreateArgs} args - Arguments to create a JobSkill.
     * @example
     * // Create one JobSkill
     * const JobSkill = await prisma.jobSkill.create({
     *   data: {
     *     // ... data to create a JobSkill
     *   }
     * })
     * 
     */
    create<T extends JobSkillCreateArgs>(args: SelectSubset<T, JobSkillCreateArgs<ExtArgs>>): Prisma__JobSkillClient<$Result.GetResult<Prisma.$JobSkillPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many JobSkills.
     * @param {JobSkillCreateManyArgs} args - Arguments to create many JobSkills.
     * @example
     * // Create many JobSkills
     * const jobSkill = await prisma.jobSkill.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JobSkillCreateManyArgs>(args?: SelectSubset<T, JobSkillCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JobSkills and returns the data saved in the database.
     * @param {JobSkillCreateManyAndReturnArgs} args - Arguments to create many JobSkills.
     * @example
     * // Create many JobSkills
     * const jobSkill = await prisma.jobSkill.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JobSkills and only return the `id`
     * const jobSkillWithIdOnly = await prisma.jobSkill.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JobSkillCreateManyAndReturnArgs>(args?: SelectSubset<T, JobSkillCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobSkillPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a JobSkill.
     * @param {JobSkillDeleteArgs} args - Arguments to delete one JobSkill.
     * @example
     * // Delete one JobSkill
     * const JobSkill = await prisma.jobSkill.delete({
     *   where: {
     *     // ... filter to delete one JobSkill
     *   }
     * })
     * 
     */
    delete<T extends JobSkillDeleteArgs>(args: SelectSubset<T, JobSkillDeleteArgs<ExtArgs>>): Prisma__JobSkillClient<$Result.GetResult<Prisma.$JobSkillPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one JobSkill.
     * @param {JobSkillUpdateArgs} args - Arguments to update one JobSkill.
     * @example
     * // Update one JobSkill
     * const jobSkill = await prisma.jobSkill.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JobSkillUpdateArgs>(args: SelectSubset<T, JobSkillUpdateArgs<ExtArgs>>): Prisma__JobSkillClient<$Result.GetResult<Prisma.$JobSkillPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more JobSkills.
     * @param {JobSkillDeleteManyArgs} args - Arguments to filter JobSkills to delete.
     * @example
     * // Delete a few JobSkills
     * const { count } = await prisma.jobSkill.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JobSkillDeleteManyArgs>(args?: SelectSubset<T, JobSkillDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JobSkills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobSkillUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JobSkills
     * const jobSkill = await prisma.jobSkill.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JobSkillUpdateManyArgs>(args: SelectSubset<T, JobSkillUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one JobSkill.
     * @param {JobSkillUpsertArgs} args - Arguments to update or create a JobSkill.
     * @example
     * // Update or create a JobSkill
     * const jobSkill = await prisma.jobSkill.upsert({
     *   create: {
     *     // ... data to create a JobSkill
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JobSkill we want to update
     *   }
     * })
     */
    upsert<T extends JobSkillUpsertArgs>(args: SelectSubset<T, JobSkillUpsertArgs<ExtArgs>>): Prisma__JobSkillClient<$Result.GetResult<Prisma.$JobSkillPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of JobSkills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobSkillCountArgs} args - Arguments to filter JobSkills to count.
     * @example
     * // Count the number of JobSkills
     * const count = await prisma.jobSkill.count({
     *   where: {
     *     // ... the filter for the JobSkills we want to count
     *   }
     * })
    **/
    count<T extends JobSkillCountArgs>(
      args?: Subset<T, JobSkillCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JobSkillCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JobSkill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobSkillAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JobSkillAggregateArgs>(args: Subset<T, JobSkillAggregateArgs>): Prisma.PrismaPromise<GetJobSkillAggregateType<T>>

    /**
     * Group by JobSkill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobSkillGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JobSkillGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JobSkillGroupByArgs['orderBy'] }
        : { orderBy?: JobSkillGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JobSkillGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJobSkillGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JobSkill model
   */
  readonly fields: JobSkillFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JobSkill.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JobSkillClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    job<T extends JobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobDefaultArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    skill<T extends SkillDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SkillDefaultArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JobSkill model
   */ 
  interface JobSkillFieldRefs {
    readonly id: FieldRef<"JobSkill", 'Int'>
    readonly jobID: FieldRef<"JobSkill", 'Int'>
    readonly skillID: FieldRef<"JobSkill", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * JobSkill findUnique
   */
  export type JobSkillFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSkill
     */
    select?: JobSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSkillInclude<ExtArgs> | null
    /**
     * Filter, which JobSkill to fetch.
     */
    where: JobSkillWhereUniqueInput
  }

  /**
   * JobSkill findUniqueOrThrow
   */
  export type JobSkillFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSkill
     */
    select?: JobSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSkillInclude<ExtArgs> | null
    /**
     * Filter, which JobSkill to fetch.
     */
    where: JobSkillWhereUniqueInput
  }

  /**
   * JobSkill findFirst
   */
  export type JobSkillFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSkill
     */
    select?: JobSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSkillInclude<ExtArgs> | null
    /**
     * Filter, which JobSkill to fetch.
     */
    where?: JobSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobSkills to fetch.
     */
    orderBy?: JobSkillOrderByWithRelationInput | JobSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JobSkills.
     */
    cursor?: JobSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobSkills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JobSkills.
     */
    distinct?: JobSkillScalarFieldEnum | JobSkillScalarFieldEnum[]
  }

  /**
   * JobSkill findFirstOrThrow
   */
  export type JobSkillFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSkill
     */
    select?: JobSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSkillInclude<ExtArgs> | null
    /**
     * Filter, which JobSkill to fetch.
     */
    where?: JobSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobSkills to fetch.
     */
    orderBy?: JobSkillOrderByWithRelationInput | JobSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JobSkills.
     */
    cursor?: JobSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobSkills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JobSkills.
     */
    distinct?: JobSkillScalarFieldEnum | JobSkillScalarFieldEnum[]
  }

  /**
   * JobSkill findMany
   */
  export type JobSkillFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSkill
     */
    select?: JobSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSkillInclude<ExtArgs> | null
    /**
     * Filter, which JobSkills to fetch.
     */
    where?: JobSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobSkills to fetch.
     */
    orderBy?: JobSkillOrderByWithRelationInput | JobSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JobSkills.
     */
    cursor?: JobSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobSkills.
     */
    skip?: number
    distinct?: JobSkillScalarFieldEnum | JobSkillScalarFieldEnum[]
  }

  /**
   * JobSkill create
   */
  export type JobSkillCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSkill
     */
    select?: JobSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSkillInclude<ExtArgs> | null
    /**
     * The data needed to create a JobSkill.
     */
    data: XOR<JobSkillCreateInput, JobSkillUncheckedCreateInput>
  }

  /**
   * JobSkill createMany
   */
  export type JobSkillCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JobSkills.
     */
    data: JobSkillCreateManyInput | JobSkillCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * JobSkill createManyAndReturn
   */
  export type JobSkillCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSkill
     */
    select?: JobSkillSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many JobSkills.
     */
    data: JobSkillCreateManyInput | JobSkillCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSkillIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * JobSkill update
   */
  export type JobSkillUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSkill
     */
    select?: JobSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSkillInclude<ExtArgs> | null
    /**
     * The data needed to update a JobSkill.
     */
    data: XOR<JobSkillUpdateInput, JobSkillUncheckedUpdateInput>
    /**
     * Choose, which JobSkill to update.
     */
    where: JobSkillWhereUniqueInput
  }

  /**
   * JobSkill updateMany
   */
  export type JobSkillUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JobSkills.
     */
    data: XOR<JobSkillUpdateManyMutationInput, JobSkillUncheckedUpdateManyInput>
    /**
     * Filter which JobSkills to update
     */
    where?: JobSkillWhereInput
  }

  /**
   * JobSkill upsert
   */
  export type JobSkillUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSkill
     */
    select?: JobSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSkillInclude<ExtArgs> | null
    /**
     * The filter to search for the JobSkill to update in case it exists.
     */
    where: JobSkillWhereUniqueInput
    /**
     * In case the JobSkill found by the `where` argument doesn't exist, create a new JobSkill with this data.
     */
    create: XOR<JobSkillCreateInput, JobSkillUncheckedCreateInput>
    /**
     * In case the JobSkill was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JobSkillUpdateInput, JobSkillUncheckedUpdateInput>
  }

  /**
   * JobSkill delete
   */
  export type JobSkillDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSkill
     */
    select?: JobSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSkillInclude<ExtArgs> | null
    /**
     * Filter which JobSkill to delete.
     */
    where: JobSkillWhereUniqueInput
  }

  /**
   * JobSkill deleteMany
   */
  export type JobSkillDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JobSkills to delete
     */
    where?: JobSkillWhereInput
  }

  /**
   * JobSkill without action
   */
  export type JobSkillDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSkill
     */
    select?: JobSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSkillInclude<ExtArgs> | null
  }


  /**
   * Model SavedJob
   */

  export type AggregateSavedJob = {
    _count: SavedJobCountAggregateOutputType | null
    _avg: SavedJobAvgAggregateOutputType | null
    _sum: SavedJobSumAggregateOutputType | null
    _min: SavedJobMinAggregateOutputType | null
    _max: SavedJobMaxAggregateOutputType | null
  }

  export type SavedJobAvgAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
  }

  export type SavedJobSumAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
  }

  export type SavedJobMinAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
    savedAt: Date | null
  }

  export type SavedJobMaxAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
    savedAt: Date | null
  }

  export type SavedJobCountAggregateOutputType = {
    id: number
    userID: number
    jobID: number
    savedAt: number
    _all: number
  }


  export type SavedJobAvgAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
  }

  export type SavedJobSumAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
  }

  export type SavedJobMinAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    savedAt?: true
  }

  export type SavedJobMaxAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    savedAt?: true
  }

  export type SavedJobCountAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    savedAt?: true
    _all?: true
  }

  export type SavedJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SavedJob to aggregate.
     */
    where?: SavedJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedJobs to fetch.
     */
    orderBy?: SavedJobOrderByWithRelationInput | SavedJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SavedJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SavedJobs
    **/
    _count?: true | SavedJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SavedJobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SavedJobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SavedJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SavedJobMaxAggregateInputType
  }

  export type GetSavedJobAggregateType<T extends SavedJobAggregateArgs> = {
        [P in keyof T & keyof AggregateSavedJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSavedJob[P]>
      : GetScalarType<T[P], AggregateSavedJob[P]>
  }




  export type SavedJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedJobWhereInput
    orderBy?: SavedJobOrderByWithAggregationInput | SavedJobOrderByWithAggregationInput[]
    by: SavedJobScalarFieldEnum[] | SavedJobScalarFieldEnum
    having?: SavedJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SavedJobCountAggregateInputType | true
    _avg?: SavedJobAvgAggregateInputType
    _sum?: SavedJobSumAggregateInputType
    _min?: SavedJobMinAggregateInputType
    _max?: SavedJobMaxAggregateInputType
  }

  export type SavedJobGroupByOutputType = {
    id: number
    userID: number
    jobID: number
    savedAt: Date
    _count: SavedJobCountAggregateOutputType | null
    _avg: SavedJobAvgAggregateOutputType | null
    _sum: SavedJobSumAggregateOutputType | null
    _min: SavedJobMinAggregateOutputType | null
    _max: SavedJobMaxAggregateOutputType | null
  }

  type GetSavedJobGroupByPayload<T extends SavedJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SavedJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SavedJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SavedJobGroupByOutputType[P]>
            : GetScalarType<T[P], SavedJobGroupByOutputType[P]>
        }
      >
    >


  export type SavedJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    jobID?: boolean
    savedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["savedJob"]>

  export type SavedJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    jobID?: boolean
    savedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["savedJob"]>

  export type SavedJobSelectScalar = {
    id?: boolean
    userID?: boolean
    jobID?: boolean
    savedAt?: boolean
  }

  export type SavedJobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
  }
  export type SavedJobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
  }

  export type $SavedJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SavedJob"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      job: Prisma.$JobPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userID: number
      jobID: number
      savedAt: Date
    }, ExtArgs["result"]["savedJob"]>
    composites: {}
  }

  type SavedJobGetPayload<S extends boolean | null | undefined | SavedJobDefaultArgs> = $Result.GetResult<Prisma.$SavedJobPayload, S>

  type SavedJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SavedJobFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SavedJobCountAggregateInputType | true
    }

  export interface SavedJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SavedJob'], meta: { name: 'SavedJob' } }
    /**
     * Find zero or one SavedJob that matches the filter.
     * @param {SavedJobFindUniqueArgs} args - Arguments to find a SavedJob
     * @example
     * // Get one SavedJob
     * const savedJob = await prisma.savedJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SavedJobFindUniqueArgs>(args: SelectSubset<T, SavedJobFindUniqueArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SavedJob that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SavedJobFindUniqueOrThrowArgs} args - Arguments to find a SavedJob
     * @example
     * // Get one SavedJob
     * const savedJob = await prisma.savedJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SavedJobFindUniqueOrThrowArgs>(args: SelectSubset<T, SavedJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SavedJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedJobFindFirstArgs} args - Arguments to find a SavedJob
     * @example
     * // Get one SavedJob
     * const savedJob = await prisma.savedJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SavedJobFindFirstArgs>(args?: SelectSubset<T, SavedJobFindFirstArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SavedJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedJobFindFirstOrThrowArgs} args - Arguments to find a SavedJob
     * @example
     * // Get one SavedJob
     * const savedJob = await prisma.savedJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SavedJobFindFirstOrThrowArgs>(args?: SelectSubset<T, SavedJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SavedJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SavedJobs
     * const savedJobs = await prisma.savedJob.findMany()
     * 
     * // Get first 10 SavedJobs
     * const savedJobs = await prisma.savedJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const savedJobWithIdOnly = await prisma.savedJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SavedJobFindManyArgs>(args?: SelectSubset<T, SavedJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SavedJob.
     * @param {SavedJobCreateArgs} args - Arguments to create a SavedJob.
     * @example
     * // Create one SavedJob
     * const SavedJob = await prisma.savedJob.create({
     *   data: {
     *     // ... data to create a SavedJob
     *   }
     * })
     * 
     */
    create<T extends SavedJobCreateArgs>(args: SelectSubset<T, SavedJobCreateArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SavedJobs.
     * @param {SavedJobCreateManyArgs} args - Arguments to create many SavedJobs.
     * @example
     * // Create many SavedJobs
     * const savedJob = await prisma.savedJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SavedJobCreateManyArgs>(args?: SelectSubset<T, SavedJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SavedJobs and returns the data saved in the database.
     * @param {SavedJobCreateManyAndReturnArgs} args - Arguments to create many SavedJobs.
     * @example
     * // Create many SavedJobs
     * const savedJob = await prisma.savedJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SavedJobs and only return the `id`
     * const savedJobWithIdOnly = await prisma.savedJob.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SavedJobCreateManyAndReturnArgs>(args?: SelectSubset<T, SavedJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SavedJob.
     * @param {SavedJobDeleteArgs} args - Arguments to delete one SavedJob.
     * @example
     * // Delete one SavedJob
     * const SavedJob = await prisma.savedJob.delete({
     *   where: {
     *     // ... filter to delete one SavedJob
     *   }
     * })
     * 
     */
    delete<T extends SavedJobDeleteArgs>(args: SelectSubset<T, SavedJobDeleteArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SavedJob.
     * @param {SavedJobUpdateArgs} args - Arguments to update one SavedJob.
     * @example
     * // Update one SavedJob
     * const savedJob = await prisma.savedJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SavedJobUpdateArgs>(args: SelectSubset<T, SavedJobUpdateArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SavedJobs.
     * @param {SavedJobDeleteManyArgs} args - Arguments to filter SavedJobs to delete.
     * @example
     * // Delete a few SavedJobs
     * const { count } = await prisma.savedJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SavedJobDeleteManyArgs>(args?: SelectSubset<T, SavedJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SavedJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SavedJobs
     * const savedJob = await prisma.savedJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SavedJobUpdateManyArgs>(args: SelectSubset<T, SavedJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SavedJob.
     * @param {SavedJobUpsertArgs} args - Arguments to update or create a SavedJob.
     * @example
     * // Update or create a SavedJob
     * const savedJob = await prisma.savedJob.upsert({
     *   create: {
     *     // ... data to create a SavedJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SavedJob we want to update
     *   }
     * })
     */
    upsert<T extends SavedJobUpsertArgs>(args: SelectSubset<T, SavedJobUpsertArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SavedJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedJobCountArgs} args - Arguments to filter SavedJobs to count.
     * @example
     * // Count the number of SavedJobs
     * const count = await prisma.savedJob.count({
     *   where: {
     *     // ... the filter for the SavedJobs we want to count
     *   }
     * })
    **/
    count<T extends SavedJobCountArgs>(
      args?: Subset<T, SavedJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SavedJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SavedJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SavedJobAggregateArgs>(args: Subset<T, SavedJobAggregateArgs>): Prisma.PrismaPromise<GetSavedJobAggregateType<T>>

    /**
     * Group by SavedJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SavedJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SavedJobGroupByArgs['orderBy'] }
        : { orderBy?: SavedJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SavedJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSavedJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SavedJob model
   */
  readonly fields: SavedJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SavedJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SavedJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    job<T extends JobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobDefaultArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SavedJob model
   */ 
  interface SavedJobFieldRefs {
    readonly id: FieldRef<"SavedJob", 'Int'>
    readonly userID: FieldRef<"SavedJob", 'Int'>
    readonly jobID: FieldRef<"SavedJob", 'Int'>
    readonly savedAt: FieldRef<"SavedJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SavedJob findUnique
   */
  export type SavedJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * Filter, which SavedJob to fetch.
     */
    where: SavedJobWhereUniqueInput
  }

  /**
   * SavedJob findUniqueOrThrow
   */
  export type SavedJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * Filter, which SavedJob to fetch.
     */
    where: SavedJobWhereUniqueInput
  }

  /**
   * SavedJob findFirst
   */
  export type SavedJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * Filter, which SavedJob to fetch.
     */
    where?: SavedJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedJobs to fetch.
     */
    orderBy?: SavedJobOrderByWithRelationInput | SavedJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SavedJobs.
     */
    cursor?: SavedJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SavedJobs.
     */
    distinct?: SavedJobScalarFieldEnum | SavedJobScalarFieldEnum[]
  }

  /**
   * SavedJob findFirstOrThrow
   */
  export type SavedJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * Filter, which SavedJob to fetch.
     */
    where?: SavedJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedJobs to fetch.
     */
    orderBy?: SavedJobOrderByWithRelationInput | SavedJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SavedJobs.
     */
    cursor?: SavedJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SavedJobs.
     */
    distinct?: SavedJobScalarFieldEnum | SavedJobScalarFieldEnum[]
  }

  /**
   * SavedJob findMany
   */
  export type SavedJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * Filter, which SavedJobs to fetch.
     */
    where?: SavedJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedJobs to fetch.
     */
    orderBy?: SavedJobOrderByWithRelationInput | SavedJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SavedJobs.
     */
    cursor?: SavedJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedJobs.
     */
    skip?: number
    distinct?: SavedJobScalarFieldEnum | SavedJobScalarFieldEnum[]
  }

  /**
   * SavedJob create
   */
  export type SavedJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * The data needed to create a SavedJob.
     */
    data: XOR<SavedJobCreateInput, SavedJobUncheckedCreateInput>
  }

  /**
   * SavedJob createMany
   */
  export type SavedJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SavedJobs.
     */
    data: SavedJobCreateManyInput | SavedJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SavedJob createManyAndReturn
   */
  export type SavedJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SavedJobs.
     */
    data: SavedJobCreateManyInput | SavedJobCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SavedJob update
   */
  export type SavedJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * The data needed to update a SavedJob.
     */
    data: XOR<SavedJobUpdateInput, SavedJobUncheckedUpdateInput>
    /**
     * Choose, which SavedJob to update.
     */
    where: SavedJobWhereUniqueInput
  }

  /**
   * SavedJob updateMany
   */
  export type SavedJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SavedJobs.
     */
    data: XOR<SavedJobUpdateManyMutationInput, SavedJobUncheckedUpdateManyInput>
    /**
     * Filter which SavedJobs to update
     */
    where?: SavedJobWhereInput
  }

  /**
   * SavedJob upsert
   */
  export type SavedJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * The filter to search for the SavedJob to update in case it exists.
     */
    where: SavedJobWhereUniqueInput
    /**
     * In case the SavedJob found by the `where` argument doesn't exist, create a new SavedJob with this data.
     */
    create: XOR<SavedJobCreateInput, SavedJobUncheckedCreateInput>
    /**
     * In case the SavedJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SavedJobUpdateInput, SavedJobUncheckedUpdateInput>
  }

  /**
   * SavedJob delete
   */
  export type SavedJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * Filter which SavedJob to delete.
     */
    where: SavedJobWhereUniqueInput
  }

  /**
   * SavedJob deleteMany
   */
  export type SavedJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SavedJobs to delete
     */
    where?: SavedJobWhereInput
  }

  /**
   * SavedJob without action
   */
  export type SavedJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
  }


  /**
   * Model Industry
   */

  export type AggregateIndustry = {
    _count: IndustryCountAggregateOutputType | null
    _avg: IndustryAvgAggregateOutputType | null
    _sum: IndustrySumAggregateOutputType | null
    _min: IndustryMinAggregateOutputType | null
    _max: IndustryMaxAggregateOutputType | null
  }

  export type IndustryAvgAggregateOutputType = {
    id: number | null
  }

  export type IndustrySumAggregateOutputType = {
    id: number | null
  }

  export type IndustryMinAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type IndustryMaxAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type IndustryCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type IndustryAvgAggregateInputType = {
    id?: true
  }

  export type IndustrySumAggregateInputType = {
    id?: true
  }

  export type IndustryMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type IndustryMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type IndustryCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type IndustryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Industry to aggregate.
     */
    where?: IndustryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Industries to fetch.
     */
    orderBy?: IndustryOrderByWithRelationInput | IndustryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IndustryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Industries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Industries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Industries
    **/
    _count?: true | IndustryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IndustryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IndustrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IndustryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IndustryMaxAggregateInputType
  }

  export type GetIndustryAggregateType<T extends IndustryAggregateArgs> = {
        [P in keyof T & keyof AggregateIndustry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIndustry[P]>
      : GetScalarType<T[P], AggregateIndustry[P]>
  }




  export type IndustryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IndustryWhereInput
    orderBy?: IndustryOrderByWithAggregationInput | IndustryOrderByWithAggregationInput[]
    by: IndustryScalarFieldEnum[] | IndustryScalarFieldEnum
    having?: IndustryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IndustryCountAggregateInputType | true
    _avg?: IndustryAvgAggregateInputType
    _sum?: IndustrySumAggregateInputType
    _min?: IndustryMinAggregateInputType
    _max?: IndustryMaxAggregateInputType
  }

  export type IndustryGroupByOutputType = {
    id: number
    name: string
    _count: IndustryCountAggregateOutputType | null
    _avg: IndustryAvgAggregateOutputType | null
    _sum: IndustrySumAggregateOutputType | null
    _min: IndustryMinAggregateOutputType | null
    _max: IndustryMaxAggregateOutputType | null
  }

  type GetIndustryGroupByPayload<T extends IndustryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IndustryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IndustryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IndustryGroupByOutputType[P]>
            : GetScalarType<T[P], IndustryGroupByOutputType[P]>
        }
      >
    >


  export type IndustrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    skills?: boolean | Industry$skillsArgs<ExtArgs>
    jobs?: boolean | Industry$jobsArgs<ExtArgs>
    userProfiles?: boolean | Industry$userProfilesArgs<ExtArgs>
    _count?: boolean | IndustryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["industry"]>

  export type IndustrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["industry"]>

  export type IndustrySelectScalar = {
    id?: boolean
    name?: boolean
  }

  export type IndustryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skills?: boolean | Industry$skillsArgs<ExtArgs>
    jobs?: boolean | Industry$jobsArgs<ExtArgs>
    userProfiles?: boolean | Industry$userProfilesArgs<ExtArgs>
    _count?: boolean | IndustryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type IndustryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $IndustryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Industry"
    objects: {
      skills: Prisma.$SkillPayload<ExtArgs>[]
      jobs: Prisma.$JobPayload<ExtArgs>[]
      userProfiles: Prisma.$UserProfilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
    }, ExtArgs["result"]["industry"]>
    composites: {}
  }

  type IndustryGetPayload<S extends boolean | null | undefined | IndustryDefaultArgs> = $Result.GetResult<Prisma.$IndustryPayload, S>

  type IndustryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<IndustryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: IndustryCountAggregateInputType | true
    }

  export interface IndustryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Industry'], meta: { name: 'Industry' } }
    /**
     * Find zero or one Industry that matches the filter.
     * @param {IndustryFindUniqueArgs} args - Arguments to find a Industry
     * @example
     * // Get one Industry
     * const industry = await prisma.industry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IndustryFindUniqueArgs>(args: SelectSubset<T, IndustryFindUniqueArgs<ExtArgs>>): Prisma__IndustryClient<$Result.GetResult<Prisma.$IndustryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Industry that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {IndustryFindUniqueOrThrowArgs} args - Arguments to find a Industry
     * @example
     * // Get one Industry
     * const industry = await prisma.industry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IndustryFindUniqueOrThrowArgs>(args: SelectSubset<T, IndustryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IndustryClient<$Result.GetResult<Prisma.$IndustryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Industry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndustryFindFirstArgs} args - Arguments to find a Industry
     * @example
     * // Get one Industry
     * const industry = await prisma.industry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IndustryFindFirstArgs>(args?: SelectSubset<T, IndustryFindFirstArgs<ExtArgs>>): Prisma__IndustryClient<$Result.GetResult<Prisma.$IndustryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Industry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndustryFindFirstOrThrowArgs} args - Arguments to find a Industry
     * @example
     * // Get one Industry
     * const industry = await prisma.industry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IndustryFindFirstOrThrowArgs>(args?: SelectSubset<T, IndustryFindFirstOrThrowArgs<ExtArgs>>): Prisma__IndustryClient<$Result.GetResult<Prisma.$IndustryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Industries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndustryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Industries
     * const industries = await prisma.industry.findMany()
     * 
     * // Get first 10 Industries
     * const industries = await prisma.industry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const industryWithIdOnly = await prisma.industry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IndustryFindManyArgs>(args?: SelectSubset<T, IndustryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IndustryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Industry.
     * @param {IndustryCreateArgs} args - Arguments to create a Industry.
     * @example
     * // Create one Industry
     * const Industry = await prisma.industry.create({
     *   data: {
     *     // ... data to create a Industry
     *   }
     * })
     * 
     */
    create<T extends IndustryCreateArgs>(args: SelectSubset<T, IndustryCreateArgs<ExtArgs>>): Prisma__IndustryClient<$Result.GetResult<Prisma.$IndustryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Industries.
     * @param {IndustryCreateManyArgs} args - Arguments to create many Industries.
     * @example
     * // Create many Industries
     * const industry = await prisma.industry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IndustryCreateManyArgs>(args?: SelectSubset<T, IndustryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Industries and returns the data saved in the database.
     * @param {IndustryCreateManyAndReturnArgs} args - Arguments to create many Industries.
     * @example
     * // Create many Industries
     * const industry = await prisma.industry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Industries and only return the `id`
     * const industryWithIdOnly = await prisma.industry.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IndustryCreateManyAndReturnArgs>(args?: SelectSubset<T, IndustryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IndustryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Industry.
     * @param {IndustryDeleteArgs} args - Arguments to delete one Industry.
     * @example
     * // Delete one Industry
     * const Industry = await prisma.industry.delete({
     *   where: {
     *     // ... filter to delete one Industry
     *   }
     * })
     * 
     */
    delete<T extends IndustryDeleteArgs>(args: SelectSubset<T, IndustryDeleteArgs<ExtArgs>>): Prisma__IndustryClient<$Result.GetResult<Prisma.$IndustryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Industry.
     * @param {IndustryUpdateArgs} args - Arguments to update one Industry.
     * @example
     * // Update one Industry
     * const industry = await prisma.industry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IndustryUpdateArgs>(args: SelectSubset<T, IndustryUpdateArgs<ExtArgs>>): Prisma__IndustryClient<$Result.GetResult<Prisma.$IndustryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Industries.
     * @param {IndustryDeleteManyArgs} args - Arguments to filter Industries to delete.
     * @example
     * // Delete a few Industries
     * const { count } = await prisma.industry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IndustryDeleteManyArgs>(args?: SelectSubset<T, IndustryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Industries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndustryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Industries
     * const industry = await prisma.industry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IndustryUpdateManyArgs>(args: SelectSubset<T, IndustryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Industry.
     * @param {IndustryUpsertArgs} args - Arguments to update or create a Industry.
     * @example
     * // Update or create a Industry
     * const industry = await prisma.industry.upsert({
     *   create: {
     *     // ... data to create a Industry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Industry we want to update
     *   }
     * })
     */
    upsert<T extends IndustryUpsertArgs>(args: SelectSubset<T, IndustryUpsertArgs<ExtArgs>>): Prisma__IndustryClient<$Result.GetResult<Prisma.$IndustryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Industries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndustryCountArgs} args - Arguments to filter Industries to count.
     * @example
     * // Count the number of Industries
     * const count = await prisma.industry.count({
     *   where: {
     *     // ... the filter for the Industries we want to count
     *   }
     * })
    **/
    count<T extends IndustryCountArgs>(
      args?: Subset<T, IndustryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IndustryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Industry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndustryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IndustryAggregateArgs>(args: Subset<T, IndustryAggregateArgs>): Prisma.PrismaPromise<GetIndustryAggregateType<T>>

    /**
     * Group by Industry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndustryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IndustryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IndustryGroupByArgs['orderBy'] }
        : { orderBy?: IndustryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IndustryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIndustryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Industry model
   */
  readonly fields: IndustryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Industry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IndustryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    skills<T extends Industry$skillsArgs<ExtArgs> = {}>(args?: Subset<T, Industry$skillsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findMany"> | Null>
    jobs<T extends Industry$jobsArgs<ExtArgs> = {}>(args?: Subset<T, Industry$jobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findMany"> | Null>
    userProfiles<T extends Industry$userProfilesArgs<ExtArgs> = {}>(args?: Subset<T, Industry$userProfilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Industry model
   */ 
  interface IndustryFieldRefs {
    readonly id: FieldRef<"Industry", 'Int'>
    readonly name: FieldRef<"Industry", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Industry findUnique
   */
  export type IndustryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Industry
     */
    select?: IndustrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndustryInclude<ExtArgs> | null
    /**
     * Filter, which Industry to fetch.
     */
    where: IndustryWhereUniqueInput
  }

  /**
   * Industry findUniqueOrThrow
   */
  export type IndustryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Industry
     */
    select?: IndustrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndustryInclude<ExtArgs> | null
    /**
     * Filter, which Industry to fetch.
     */
    where: IndustryWhereUniqueInput
  }

  /**
   * Industry findFirst
   */
  export type IndustryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Industry
     */
    select?: IndustrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndustryInclude<ExtArgs> | null
    /**
     * Filter, which Industry to fetch.
     */
    where?: IndustryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Industries to fetch.
     */
    orderBy?: IndustryOrderByWithRelationInput | IndustryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Industries.
     */
    cursor?: IndustryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Industries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Industries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Industries.
     */
    distinct?: IndustryScalarFieldEnum | IndustryScalarFieldEnum[]
  }

  /**
   * Industry findFirstOrThrow
   */
  export type IndustryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Industry
     */
    select?: IndustrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndustryInclude<ExtArgs> | null
    /**
     * Filter, which Industry to fetch.
     */
    where?: IndustryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Industries to fetch.
     */
    orderBy?: IndustryOrderByWithRelationInput | IndustryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Industries.
     */
    cursor?: IndustryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Industries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Industries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Industries.
     */
    distinct?: IndustryScalarFieldEnum | IndustryScalarFieldEnum[]
  }

  /**
   * Industry findMany
   */
  export type IndustryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Industry
     */
    select?: IndustrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndustryInclude<ExtArgs> | null
    /**
     * Filter, which Industries to fetch.
     */
    where?: IndustryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Industries to fetch.
     */
    orderBy?: IndustryOrderByWithRelationInput | IndustryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Industries.
     */
    cursor?: IndustryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Industries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Industries.
     */
    skip?: number
    distinct?: IndustryScalarFieldEnum | IndustryScalarFieldEnum[]
  }

  /**
   * Industry create
   */
  export type IndustryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Industry
     */
    select?: IndustrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndustryInclude<ExtArgs> | null
    /**
     * The data needed to create a Industry.
     */
    data: XOR<IndustryCreateInput, IndustryUncheckedCreateInput>
  }

  /**
   * Industry createMany
   */
  export type IndustryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Industries.
     */
    data: IndustryCreateManyInput | IndustryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Industry createManyAndReturn
   */
  export type IndustryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Industry
     */
    select?: IndustrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Industries.
     */
    data: IndustryCreateManyInput | IndustryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Industry update
   */
  export type IndustryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Industry
     */
    select?: IndustrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndustryInclude<ExtArgs> | null
    /**
     * The data needed to update a Industry.
     */
    data: XOR<IndustryUpdateInput, IndustryUncheckedUpdateInput>
    /**
     * Choose, which Industry to update.
     */
    where: IndustryWhereUniqueInput
  }

  /**
   * Industry updateMany
   */
  export type IndustryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Industries.
     */
    data: XOR<IndustryUpdateManyMutationInput, IndustryUncheckedUpdateManyInput>
    /**
     * Filter which Industries to update
     */
    where?: IndustryWhereInput
  }

  /**
   * Industry upsert
   */
  export type IndustryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Industry
     */
    select?: IndustrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndustryInclude<ExtArgs> | null
    /**
     * The filter to search for the Industry to update in case it exists.
     */
    where: IndustryWhereUniqueInput
    /**
     * In case the Industry found by the `where` argument doesn't exist, create a new Industry with this data.
     */
    create: XOR<IndustryCreateInput, IndustryUncheckedCreateInput>
    /**
     * In case the Industry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IndustryUpdateInput, IndustryUncheckedUpdateInput>
  }

  /**
   * Industry delete
   */
  export type IndustryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Industry
     */
    select?: IndustrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndustryInclude<ExtArgs> | null
    /**
     * Filter which Industry to delete.
     */
    where: IndustryWhereUniqueInput
  }

  /**
   * Industry deleteMany
   */
  export type IndustryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Industries to delete
     */
    where?: IndustryWhereInput
  }

  /**
   * Industry.skills
   */
  export type Industry$skillsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    where?: SkillWhereInput
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    cursor?: SkillWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Industry.jobs
   */
  export type Industry$jobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    where?: JobWhereInput
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    cursor?: JobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Industry.userProfiles
   */
  export type Industry$userProfilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    where?: UserProfileWhereInput
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    cursor?: UserProfileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * Industry without action
   */
  export type IndustryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Industry
     */
    select?: IndustrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IndustryInclude<ExtArgs> | null
  }


  /**
   * Model Skill
   */

  export type AggregateSkill = {
    _count: SkillCountAggregateOutputType | null
    _avg: SkillAvgAggregateOutputType | null
    _sum: SkillSumAggregateOutputType | null
    _min: SkillMinAggregateOutputType | null
    _max: SkillMaxAggregateOutputType | null
  }

  export type SkillAvgAggregateOutputType = {
    skillID: number | null
    industryID: number | null
  }

  export type SkillSumAggregateOutputType = {
    skillID: number | null
    industryID: number | null
  }

  export type SkillMinAggregateOutputType = {
    skillID: number | null
    industryID: number | null
    name: string | null
  }

  export type SkillMaxAggregateOutputType = {
    skillID: number | null
    industryID: number | null
    name: string | null
  }

  export type SkillCountAggregateOutputType = {
    skillID: number
    industryID: number
    name: number
    _all: number
  }


  export type SkillAvgAggregateInputType = {
    skillID?: true
    industryID?: true
  }

  export type SkillSumAggregateInputType = {
    skillID?: true
    industryID?: true
  }

  export type SkillMinAggregateInputType = {
    skillID?: true
    industryID?: true
    name?: true
  }

  export type SkillMaxAggregateInputType = {
    skillID?: true
    industryID?: true
    name?: true
  }

  export type SkillCountAggregateInputType = {
    skillID?: true
    industryID?: true
    name?: true
    _all?: true
  }

  export type SkillAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Skill to aggregate.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Skills
    **/
    _count?: true | SkillCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SkillAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SkillSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SkillMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SkillMaxAggregateInputType
  }

  export type GetSkillAggregateType<T extends SkillAggregateArgs> = {
        [P in keyof T & keyof AggregateSkill]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSkill[P]>
      : GetScalarType<T[P], AggregateSkill[P]>
  }




  export type SkillGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillWhereInput
    orderBy?: SkillOrderByWithAggregationInput | SkillOrderByWithAggregationInput[]
    by: SkillScalarFieldEnum[] | SkillScalarFieldEnum
    having?: SkillScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SkillCountAggregateInputType | true
    _avg?: SkillAvgAggregateInputType
    _sum?: SkillSumAggregateInputType
    _min?: SkillMinAggregateInputType
    _max?: SkillMaxAggregateInputType
  }

  export type SkillGroupByOutputType = {
    skillID: number
    industryID: number
    name: string
    _count: SkillCountAggregateOutputType | null
    _avg: SkillAvgAggregateOutputType | null
    _sum: SkillSumAggregateOutputType | null
    _min: SkillMinAggregateOutputType | null
    _max: SkillMaxAggregateOutputType | null
  }

  type GetSkillGroupByPayload<T extends SkillGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SkillGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SkillGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SkillGroupByOutputType[P]>
            : GetScalarType<T[P], SkillGroupByOutputType[P]>
        }
      >
    >


  export type SkillSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    skillID?: boolean
    industryID?: boolean
    name?: boolean
    industry?: boolean | IndustryDefaultArgs<ExtArgs>
    users?: boolean | Skill$usersArgs<ExtArgs>
    jobs?: boolean | Skill$jobsArgs<ExtArgs>
    _count?: boolean | SkillCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skill"]>

  export type SkillSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    skillID?: boolean
    industryID?: boolean
    name?: boolean
    industry?: boolean | IndustryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skill"]>

  export type SkillSelectScalar = {
    skillID?: boolean
    industryID?: boolean
    name?: boolean
  }

  export type SkillInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    industry?: boolean | IndustryDefaultArgs<ExtArgs>
    users?: boolean | Skill$usersArgs<ExtArgs>
    jobs?: boolean | Skill$jobsArgs<ExtArgs>
    _count?: boolean | SkillCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SkillIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    industry?: boolean | IndustryDefaultArgs<ExtArgs>
  }

  export type $SkillPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Skill"
    objects: {
      industry: Prisma.$IndustryPayload<ExtArgs>
      users: Prisma.$UserSkillPayload<ExtArgs>[]
      jobs: Prisma.$JobSkillPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      skillID: number
      industryID: number
      name: string
    }, ExtArgs["result"]["skill"]>
    composites: {}
  }

  type SkillGetPayload<S extends boolean | null | undefined | SkillDefaultArgs> = $Result.GetResult<Prisma.$SkillPayload, S>

  type SkillCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SkillFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SkillCountAggregateInputType | true
    }

  export interface SkillDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Skill'], meta: { name: 'Skill' } }
    /**
     * Find zero or one Skill that matches the filter.
     * @param {SkillFindUniqueArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SkillFindUniqueArgs>(args: SelectSubset<T, SkillFindUniqueArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Skill that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SkillFindUniqueOrThrowArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SkillFindUniqueOrThrowArgs>(args: SelectSubset<T, SkillFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Skill that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindFirstArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SkillFindFirstArgs>(args?: SelectSubset<T, SkillFindFirstArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Skill that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindFirstOrThrowArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SkillFindFirstOrThrowArgs>(args?: SelectSubset<T, SkillFindFirstOrThrowArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Skills that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Skills
     * const skills = await prisma.skill.findMany()
     * 
     * // Get first 10 Skills
     * const skills = await prisma.skill.findMany({ take: 10 })
     * 
     * // Only select the `skillID`
     * const skillWithSkillIDOnly = await prisma.skill.findMany({ select: { skillID: true } })
     * 
     */
    findMany<T extends SkillFindManyArgs>(args?: SelectSubset<T, SkillFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Skill.
     * @param {SkillCreateArgs} args - Arguments to create a Skill.
     * @example
     * // Create one Skill
     * const Skill = await prisma.skill.create({
     *   data: {
     *     // ... data to create a Skill
     *   }
     * })
     * 
     */
    create<T extends SkillCreateArgs>(args: SelectSubset<T, SkillCreateArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Skills.
     * @param {SkillCreateManyArgs} args - Arguments to create many Skills.
     * @example
     * // Create many Skills
     * const skill = await prisma.skill.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SkillCreateManyArgs>(args?: SelectSubset<T, SkillCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Skills and returns the data saved in the database.
     * @param {SkillCreateManyAndReturnArgs} args - Arguments to create many Skills.
     * @example
     * // Create many Skills
     * const skill = await prisma.skill.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Skills and only return the `skillID`
     * const skillWithSkillIDOnly = await prisma.skill.createManyAndReturn({ 
     *   select: { skillID: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SkillCreateManyAndReturnArgs>(args?: SelectSubset<T, SkillCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Skill.
     * @param {SkillDeleteArgs} args - Arguments to delete one Skill.
     * @example
     * // Delete one Skill
     * const Skill = await prisma.skill.delete({
     *   where: {
     *     // ... filter to delete one Skill
     *   }
     * })
     * 
     */
    delete<T extends SkillDeleteArgs>(args: SelectSubset<T, SkillDeleteArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Skill.
     * @param {SkillUpdateArgs} args - Arguments to update one Skill.
     * @example
     * // Update one Skill
     * const skill = await prisma.skill.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SkillUpdateArgs>(args: SelectSubset<T, SkillUpdateArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Skills.
     * @param {SkillDeleteManyArgs} args - Arguments to filter Skills to delete.
     * @example
     * // Delete a few Skills
     * const { count } = await prisma.skill.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SkillDeleteManyArgs>(args?: SelectSubset<T, SkillDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Skills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Skills
     * const skill = await prisma.skill.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SkillUpdateManyArgs>(args: SelectSubset<T, SkillUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Skill.
     * @param {SkillUpsertArgs} args - Arguments to update or create a Skill.
     * @example
     * // Update or create a Skill
     * const skill = await prisma.skill.upsert({
     *   create: {
     *     // ... data to create a Skill
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Skill we want to update
     *   }
     * })
     */
    upsert<T extends SkillUpsertArgs>(args: SelectSubset<T, SkillUpsertArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Skills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillCountArgs} args - Arguments to filter Skills to count.
     * @example
     * // Count the number of Skills
     * const count = await prisma.skill.count({
     *   where: {
     *     // ... the filter for the Skills we want to count
     *   }
     * })
    **/
    count<T extends SkillCountArgs>(
      args?: Subset<T, SkillCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SkillCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Skill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SkillAggregateArgs>(args: Subset<T, SkillAggregateArgs>): Prisma.PrismaPromise<GetSkillAggregateType<T>>

    /**
     * Group by Skill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SkillGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SkillGroupByArgs['orderBy'] }
        : { orderBy?: SkillGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SkillGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSkillGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Skill model
   */
  readonly fields: SkillFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Skill.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SkillClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    industry<T extends IndustryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, IndustryDefaultArgs<ExtArgs>>): Prisma__IndustryClient<$Result.GetResult<Prisma.$IndustryPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    users<T extends Skill$usersArgs<ExtArgs> = {}>(args?: Subset<T, Skill$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSkillPayload<ExtArgs>, T, "findMany"> | Null>
    jobs<T extends Skill$jobsArgs<ExtArgs> = {}>(args?: Subset<T, Skill$jobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobSkillPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Skill model
   */ 
  interface SkillFieldRefs {
    readonly skillID: FieldRef<"Skill", 'Int'>
    readonly industryID: FieldRef<"Skill", 'Int'>
    readonly name: FieldRef<"Skill", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Skill findUnique
   */
  export type SkillFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill findUniqueOrThrow
   */
  export type SkillFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill findFirst
   */
  export type SkillFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Skills.
     */
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill findFirstOrThrow
   */
  export type SkillFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Skills.
     */
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill findMany
   */
  export type SkillFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skills to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill create
   */
  export type SkillCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The data needed to create a Skill.
     */
    data: XOR<SkillCreateInput, SkillUncheckedCreateInput>
  }

  /**
   * Skill createMany
   */
  export type SkillCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Skills.
     */
    data: SkillCreateManyInput | SkillCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Skill createManyAndReturn
   */
  export type SkillCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Skills.
     */
    data: SkillCreateManyInput | SkillCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Skill update
   */
  export type SkillUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The data needed to update a Skill.
     */
    data: XOR<SkillUpdateInput, SkillUncheckedUpdateInput>
    /**
     * Choose, which Skill to update.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill updateMany
   */
  export type SkillUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Skills.
     */
    data: XOR<SkillUpdateManyMutationInput, SkillUncheckedUpdateManyInput>
    /**
     * Filter which Skills to update
     */
    where?: SkillWhereInput
  }

  /**
   * Skill upsert
   */
  export type SkillUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The filter to search for the Skill to update in case it exists.
     */
    where: SkillWhereUniqueInput
    /**
     * In case the Skill found by the `where` argument doesn't exist, create a new Skill with this data.
     */
    create: XOR<SkillCreateInput, SkillUncheckedCreateInput>
    /**
     * In case the Skill was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SkillUpdateInput, SkillUncheckedUpdateInput>
  }

  /**
   * Skill delete
   */
  export type SkillDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter which Skill to delete.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill deleteMany
   */
  export type SkillDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Skills to delete
     */
    where?: SkillWhereInput
  }

  /**
   * Skill.users
   */
  export type Skill$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkill
     */
    select?: UserSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSkillInclude<ExtArgs> | null
    where?: UserSkillWhereInput
    orderBy?: UserSkillOrderByWithRelationInput | UserSkillOrderByWithRelationInput[]
    cursor?: UserSkillWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserSkillScalarFieldEnum | UserSkillScalarFieldEnum[]
  }

  /**
   * Skill.jobs
   */
  export type Skill$jobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSkill
     */
    select?: JobSkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSkillInclude<ExtArgs> | null
    where?: JobSkillWhereInput
    orderBy?: JobSkillOrderByWithRelationInput | JobSkillOrderByWithRelationInput[]
    cursor?: JobSkillWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobSkillScalarFieldEnum | JobSkillScalarFieldEnum[]
  }

  /**
   * Skill without action
   */
  export type SkillDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
  }


  /**
   * Model UserBehavior
   */

  export type AggregateUserBehavior = {
    _count: UserBehaviorCountAggregateOutputType | null
    _avg: UserBehaviorAvgAggregateOutputType | null
    _sum: UserBehaviorSumAggregateOutputType | null
    _min: UserBehaviorMinAggregateOutputType | null
    _max: UserBehaviorMaxAggregateOutputType | null
  }

  export type UserBehaviorAvgAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
  }

  export type UserBehaviorSumAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
  }

  export type UserBehaviorMinAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
    action: string | null
    createdAt: Date | null
  }

  export type UserBehaviorMaxAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
    action: string | null
    createdAt: Date | null
  }

  export type UserBehaviorCountAggregateOutputType = {
    id: number
    userID: number
    jobID: number
    action: number
    createdAt: number
    _all: number
  }


  export type UserBehaviorAvgAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
  }

  export type UserBehaviorSumAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
  }

  export type UserBehaviorMinAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    action?: true
    createdAt?: true
  }

  export type UserBehaviorMaxAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    action?: true
    createdAt?: true
  }

  export type UserBehaviorCountAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    action?: true
    createdAt?: true
    _all?: true
  }

  export type UserBehaviorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserBehavior to aggregate.
     */
    where?: UserBehaviorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBehaviors to fetch.
     */
    orderBy?: UserBehaviorOrderByWithRelationInput | UserBehaviorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserBehaviorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBehaviors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBehaviors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserBehaviors
    **/
    _count?: true | UserBehaviorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserBehaviorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserBehaviorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserBehaviorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserBehaviorMaxAggregateInputType
  }

  export type GetUserBehaviorAggregateType<T extends UserBehaviorAggregateArgs> = {
        [P in keyof T & keyof AggregateUserBehavior]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserBehavior[P]>
      : GetScalarType<T[P], AggregateUserBehavior[P]>
  }




  export type UserBehaviorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserBehaviorWhereInput
    orderBy?: UserBehaviorOrderByWithAggregationInput | UserBehaviorOrderByWithAggregationInput[]
    by: UserBehaviorScalarFieldEnum[] | UserBehaviorScalarFieldEnum
    having?: UserBehaviorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserBehaviorCountAggregateInputType | true
    _avg?: UserBehaviorAvgAggregateInputType
    _sum?: UserBehaviorSumAggregateInputType
    _min?: UserBehaviorMinAggregateInputType
    _max?: UserBehaviorMaxAggregateInputType
  }

  export type UserBehaviorGroupByOutputType = {
    id: number
    userID: number
    jobID: number
    action: string
    createdAt: Date
    _count: UserBehaviorCountAggregateOutputType | null
    _avg: UserBehaviorAvgAggregateOutputType | null
    _sum: UserBehaviorSumAggregateOutputType | null
    _min: UserBehaviorMinAggregateOutputType | null
    _max: UserBehaviorMaxAggregateOutputType | null
  }

  type GetUserBehaviorGroupByPayload<T extends UserBehaviorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserBehaviorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserBehaviorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserBehaviorGroupByOutputType[P]>
            : GetScalarType<T[P], UserBehaviorGroupByOutputType[P]>
        }
      >
    >


  export type UserBehaviorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    jobID?: boolean
    action?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userBehavior"]>

  export type UserBehaviorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    jobID?: boolean
    action?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userBehavior"]>

  export type UserBehaviorSelectScalar = {
    id?: boolean
    userID?: boolean
    jobID?: boolean
    action?: boolean
    createdAt?: boolean
  }

  export type UserBehaviorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
  }
  export type UserBehaviorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
  }

  export type $UserBehaviorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserBehavior"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      job: Prisma.$JobPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userID: number
      jobID: number
      action: string
      createdAt: Date
    }, ExtArgs["result"]["userBehavior"]>
    composites: {}
  }

  type UserBehaviorGetPayload<S extends boolean | null | undefined | UserBehaviorDefaultArgs> = $Result.GetResult<Prisma.$UserBehaviorPayload, S>

  type UserBehaviorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserBehaviorFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserBehaviorCountAggregateInputType | true
    }

  export interface UserBehaviorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserBehavior'], meta: { name: 'UserBehavior' } }
    /**
     * Find zero or one UserBehavior that matches the filter.
     * @param {UserBehaviorFindUniqueArgs} args - Arguments to find a UserBehavior
     * @example
     * // Get one UserBehavior
     * const userBehavior = await prisma.userBehavior.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserBehaviorFindUniqueArgs>(args: SelectSubset<T, UserBehaviorFindUniqueArgs<ExtArgs>>): Prisma__UserBehaviorClient<$Result.GetResult<Prisma.$UserBehaviorPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserBehavior that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserBehaviorFindUniqueOrThrowArgs} args - Arguments to find a UserBehavior
     * @example
     * // Get one UserBehavior
     * const userBehavior = await prisma.userBehavior.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserBehaviorFindUniqueOrThrowArgs>(args: SelectSubset<T, UserBehaviorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserBehaviorClient<$Result.GetResult<Prisma.$UserBehaviorPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserBehavior that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBehaviorFindFirstArgs} args - Arguments to find a UserBehavior
     * @example
     * // Get one UserBehavior
     * const userBehavior = await prisma.userBehavior.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserBehaviorFindFirstArgs>(args?: SelectSubset<T, UserBehaviorFindFirstArgs<ExtArgs>>): Prisma__UserBehaviorClient<$Result.GetResult<Prisma.$UserBehaviorPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserBehavior that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBehaviorFindFirstOrThrowArgs} args - Arguments to find a UserBehavior
     * @example
     * // Get one UserBehavior
     * const userBehavior = await prisma.userBehavior.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserBehaviorFindFirstOrThrowArgs>(args?: SelectSubset<T, UserBehaviorFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserBehaviorClient<$Result.GetResult<Prisma.$UserBehaviorPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserBehaviors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBehaviorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserBehaviors
     * const userBehaviors = await prisma.userBehavior.findMany()
     * 
     * // Get first 10 UserBehaviors
     * const userBehaviors = await prisma.userBehavior.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userBehaviorWithIdOnly = await prisma.userBehavior.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserBehaviorFindManyArgs>(args?: SelectSubset<T, UserBehaviorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBehaviorPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserBehavior.
     * @param {UserBehaviorCreateArgs} args - Arguments to create a UserBehavior.
     * @example
     * // Create one UserBehavior
     * const UserBehavior = await prisma.userBehavior.create({
     *   data: {
     *     // ... data to create a UserBehavior
     *   }
     * })
     * 
     */
    create<T extends UserBehaviorCreateArgs>(args: SelectSubset<T, UserBehaviorCreateArgs<ExtArgs>>): Prisma__UserBehaviorClient<$Result.GetResult<Prisma.$UserBehaviorPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserBehaviors.
     * @param {UserBehaviorCreateManyArgs} args - Arguments to create many UserBehaviors.
     * @example
     * // Create many UserBehaviors
     * const userBehavior = await prisma.userBehavior.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserBehaviorCreateManyArgs>(args?: SelectSubset<T, UserBehaviorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserBehaviors and returns the data saved in the database.
     * @param {UserBehaviorCreateManyAndReturnArgs} args - Arguments to create many UserBehaviors.
     * @example
     * // Create many UserBehaviors
     * const userBehavior = await prisma.userBehavior.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserBehaviors and only return the `id`
     * const userBehaviorWithIdOnly = await prisma.userBehavior.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserBehaviorCreateManyAndReturnArgs>(args?: SelectSubset<T, UserBehaviorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBehaviorPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserBehavior.
     * @param {UserBehaviorDeleteArgs} args - Arguments to delete one UserBehavior.
     * @example
     * // Delete one UserBehavior
     * const UserBehavior = await prisma.userBehavior.delete({
     *   where: {
     *     // ... filter to delete one UserBehavior
     *   }
     * })
     * 
     */
    delete<T extends UserBehaviorDeleteArgs>(args: SelectSubset<T, UserBehaviorDeleteArgs<ExtArgs>>): Prisma__UserBehaviorClient<$Result.GetResult<Prisma.$UserBehaviorPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserBehavior.
     * @param {UserBehaviorUpdateArgs} args - Arguments to update one UserBehavior.
     * @example
     * // Update one UserBehavior
     * const userBehavior = await prisma.userBehavior.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserBehaviorUpdateArgs>(args: SelectSubset<T, UserBehaviorUpdateArgs<ExtArgs>>): Prisma__UserBehaviorClient<$Result.GetResult<Prisma.$UserBehaviorPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserBehaviors.
     * @param {UserBehaviorDeleteManyArgs} args - Arguments to filter UserBehaviors to delete.
     * @example
     * // Delete a few UserBehaviors
     * const { count } = await prisma.userBehavior.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserBehaviorDeleteManyArgs>(args?: SelectSubset<T, UserBehaviorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserBehaviors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBehaviorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserBehaviors
     * const userBehavior = await prisma.userBehavior.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserBehaviorUpdateManyArgs>(args: SelectSubset<T, UserBehaviorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserBehavior.
     * @param {UserBehaviorUpsertArgs} args - Arguments to update or create a UserBehavior.
     * @example
     * // Update or create a UserBehavior
     * const userBehavior = await prisma.userBehavior.upsert({
     *   create: {
     *     // ... data to create a UserBehavior
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserBehavior we want to update
     *   }
     * })
     */
    upsert<T extends UserBehaviorUpsertArgs>(args: SelectSubset<T, UserBehaviorUpsertArgs<ExtArgs>>): Prisma__UserBehaviorClient<$Result.GetResult<Prisma.$UserBehaviorPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserBehaviors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBehaviorCountArgs} args - Arguments to filter UserBehaviors to count.
     * @example
     * // Count the number of UserBehaviors
     * const count = await prisma.userBehavior.count({
     *   where: {
     *     // ... the filter for the UserBehaviors we want to count
     *   }
     * })
    **/
    count<T extends UserBehaviorCountArgs>(
      args?: Subset<T, UserBehaviorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserBehaviorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserBehavior.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBehaviorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserBehaviorAggregateArgs>(args: Subset<T, UserBehaviorAggregateArgs>): Prisma.PrismaPromise<GetUserBehaviorAggregateType<T>>

    /**
     * Group by UserBehavior.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBehaviorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserBehaviorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserBehaviorGroupByArgs['orderBy'] }
        : { orderBy?: UserBehaviorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserBehaviorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserBehaviorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserBehavior model
   */
  readonly fields: UserBehaviorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserBehavior.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserBehaviorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    job<T extends JobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobDefaultArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserBehavior model
   */ 
  interface UserBehaviorFieldRefs {
    readonly id: FieldRef<"UserBehavior", 'Int'>
    readonly userID: FieldRef<"UserBehavior", 'Int'>
    readonly jobID: FieldRef<"UserBehavior", 'Int'>
    readonly action: FieldRef<"UserBehavior", 'String'>
    readonly createdAt: FieldRef<"UserBehavior", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserBehavior findUnique
   */
  export type UserBehaviorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBehavior
     */
    select?: UserBehaviorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBehaviorInclude<ExtArgs> | null
    /**
     * Filter, which UserBehavior to fetch.
     */
    where: UserBehaviorWhereUniqueInput
  }

  /**
   * UserBehavior findUniqueOrThrow
   */
  export type UserBehaviorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBehavior
     */
    select?: UserBehaviorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBehaviorInclude<ExtArgs> | null
    /**
     * Filter, which UserBehavior to fetch.
     */
    where: UserBehaviorWhereUniqueInput
  }

  /**
   * UserBehavior findFirst
   */
  export type UserBehaviorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBehavior
     */
    select?: UserBehaviorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBehaviorInclude<ExtArgs> | null
    /**
     * Filter, which UserBehavior to fetch.
     */
    where?: UserBehaviorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBehaviors to fetch.
     */
    orderBy?: UserBehaviorOrderByWithRelationInput | UserBehaviorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserBehaviors.
     */
    cursor?: UserBehaviorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBehaviors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBehaviors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserBehaviors.
     */
    distinct?: UserBehaviorScalarFieldEnum | UserBehaviorScalarFieldEnum[]
  }

  /**
   * UserBehavior findFirstOrThrow
   */
  export type UserBehaviorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBehavior
     */
    select?: UserBehaviorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBehaviorInclude<ExtArgs> | null
    /**
     * Filter, which UserBehavior to fetch.
     */
    where?: UserBehaviorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBehaviors to fetch.
     */
    orderBy?: UserBehaviorOrderByWithRelationInput | UserBehaviorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserBehaviors.
     */
    cursor?: UserBehaviorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBehaviors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBehaviors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserBehaviors.
     */
    distinct?: UserBehaviorScalarFieldEnum | UserBehaviorScalarFieldEnum[]
  }

  /**
   * UserBehavior findMany
   */
  export type UserBehaviorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBehavior
     */
    select?: UserBehaviorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBehaviorInclude<ExtArgs> | null
    /**
     * Filter, which UserBehaviors to fetch.
     */
    where?: UserBehaviorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBehaviors to fetch.
     */
    orderBy?: UserBehaviorOrderByWithRelationInput | UserBehaviorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserBehaviors.
     */
    cursor?: UserBehaviorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBehaviors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBehaviors.
     */
    skip?: number
    distinct?: UserBehaviorScalarFieldEnum | UserBehaviorScalarFieldEnum[]
  }

  /**
   * UserBehavior create
   */
  export type UserBehaviorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBehavior
     */
    select?: UserBehaviorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBehaviorInclude<ExtArgs> | null
    /**
     * The data needed to create a UserBehavior.
     */
    data: XOR<UserBehaviorCreateInput, UserBehaviorUncheckedCreateInput>
  }

  /**
   * UserBehavior createMany
   */
  export type UserBehaviorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserBehaviors.
     */
    data: UserBehaviorCreateManyInput | UserBehaviorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserBehavior createManyAndReturn
   */
  export type UserBehaviorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBehavior
     */
    select?: UserBehaviorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserBehaviors.
     */
    data: UserBehaviorCreateManyInput | UserBehaviorCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBehaviorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserBehavior update
   */
  export type UserBehaviorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBehavior
     */
    select?: UserBehaviorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBehaviorInclude<ExtArgs> | null
    /**
     * The data needed to update a UserBehavior.
     */
    data: XOR<UserBehaviorUpdateInput, UserBehaviorUncheckedUpdateInput>
    /**
     * Choose, which UserBehavior to update.
     */
    where: UserBehaviorWhereUniqueInput
  }

  /**
   * UserBehavior updateMany
   */
  export type UserBehaviorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserBehaviors.
     */
    data: XOR<UserBehaviorUpdateManyMutationInput, UserBehaviorUncheckedUpdateManyInput>
    /**
     * Filter which UserBehaviors to update
     */
    where?: UserBehaviorWhereInput
  }

  /**
   * UserBehavior upsert
   */
  export type UserBehaviorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBehavior
     */
    select?: UserBehaviorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBehaviorInclude<ExtArgs> | null
    /**
     * The filter to search for the UserBehavior to update in case it exists.
     */
    where: UserBehaviorWhereUniqueInput
    /**
     * In case the UserBehavior found by the `where` argument doesn't exist, create a new UserBehavior with this data.
     */
    create: XOR<UserBehaviorCreateInput, UserBehaviorUncheckedCreateInput>
    /**
     * In case the UserBehavior was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserBehaviorUpdateInput, UserBehaviorUncheckedUpdateInput>
  }

  /**
   * UserBehavior delete
   */
  export type UserBehaviorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBehavior
     */
    select?: UserBehaviorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBehaviorInclude<ExtArgs> | null
    /**
     * Filter which UserBehavior to delete.
     */
    where: UserBehaviorWhereUniqueInput
  }

  /**
   * UserBehavior deleteMany
   */
  export type UserBehaviorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserBehaviors to delete
     */
    where?: UserBehaviorWhereInput
  }

  /**
   * UserBehavior without action
   */
  export type UserBehaviorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBehavior
     */
    select?: UserBehaviorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBehaviorInclude<ExtArgs> | null
  }


  /**
   * Model ApplyHistory
   */

  export type AggregateApplyHistory = {
    _count: ApplyHistoryCountAggregateOutputType | null
    _avg: ApplyHistoryAvgAggregateOutputType | null
    _sum: ApplyHistorySumAggregateOutputType | null
    _min: ApplyHistoryMinAggregateOutputType | null
    _max: ApplyHistoryMaxAggregateOutputType | null
  }

  export type ApplyHistoryAvgAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
    cvID: number | null
  }

  export type ApplyHistorySumAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
    cvID: number | null
  }

  export type ApplyHistoryMinAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
    cvID: number | null
    status: string | null
    appliedAt: Date | null
  }

  export type ApplyHistoryMaxAggregateOutputType = {
    id: number | null
    userID: number | null
    jobID: number | null
    cvID: number | null
    status: string | null
    appliedAt: Date | null
  }

  export type ApplyHistoryCountAggregateOutputType = {
    id: number
    userID: number
    jobID: number
    cvID: number
    status: number
    appliedAt: number
    _all: number
  }


  export type ApplyHistoryAvgAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    cvID?: true
  }

  export type ApplyHistorySumAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    cvID?: true
  }

  export type ApplyHistoryMinAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    cvID?: true
    status?: true
    appliedAt?: true
  }

  export type ApplyHistoryMaxAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    cvID?: true
    status?: true
    appliedAt?: true
  }

  export type ApplyHistoryCountAggregateInputType = {
    id?: true
    userID?: true
    jobID?: true
    cvID?: true
    status?: true
    appliedAt?: true
    _all?: true
  }

  export type ApplyHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApplyHistory to aggregate.
     */
    where?: ApplyHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApplyHistories to fetch.
     */
    orderBy?: ApplyHistoryOrderByWithRelationInput | ApplyHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApplyHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApplyHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApplyHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ApplyHistories
    **/
    _count?: true | ApplyHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ApplyHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ApplyHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApplyHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApplyHistoryMaxAggregateInputType
  }

  export type GetApplyHistoryAggregateType<T extends ApplyHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateApplyHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApplyHistory[P]>
      : GetScalarType<T[P], AggregateApplyHistory[P]>
  }




  export type ApplyHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplyHistoryWhereInput
    orderBy?: ApplyHistoryOrderByWithAggregationInput | ApplyHistoryOrderByWithAggregationInput[]
    by: ApplyHistoryScalarFieldEnum[] | ApplyHistoryScalarFieldEnum
    having?: ApplyHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApplyHistoryCountAggregateInputType | true
    _avg?: ApplyHistoryAvgAggregateInputType
    _sum?: ApplyHistorySumAggregateInputType
    _min?: ApplyHistoryMinAggregateInputType
    _max?: ApplyHistoryMaxAggregateInputType
  }

  export type ApplyHistoryGroupByOutputType = {
    id: number
    userID: number
    jobID: number
    cvID: number
    status: string
    appliedAt: Date
    _count: ApplyHistoryCountAggregateOutputType | null
    _avg: ApplyHistoryAvgAggregateOutputType | null
    _sum: ApplyHistorySumAggregateOutputType | null
    _min: ApplyHistoryMinAggregateOutputType | null
    _max: ApplyHistoryMaxAggregateOutputType | null
  }

  type GetApplyHistoryGroupByPayload<T extends ApplyHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApplyHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApplyHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApplyHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], ApplyHistoryGroupByOutputType[P]>
        }
      >
    >


  export type ApplyHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    jobID?: boolean
    cvID?: boolean
    status?: boolean
    appliedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
    cv?: boolean | CVDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["applyHistory"]>

  export type ApplyHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    jobID?: boolean
    cvID?: boolean
    status?: boolean
    appliedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
    cv?: boolean | CVDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["applyHistory"]>

  export type ApplyHistorySelectScalar = {
    id?: boolean
    userID?: boolean
    jobID?: boolean
    cvID?: boolean
    status?: boolean
    appliedAt?: boolean
  }

  export type ApplyHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
    cv?: boolean | CVDefaultArgs<ExtArgs>
  }
  export type ApplyHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
    cv?: boolean | CVDefaultArgs<ExtArgs>
  }

  export type $ApplyHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ApplyHistory"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      job: Prisma.$JobPayload<ExtArgs>
      cv: Prisma.$CVPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userID: number
      jobID: number
      cvID: number
      status: string
      appliedAt: Date
    }, ExtArgs["result"]["applyHistory"]>
    composites: {}
  }

  type ApplyHistoryGetPayload<S extends boolean | null | undefined | ApplyHistoryDefaultArgs> = $Result.GetResult<Prisma.$ApplyHistoryPayload, S>

  type ApplyHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ApplyHistoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ApplyHistoryCountAggregateInputType | true
    }

  export interface ApplyHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ApplyHistory'], meta: { name: 'ApplyHistory' } }
    /**
     * Find zero or one ApplyHistory that matches the filter.
     * @param {ApplyHistoryFindUniqueArgs} args - Arguments to find a ApplyHistory
     * @example
     * // Get one ApplyHistory
     * const applyHistory = await prisma.applyHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApplyHistoryFindUniqueArgs>(args: SelectSubset<T, ApplyHistoryFindUniqueArgs<ExtArgs>>): Prisma__ApplyHistoryClient<$Result.GetResult<Prisma.$ApplyHistoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ApplyHistory that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ApplyHistoryFindUniqueOrThrowArgs} args - Arguments to find a ApplyHistory
     * @example
     * // Get one ApplyHistory
     * const applyHistory = await prisma.applyHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApplyHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, ApplyHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApplyHistoryClient<$Result.GetResult<Prisma.$ApplyHistoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ApplyHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplyHistoryFindFirstArgs} args - Arguments to find a ApplyHistory
     * @example
     * // Get one ApplyHistory
     * const applyHistory = await prisma.applyHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApplyHistoryFindFirstArgs>(args?: SelectSubset<T, ApplyHistoryFindFirstArgs<ExtArgs>>): Prisma__ApplyHistoryClient<$Result.GetResult<Prisma.$ApplyHistoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ApplyHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplyHistoryFindFirstOrThrowArgs} args - Arguments to find a ApplyHistory
     * @example
     * // Get one ApplyHistory
     * const applyHistory = await prisma.applyHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApplyHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, ApplyHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApplyHistoryClient<$Result.GetResult<Prisma.$ApplyHistoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ApplyHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplyHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ApplyHistories
     * const applyHistories = await prisma.applyHistory.findMany()
     * 
     * // Get first 10 ApplyHistories
     * const applyHistories = await prisma.applyHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const applyHistoryWithIdOnly = await prisma.applyHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApplyHistoryFindManyArgs>(args?: SelectSubset<T, ApplyHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplyHistoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ApplyHistory.
     * @param {ApplyHistoryCreateArgs} args - Arguments to create a ApplyHistory.
     * @example
     * // Create one ApplyHistory
     * const ApplyHistory = await prisma.applyHistory.create({
     *   data: {
     *     // ... data to create a ApplyHistory
     *   }
     * })
     * 
     */
    create<T extends ApplyHistoryCreateArgs>(args: SelectSubset<T, ApplyHistoryCreateArgs<ExtArgs>>): Prisma__ApplyHistoryClient<$Result.GetResult<Prisma.$ApplyHistoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ApplyHistories.
     * @param {ApplyHistoryCreateManyArgs} args - Arguments to create many ApplyHistories.
     * @example
     * // Create many ApplyHistories
     * const applyHistory = await prisma.applyHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApplyHistoryCreateManyArgs>(args?: SelectSubset<T, ApplyHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ApplyHistories and returns the data saved in the database.
     * @param {ApplyHistoryCreateManyAndReturnArgs} args - Arguments to create many ApplyHistories.
     * @example
     * // Create many ApplyHistories
     * const applyHistory = await prisma.applyHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ApplyHistories and only return the `id`
     * const applyHistoryWithIdOnly = await prisma.applyHistory.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApplyHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, ApplyHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplyHistoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ApplyHistory.
     * @param {ApplyHistoryDeleteArgs} args - Arguments to delete one ApplyHistory.
     * @example
     * // Delete one ApplyHistory
     * const ApplyHistory = await prisma.applyHistory.delete({
     *   where: {
     *     // ... filter to delete one ApplyHistory
     *   }
     * })
     * 
     */
    delete<T extends ApplyHistoryDeleteArgs>(args: SelectSubset<T, ApplyHistoryDeleteArgs<ExtArgs>>): Prisma__ApplyHistoryClient<$Result.GetResult<Prisma.$ApplyHistoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ApplyHistory.
     * @param {ApplyHistoryUpdateArgs} args - Arguments to update one ApplyHistory.
     * @example
     * // Update one ApplyHistory
     * const applyHistory = await prisma.applyHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApplyHistoryUpdateArgs>(args: SelectSubset<T, ApplyHistoryUpdateArgs<ExtArgs>>): Prisma__ApplyHistoryClient<$Result.GetResult<Prisma.$ApplyHistoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ApplyHistories.
     * @param {ApplyHistoryDeleteManyArgs} args - Arguments to filter ApplyHistories to delete.
     * @example
     * // Delete a few ApplyHistories
     * const { count } = await prisma.applyHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApplyHistoryDeleteManyArgs>(args?: SelectSubset<T, ApplyHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApplyHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplyHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ApplyHistories
     * const applyHistory = await prisma.applyHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApplyHistoryUpdateManyArgs>(args: SelectSubset<T, ApplyHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ApplyHistory.
     * @param {ApplyHistoryUpsertArgs} args - Arguments to update or create a ApplyHistory.
     * @example
     * // Update or create a ApplyHistory
     * const applyHistory = await prisma.applyHistory.upsert({
     *   create: {
     *     // ... data to create a ApplyHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ApplyHistory we want to update
     *   }
     * })
     */
    upsert<T extends ApplyHistoryUpsertArgs>(args: SelectSubset<T, ApplyHistoryUpsertArgs<ExtArgs>>): Prisma__ApplyHistoryClient<$Result.GetResult<Prisma.$ApplyHistoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ApplyHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplyHistoryCountArgs} args - Arguments to filter ApplyHistories to count.
     * @example
     * // Count the number of ApplyHistories
     * const count = await prisma.applyHistory.count({
     *   where: {
     *     // ... the filter for the ApplyHistories we want to count
     *   }
     * })
    **/
    count<T extends ApplyHistoryCountArgs>(
      args?: Subset<T, ApplyHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApplyHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ApplyHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplyHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApplyHistoryAggregateArgs>(args: Subset<T, ApplyHistoryAggregateArgs>): Prisma.PrismaPromise<GetApplyHistoryAggregateType<T>>

    /**
     * Group by ApplyHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplyHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApplyHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApplyHistoryGroupByArgs['orderBy'] }
        : { orderBy?: ApplyHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApplyHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApplyHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ApplyHistory model
   */
  readonly fields: ApplyHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ApplyHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApplyHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    job<T extends JobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobDefaultArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    cv<T extends CVDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CVDefaultArgs<ExtArgs>>): Prisma__CVClient<$Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ApplyHistory model
   */ 
  interface ApplyHistoryFieldRefs {
    readonly id: FieldRef<"ApplyHistory", 'Int'>
    readonly userID: FieldRef<"ApplyHistory", 'Int'>
    readonly jobID: FieldRef<"ApplyHistory", 'Int'>
    readonly cvID: FieldRef<"ApplyHistory", 'Int'>
    readonly status: FieldRef<"ApplyHistory", 'String'>
    readonly appliedAt: FieldRef<"ApplyHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ApplyHistory findUnique
   */
  export type ApplyHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplyHistory
     */
    select?: ApplyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplyHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ApplyHistory to fetch.
     */
    where: ApplyHistoryWhereUniqueInput
  }

  /**
   * ApplyHistory findUniqueOrThrow
   */
  export type ApplyHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplyHistory
     */
    select?: ApplyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplyHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ApplyHistory to fetch.
     */
    where: ApplyHistoryWhereUniqueInput
  }

  /**
   * ApplyHistory findFirst
   */
  export type ApplyHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplyHistory
     */
    select?: ApplyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplyHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ApplyHistory to fetch.
     */
    where?: ApplyHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApplyHistories to fetch.
     */
    orderBy?: ApplyHistoryOrderByWithRelationInput | ApplyHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApplyHistories.
     */
    cursor?: ApplyHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApplyHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApplyHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApplyHistories.
     */
    distinct?: ApplyHistoryScalarFieldEnum | ApplyHistoryScalarFieldEnum[]
  }

  /**
   * ApplyHistory findFirstOrThrow
   */
  export type ApplyHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplyHistory
     */
    select?: ApplyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplyHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ApplyHistory to fetch.
     */
    where?: ApplyHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApplyHistories to fetch.
     */
    orderBy?: ApplyHistoryOrderByWithRelationInput | ApplyHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApplyHistories.
     */
    cursor?: ApplyHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApplyHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApplyHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApplyHistories.
     */
    distinct?: ApplyHistoryScalarFieldEnum | ApplyHistoryScalarFieldEnum[]
  }

  /**
   * ApplyHistory findMany
   */
  export type ApplyHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplyHistory
     */
    select?: ApplyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplyHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ApplyHistories to fetch.
     */
    where?: ApplyHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApplyHistories to fetch.
     */
    orderBy?: ApplyHistoryOrderByWithRelationInput | ApplyHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ApplyHistories.
     */
    cursor?: ApplyHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApplyHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApplyHistories.
     */
    skip?: number
    distinct?: ApplyHistoryScalarFieldEnum | ApplyHistoryScalarFieldEnum[]
  }

  /**
   * ApplyHistory create
   */
  export type ApplyHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplyHistory
     */
    select?: ApplyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplyHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a ApplyHistory.
     */
    data: XOR<ApplyHistoryCreateInput, ApplyHistoryUncheckedCreateInput>
  }

  /**
   * ApplyHistory createMany
   */
  export type ApplyHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ApplyHistories.
     */
    data: ApplyHistoryCreateManyInput | ApplyHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApplyHistory createManyAndReturn
   */
  export type ApplyHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplyHistory
     */
    select?: ApplyHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ApplyHistories.
     */
    data: ApplyHistoryCreateManyInput | ApplyHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplyHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApplyHistory update
   */
  export type ApplyHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplyHistory
     */
    select?: ApplyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplyHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a ApplyHistory.
     */
    data: XOR<ApplyHistoryUpdateInput, ApplyHistoryUncheckedUpdateInput>
    /**
     * Choose, which ApplyHistory to update.
     */
    where: ApplyHistoryWhereUniqueInput
  }

  /**
   * ApplyHistory updateMany
   */
  export type ApplyHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ApplyHistories.
     */
    data: XOR<ApplyHistoryUpdateManyMutationInput, ApplyHistoryUncheckedUpdateManyInput>
    /**
     * Filter which ApplyHistories to update
     */
    where?: ApplyHistoryWhereInput
  }

  /**
   * ApplyHistory upsert
   */
  export type ApplyHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplyHistory
     */
    select?: ApplyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplyHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the ApplyHistory to update in case it exists.
     */
    where: ApplyHistoryWhereUniqueInput
    /**
     * In case the ApplyHistory found by the `where` argument doesn't exist, create a new ApplyHistory with this data.
     */
    create: XOR<ApplyHistoryCreateInput, ApplyHistoryUncheckedCreateInput>
    /**
     * In case the ApplyHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApplyHistoryUpdateInput, ApplyHistoryUncheckedUpdateInput>
  }

  /**
   * ApplyHistory delete
   */
  export type ApplyHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplyHistory
     */
    select?: ApplyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplyHistoryInclude<ExtArgs> | null
    /**
     * Filter which ApplyHistory to delete.
     */
    where: ApplyHistoryWhereUniqueInput
  }

  /**
   * ApplyHistory deleteMany
   */
  export type ApplyHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApplyHistories to delete
     */
    where?: ApplyHistoryWhereInput
  }

  /**
   * ApplyHistory without action
   */
  export type ApplyHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplyHistory
     */
    select?: ApplyHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplyHistoryInclude<ExtArgs> | null
  }


  /**
   * Model JobSourceTracking
   */

  export type AggregateJobSourceTracking = {
    _count: JobSourceTrackingCountAggregateOutputType | null
    _avg: JobSourceTrackingAvgAggregateOutputType | null
    _sum: JobSourceTrackingSumAggregateOutputType | null
    _min: JobSourceTrackingMinAggregateOutputType | null
    _max: JobSourceTrackingMaxAggregateOutputType | null
  }

  export type JobSourceTrackingAvgAggregateOutputType = {
    id: number | null
    jobID: number | null
  }

  export type JobSourceTrackingSumAggregateOutputType = {
    id: number | null
    jobID: number | null
  }

  export type JobSourceTrackingMinAggregateOutputType = {
    id: number | null
    jobID: number | null
    platform: string | null
    externalJobID: string | null
    crawledAt: Date | null
  }

  export type JobSourceTrackingMaxAggregateOutputType = {
    id: number | null
    jobID: number | null
    platform: string | null
    externalJobID: string | null
    crawledAt: Date | null
  }

  export type JobSourceTrackingCountAggregateOutputType = {
    id: number
    jobID: number
    platform: number
    externalJobID: number
    crawledAt: number
    _all: number
  }


  export type JobSourceTrackingAvgAggregateInputType = {
    id?: true
    jobID?: true
  }

  export type JobSourceTrackingSumAggregateInputType = {
    id?: true
    jobID?: true
  }

  export type JobSourceTrackingMinAggregateInputType = {
    id?: true
    jobID?: true
    platform?: true
    externalJobID?: true
    crawledAt?: true
  }

  export type JobSourceTrackingMaxAggregateInputType = {
    id?: true
    jobID?: true
    platform?: true
    externalJobID?: true
    crawledAt?: true
  }

  export type JobSourceTrackingCountAggregateInputType = {
    id?: true
    jobID?: true
    platform?: true
    externalJobID?: true
    crawledAt?: true
    _all?: true
  }

  export type JobSourceTrackingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JobSourceTracking to aggregate.
     */
    where?: JobSourceTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobSourceTrackings to fetch.
     */
    orderBy?: JobSourceTrackingOrderByWithRelationInput | JobSourceTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JobSourceTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobSourceTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobSourceTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JobSourceTrackings
    **/
    _count?: true | JobSourceTrackingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JobSourceTrackingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JobSourceTrackingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JobSourceTrackingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JobSourceTrackingMaxAggregateInputType
  }

  export type GetJobSourceTrackingAggregateType<T extends JobSourceTrackingAggregateArgs> = {
        [P in keyof T & keyof AggregateJobSourceTracking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJobSourceTracking[P]>
      : GetScalarType<T[P], AggregateJobSourceTracking[P]>
  }




  export type JobSourceTrackingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobSourceTrackingWhereInput
    orderBy?: JobSourceTrackingOrderByWithAggregationInput | JobSourceTrackingOrderByWithAggregationInput[]
    by: JobSourceTrackingScalarFieldEnum[] | JobSourceTrackingScalarFieldEnum
    having?: JobSourceTrackingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JobSourceTrackingCountAggregateInputType | true
    _avg?: JobSourceTrackingAvgAggregateInputType
    _sum?: JobSourceTrackingSumAggregateInputType
    _min?: JobSourceTrackingMinAggregateInputType
    _max?: JobSourceTrackingMaxAggregateInputType
  }

  export type JobSourceTrackingGroupByOutputType = {
    id: number
    jobID: number
    platform: string
    externalJobID: string
    crawledAt: Date
    _count: JobSourceTrackingCountAggregateOutputType | null
    _avg: JobSourceTrackingAvgAggregateOutputType | null
    _sum: JobSourceTrackingSumAggregateOutputType | null
    _min: JobSourceTrackingMinAggregateOutputType | null
    _max: JobSourceTrackingMaxAggregateOutputType | null
  }

  type GetJobSourceTrackingGroupByPayload<T extends JobSourceTrackingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JobSourceTrackingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JobSourceTrackingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JobSourceTrackingGroupByOutputType[P]>
            : GetScalarType<T[P], JobSourceTrackingGroupByOutputType[P]>
        }
      >
    >


  export type JobSourceTrackingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobID?: boolean
    platform?: boolean
    externalJobID?: boolean
    crawledAt?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jobSourceTracking"]>

  export type JobSourceTrackingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobID?: boolean
    platform?: boolean
    externalJobID?: boolean
    crawledAt?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jobSourceTracking"]>

  export type JobSourceTrackingSelectScalar = {
    id?: boolean
    jobID?: boolean
    platform?: boolean
    externalJobID?: boolean
    crawledAt?: boolean
  }

  export type JobSourceTrackingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
  }
  export type JobSourceTrackingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
  }

  export type $JobSourceTrackingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JobSourceTracking"
    objects: {
      job: Prisma.$JobPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      jobID: number
      platform: string
      externalJobID: string
      crawledAt: Date
    }, ExtArgs["result"]["jobSourceTracking"]>
    composites: {}
  }

  type JobSourceTrackingGetPayload<S extends boolean | null | undefined | JobSourceTrackingDefaultArgs> = $Result.GetResult<Prisma.$JobSourceTrackingPayload, S>

  type JobSourceTrackingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<JobSourceTrackingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: JobSourceTrackingCountAggregateInputType | true
    }

  export interface JobSourceTrackingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JobSourceTracking'], meta: { name: 'JobSourceTracking' } }
    /**
     * Find zero or one JobSourceTracking that matches the filter.
     * @param {JobSourceTrackingFindUniqueArgs} args - Arguments to find a JobSourceTracking
     * @example
     * // Get one JobSourceTracking
     * const jobSourceTracking = await prisma.jobSourceTracking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JobSourceTrackingFindUniqueArgs>(args: SelectSubset<T, JobSourceTrackingFindUniqueArgs<ExtArgs>>): Prisma__JobSourceTrackingClient<$Result.GetResult<Prisma.$JobSourceTrackingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one JobSourceTracking that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {JobSourceTrackingFindUniqueOrThrowArgs} args - Arguments to find a JobSourceTracking
     * @example
     * // Get one JobSourceTracking
     * const jobSourceTracking = await prisma.jobSourceTracking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JobSourceTrackingFindUniqueOrThrowArgs>(args: SelectSubset<T, JobSourceTrackingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JobSourceTrackingClient<$Result.GetResult<Prisma.$JobSourceTrackingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first JobSourceTracking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobSourceTrackingFindFirstArgs} args - Arguments to find a JobSourceTracking
     * @example
     * // Get one JobSourceTracking
     * const jobSourceTracking = await prisma.jobSourceTracking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JobSourceTrackingFindFirstArgs>(args?: SelectSubset<T, JobSourceTrackingFindFirstArgs<ExtArgs>>): Prisma__JobSourceTrackingClient<$Result.GetResult<Prisma.$JobSourceTrackingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first JobSourceTracking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobSourceTrackingFindFirstOrThrowArgs} args - Arguments to find a JobSourceTracking
     * @example
     * // Get one JobSourceTracking
     * const jobSourceTracking = await prisma.jobSourceTracking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JobSourceTrackingFindFirstOrThrowArgs>(args?: SelectSubset<T, JobSourceTrackingFindFirstOrThrowArgs<ExtArgs>>): Prisma__JobSourceTrackingClient<$Result.GetResult<Prisma.$JobSourceTrackingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more JobSourceTrackings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobSourceTrackingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JobSourceTrackings
     * const jobSourceTrackings = await prisma.jobSourceTracking.findMany()
     * 
     * // Get first 10 JobSourceTrackings
     * const jobSourceTrackings = await prisma.jobSourceTracking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jobSourceTrackingWithIdOnly = await prisma.jobSourceTracking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JobSourceTrackingFindManyArgs>(args?: SelectSubset<T, JobSourceTrackingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobSourceTrackingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a JobSourceTracking.
     * @param {JobSourceTrackingCreateArgs} args - Arguments to create a JobSourceTracking.
     * @example
     * // Create one JobSourceTracking
     * const JobSourceTracking = await prisma.jobSourceTracking.create({
     *   data: {
     *     // ... data to create a JobSourceTracking
     *   }
     * })
     * 
     */
    create<T extends JobSourceTrackingCreateArgs>(args: SelectSubset<T, JobSourceTrackingCreateArgs<ExtArgs>>): Prisma__JobSourceTrackingClient<$Result.GetResult<Prisma.$JobSourceTrackingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many JobSourceTrackings.
     * @param {JobSourceTrackingCreateManyArgs} args - Arguments to create many JobSourceTrackings.
     * @example
     * // Create many JobSourceTrackings
     * const jobSourceTracking = await prisma.jobSourceTracking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JobSourceTrackingCreateManyArgs>(args?: SelectSubset<T, JobSourceTrackingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JobSourceTrackings and returns the data saved in the database.
     * @param {JobSourceTrackingCreateManyAndReturnArgs} args - Arguments to create many JobSourceTrackings.
     * @example
     * // Create many JobSourceTrackings
     * const jobSourceTracking = await prisma.jobSourceTracking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JobSourceTrackings and only return the `id`
     * const jobSourceTrackingWithIdOnly = await prisma.jobSourceTracking.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JobSourceTrackingCreateManyAndReturnArgs>(args?: SelectSubset<T, JobSourceTrackingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobSourceTrackingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a JobSourceTracking.
     * @param {JobSourceTrackingDeleteArgs} args - Arguments to delete one JobSourceTracking.
     * @example
     * // Delete one JobSourceTracking
     * const JobSourceTracking = await prisma.jobSourceTracking.delete({
     *   where: {
     *     // ... filter to delete one JobSourceTracking
     *   }
     * })
     * 
     */
    delete<T extends JobSourceTrackingDeleteArgs>(args: SelectSubset<T, JobSourceTrackingDeleteArgs<ExtArgs>>): Prisma__JobSourceTrackingClient<$Result.GetResult<Prisma.$JobSourceTrackingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one JobSourceTracking.
     * @param {JobSourceTrackingUpdateArgs} args - Arguments to update one JobSourceTracking.
     * @example
     * // Update one JobSourceTracking
     * const jobSourceTracking = await prisma.jobSourceTracking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JobSourceTrackingUpdateArgs>(args: SelectSubset<T, JobSourceTrackingUpdateArgs<ExtArgs>>): Prisma__JobSourceTrackingClient<$Result.GetResult<Prisma.$JobSourceTrackingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more JobSourceTrackings.
     * @param {JobSourceTrackingDeleteManyArgs} args - Arguments to filter JobSourceTrackings to delete.
     * @example
     * // Delete a few JobSourceTrackings
     * const { count } = await prisma.jobSourceTracking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JobSourceTrackingDeleteManyArgs>(args?: SelectSubset<T, JobSourceTrackingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JobSourceTrackings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobSourceTrackingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JobSourceTrackings
     * const jobSourceTracking = await prisma.jobSourceTracking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JobSourceTrackingUpdateManyArgs>(args: SelectSubset<T, JobSourceTrackingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one JobSourceTracking.
     * @param {JobSourceTrackingUpsertArgs} args - Arguments to update or create a JobSourceTracking.
     * @example
     * // Update or create a JobSourceTracking
     * const jobSourceTracking = await prisma.jobSourceTracking.upsert({
     *   create: {
     *     // ... data to create a JobSourceTracking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JobSourceTracking we want to update
     *   }
     * })
     */
    upsert<T extends JobSourceTrackingUpsertArgs>(args: SelectSubset<T, JobSourceTrackingUpsertArgs<ExtArgs>>): Prisma__JobSourceTrackingClient<$Result.GetResult<Prisma.$JobSourceTrackingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of JobSourceTrackings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobSourceTrackingCountArgs} args - Arguments to filter JobSourceTrackings to count.
     * @example
     * // Count the number of JobSourceTrackings
     * const count = await prisma.jobSourceTracking.count({
     *   where: {
     *     // ... the filter for the JobSourceTrackings we want to count
     *   }
     * })
    **/
    count<T extends JobSourceTrackingCountArgs>(
      args?: Subset<T, JobSourceTrackingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JobSourceTrackingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JobSourceTracking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobSourceTrackingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JobSourceTrackingAggregateArgs>(args: Subset<T, JobSourceTrackingAggregateArgs>): Prisma.PrismaPromise<GetJobSourceTrackingAggregateType<T>>

    /**
     * Group by JobSourceTracking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobSourceTrackingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JobSourceTrackingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JobSourceTrackingGroupByArgs['orderBy'] }
        : { orderBy?: JobSourceTrackingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JobSourceTrackingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJobSourceTrackingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JobSourceTracking model
   */
  readonly fields: JobSourceTrackingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JobSourceTracking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JobSourceTrackingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    job<T extends JobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobDefaultArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JobSourceTracking model
   */ 
  interface JobSourceTrackingFieldRefs {
    readonly id: FieldRef<"JobSourceTracking", 'Int'>
    readonly jobID: FieldRef<"JobSourceTracking", 'Int'>
    readonly platform: FieldRef<"JobSourceTracking", 'String'>
    readonly externalJobID: FieldRef<"JobSourceTracking", 'String'>
    readonly crawledAt: FieldRef<"JobSourceTracking", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * JobSourceTracking findUnique
   */
  export type JobSourceTrackingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSourceTracking
     */
    select?: JobSourceTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSourceTrackingInclude<ExtArgs> | null
    /**
     * Filter, which JobSourceTracking to fetch.
     */
    where: JobSourceTrackingWhereUniqueInput
  }

  /**
   * JobSourceTracking findUniqueOrThrow
   */
  export type JobSourceTrackingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSourceTracking
     */
    select?: JobSourceTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSourceTrackingInclude<ExtArgs> | null
    /**
     * Filter, which JobSourceTracking to fetch.
     */
    where: JobSourceTrackingWhereUniqueInput
  }

  /**
   * JobSourceTracking findFirst
   */
  export type JobSourceTrackingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSourceTracking
     */
    select?: JobSourceTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSourceTrackingInclude<ExtArgs> | null
    /**
     * Filter, which JobSourceTracking to fetch.
     */
    where?: JobSourceTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobSourceTrackings to fetch.
     */
    orderBy?: JobSourceTrackingOrderByWithRelationInput | JobSourceTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JobSourceTrackings.
     */
    cursor?: JobSourceTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobSourceTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobSourceTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JobSourceTrackings.
     */
    distinct?: JobSourceTrackingScalarFieldEnum | JobSourceTrackingScalarFieldEnum[]
  }

  /**
   * JobSourceTracking findFirstOrThrow
   */
  export type JobSourceTrackingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSourceTracking
     */
    select?: JobSourceTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSourceTrackingInclude<ExtArgs> | null
    /**
     * Filter, which JobSourceTracking to fetch.
     */
    where?: JobSourceTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobSourceTrackings to fetch.
     */
    orderBy?: JobSourceTrackingOrderByWithRelationInput | JobSourceTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JobSourceTrackings.
     */
    cursor?: JobSourceTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobSourceTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobSourceTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JobSourceTrackings.
     */
    distinct?: JobSourceTrackingScalarFieldEnum | JobSourceTrackingScalarFieldEnum[]
  }

  /**
   * JobSourceTracking findMany
   */
  export type JobSourceTrackingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSourceTracking
     */
    select?: JobSourceTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSourceTrackingInclude<ExtArgs> | null
    /**
     * Filter, which JobSourceTrackings to fetch.
     */
    where?: JobSourceTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobSourceTrackings to fetch.
     */
    orderBy?: JobSourceTrackingOrderByWithRelationInput | JobSourceTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JobSourceTrackings.
     */
    cursor?: JobSourceTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobSourceTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobSourceTrackings.
     */
    skip?: number
    distinct?: JobSourceTrackingScalarFieldEnum | JobSourceTrackingScalarFieldEnum[]
  }

  /**
   * JobSourceTracking create
   */
  export type JobSourceTrackingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSourceTracking
     */
    select?: JobSourceTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSourceTrackingInclude<ExtArgs> | null
    /**
     * The data needed to create a JobSourceTracking.
     */
    data: XOR<JobSourceTrackingCreateInput, JobSourceTrackingUncheckedCreateInput>
  }

  /**
   * JobSourceTracking createMany
   */
  export type JobSourceTrackingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JobSourceTrackings.
     */
    data: JobSourceTrackingCreateManyInput | JobSourceTrackingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * JobSourceTracking createManyAndReturn
   */
  export type JobSourceTrackingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSourceTracking
     */
    select?: JobSourceTrackingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many JobSourceTrackings.
     */
    data: JobSourceTrackingCreateManyInput | JobSourceTrackingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSourceTrackingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * JobSourceTracking update
   */
  export type JobSourceTrackingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSourceTracking
     */
    select?: JobSourceTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSourceTrackingInclude<ExtArgs> | null
    /**
     * The data needed to update a JobSourceTracking.
     */
    data: XOR<JobSourceTrackingUpdateInput, JobSourceTrackingUncheckedUpdateInput>
    /**
     * Choose, which JobSourceTracking to update.
     */
    where: JobSourceTrackingWhereUniqueInput
  }

  /**
   * JobSourceTracking updateMany
   */
  export type JobSourceTrackingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JobSourceTrackings.
     */
    data: XOR<JobSourceTrackingUpdateManyMutationInput, JobSourceTrackingUncheckedUpdateManyInput>
    /**
     * Filter which JobSourceTrackings to update
     */
    where?: JobSourceTrackingWhereInput
  }

  /**
   * JobSourceTracking upsert
   */
  export type JobSourceTrackingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSourceTracking
     */
    select?: JobSourceTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSourceTrackingInclude<ExtArgs> | null
    /**
     * The filter to search for the JobSourceTracking to update in case it exists.
     */
    where: JobSourceTrackingWhereUniqueInput
    /**
     * In case the JobSourceTracking found by the `where` argument doesn't exist, create a new JobSourceTracking with this data.
     */
    create: XOR<JobSourceTrackingCreateInput, JobSourceTrackingUncheckedCreateInput>
    /**
     * In case the JobSourceTracking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JobSourceTrackingUpdateInput, JobSourceTrackingUncheckedUpdateInput>
  }

  /**
   * JobSourceTracking delete
   */
  export type JobSourceTrackingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSourceTracking
     */
    select?: JobSourceTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSourceTrackingInclude<ExtArgs> | null
    /**
     * Filter which JobSourceTracking to delete.
     */
    where: JobSourceTrackingWhereUniqueInput
  }

  /**
   * JobSourceTracking deleteMany
   */
  export type JobSourceTrackingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JobSourceTrackings to delete
     */
    where?: JobSourceTrackingWhereInput
  }

  /**
   * JobSourceTracking without action
   */
  export type JobSourceTrackingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobSourceTracking
     */
    select?: JobSourceTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobSourceTrackingInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AccountScalarFieldEnum: {
    accountID: 'accountID',
    email: 'email',
    password: 'password',
    provider: 'provider',
    createdAt: 'createdAt',
    active: 'active'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const UserScalarFieldEnum: {
    userID: 'userID',
    fullName: 'fullName',
    birthYear: 'birthYear',
    phone: 'phone',
    gender: 'gender',
    address: 'address',
    accountID: 'accountID'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserProfileScalarFieldEnum: {
    id: 'id',
    jobTitle: 'jobTitle',
    experienceYear: 'experienceYear',
    careerLevel: 'careerLevel',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userID: 'userID',
    industryID: 'industryID'
  };

  export type UserProfileScalarFieldEnum = (typeof UserProfileScalarFieldEnum)[keyof typeof UserProfileScalarFieldEnum]


  export const UserSkillScalarFieldEnum: {
    id: 'id',
    userID: 'userID',
    skillID: 'skillID'
  };

  export type UserSkillScalarFieldEnum = (typeof UserSkillScalarFieldEnum)[keyof typeof UserSkillScalarFieldEnum]


  export const CVScalarFieldEnum: {
    id: 'id',
    userID: 'userID',
    title: 'title'
  };

  export type CVScalarFieldEnum = (typeof CVScalarFieldEnum)[keyof typeof CVScalarFieldEnum]


  export const CompanyScalarFieldEnum: {
    companyID: 'companyID',
    companyName: 'companyName',
    companyWebsite: 'companyWebsite',
    companyProfile: 'companyProfile',
    address: 'address',
    companySize: 'companySize',
    companyLogo: 'companyLogo'
  };

  export type CompanyScalarFieldEnum = (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum]


  export const JobScalarFieldEnum: {
    jobID: 'jobID',
    companyID: 'companyID',
    industryID: 'industryID',
    title: 'title',
    location: 'location',
    salary: 'salary',
    description: 'description',
    requirement: 'requirement',
    benefit: 'benefit',
    jobType: 'jobType',
    workingTime: 'workingTime',
    experienceYear: 'experienceYear',
    postedAt: 'postedAt',
    deadline: 'deadline',
    sourcePlatform: 'sourcePlatform',
    sourceLink: 'sourceLink',
    isActive: 'isActive'
  };

  export type JobScalarFieldEnum = (typeof JobScalarFieldEnum)[keyof typeof JobScalarFieldEnum]


  export const JobRecommendationScalarFieldEnum: {
    id: 'id',
    userID: 'userID',
    jobID: 'jobID',
    matchPercent: 'matchPercent',
    createdAt: 'createdAt'
  };

  export type JobRecommendationScalarFieldEnum = (typeof JobRecommendationScalarFieldEnum)[keyof typeof JobRecommendationScalarFieldEnum]


  export const JobSkillScalarFieldEnum: {
    id: 'id',
    jobID: 'jobID',
    skillID: 'skillID'
  };

  export type JobSkillScalarFieldEnum = (typeof JobSkillScalarFieldEnum)[keyof typeof JobSkillScalarFieldEnum]


  export const SavedJobScalarFieldEnum: {
    id: 'id',
    userID: 'userID',
    jobID: 'jobID',
    savedAt: 'savedAt'
  };

  export type SavedJobScalarFieldEnum = (typeof SavedJobScalarFieldEnum)[keyof typeof SavedJobScalarFieldEnum]


  export const IndustryScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type IndustryScalarFieldEnum = (typeof IndustryScalarFieldEnum)[keyof typeof IndustryScalarFieldEnum]


  export const SkillScalarFieldEnum: {
    skillID: 'skillID',
    industryID: 'industryID',
    name: 'name'
  };

  export type SkillScalarFieldEnum = (typeof SkillScalarFieldEnum)[keyof typeof SkillScalarFieldEnum]


  export const UserBehaviorScalarFieldEnum: {
    id: 'id',
    userID: 'userID',
    jobID: 'jobID',
    action: 'action',
    createdAt: 'createdAt'
  };

  export type UserBehaviorScalarFieldEnum = (typeof UserBehaviorScalarFieldEnum)[keyof typeof UserBehaviorScalarFieldEnum]


  export const ApplyHistoryScalarFieldEnum: {
    id: 'id',
    userID: 'userID',
    jobID: 'jobID',
    cvID: 'cvID',
    status: 'status',
    appliedAt: 'appliedAt'
  };

  export type ApplyHistoryScalarFieldEnum = (typeof ApplyHistoryScalarFieldEnum)[keyof typeof ApplyHistoryScalarFieldEnum]


  export const JobSourceTrackingScalarFieldEnum: {
    id: 'id',
    jobID: 'jobID',
    platform: 'platform',
    externalJobID: 'externalJobID',
    crawledAt: 'crawledAt'
  };

  export type JobSourceTrackingScalarFieldEnum = (typeof JobSourceTrackingScalarFieldEnum)[keyof typeof JobSourceTrackingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    accountID?: IntFilter<"Account"> | number
    email?: StringFilter<"Account"> | string
    password?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    createdAt?: DateTimeFilter<"Account"> | Date | string
    active?: BoolFilter<"Account"> | boolean
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type AccountOrderByWithRelationInput = {
    accountID?: SortOrder
    email?: SortOrder
    password?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
    active?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    accountID?: number
    email?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    password?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    createdAt?: DateTimeFilter<"Account"> | Date | string
    active?: BoolFilter<"Account"> | boolean
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "accountID" | "email">

  export type AccountOrderByWithAggregationInput = {
    accountID?: SortOrder
    email?: SortOrder
    password?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
    active?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    accountID?: IntWithAggregatesFilter<"Account"> | number
    email?: StringWithAggregatesFilter<"Account"> | string
    password?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    active?: BoolWithAggregatesFilter<"Account"> | boolean
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    userID?: IntFilter<"User"> | number
    fullName?: StringNullableFilter<"User"> | string | null
    birthYear?: IntNullableFilter<"User"> | number | null
    phone?: StringNullableFilter<"User"> | string | null
    gender?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    accountID?: IntFilter<"User"> | number
    account?: XOR<AccountRelationFilter, AccountWhereInput>
    profiles?: UserProfileListRelationFilter
    skills?: UserSkillListRelationFilter
    cvs?: CVListRelationFilter
    savedJobs?: SavedJobListRelationFilter
    behaviors?: UserBehaviorListRelationFilter
    applications?: ApplyHistoryListRelationFilter
    jobRecommendations?: JobRecommendationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    userID?: SortOrder
    fullName?: SortOrderInput | SortOrder
    birthYear?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    accountID?: SortOrder
    account?: AccountOrderByWithRelationInput
    profiles?: UserProfileOrderByRelationAggregateInput
    skills?: UserSkillOrderByRelationAggregateInput
    cvs?: CVOrderByRelationAggregateInput
    savedJobs?: SavedJobOrderByRelationAggregateInput
    behaviors?: UserBehaviorOrderByRelationAggregateInput
    applications?: ApplyHistoryOrderByRelationAggregateInput
    jobRecommendations?: JobRecommendationOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    userID?: number
    accountID?: number
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    fullName?: StringNullableFilter<"User"> | string | null
    birthYear?: IntNullableFilter<"User"> | number | null
    phone?: StringNullableFilter<"User"> | string | null
    gender?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    account?: XOR<AccountRelationFilter, AccountWhereInput>
    profiles?: UserProfileListRelationFilter
    skills?: UserSkillListRelationFilter
    cvs?: CVListRelationFilter
    savedJobs?: SavedJobListRelationFilter
    behaviors?: UserBehaviorListRelationFilter
    applications?: ApplyHistoryListRelationFilter
    jobRecommendations?: JobRecommendationListRelationFilter
  }, "userID" | "accountID">

  export type UserOrderByWithAggregationInput = {
    userID?: SortOrder
    fullName?: SortOrderInput | SortOrder
    birthYear?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    accountID?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    userID?: IntWithAggregatesFilter<"User"> | number
    fullName?: StringNullableWithAggregatesFilter<"User"> | string | null
    birthYear?: IntNullableWithAggregatesFilter<"User"> | number | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    gender?: StringNullableWithAggregatesFilter<"User"> | string | null
    address?: StringNullableWithAggregatesFilter<"User"> | string | null
    accountID?: IntWithAggregatesFilter<"User"> | number
  }

  export type UserProfileWhereInput = {
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    id?: IntFilter<"UserProfile"> | number
    jobTitle?: StringNullableFilter<"UserProfile"> | string | null
    experienceYear?: IntNullableFilter<"UserProfile"> | number | null
    careerLevel?: StringNullableFilter<"UserProfile"> | string | null
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    userID?: IntFilter<"UserProfile"> | number
    industryID?: IntNullableFilter<"UserProfile"> | number | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    industry?: XOR<IndustryNullableRelationFilter, IndustryWhereInput> | null
  }

  export type UserProfileOrderByWithRelationInput = {
    id?: SortOrder
    jobTitle?: SortOrderInput | SortOrder
    experienceYear?: SortOrderInput | SortOrder
    careerLevel?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userID?: SortOrder
    industryID?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    industry?: IndustryOrderByWithRelationInput
  }

  export type UserProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    jobTitle?: StringNullableFilter<"UserProfile"> | string | null
    experienceYear?: IntNullableFilter<"UserProfile"> | number | null
    careerLevel?: StringNullableFilter<"UserProfile"> | string | null
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    userID?: IntFilter<"UserProfile"> | number
    industryID?: IntNullableFilter<"UserProfile"> | number | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    industry?: XOR<IndustryNullableRelationFilter, IndustryWhereInput> | null
  }, "id">

  export type UserProfileOrderByWithAggregationInput = {
    id?: SortOrder
    jobTitle?: SortOrderInput | SortOrder
    experienceYear?: SortOrderInput | SortOrder
    careerLevel?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userID?: SortOrder
    industryID?: SortOrderInput | SortOrder
    _count?: UserProfileCountOrderByAggregateInput
    _avg?: UserProfileAvgOrderByAggregateInput
    _max?: UserProfileMaxOrderByAggregateInput
    _min?: UserProfileMinOrderByAggregateInput
    _sum?: UserProfileSumOrderByAggregateInput
  }

  export type UserProfileScalarWhereWithAggregatesInput = {
    AND?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    OR?: UserProfileScalarWhereWithAggregatesInput[]
    NOT?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UserProfile"> | number
    jobTitle?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    experienceYear?: IntNullableWithAggregatesFilter<"UserProfile"> | number | null
    careerLevel?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
    userID?: IntWithAggregatesFilter<"UserProfile"> | number
    industryID?: IntNullableWithAggregatesFilter<"UserProfile"> | number | null
  }

  export type UserSkillWhereInput = {
    AND?: UserSkillWhereInput | UserSkillWhereInput[]
    OR?: UserSkillWhereInput[]
    NOT?: UserSkillWhereInput | UserSkillWhereInput[]
    id?: IntFilter<"UserSkill"> | number
    userID?: IntFilter<"UserSkill"> | number
    skillID?: IntFilter<"UserSkill"> | number
    user?: XOR<UserRelationFilter, UserWhereInput>
    skill?: XOR<SkillRelationFilter, SkillWhereInput>
  }

  export type UserSkillOrderByWithRelationInput = {
    id?: SortOrder
    userID?: SortOrder
    skillID?: SortOrder
    user?: UserOrderByWithRelationInput
    skill?: SkillOrderByWithRelationInput
  }

  export type UserSkillWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: UserSkillWhereInput | UserSkillWhereInput[]
    OR?: UserSkillWhereInput[]
    NOT?: UserSkillWhereInput | UserSkillWhereInput[]
    userID?: IntFilter<"UserSkill"> | number
    skillID?: IntFilter<"UserSkill"> | number
    user?: XOR<UserRelationFilter, UserWhereInput>
    skill?: XOR<SkillRelationFilter, SkillWhereInput>
  }, "id">

  export type UserSkillOrderByWithAggregationInput = {
    id?: SortOrder
    userID?: SortOrder
    skillID?: SortOrder
    _count?: UserSkillCountOrderByAggregateInput
    _avg?: UserSkillAvgOrderByAggregateInput
    _max?: UserSkillMaxOrderByAggregateInput
    _min?: UserSkillMinOrderByAggregateInput
    _sum?: UserSkillSumOrderByAggregateInput
  }

  export type UserSkillScalarWhereWithAggregatesInput = {
    AND?: UserSkillScalarWhereWithAggregatesInput | UserSkillScalarWhereWithAggregatesInput[]
    OR?: UserSkillScalarWhereWithAggregatesInput[]
    NOT?: UserSkillScalarWhereWithAggregatesInput | UserSkillScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UserSkill"> | number
    userID?: IntWithAggregatesFilter<"UserSkill"> | number
    skillID?: IntWithAggregatesFilter<"UserSkill"> | number
  }

  export type CVWhereInput = {
    AND?: CVWhereInput | CVWhereInput[]
    OR?: CVWhereInput[]
    NOT?: CVWhereInput | CVWhereInput[]
    id?: IntFilter<"CV"> | number
    userID?: IntFilter<"CV"> | number
    title?: StringFilter<"CV"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    applications?: ApplyHistoryListRelationFilter
  }

  export type CVOrderByWithRelationInput = {
    id?: SortOrder
    userID?: SortOrder
    title?: SortOrder
    user?: UserOrderByWithRelationInput
    applications?: ApplyHistoryOrderByRelationAggregateInput
  }

  export type CVWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CVWhereInput | CVWhereInput[]
    OR?: CVWhereInput[]
    NOT?: CVWhereInput | CVWhereInput[]
    userID?: IntFilter<"CV"> | number
    title?: StringFilter<"CV"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    applications?: ApplyHistoryListRelationFilter
  }, "id">

  export type CVOrderByWithAggregationInput = {
    id?: SortOrder
    userID?: SortOrder
    title?: SortOrder
    _count?: CVCountOrderByAggregateInput
    _avg?: CVAvgOrderByAggregateInput
    _max?: CVMaxOrderByAggregateInput
    _min?: CVMinOrderByAggregateInput
    _sum?: CVSumOrderByAggregateInput
  }

  export type CVScalarWhereWithAggregatesInput = {
    AND?: CVScalarWhereWithAggregatesInput | CVScalarWhereWithAggregatesInput[]
    OR?: CVScalarWhereWithAggregatesInput[]
    NOT?: CVScalarWhereWithAggregatesInput | CVScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CV"> | number
    userID?: IntWithAggregatesFilter<"CV"> | number
    title?: StringWithAggregatesFilter<"CV"> | string
  }

  export type CompanyWhereInput = {
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    companyID?: IntFilter<"Company"> | number
    companyName?: StringFilter<"Company"> | string
    companyWebsite?: StringNullableFilter<"Company"> | string | null
    companyProfile?: StringNullableFilter<"Company"> | string | null
    address?: StringNullableFilter<"Company"> | string | null
    companySize?: StringNullableFilter<"Company"> | string | null
    companyLogo?: StringNullableFilter<"Company"> | string | null
    jobs?: JobListRelationFilter
  }

  export type CompanyOrderByWithRelationInput = {
    companyID?: SortOrder
    companyName?: SortOrder
    companyWebsite?: SortOrderInput | SortOrder
    companyProfile?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    companySize?: SortOrderInput | SortOrder
    companyLogo?: SortOrderInput | SortOrder
    jobs?: JobOrderByRelationAggregateInput
  }

  export type CompanyWhereUniqueInput = Prisma.AtLeast<{
    companyID?: number
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    companyName?: StringFilter<"Company"> | string
    companyWebsite?: StringNullableFilter<"Company"> | string | null
    companyProfile?: StringNullableFilter<"Company"> | string | null
    address?: StringNullableFilter<"Company"> | string | null
    companySize?: StringNullableFilter<"Company"> | string | null
    companyLogo?: StringNullableFilter<"Company"> | string | null
    jobs?: JobListRelationFilter
  }, "companyID">

  export type CompanyOrderByWithAggregationInput = {
    companyID?: SortOrder
    companyName?: SortOrder
    companyWebsite?: SortOrderInput | SortOrder
    companyProfile?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    companySize?: SortOrderInput | SortOrder
    companyLogo?: SortOrderInput | SortOrder
    _count?: CompanyCountOrderByAggregateInput
    _avg?: CompanyAvgOrderByAggregateInput
    _max?: CompanyMaxOrderByAggregateInput
    _min?: CompanyMinOrderByAggregateInput
    _sum?: CompanySumOrderByAggregateInput
  }

  export type CompanyScalarWhereWithAggregatesInput = {
    AND?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    OR?: CompanyScalarWhereWithAggregatesInput[]
    NOT?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    companyID?: IntWithAggregatesFilter<"Company"> | number
    companyName?: StringWithAggregatesFilter<"Company"> | string
    companyWebsite?: StringNullableWithAggregatesFilter<"Company"> | string | null
    companyProfile?: StringNullableWithAggregatesFilter<"Company"> | string | null
    address?: StringNullableWithAggregatesFilter<"Company"> | string | null
    companySize?: StringNullableWithAggregatesFilter<"Company"> | string | null
    companyLogo?: StringNullableWithAggregatesFilter<"Company"> | string | null
  }

  export type JobWhereInput = {
    AND?: JobWhereInput | JobWhereInput[]
    OR?: JobWhereInput[]
    NOT?: JobWhereInput | JobWhereInput[]
    jobID?: IntFilter<"Job"> | number
    companyID?: IntFilter<"Job"> | number
    industryID?: IntNullableFilter<"Job"> | number | null
    title?: StringNullableFilter<"Job"> | string | null
    location?: StringNullableFilter<"Job"> | string | null
    salary?: StringNullableFilter<"Job"> | string | null
    description?: StringNullableFilter<"Job"> | string | null
    requirement?: StringNullableFilter<"Job"> | string | null
    benefit?: StringNullableFilter<"Job"> | string | null
    jobType?: StringNullableFilter<"Job"> | string | null
    workingTime?: StringNullableFilter<"Job"> | string | null
    experienceYear?: IntNullableFilter<"Job"> | number | null
    postedAt?: DateTimeFilter<"Job"> | Date | string
    deadline?: DateTimeNullableFilter<"Job"> | Date | string | null
    sourcePlatform?: StringNullableFilter<"Job"> | string | null
    sourceLink?: StringNullableFilter<"Job"> | string | null
    isActive?: BoolFilter<"Job"> | boolean
    company?: XOR<CompanyRelationFilter, CompanyWhereInput>
    industry?: XOR<IndustryNullableRelationFilter, IndustryWhereInput> | null
    skills?: JobSkillListRelationFilter
    savedJobs?: SavedJobListRelationFilter
    behaviors?: UserBehaviorListRelationFilter
    applyHistories?: ApplyHistoryListRelationFilter
    sourceTrackings?: JobSourceTrackingListRelationFilter
    recommendations?: JobRecommendationListRelationFilter
  }

  export type JobOrderByWithRelationInput = {
    jobID?: SortOrder
    companyID?: SortOrder
    industryID?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    salary?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    requirement?: SortOrderInput | SortOrder
    benefit?: SortOrderInput | SortOrder
    jobType?: SortOrderInput | SortOrder
    workingTime?: SortOrderInput | SortOrder
    experienceYear?: SortOrderInput | SortOrder
    postedAt?: SortOrder
    deadline?: SortOrderInput | SortOrder
    sourcePlatform?: SortOrderInput | SortOrder
    sourceLink?: SortOrderInput | SortOrder
    isActive?: SortOrder
    company?: CompanyOrderByWithRelationInput
    industry?: IndustryOrderByWithRelationInput
    skills?: JobSkillOrderByRelationAggregateInput
    savedJobs?: SavedJobOrderByRelationAggregateInput
    behaviors?: UserBehaviorOrderByRelationAggregateInput
    applyHistories?: ApplyHistoryOrderByRelationAggregateInput
    sourceTrackings?: JobSourceTrackingOrderByRelationAggregateInput
    recommendations?: JobRecommendationOrderByRelationAggregateInput
  }

  export type JobWhereUniqueInput = Prisma.AtLeast<{
    jobID?: number
    AND?: JobWhereInput | JobWhereInput[]
    OR?: JobWhereInput[]
    NOT?: JobWhereInput | JobWhereInput[]
    companyID?: IntFilter<"Job"> | number
    industryID?: IntNullableFilter<"Job"> | number | null
    title?: StringNullableFilter<"Job"> | string | null
    location?: StringNullableFilter<"Job"> | string | null
    salary?: StringNullableFilter<"Job"> | string | null
    description?: StringNullableFilter<"Job"> | string | null
    requirement?: StringNullableFilter<"Job"> | string | null
    benefit?: StringNullableFilter<"Job"> | string | null
    jobType?: StringNullableFilter<"Job"> | string | null
    workingTime?: StringNullableFilter<"Job"> | string | null
    experienceYear?: IntNullableFilter<"Job"> | number | null
    postedAt?: DateTimeFilter<"Job"> | Date | string
    deadline?: DateTimeNullableFilter<"Job"> | Date | string | null
    sourcePlatform?: StringNullableFilter<"Job"> | string | null
    sourceLink?: StringNullableFilter<"Job"> | string | null
    isActive?: BoolFilter<"Job"> | boolean
    company?: XOR<CompanyRelationFilter, CompanyWhereInput>
    industry?: XOR<IndustryNullableRelationFilter, IndustryWhereInput> | null
    skills?: JobSkillListRelationFilter
    savedJobs?: SavedJobListRelationFilter
    behaviors?: UserBehaviorListRelationFilter
    applyHistories?: ApplyHistoryListRelationFilter
    sourceTrackings?: JobSourceTrackingListRelationFilter
    recommendations?: JobRecommendationListRelationFilter
  }, "jobID">

  export type JobOrderByWithAggregationInput = {
    jobID?: SortOrder
    companyID?: SortOrder
    industryID?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    salary?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    requirement?: SortOrderInput | SortOrder
    benefit?: SortOrderInput | SortOrder
    jobType?: SortOrderInput | SortOrder
    workingTime?: SortOrderInput | SortOrder
    experienceYear?: SortOrderInput | SortOrder
    postedAt?: SortOrder
    deadline?: SortOrderInput | SortOrder
    sourcePlatform?: SortOrderInput | SortOrder
    sourceLink?: SortOrderInput | SortOrder
    isActive?: SortOrder
    _count?: JobCountOrderByAggregateInput
    _avg?: JobAvgOrderByAggregateInput
    _max?: JobMaxOrderByAggregateInput
    _min?: JobMinOrderByAggregateInput
    _sum?: JobSumOrderByAggregateInput
  }

  export type JobScalarWhereWithAggregatesInput = {
    AND?: JobScalarWhereWithAggregatesInput | JobScalarWhereWithAggregatesInput[]
    OR?: JobScalarWhereWithAggregatesInput[]
    NOT?: JobScalarWhereWithAggregatesInput | JobScalarWhereWithAggregatesInput[]
    jobID?: IntWithAggregatesFilter<"Job"> | number
    companyID?: IntWithAggregatesFilter<"Job"> | number
    industryID?: IntNullableWithAggregatesFilter<"Job"> | number | null
    title?: StringNullableWithAggregatesFilter<"Job"> | string | null
    location?: StringNullableWithAggregatesFilter<"Job"> | string | null
    salary?: StringNullableWithAggregatesFilter<"Job"> | string | null
    description?: StringNullableWithAggregatesFilter<"Job"> | string | null
    requirement?: StringNullableWithAggregatesFilter<"Job"> | string | null
    benefit?: StringNullableWithAggregatesFilter<"Job"> | string | null
    jobType?: StringNullableWithAggregatesFilter<"Job"> | string | null
    workingTime?: StringNullableWithAggregatesFilter<"Job"> | string | null
    experienceYear?: IntNullableWithAggregatesFilter<"Job"> | number | null
    postedAt?: DateTimeWithAggregatesFilter<"Job"> | Date | string
    deadline?: DateTimeNullableWithAggregatesFilter<"Job"> | Date | string | null
    sourcePlatform?: StringNullableWithAggregatesFilter<"Job"> | string | null
    sourceLink?: StringNullableWithAggregatesFilter<"Job"> | string | null
    isActive?: BoolWithAggregatesFilter<"Job"> | boolean
  }

  export type JobRecommendationWhereInput = {
    AND?: JobRecommendationWhereInput | JobRecommendationWhereInput[]
    OR?: JobRecommendationWhereInput[]
    NOT?: JobRecommendationWhereInput | JobRecommendationWhereInput[]
    id?: IntFilter<"JobRecommendation"> | number
    userID?: IntFilter<"JobRecommendation"> | number
    jobID?: IntFilter<"JobRecommendation"> | number
    matchPercent?: FloatFilter<"JobRecommendation"> | number
    createdAt?: DateTimeFilter<"JobRecommendation"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    job?: XOR<JobRelationFilter, JobWhereInput>
  }

  export type JobRecommendationOrderByWithRelationInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    matchPercent?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    job?: JobOrderByWithRelationInput
  }

  export type JobRecommendationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userID_jobID?: JobRecommendationUserIDJobIDCompoundUniqueInput
    AND?: JobRecommendationWhereInput | JobRecommendationWhereInput[]
    OR?: JobRecommendationWhereInput[]
    NOT?: JobRecommendationWhereInput | JobRecommendationWhereInput[]
    userID?: IntFilter<"JobRecommendation"> | number
    jobID?: IntFilter<"JobRecommendation"> | number
    matchPercent?: FloatFilter<"JobRecommendation"> | number
    createdAt?: DateTimeFilter<"JobRecommendation"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    job?: XOR<JobRelationFilter, JobWhereInput>
  }, "id" | "userID_jobID">

  export type JobRecommendationOrderByWithAggregationInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    matchPercent?: SortOrder
    createdAt?: SortOrder
    _count?: JobRecommendationCountOrderByAggregateInput
    _avg?: JobRecommendationAvgOrderByAggregateInput
    _max?: JobRecommendationMaxOrderByAggregateInput
    _min?: JobRecommendationMinOrderByAggregateInput
    _sum?: JobRecommendationSumOrderByAggregateInput
  }

  export type JobRecommendationScalarWhereWithAggregatesInput = {
    AND?: JobRecommendationScalarWhereWithAggregatesInput | JobRecommendationScalarWhereWithAggregatesInput[]
    OR?: JobRecommendationScalarWhereWithAggregatesInput[]
    NOT?: JobRecommendationScalarWhereWithAggregatesInput | JobRecommendationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"JobRecommendation"> | number
    userID?: IntWithAggregatesFilter<"JobRecommendation"> | number
    jobID?: IntWithAggregatesFilter<"JobRecommendation"> | number
    matchPercent?: FloatWithAggregatesFilter<"JobRecommendation"> | number
    createdAt?: DateTimeWithAggregatesFilter<"JobRecommendation"> | Date | string
  }

  export type JobSkillWhereInput = {
    AND?: JobSkillWhereInput | JobSkillWhereInput[]
    OR?: JobSkillWhereInput[]
    NOT?: JobSkillWhereInput | JobSkillWhereInput[]
    id?: IntFilter<"JobSkill"> | number
    jobID?: IntFilter<"JobSkill"> | number
    skillID?: IntFilter<"JobSkill"> | number
    job?: XOR<JobRelationFilter, JobWhereInput>
    skill?: XOR<SkillRelationFilter, SkillWhereInput>
  }

  export type JobSkillOrderByWithRelationInput = {
    id?: SortOrder
    jobID?: SortOrder
    skillID?: SortOrder
    job?: JobOrderByWithRelationInput
    skill?: SkillOrderByWithRelationInput
  }

  export type JobSkillWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: JobSkillWhereInput | JobSkillWhereInput[]
    OR?: JobSkillWhereInput[]
    NOT?: JobSkillWhereInput | JobSkillWhereInput[]
    jobID?: IntFilter<"JobSkill"> | number
    skillID?: IntFilter<"JobSkill"> | number
    job?: XOR<JobRelationFilter, JobWhereInput>
    skill?: XOR<SkillRelationFilter, SkillWhereInput>
  }, "id">

  export type JobSkillOrderByWithAggregationInput = {
    id?: SortOrder
    jobID?: SortOrder
    skillID?: SortOrder
    _count?: JobSkillCountOrderByAggregateInput
    _avg?: JobSkillAvgOrderByAggregateInput
    _max?: JobSkillMaxOrderByAggregateInput
    _min?: JobSkillMinOrderByAggregateInput
    _sum?: JobSkillSumOrderByAggregateInput
  }

  export type JobSkillScalarWhereWithAggregatesInput = {
    AND?: JobSkillScalarWhereWithAggregatesInput | JobSkillScalarWhereWithAggregatesInput[]
    OR?: JobSkillScalarWhereWithAggregatesInput[]
    NOT?: JobSkillScalarWhereWithAggregatesInput | JobSkillScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"JobSkill"> | number
    jobID?: IntWithAggregatesFilter<"JobSkill"> | number
    skillID?: IntWithAggregatesFilter<"JobSkill"> | number
  }

  export type SavedJobWhereInput = {
    AND?: SavedJobWhereInput | SavedJobWhereInput[]
    OR?: SavedJobWhereInput[]
    NOT?: SavedJobWhereInput | SavedJobWhereInput[]
    id?: IntFilter<"SavedJob"> | number
    userID?: IntFilter<"SavedJob"> | number
    jobID?: IntFilter<"SavedJob"> | number
    savedAt?: DateTimeFilter<"SavedJob"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    job?: XOR<JobRelationFilter, JobWhereInput>
  }

  export type SavedJobOrderByWithRelationInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    savedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    job?: JobOrderByWithRelationInput
  }

  export type SavedJobWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: SavedJobWhereInput | SavedJobWhereInput[]
    OR?: SavedJobWhereInput[]
    NOT?: SavedJobWhereInput | SavedJobWhereInput[]
    userID?: IntFilter<"SavedJob"> | number
    jobID?: IntFilter<"SavedJob"> | number
    savedAt?: DateTimeFilter<"SavedJob"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    job?: XOR<JobRelationFilter, JobWhereInput>
  }, "id">

  export type SavedJobOrderByWithAggregationInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    savedAt?: SortOrder
    _count?: SavedJobCountOrderByAggregateInput
    _avg?: SavedJobAvgOrderByAggregateInput
    _max?: SavedJobMaxOrderByAggregateInput
    _min?: SavedJobMinOrderByAggregateInput
    _sum?: SavedJobSumOrderByAggregateInput
  }

  export type SavedJobScalarWhereWithAggregatesInput = {
    AND?: SavedJobScalarWhereWithAggregatesInput | SavedJobScalarWhereWithAggregatesInput[]
    OR?: SavedJobScalarWhereWithAggregatesInput[]
    NOT?: SavedJobScalarWhereWithAggregatesInput | SavedJobScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SavedJob"> | number
    userID?: IntWithAggregatesFilter<"SavedJob"> | number
    jobID?: IntWithAggregatesFilter<"SavedJob"> | number
    savedAt?: DateTimeWithAggregatesFilter<"SavedJob"> | Date | string
  }

  export type IndustryWhereInput = {
    AND?: IndustryWhereInput | IndustryWhereInput[]
    OR?: IndustryWhereInput[]
    NOT?: IndustryWhereInput | IndustryWhereInput[]
    id?: IntFilter<"Industry"> | number
    name?: StringFilter<"Industry"> | string
    skills?: SkillListRelationFilter
    jobs?: JobListRelationFilter
    userProfiles?: UserProfileListRelationFilter
  }

  export type IndustryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    skills?: SkillOrderByRelationAggregateInput
    jobs?: JobOrderByRelationAggregateInput
    userProfiles?: UserProfileOrderByRelationAggregateInput
  }

  export type IndustryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: IndustryWhereInput | IndustryWhereInput[]
    OR?: IndustryWhereInput[]
    NOT?: IndustryWhereInput | IndustryWhereInput[]
    name?: StringFilter<"Industry"> | string
    skills?: SkillListRelationFilter
    jobs?: JobListRelationFilter
    userProfiles?: UserProfileListRelationFilter
  }, "id">

  export type IndustryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: IndustryCountOrderByAggregateInput
    _avg?: IndustryAvgOrderByAggregateInput
    _max?: IndustryMaxOrderByAggregateInput
    _min?: IndustryMinOrderByAggregateInput
    _sum?: IndustrySumOrderByAggregateInput
  }

  export type IndustryScalarWhereWithAggregatesInput = {
    AND?: IndustryScalarWhereWithAggregatesInput | IndustryScalarWhereWithAggregatesInput[]
    OR?: IndustryScalarWhereWithAggregatesInput[]
    NOT?: IndustryScalarWhereWithAggregatesInput | IndustryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Industry"> | number
    name?: StringWithAggregatesFilter<"Industry"> | string
  }

  export type SkillWhereInput = {
    AND?: SkillWhereInput | SkillWhereInput[]
    OR?: SkillWhereInput[]
    NOT?: SkillWhereInput | SkillWhereInput[]
    skillID?: IntFilter<"Skill"> | number
    industryID?: IntFilter<"Skill"> | number
    name?: StringFilter<"Skill"> | string
    industry?: XOR<IndustryRelationFilter, IndustryWhereInput>
    users?: UserSkillListRelationFilter
    jobs?: JobSkillListRelationFilter
  }

  export type SkillOrderByWithRelationInput = {
    skillID?: SortOrder
    industryID?: SortOrder
    name?: SortOrder
    industry?: IndustryOrderByWithRelationInput
    users?: UserSkillOrderByRelationAggregateInput
    jobs?: JobSkillOrderByRelationAggregateInput
  }

  export type SkillWhereUniqueInput = Prisma.AtLeast<{
    skillID?: number
    AND?: SkillWhereInput | SkillWhereInput[]
    OR?: SkillWhereInput[]
    NOT?: SkillWhereInput | SkillWhereInput[]
    industryID?: IntFilter<"Skill"> | number
    name?: StringFilter<"Skill"> | string
    industry?: XOR<IndustryRelationFilter, IndustryWhereInput>
    users?: UserSkillListRelationFilter
    jobs?: JobSkillListRelationFilter
  }, "skillID">

  export type SkillOrderByWithAggregationInput = {
    skillID?: SortOrder
    industryID?: SortOrder
    name?: SortOrder
    _count?: SkillCountOrderByAggregateInput
    _avg?: SkillAvgOrderByAggregateInput
    _max?: SkillMaxOrderByAggregateInput
    _min?: SkillMinOrderByAggregateInput
    _sum?: SkillSumOrderByAggregateInput
  }

  export type SkillScalarWhereWithAggregatesInput = {
    AND?: SkillScalarWhereWithAggregatesInput | SkillScalarWhereWithAggregatesInput[]
    OR?: SkillScalarWhereWithAggregatesInput[]
    NOT?: SkillScalarWhereWithAggregatesInput | SkillScalarWhereWithAggregatesInput[]
    skillID?: IntWithAggregatesFilter<"Skill"> | number
    industryID?: IntWithAggregatesFilter<"Skill"> | number
    name?: StringWithAggregatesFilter<"Skill"> | string
  }

  export type UserBehaviorWhereInput = {
    AND?: UserBehaviorWhereInput | UserBehaviorWhereInput[]
    OR?: UserBehaviorWhereInput[]
    NOT?: UserBehaviorWhereInput | UserBehaviorWhereInput[]
    id?: IntFilter<"UserBehavior"> | number
    userID?: IntFilter<"UserBehavior"> | number
    jobID?: IntFilter<"UserBehavior"> | number
    action?: StringFilter<"UserBehavior"> | string
    createdAt?: DateTimeFilter<"UserBehavior"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    job?: XOR<JobRelationFilter, JobWhereInput>
  }

  export type UserBehaviorOrderByWithRelationInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    job?: JobOrderByWithRelationInput
  }

  export type UserBehaviorWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: UserBehaviorWhereInput | UserBehaviorWhereInput[]
    OR?: UserBehaviorWhereInput[]
    NOT?: UserBehaviorWhereInput | UserBehaviorWhereInput[]
    userID?: IntFilter<"UserBehavior"> | number
    jobID?: IntFilter<"UserBehavior"> | number
    action?: StringFilter<"UserBehavior"> | string
    createdAt?: DateTimeFilter<"UserBehavior"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    job?: XOR<JobRelationFilter, JobWhereInput>
  }, "id">

  export type UserBehaviorOrderByWithAggregationInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
    _count?: UserBehaviorCountOrderByAggregateInput
    _avg?: UserBehaviorAvgOrderByAggregateInput
    _max?: UserBehaviorMaxOrderByAggregateInput
    _min?: UserBehaviorMinOrderByAggregateInput
    _sum?: UserBehaviorSumOrderByAggregateInput
  }

  export type UserBehaviorScalarWhereWithAggregatesInput = {
    AND?: UserBehaviorScalarWhereWithAggregatesInput | UserBehaviorScalarWhereWithAggregatesInput[]
    OR?: UserBehaviorScalarWhereWithAggregatesInput[]
    NOT?: UserBehaviorScalarWhereWithAggregatesInput | UserBehaviorScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UserBehavior"> | number
    userID?: IntWithAggregatesFilter<"UserBehavior"> | number
    jobID?: IntWithAggregatesFilter<"UserBehavior"> | number
    action?: StringWithAggregatesFilter<"UserBehavior"> | string
    createdAt?: DateTimeWithAggregatesFilter<"UserBehavior"> | Date | string
  }

  export type ApplyHistoryWhereInput = {
    AND?: ApplyHistoryWhereInput | ApplyHistoryWhereInput[]
    OR?: ApplyHistoryWhereInput[]
    NOT?: ApplyHistoryWhereInput | ApplyHistoryWhereInput[]
    id?: IntFilter<"ApplyHistory"> | number
    userID?: IntFilter<"ApplyHistory"> | number
    jobID?: IntFilter<"ApplyHistory"> | number
    cvID?: IntFilter<"ApplyHistory"> | number
    status?: StringFilter<"ApplyHistory"> | string
    appliedAt?: DateTimeFilter<"ApplyHistory"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    job?: XOR<JobRelationFilter, JobWhereInput>
    cv?: XOR<CVRelationFilter, CVWhereInput>
  }

  export type ApplyHistoryOrderByWithRelationInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    cvID?: SortOrder
    status?: SortOrder
    appliedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    job?: JobOrderByWithRelationInput
    cv?: CVOrderByWithRelationInput
  }

  export type ApplyHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ApplyHistoryWhereInput | ApplyHistoryWhereInput[]
    OR?: ApplyHistoryWhereInput[]
    NOT?: ApplyHistoryWhereInput | ApplyHistoryWhereInput[]
    userID?: IntFilter<"ApplyHistory"> | number
    jobID?: IntFilter<"ApplyHistory"> | number
    cvID?: IntFilter<"ApplyHistory"> | number
    status?: StringFilter<"ApplyHistory"> | string
    appliedAt?: DateTimeFilter<"ApplyHistory"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    job?: XOR<JobRelationFilter, JobWhereInput>
    cv?: XOR<CVRelationFilter, CVWhereInput>
  }, "id">

  export type ApplyHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    cvID?: SortOrder
    status?: SortOrder
    appliedAt?: SortOrder
    _count?: ApplyHistoryCountOrderByAggregateInput
    _avg?: ApplyHistoryAvgOrderByAggregateInput
    _max?: ApplyHistoryMaxOrderByAggregateInput
    _min?: ApplyHistoryMinOrderByAggregateInput
    _sum?: ApplyHistorySumOrderByAggregateInput
  }

  export type ApplyHistoryScalarWhereWithAggregatesInput = {
    AND?: ApplyHistoryScalarWhereWithAggregatesInput | ApplyHistoryScalarWhereWithAggregatesInput[]
    OR?: ApplyHistoryScalarWhereWithAggregatesInput[]
    NOT?: ApplyHistoryScalarWhereWithAggregatesInput | ApplyHistoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ApplyHistory"> | number
    userID?: IntWithAggregatesFilter<"ApplyHistory"> | number
    jobID?: IntWithAggregatesFilter<"ApplyHistory"> | number
    cvID?: IntWithAggregatesFilter<"ApplyHistory"> | number
    status?: StringWithAggregatesFilter<"ApplyHistory"> | string
    appliedAt?: DateTimeWithAggregatesFilter<"ApplyHistory"> | Date | string
  }

  export type JobSourceTrackingWhereInput = {
    AND?: JobSourceTrackingWhereInput | JobSourceTrackingWhereInput[]
    OR?: JobSourceTrackingWhereInput[]
    NOT?: JobSourceTrackingWhereInput | JobSourceTrackingWhereInput[]
    id?: IntFilter<"JobSourceTracking"> | number
    jobID?: IntFilter<"JobSourceTracking"> | number
    platform?: StringFilter<"JobSourceTracking"> | string
    externalJobID?: StringFilter<"JobSourceTracking"> | string
    crawledAt?: DateTimeFilter<"JobSourceTracking"> | Date | string
    job?: XOR<JobRelationFilter, JobWhereInput>
  }

  export type JobSourceTrackingOrderByWithRelationInput = {
    id?: SortOrder
    jobID?: SortOrder
    platform?: SortOrder
    externalJobID?: SortOrder
    crawledAt?: SortOrder
    job?: JobOrderByWithRelationInput
  }

  export type JobSourceTrackingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: JobSourceTrackingWhereInput | JobSourceTrackingWhereInput[]
    OR?: JobSourceTrackingWhereInput[]
    NOT?: JobSourceTrackingWhereInput | JobSourceTrackingWhereInput[]
    jobID?: IntFilter<"JobSourceTracking"> | number
    platform?: StringFilter<"JobSourceTracking"> | string
    externalJobID?: StringFilter<"JobSourceTracking"> | string
    crawledAt?: DateTimeFilter<"JobSourceTracking"> | Date | string
    job?: XOR<JobRelationFilter, JobWhereInput>
  }, "id">

  export type JobSourceTrackingOrderByWithAggregationInput = {
    id?: SortOrder
    jobID?: SortOrder
    platform?: SortOrder
    externalJobID?: SortOrder
    crawledAt?: SortOrder
    _count?: JobSourceTrackingCountOrderByAggregateInput
    _avg?: JobSourceTrackingAvgOrderByAggregateInput
    _max?: JobSourceTrackingMaxOrderByAggregateInput
    _min?: JobSourceTrackingMinOrderByAggregateInput
    _sum?: JobSourceTrackingSumOrderByAggregateInput
  }

  export type JobSourceTrackingScalarWhereWithAggregatesInput = {
    AND?: JobSourceTrackingScalarWhereWithAggregatesInput | JobSourceTrackingScalarWhereWithAggregatesInput[]
    OR?: JobSourceTrackingScalarWhereWithAggregatesInput[]
    NOT?: JobSourceTrackingScalarWhereWithAggregatesInput | JobSourceTrackingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"JobSourceTracking"> | number
    jobID?: IntWithAggregatesFilter<"JobSourceTracking"> | number
    platform?: StringWithAggregatesFilter<"JobSourceTracking"> | string
    externalJobID?: StringWithAggregatesFilter<"JobSourceTracking"> | string
    crawledAt?: DateTimeWithAggregatesFilter<"JobSourceTracking"> | Date | string
  }

  export type AccountCreateInput = {
    email: string
    password: string
    provider: string
    createdAt?: Date | string
    active?: boolean
    user?: UserCreateNestedOneWithoutAccountInput
  }

  export type AccountUncheckedCreateInput = {
    accountID?: number
    email: string
    password: string
    provider: string
    createdAt?: Date | string
    active?: boolean
    user?: UserUncheckedCreateNestedOneWithoutAccountInput
  }

  export type AccountUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    accountID?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUncheckedUpdateOneWithoutAccountNestedInput
  }

  export type AccountCreateManyInput = {
    accountID?: number
    email: string
    password: string
    provider: string
    createdAt?: Date | string
    active?: boolean
  }

  export type AccountUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AccountUncheckedUpdateManyInput = {
    accountID?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserCreateInput = {
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    account: AccountCreateNestedOneWithoutUserInput
    profiles?: UserProfileCreateNestedManyWithoutUserInput
    skills?: UserSkillCreateNestedManyWithoutUserInput
    cvs?: CVCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    userID?: number
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    accountID: number
    profiles?: UserProfileUncheckedCreateNestedManyWithoutUserInput
    skills?: UserSkillUncheckedCreateNestedManyWithoutUserInput
    cvs?: CVUncheckedCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryUncheckedCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    account?: AccountUpdateOneRequiredWithoutUserNestedInput
    profiles?: UserProfileUpdateManyWithoutUserNestedInput
    skills?: UserSkillUpdateManyWithoutUserNestedInput
    cvs?: CVUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    userID?: IntFieldUpdateOperationsInput | number
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    accountID?: IntFieldUpdateOperationsInput | number
    profiles?: UserProfileUncheckedUpdateManyWithoutUserNestedInput
    skills?: UserSkillUncheckedUpdateManyWithoutUserNestedInput
    cvs?: CVUncheckedUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUncheckedUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    userID?: number
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    accountID: number
  }

  export type UserUpdateManyMutationInput = {
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    userID?: IntFieldUpdateOperationsInput | number
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    accountID?: IntFieldUpdateOperationsInput | number
  }

  export type UserProfileCreateInput = {
    jobTitle?: string | null
    experienceYear?: number | null
    careerLevel?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProfilesInput
    industry?: IndustryCreateNestedOneWithoutUserProfilesInput
  }

  export type UserProfileUncheckedCreateInput = {
    id?: number
    jobTitle?: string | null
    experienceYear?: number | null
    careerLevel?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userID: number
    industryID?: number | null
  }

  export type UserProfileUpdateInput = {
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    careerLevel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProfilesNestedInput
    industry?: IndustryUpdateOneWithoutUserProfilesNestedInput
  }

  export type UserProfileUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    careerLevel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userID?: IntFieldUpdateOperationsInput | number
    industryID?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type UserProfileCreateManyInput = {
    id?: number
    jobTitle?: string | null
    experienceYear?: number | null
    careerLevel?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userID: number
    industryID?: number | null
  }

  export type UserProfileUpdateManyMutationInput = {
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    careerLevel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    careerLevel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userID?: IntFieldUpdateOperationsInput | number
    industryID?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type UserSkillCreateInput = {
    user: UserCreateNestedOneWithoutSkillsInput
    skill: SkillCreateNestedOneWithoutUsersInput
  }

  export type UserSkillUncheckedCreateInput = {
    id?: number
    userID: number
    skillID: number
  }

  export type UserSkillUpdateInput = {
    user?: UserUpdateOneRequiredWithoutSkillsNestedInput
    skill?: SkillUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserSkillUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    skillID?: IntFieldUpdateOperationsInput | number
  }

  export type UserSkillCreateManyInput = {
    id?: number
    userID: number
    skillID: number
  }

  export type UserSkillUpdateManyMutationInput = {

  }

  export type UserSkillUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    skillID?: IntFieldUpdateOperationsInput | number
  }

  export type CVCreateInput = {
    title: string
    user: UserCreateNestedOneWithoutCvsInput
    applications?: ApplyHistoryCreateNestedManyWithoutCvInput
  }

  export type CVUncheckedCreateInput = {
    id?: number
    userID: number
    title: string
    applications?: ApplyHistoryUncheckedCreateNestedManyWithoutCvInput
  }

  export type CVUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneRequiredWithoutCvsNestedInput
    applications?: ApplyHistoryUpdateManyWithoutCvNestedInput
  }

  export type CVUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    applications?: ApplyHistoryUncheckedUpdateManyWithoutCvNestedInput
  }

  export type CVCreateManyInput = {
    id?: number
    userID: number
    title: string
  }

  export type CVUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
  }

  export type CVUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
  }

  export type CompanyCreateInput = {
    companyName: string
    companyWebsite?: string | null
    companyProfile?: string | null
    address?: string | null
    companySize?: string | null
    companyLogo?: string | null
    jobs?: JobCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateInput = {
    companyID?: number
    companyName: string
    companyWebsite?: string | null
    companyProfile?: string | null
    address?: string | null
    companySize?: string | null
    companyLogo?: string | null
    jobs?: JobUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUpdateInput = {
    companyName?: StringFieldUpdateOperationsInput | string
    companyWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    companyProfile?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableStringFieldUpdateOperationsInput | string | null
    companyLogo?: NullableStringFieldUpdateOperationsInput | string | null
    jobs?: JobUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateInput = {
    companyID?: IntFieldUpdateOperationsInput | number
    companyName?: StringFieldUpdateOperationsInput | string
    companyWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    companyProfile?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableStringFieldUpdateOperationsInput | string | null
    companyLogo?: NullableStringFieldUpdateOperationsInput | string | null
    jobs?: JobUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyCreateManyInput = {
    companyID?: number
    companyName: string
    companyWebsite?: string | null
    companyProfile?: string | null
    address?: string | null
    companySize?: string | null
    companyLogo?: string | null
  }

  export type CompanyUpdateManyMutationInput = {
    companyName?: StringFieldUpdateOperationsInput | string
    companyWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    companyProfile?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableStringFieldUpdateOperationsInput | string | null
    companyLogo?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CompanyUncheckedUpdateManyInput = {
    companyID?: IntFieldUpdateOperationsInput | number
    companyName?: StringFieldUpdateOperationsInput | string
    companyWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    companyProfile?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableStringFieldUpdateOperationsInput | string | null
    companyLogo?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type JobCreateInput = {
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    company: CompanyCreateNestedOneWithoutJobsInput
    industry?: IndustryCreateNestedOneWithoutJobsInput
    skills?: JobSkillCreateNestedManyWithoutJobInput
    savedJobs?: SavedJobCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateInput = {
    jobID?: number
    companyID: number
    industryID?: number | null
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    skills?: JobSkillUncheckedCreateNestedManyWithoutJobInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryUncheckedCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingUncheckedCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobUpdateInput = {
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    company?: CompanyUpdateOneRequiredWithoutJobsNestedInput
    industry?: IndustryUpdateOneWithoutJobsNestedInput
    skills?: JobSkillUpdateManyWithoutJobNestedInput
    savedJobs?: SavedJobUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateInput = {
    jobID?: IntFieldUpdateOperationsInput | number
    companyID?: IntFieldUpdateOperationsInput | number
    industryID?: NullableIntFieldUpdateOperationsInput | number | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    skills?: JobSkillUncheckedUpdateManyWithoutJobNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUncheckedUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUncheckedUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUncheckedUpdateManyWithoutJobNestedInput
  }

  export type JobCreateManyInput = {
    jobID?: number
    companyID: number
    industryID?: number | null
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
  }

  export type JobUpdateManyMutationInput = {
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type JobUncheckedUpdateManyInput = {
    jobID?: IntFieldUpdateOperationsInput | number
    companyID?: IntFieldUpdateOperationsInput | number
    industryID?: NullableIntFieldUpdateOperationsInput | number | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type JobRecommendationCreateInput = {
    matchPercent: number
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutJobRecommendationsInput
    job: JobCreateNestedOneWithoutRecommendationsInput
  }

  export type JobRecommendationUncheckedCreateInput = {
    id?: number
    userID: number
    jobID: number
    matchPercent: number
    createdAt?: Date | string
  }

  export type JobRecommendationUpdateInput = {
    matchPercent?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutJobRecommendationsNestedInput
    job?: JobUpdateOneRequiredWithoutRecommendationsNestedInput
  }

  export type JobRecommendationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    matchPercent?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobRecommendationCreateManyInput = {
    id?: number
    userID: number
    jobID: number
    matchPercent: number
    createdAt?: Date | string
  }

  export type JobRecommendationUpdateManyMutationInput = {
    matchPercent?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobRecommendationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    matchPercent?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobSkillCreateInput = {
    job: JobCreateNestedOneWithoutSkillsInput
    skill: SkillCreateNestedOneWithoutJobsInput
  }

  export type JobSkillUncheckedCreateInput = {
    id?: number
    jobID: number
    skillID: number
  }

  export type JobSkillUpdateInput = {
    job?: JobUpdateOneRequiredWithoutSkillsNestedInput
    skill?: SkillUpdateOneRequiredWithoutJobsNestedInput
  }

  export type JobSkillUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    skillID?: IntFieldUpdateOperationsInput | number
  }

  export type JobSkillCreateManyInput = {
    id?: number
    jobID: number
    skillID: number
  }

  export type JobSkillUpdateManyMutationInput = {

  }

  export type JobSkillUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    skillID?: IntFieldUpdateOperationsInput | number
  }

  export type SavedJobCreateInput = {
    savedAt?: Date | string
    user: UserCreateNestedOneWithoutSavedJobsInput
    job: JobCreateNestedOneWithoutSavedJobsInput
  }

  export type SavedJobUncheckedCreateInput = {
    id?: number
    userID: number
    jobID: number
    savedAt?: Date | string
  }

  export type SavedJobUpdateInput = {
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSavedJobsNestedInput
    job?: JobUpdateOneRequiredWithoutSavedJobsNestedInput
  }

  export type SavedJobUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedJobCreateManyInput = {
    id?: number
    userID: number
    jobID: number
    savedAt?: Date | string
  }

  export type SavedJobUpdateManyMutationInput = {
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedJobUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndustryCreateInput = {
    name: string
    skills?: SkillCreateNestedManyWithoutIndustryInput
    jobs?: JobCreateNestedManyWithoutIndustryInput
    userProfiles?: UserProfileCreateNestedManyWithoutIndustryInput
  }

  export type IndustryUncheckedCreateInput = {
    id?: number
    name: string
    skills?: SkillUncheckedCreateNestedManyWithoutIndustryInput
    jobs?: JobUncheckedCreateNestedManyWithoutIndustryInput
    userProfiles?: UserProfileUncheckedCreateNestedManyWithoutIndustryInput
  }

  export type IndustryUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    skills?: SkillUpdateManyWithoutIndustryNestedInput
    jobs?: JobUpdateManyWithoutIndustryNestedInput
    userProfiles?: UserProfileUpdateManyWithoutIndustryNestedInput
  }

  export type IndustryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    skills?: SkillUncheckedUpdateManyWithoutIndustryNestedInput
    jobs?: JobUncheckedUpdateManyWithoutIndustryNestedInput
    userProfiles?: UserProfileUncheckedUpdateManyWithoutIndustryNestedInput
  }

  export type IndustryCreateManyInput = {
    id?: number
    name: string
  }

  export type IndustryUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type IndustryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type SkillCreateInput = {
    name: string
    industry: IndustryCreateNestedOneWithoutSkillsInput
    users?: UserSkillCreateNestedManyWithoutSkillInput
    jobs?: JobSkillCreateNestedManyWithoutSkillInput
  }

  export type SkillUncheckedCreateInput = {
    skillID?: number
    industryID: number
    name: string
    users?: UserSkillUncheckedCreateNestedManyWithoutSkillInput
    jobs?: JobSkillUncheckedCreateNestedManyWithoutSkillInput
  }

  export type SkillUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    industry?: IndustryUpdateOneRequiredWithoutSkillsNestedInput
    users?: UserSkillUpdateManyWithoutSkillNestedInput
    jobs?: JobSkillUpdateManyWithoutSkillNestedInput
  }

  export type SkillUncheckedUpdateInput = {
    skillID?: IntFieldUpdateOperationsInput | number
    industryID?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    users?: UserSkillUncheckedUpdateManyWithoutSkillNestedInput
    jobs?: JobSkillUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type SkillCreateManyInput = {
    skillID?: number
    industryID: number
    name: string
  }

  export type SkillUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type SkillUncheckedUpdateManyInput = {
    skillID?: IntFieldUpdateOperationsInput | number
    industryID?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type UserBehaviorCreateInput = {
    action: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutBehaviorsInput
    job: JobCreateNestedOneWithoutBehaviorsInput
  }

  export type UserBehaviorUncheckedCreateInput = {
    id?: number
    userID: number
    jobID: number
    action: string
    createdAt?: Date | string
  }

  export type UserBehaviorUpdateInput = {
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBehaviorsNestedInput
    job?: JobUpdateOneRequiredWithoutBehaviorsNestedInput
  }

  export type UserBehaviorUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBehaviorCreateManyInput = {
    id?: number
    userID: number
    jobID: number
    action: string
    createdAt?: Date | string
  }

  export type UserBehaviorUpdateManyMutationInput = {
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBehaviorUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplyHistoryCreateInput = {
    status: string
    appliedAt?: Date | string
    user: UserCreateNestedOneWithoutApplicationsInput
    job: JobCreateNestedOneWithoutApplyHistoriesInput
    cv: CVCreateNestedOneWithoutApplicationsInput
  }

  export type ApplyHistoryUncheckedCreateInput = {
    id?: number
    userID: number
    jobID: number
    cvID: number
    status: string
    appliedAt?: Date | string
  }

  export type ApplyHistoryUpdateInput = {
    status?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutApplicationsNestedInput
    job?: JobUpdateOneRequiredWithoutApplyHistoriesNestedInput
    cv?: CVUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type ApplyHistoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    cvID?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplyHistoryCreateManyInput = {
    id?: number
    userID: number
    jobID: number
    cvID: number
    status: string
    appliedAt?: Date | string
  }

  export type ApplyHistoryUpdateManyMutationInput = {
    status?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplyHistoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    cvID?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobSourceTrackingCreateInput = {
    platform: string
    externalJobID: string
    crawledAt?: Date | string
    job: JobCreateNestedOneWithoutSourceTrackingsInput
  }

  export type JobSourceTrackingUncheckedCreateInput = {
    id?: number
    jobID: number
    platform: string
    externalJobID: string
    crawledAt?: Date | string
  }

  export type JobSourceTrackingUpdateInput = {
    platform?: StringFieldUpdateOperationsInput | string
    externalJobID?: StringFieldUpdateOperationsInput | string
    crawledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: JobUpdateOneRequiredWithoutSourceTrackingsNestedInput
  }

  export type JobSourceTrackingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    platform?: StringFieldUpdateOperationsInput | string
    externalJobID?: StringFieldUpdateOperationsInput | string
    crawledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobSourceTrackingCreateManyInput = {
    id?: number
    jobID: number
    platform: string
    externalJobID: string
    crawledAt?: Date | string
  }

  export type JobSourceTrackingUpdateManyMutationInput = {
    platform?: StringFieldUpdateOperationsInput | string
    externalJobID?: StringFieldUpdateOperationsInput | string
    crawledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobSourceTrackingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    platform?: StringFieldUpdateOperationsInput | string
    externalJobID?: StringFieldUpdateOperationsInput | string
    crawledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type AccountCountOrderByAggregateInput = {
    accountID?: SortOrder
    email?: SortOrder
    password?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
    active?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    accountID?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    accountID?: SortOrder
    email?: SortOrder
    password?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
    active?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    accountID?: SortOrder
    email?: SortOrder
    password?: SortOrder
    provider?: SortOrder
    createdAt?: SortOrder
    active?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    accountID?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type AccountRelationFilter = {
    is?: AccountWhereInput
    isNot?: AccountWhereInput
  }

  export type UserProfileListRelationFilter = {
    every?: UserProfileWhereInput
    some?: UserProfileWhereInput
    none?: UserProfileWhereInput
  }

  export type UserSkillListRelationFilter = {
    every?: UserSkillWhereInput
    some?: UserSkillWhereInput
    none?: UserSkillWhereInput
  }

  export type CVListRelationFilter = {
    every?: CVWhereInput
    some?: CVWhereInput
    none?: CVWhereInput
  }

  export type SavedJobListRelationFilter = {
    every?: SavedJobWhereInput
    some?: SavedJobWhereInput
    none?: SavedJobWhereInput
  }

  export type UserBehaviorListRelationFilter = {
    every?: UserBehaviorWhereInput
    some?: UserBehaviorWhereInput
    none?: UserBehaviorWhereInput
  }

  export type ApplyHistoryListRelationFilter = {
    every?: ApplyHistoryWhereInput
    some?: ApplyHistoryWhereInput
    none?: ApplyHistoryWhereInput
  }

  export type JobRecommendationListRelationFilter = {
    every?: JobRecommendationWhereInput
    some?: JobRecommendationWhereInput
    none?: JobRecommendationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserProfileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserSkillOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CVOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SavedJobOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserBehaviorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ApplyHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JobRecommendationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    userID?: SortOrder
    fullName?: SortOrder
    birthYear?: SortOrder
    phone?: SortOrder
    gender?: SortOrder
    address?: SortOrder
    accountID?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    userID?: SortOrder
    birthYear?: SortOrder
    accountID?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    userID?: SortOrder
    fullName?: SortOrder
    birthYear?: SortOrder
    phone?: SortOrder
    gender?: SortOrder
    address?: SortOrder
    accountID?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    userID?: SortOrder
    fullName?: SortOrder
    birthYear?: SortOrder
    phone?: SortOrder
    gender?: SortOrder
    address?: SortOrder
    accountID?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    userID?: SortOrder
    birthYear?: SortOrder
    accountID?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type IndustryNullableRelationFilter = {
    is?: IndustryWhereInput | null
    isNot?: IndustryWhereInput | null
  }

  export type UserProfileCountOrderByAggregateInput = {
    id?: SortOrder
    jobTitle?: SortOrder
    experienceYear?: SortOrder
    careerLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userID?: SortOrder
    industryID?: SortOrder
  }

  export type UserProfileAvgOrderByAggregateInput = {
    id?: SortOrder
    experienceYear?: SortOrder
    userID?: SortOrder
    industryID?: SortOrder
  }

  export type UserProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    jobTitle?: SortOrder
    experienceYear?: SortOrder
    careerLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userID?: SortOrder
    industryID?: SortOrder
  }

  export type UserProfileMinOrderByAggregateInput = {
    id?: SortOrder
    jobTitle?: SortOrder
    experienceYear?: SortOrder
    careerLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userID?: SortOrder
    industryID?: SortOrder
  }

  export type UserProfileSumOrderByAggregateInput = {
    id?: SortOrder
    experienceYear?: SortOrder
    userID?: SortOrder
    industryID?: SortOrder
  }

  export type SkillRelationFilter = {
    is?: SkillWhereInput
    isNot?: SkillWhereInput
  }

  export type UserSkillCountOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    skillID?: SortOrder
  }

  export type UserSkillAvgOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    skillID?: SortOrder
  }

  export type UserSkillMaxOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    skillID?: SortOrder
  }

  export type UserSkillMinOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    skillID?: SortOrder
  }

  export type UserSkillSumOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    skillID?: SortOrder
  }

  export type CVCountOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    title?: SortOrder
  }

  export type CVAvgOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
  }

  export type CVMaxOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    title?: SortOrder
  }

  export type CVMinOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    title?: SortOrder
  }

  export type CVSumOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
  }

  export type JobListRelationFilter = {
    every?: JobWhereInput
    some?: JobWhereInput
    none?: JobWhereInput
  }

  export type JobOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CompanyCountOrderByAggregateInput = {
    companyID?: SortOrder
    companyName?: SortOrder
    companyWebsite?: SortOrder
    companyProfile?: SortOrder
    address?: SortOrder
    companySize?: SortOrder
    companyLogo?: SortOrder
  }

  export type CompanyAvgOrderByAggregateInput = {
    companyID?: SortOrder
  }

  export type CompanyMaxOrderByAggregateInput = {
    companyID?: SortOrder
    companyName?: SortOrder
    companyWebsite?: SortOrder
    companyProfile?: SortOrder
    address?: SortOrder
    companySize?: SortOrder
    companyLogo?: SortOrder
  }

  export type CompanyMinOrderByAggregateInput = {
    companyID?: SortOrder
    companyName?: SortOrder
    companyWebsite?: SortOrder
    companyProfile?: SortOrder
    address?: SortOrder
    companySize?: SortOrder
    companyLogo?: SortOrder
  }

  export type CompanySumOrderByAggregateInput = {
    companyID?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type CompanyRelationFilter = {
    is?: CompanyWhereInput
    isNot?: CompanyWhereInput
  }

  export type JobSkillListRelationFilter = {
    every?: JobSkillWhereInput
    some?: JobSkillWhereInput
    none?: JobSkillWhereInput
  }

  export type JobSourceTrackingListRelationFilter = {
    every?: JobSourceTrackingWhereInput
    some?: JobSourceTrackingWhereInput
    none?: JobSourceTrackingWhereInput
  }

  export type JobSkillOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JobSourceTrackingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JobCountOrderByAggregateInput = {
    jobID?: SortOrder
    companyID?: SortOrder
    industryID?: SortOrder
    title?: SortOrder
    location?: SortOrder
    salary?: SortOrder
    description?: SortOrder
    requirement?: SortOrder
    benefit?: SortOrder
    jobType?: SortOrder
    workingTime?: SortOrder
    experienceYear?: SortOrder
    postedAt?: SortOrder
    deadline?: SortOrder
    sourcePlatform?: SortOrder
    sourceLink?: SortOrder
    isActive?: SortOrder
  }

  export type JobAvgOrderByAggregateInput = {
    jobID?: SortOrder
    companyID?: SortOrder
    industryID?: SortOrder
    experienceYear?: SortOrder
  }

  export type JobMaxOrderByAggregateInput = {
    jobID?: SortOrder
    companyID?: SortOrder
    industryID?: SortOrder
    title?: SortOrder
    location?: SortOrder
    salary?: SortOrder
    description?: SortOrder
    requirement?: SortOrder
    benefit?: SortOrder
    jobType?: SortOrder
    workingTime?: SortOrder
    experienceYear?: SortOrder
    postedAt?: SortOrder
    deadline?: SortOrder
    sourcePlatform?: SortOrder
    sourceLink?: SortOrder
    isActive?: SortOrder
  }

  export type JobMinOrderByAggregateInput = {
    jobID?: SortOrder
    companyID?: SortOrder
    industryID?: SortOrder
    title?: SortOrder
    location?: SortOrder
    salary?: SortOrder
    description?: SortOrder
    requirement?: SortOrder
    benefit?: SortOrder
    jobType?: SortOrder
    workingTime?: SortOrder
    experienceYear?: SortOrder
    postedAt?: SortOrder
    deadline?: SortOrder
    sourcePlatform?: SortOrder
    sourceLink?: SortOrder
    isActive?: SortOrder
  }

  export type JobSumOrderByAggregateInput = {
    jobID?: SortOrder
    companyID?: SortOrder
    industryID?: SortOrder
    experienceYear?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type JobRelationFilter = {
    is?: JobWhereInput
    isNot?: JobWhereInput
  }

  export type JobRecommendationUserIDJobIDCompoundUniqueInput = {
    userID: number
    jobID: number
  }

  export type JobRecommendationCountOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    matchPercent?: SortOrder
    createdAt?: SortOrder
  }

  export type JobRecommendationAvgOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    matchPercent?: SortOrder
  }

  export type JobRecommendationMaxOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    matchPercent?: SortOrder
    createdAt?: SortOrder
  }

  export type JobRecommendationMinOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    matchPercent?: SortOrder
    createdAt?: SortOrder
  }

  export type JobRecommendationSumOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    matchPercent?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type JobSkillCountOrderByAggregateInput = {
    id?: SortOrder
    jobID?: SortOrder
    skillID?: SortOrder
  }

  export type JobSkillAvgOrderByAggregateInput = {
    id?: SortOrder
    jobID?: SortOrder
    skillID?: SortOrder
  }

  export type JobSkillMaxOrderByAggregateInput = {
    id?: SortOrder
    jobID?: SortOrder
    skillID?: SortOrder
  }

  export type JobSkillMinOrderByAggregateInput = {
    id?: SortOrder
    jobID?: SortOrder
    skillID?: SortOrder
  }

  export type JobSkillSumOrderByAggregateInput = {
    id?: SortOrder
    jobID?: SortOrder
    skillID?: SortOrder
  }

  export type SavedJobCountOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    savedAt?: SortOrder
  }

  export type SavedJobAvgOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
  }

  export type SavedJobMaxOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    savedAt?: SortOrder
  }

  export type SavedJobMinOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    savedAt?: SortOrder
  }

  export type SavedJobSumOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
  }

  export type SkillListRelationFilter = {
    every?: SkillWhereInput
    some?: SkillWhereInput
    none?: SkillWhereInput
  }

  export type SkillOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type IndustryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type IndustryAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IndustryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type IndustryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type IndustrySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IndustryRelationFilter = {
    is?: IndustryWhereInput
    isNot?: IndustryWhereInput
  }

  export type SkillCountOrderByAggregateInput = {
    skillID?: SortOrder
    industryID?: SortOrder
    name?: SortOrder
  }

  export type SkillAvgOrderByAggregateInput = {
    skillID?: SortOrder
    industryID?: SortOrder
  }

  export type SkillMaxOrderByAggregateInput = {
    skillID?: SortOrder
    industryID?: SortOrder
    name?: SortOrder
  }

  export type SkillMinOrderByAggregateInput = {
    skillID?: SortOrder
    industryID?: SortOrder
    name?: SortOrder
  }

  export type SkillSumOrderByAggregateInput = {
    skillID?: SortOrder
    industryID?: SortOrder
  }

  export type UserBehaviorCountOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type UserBehaviorAvgOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
  }

  export type UserBehaviorMaxOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type UserBehaviorMinOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type UserBehaviorSumOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
  }

  export type CVRelationFilter = {
    is?: CVWhereInput
    isNot?: CVWhereInput
  }

  export type ApplyHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    cvID?: SortOrder
    status?: SortOrder
    appliedAt?: SortOrder
  }

  export type ApplyHistoryAvgOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    cvID?: SortOrder
  }

  export type ApplyHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    cvID?: SortOrder
    status?: SortOrder
    appliedAt?: SortOrder
  }

  export type ApplyHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    cvID?: SortOrder
    status?: SortOrder
    appliedAt?: SortOrder
  }

  export type ApplyHistorySumOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    jobID?: SortOrder
    cvID?: SortOrder
  }

  export type JobSourceTrackingCountOrderByAggregateInput = {
    id?: SortOrder
    jobID?: SortOrder
    platform?: SortOrder
    externalJobID?: SortOrder
    crawledAt?: SortOrder
  }

  export type JobSourceTrackingAvgOrderByAggregateInput = {
    id?: SortOrder
    jobID?: SortOrder
  }

  export type JobSourceTrackingMaxOrderByAggregateInput = {
    id?: SortOrder
    jobID?: SortOrder
    platform?: SortOrder
    externalJobID?: SortOrder
    crawledAt?: SortOrder
  }

  export type JobSourceTrackingMinOrderByAggregateInput = {
    id?: SortOrder
    jobID?: SortOrder
    platform?: SortOrder
    externalJobID?: SortOrder
    crawledAt?: SortOrder
  }

  export type JobSourceTrackingSumOrderByAggregateInput = {
    id?: SortOrder
    jobID?: SortOrder
  }

  export type UserCreateNestedOneWithoutAccountInput = {
    create?: XOR<UserCreateWithoutAccountInput, UserUncheckedCreateWithoutAccountInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountInput
    connect?: UserWhereUniqueInput
  }

  export type UserUncheckedCreateNestedOneWithoutAccountInput = {
    create?: XOR<UserCreateWithoutAccountInput, UserUncheckedCreateWithoutAccountInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountInput
    connect?: UserWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneWithoutAccountNestedInput = {
    create?: XOR<UserCreateWithoutAccountInput, UserUncheckedCreateWithoutAccountInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountInput
    upsert?: UserUpsertWithoutAccountInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountInput, UserUpdateWithoutAccountInput>, UserUncheckedUpdateWithoutAccountInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUncheckedUpdateOneWithoutAccountNestedInput = {
    create?: XOR<UserCreateWithoutAccountInput, UserUncheckedCreateWithoutAccountInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountInput
    upsert?: UserUpsertWithoutAccountInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountInput, UserUpdateWithoutAccountInput>, UserUncheckedUpdateWithoutAccountInput>
  }

  export type AccountCreateNestedOneWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput
    connect?: AccountWhereUniqueInput
  }

  export type UserProfileCreateNestedManyWithoutUserInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput> | UserProfileCreateWithoutUserInput[] | UserProfileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput | UserProfileCreateOrConnectWithoutUserInput[]
    createMany?: UserProfileCreateManyUserInputEnvelope
    connect?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
  }

  export type UserSkillCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSkillCreateWithoutUserInput, UserSkillUncheckedCreateWithoutUserInput> | UserSkillCreateWithoutUserInput[] | UserSkillUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSkillCreateOrConnectWithoutUserInput | UserSkillCreateOrConnectWithoutUserInput[]
    createMany?: UserSkillCreateManyUserInputEnvelope
    connect?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
  }

  export type CVCreateNestedManyWithoutUserInput = {
    create?: XOR<CVCreateWithoutUserInput, CVUncheckedCreateWithoutUserInput> | CVCreateWithoutUserInput[] | CVUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CVCreateOrConnectWithoutUserInput | CVCreateOrConnectWithoutUserInput[]
    createMany?: CVCreateManyUserInputEnvelope
    connect?: CVWhereUniqueInput | CVWhereUniqueInput[]
  }

  export type SavedJobCreateNestedManyWithoutUserInput = {
    create?: XOR<SavedJobCreateWithoutUserInput, SavedJobUncheckedCreateWithoutUserInput> | SavedJobCreateWithoutUserInput[] | SavedJobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutUserInput | SavedJobCreateOrConnectWithoutUserInput[]
    createMany?: SavedJobCreateManyUserInputEnvelope
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
  }

  export type UserBehaviorCreateNestedManyWithoutUserInput = {
    create?: XOR<UserBehaviorCreateWithoutUserInput, UserBehaviorUncheckedCreateWithoutUserInput> | UserBehaviorCreateWithoutUserInput[] | UserBehaviorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBehaviorCreateOrConnectWithoutUserInput | UserBehaviorCreateOrConnectWithoutUserInput[]
    createMany?: UserBehaviorCreateManyUserInputEnvelope
    connect?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
  }

  export type ApplyHistoryCreateNestedManyWithoutUserInput = {
    create?: XOR<ApplyHistoryCreateWithoutUserInput, ApplyHistoryUncheckedCreateWithoutUserInput> | ApplyHistoryCreateWithoutUserInput[] | ApplyHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplyHistoryCreateOrConnectWithoutUserInput | ApplyHistoryCreateOrConnectWithoutUserInput[]
    createMany?: ApplyHistoryCreateManyUserInputEnvelope
    connect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
  }

  export type JobRecommendationCreateNestedManyWithoutUserInput = {
    create?: XOR<JobRecommendationCreateWithoutUserInput, JobRecommendationUncheckedCreateWithoutUserInput> | JobRecommendationCreateWithoutUserInput[] | JobRecommendationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JobRecommendationCreateOrConnectWithoutUserInput | JobRecommendationCreateOrConnectWithoutUserInput[]
    createMany?: JobRecommendationCreateManyUserInputEnvelope
    connect?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
  }

  export type UserProfileUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput> | UserProfileCreateWithoutUserInput[] | UserProfileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput | UserProfileCreateOrConnectWithoutUserInput[]
    createMany?: UserProfileCreateManyUserInputEnvelope
    connect?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
  }

  export type UserSkillUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSkillCreateWithoutUserInput, UserSkillUncheckedCreateWithoutUserInput> | UserSkillCreateWithoutUserInput[] | UserSkillUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSkillCreateOrConnectWithoutUserInput | UserSkillCreateOrConnectWithoutUserInput[]
    createMany?: UserSkillCreateManyUserInputEnvelope
    connect?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
  }

  export type CVUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CVCreateWithoutUserInput, CVUncheckedCreateWithoutUserInput> | CVCreateWithoutUserInput[] | CVUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CVCreateOrConnectWithoutUserInput | CVCreateOrConnectWithoutUserInput[]
    createMany?: CVCreateManyUserInputEnvelope
    connect?: CVWhereUniqueInput | CVWhereUniqueInput[]
  }

  export type SavedJobUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SavedJobCreateWithoutUserInput, SavedJobUncheckedCreateWithoutUserInput> | SavedJobCreateWithoutUserInput[] | SavedJobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutUserInput | SavedJobCreateOrConnectWithoutUserInput[]
    createMany?: SavedJobCreateManyUserInputEnvelope
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
  }

  export type UserBehaviorUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserBehaviorCreateWithoutUserInput, UserBehaviorUncheckedCreateWithoutUserInput> | UserBehaviorCreateWithoutUserInput[] | UserBehaviorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBehaviorCreateOrConnectWithoutUserInput | UserBehaviorCreateOrConnectWithoutUserInput[]
    createMany?: UserBehaviorCreateManyUserInputEnvelope
    connect?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
  }

  export type ApplyHistoryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ApplyHistoryCreateWithoutUserInput, ApplyHistoryUncheckedCreateWithoutUserInput> | ApplyHistoryCreateWithoutUserInput[] | ApplyHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplyHistoryCreateOrConnectWithoutUserInput | ApplyHistoryCreateOrConnectWithoutUserInput[]
    createMany?: ApplyHistoryCreateManyUserInputEnvelope
    connect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
  }

  export type JobRecommendationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<JobRecommendationCreateWithoutUserInput, JobRecommendationUncheckedCreateWithoutUserInput> | JobRecommendationCreateWithoutUserInput[] | JobRecommendationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JobRecommendationCreateOrConnectWithoutUserInput | JobRecommendationCreateOrConnectWithoutUserInput[]
    createMany?: JobRecommendationCreateManyUserInputEnvelope
    connect?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AccountUpdateOneRequiredWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput
    upsert?: AccountUpsertWithoutUserInput
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutUserInput, AccountUpdateWithoutUserInput>, AccountUncheckedUpdateWithoutUserInput>
  }

  export type UserProfileUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput> | UserProfileCreateWithoutUserInput[] | UserProfileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput | UserProfileCreateOrConnectWithoutUserInput[]
    upsert?: UserProfileUpsertWithWhereUniqueWithoutUserInput | UserProfileUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserProfileCreateManyUserInputEnvelope
    set?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    disconnect?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    delete?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    connect?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    update?: UserProfileUpdateWithWhereUniqueWithoutUserInput | UserProfileUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserProfileUpdateManyWithWhereWithoutUserInput | UserProfileUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserProfileScalarWhereInput | UserProfileScalarWhereInput[]
  }

  export type UserSkillUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSkillCreateWithoutUserInput, UserSkillUncheckedCreateWithoutUserInput> | UserSkillCreateWithoutUserInput[] | UserSkillUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSkillCreateOrConnectWithoutUserInput | UserSkillCreateOrConnectWithoutUserInput[]
    upsert?: UserSkillUpsertWithWhereUniqueWithoutUserInput | UserSkillUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSkillCreateManyUserInputEnvelope
    set?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    disconnect?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    delete?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    connect?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    update?: UserSkillUpdateWithWhereUniqueWithoutUserInput | UserSkillUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSkillUpdateManyWithWhereWithoutUserInput | UserSkillUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSkillScalarWhereInput | UserSkillScalarWhereInput[]
  }

  export type CVUpdateManyWithoutUserNestedInput = {
    create?: XOR<CVCreateWithoutUserInput, CVUncheckedCreateWithoutUserInput> | CVCreateWithoutUserInput[] | CVUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CVCreateOrConnectWithoutUserInput | CVCreateOrConnectWithoutUserInput[]
    upsert?: CVUpsertWithWhereUniqueWithoutUserInput | CVUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CVCreateManyUserInputEnvelope
    set?: CVWhereUniqueInput | CVWhereUniqueInput[]
    disconnect?: CVWhereUniqueInput | CVWhereUniqueInput[]
    delete?: CVWhereUniqueInput | CVWhereUniqueInput[]
    connect?: CVWhereUniqueInput | CVWhereUniqueInput[]
    update?: CVUpdateWithWhereUniqueWithoutUserInput | CVUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CVUpdateManyWithWhereWithoutUserInput | CVUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CVScalarWhereInput | CVScalarWhereInput[]
  }

  export type SavedJobUpdateManyWithoutUserNestedInput = {
    create?: XOR<SavedJobCreateWithoutUserInput, SavedJobUncheckedCreateWithoutUserInput> | SavedJobCreateWithoutUserInput[] | SavedJobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutUserInput | SavedJobCreateOrConnectWithoutUserInput[]
    upsert?: SavedJobUpsertWithWhereUniqueWithoutUserInput | SavedJobUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SavedJobCreateManyUserInputEnvelope
    set?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    disconnect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    delete?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    update?: SavedJobUpdateWithWhereUniqueWithoutUserInput | SavedJobUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SavedJobUpdateManyWithWhereWithoutUserInput | SavedJobUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SavedJobScalarWhereInput | SavedJobScalarWhereInput[]
  }

  export type UserBehaviorUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserBehaviorCreateWithoutUserInput, UserBehaviorUncheckedCreateWithoutUserInput> | UserBehaviorCreateWithoutUserInput[] | UserBehaviorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBehaviorCreateOrConnectWithoutUserInput | UserBehaviorCreateOrConnectWithoutUserInput[]
    upsert?: UserBehaviorUpsertWithWhereUniqueWithoutUserInput | UserBehaviorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserBehaviorCreateManyUserInputEnvelope
    set?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    disconnect?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    delete?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    connect?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    update?: UserBehaviorUpdateWithWhereUniqueWithoutUserInput | UserBehaviorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserBehaviorUpdateManyWithWhereWithoutUserInput | UserBehaviorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserBehaviorScalarWhereInput | UserBehaviorScalarWhereInput[]
  }

  export type ApplyHistoryUpdateManyWithoutUserNestedInput = {
    create?: XOR<ApplyHistoryCreateWithoutUserInput, ApplyHistoryUncheckedCreateWithoutUserInput> | ApplyHistoryCreateWithoutUserInput[] | ApplyHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplyHistoryCreateOrConnectWithoutUserInput | ApplyHistoryCreateOrConnectWithoutUserInput[]
    upsert?: ApplyHistoryUpsertWithWhereUniqueWithoutUserInput | ApplyHistoryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ApplyHistoryCreateManyUserInputEnvelope
    set?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    disconnect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    delete?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    connect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    update?: ApplyHistoryUpdateWithWhereUniqueWithoutUserInput | ApplyHistoryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ApplyHistoryUpdateManyWithWhereWithoutUserInput | ApplyHistoryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ApplyHistoryScalarWhereInput | ApplyHistoryScalarWhereInput[]
  }

  export type JobRecommendationUpdateManyWithoutUserNestedInput = {
    create?: XOR<JobRecommendationCreateWithoutUserInput, JobRecommendationUncheckedCreateWithoutUserInput> | JobRecommendationCreateWithoutUserInput[] | JobRecommendationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JobRecommendationCreateOrConnectWithoutUserInput | JobRecommendationCreateOrConnectWithoutUserInput[]
    upsert?: JobRecommendationUpsertWithWhereUniqueWithoutUserInput | JobRecommendationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: JobRecommendationCreateManyUserInputEnvelope
    set?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    disconnect?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    delete?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    connect?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    update?: JobRecommendationUpdateWithWhereUniqueWithoutUserInput | JobRecommendationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: JobRecommendationUpdateManyWithWhereWithoutUserInput | JobRecommendationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: JobRecommendationScalarWhereInput | JobRecommendationScalarWhereInput[]
  }

  export type UserProfileUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput> | UserProfileCreateWithoutUserInput[] | UserProfileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput | UserProfileCreateOrConnectWithoutUserInput[]
    upsert?: UserProfileUpsertWithWhereUniqueWithoutUserInput | UserProfileUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserProfileCreateManyUserInputEnvelope
    set?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    disconnect?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    delete?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    connect?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    update?: UserProfileUpdateWithWhereUniqueWithoutUserInput | UserProfileUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserProfileUpdateManyWithWhereWithoutUserInput | UserProfileUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserProfileScalarWhereInput | UserProfileScalarWhereInput[]
  }

  export type UserSkillUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSkillCreateWithoutUserInput, UserSkillUncheckedCreateWithoutUserInput> | UserSkillCreateWithoutUserInput[] | UserSkillUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSkillCreateOrConnectWithoutUserInput | UserSkillCreateOrConnectWithoutUserInput[]
    upsert?: UserSkillUpsertWithWhereUniqueWithoutUserInput | UserSkillUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSkillCreateManyUserInputEnvelope
    set?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    disconnect?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    delete?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    connect?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    update?: UserSkillUpdateWithWhereUniqueWithoutUserInput | UserSkillUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSkillUpdateManyWithWhereWithoutUserInput | UserSkillUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSkillScalarWhereInput | UserSkillScalarWhereInput[]
  }

  export type CVUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CVCreateWithoutUserInput, CVUncheckedCreateWithoutUserInput> | CVCreateWithoutUserInput[] | CVUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CVCreateOrConnectWithoutUserInput | CVCreateOrConnectWithoutUserInput[]
    upsert?: CVUpsertWithWhereUniqueWithoutUserInput | CVUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CVCreateManyUserInputEnvelope
    set?: CVWhereUniqueInput | CVWhereUniqueInput[]
    disconnect?: CVWhereUniqueInput | CVWhereUniqueInput[]
    delete?: CVWhereUniqueInput | CVWhereUniqueInput[]
    connect?: CVWhereUniqueInput | CVWhereUniqueInput[]
    update?: CVUpdateWithWhereUniqueWithoutUserInput | CVUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CVUpdateManyWithWhereWithoutUserInput | CVUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CVScalarWhereInput | CVScalarWhereInput[]
  }

  export type SavedJobUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SavedJobCreateWithoutUserInput, SavedJobUncheckedCreateWithoutUserInput> | SavedJobCreateWithoutUserInput[] | SavedJobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutUserInput | SavedJobCreateOrConnectWithoutUserInput[]
    upsert?: SavedJobUpsertWithWhereUniqueWithoutUserInput | SavedJobUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SavedJobCreateManyUserInputEnvelope
    set?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    disconnect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    delete?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    update?: SavedJobUpdateWithWhereUniqueWithoutUserInput | SavedJobUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SavedJobUpdateManyWithWhereWithoutUserInput | SavedJobUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SavedJobScalarWhereInput | SavedJobScalarWhereInput[]
  }

  export type UserBehaviorUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserBehaviorCreateWithoutUserInput, UserBehaviorUncheckedCreateWithoutUserInput> | UserBehaviorCreateWithoutUserInput[] | UserBehaviorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBehaviorCreateOrConnectWithoutUserInput | UserBehaviorCreateOrConnectWithoutUserInput[]
    upsert?: UserBehaviorUpsertWithWhereUniqueWithoutUserInput | UserBehaviorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserBehaviorCreateManyUserInputEnvelope
    set?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    disconnect?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    delete?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    connect?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    update?: UserBehaviorUpdateWithWhereUniqueWithoutUserInput | UserBehaviorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserBehaviorUpdateManyWithWhereWithoutUserInput | UserBehaviorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserBehaviorScalarWhereInput | UserBehaviorScalarWhereInput[]
  }

  export type ApplyHistoryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ApplyHistoryCreateWithoutUserInput, ApplyHistoryUncheckedCreateWithoutUserInput> | ApplyHistoryCreateWithoutUserInput[] | ApplyHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplyHistoryCreateOrConnectWithoutUserInput | ApplyHistoryCreateOrConnectWithoutUserInput[]
    upsert?: ApplyHistoryUpsertWithWhereUniqueWithoutUserInput | ApplyHistoryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ApplyHistoryCreateManyUserInputEnvelope
    set?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    disconnect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    delete?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    connect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    update?: ApplyHistoryUpdateWithWhereUniqueWithoutUserInput | ApplyHistoryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ApplyHistoryUpdateManyWithWhereWithoutUserInput | ApplyHistoryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ApplyHistoryScalarWhereInput | ApplyHistoryScalarWhereInput[]
  }

  export type JobRecommendationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<JobRecommendationCreateWithoutUserInput, JobRecommendationUncheckedCreateWithoutUserInput> | JobRecommendationCreateWithoutUserInput[] | JobRecommendationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JobRecommendationCreateOrConnectWithoutUserInput | JobRecommendationCreateOrConnectWithoutUserInput[]
    upsert?: JobRecommendationUpsertWithWhereUniqueWithoutUserInput | JobRecommendationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: JobRecommendationCreateManyUserInputEnvelope
    set?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    disconnect?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    delete?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    connect?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    update?: JobRecommendationUpdateWithWhereUniqueWithoutUserInput | JobRecommendationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: JobRecommendationUpdateManyWithWhereWithoutUserInput | JobRecommendationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: JobRecommendationScalarWhereInput | JobRecommendationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutProfilesInput = {
    create?: XOR<UserCreateWithoutProfilesInput, UserUncheckedCreateWithoutProfilesInput>
    connectOrCreate?: UserCreateOrConnectWithoutProfilesInput
    connect?: UserWhereUniqueInput
  }

  export type IndustryCreateNestedOneWithoutUserProfilesInput = {
    create?: XOR<IndustryCreateWithoutUserProfilesInput, IndustryUncheckedCreateWithoutUserProfilesInput>
    connectOrCreate?: IndustryCreateOrConnectWithoutUserProfilesInput
    connect?: IndustryWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutProfilesNestedInput = {
    create?: XOR<UserCreateWithoutProfilesInput, UserUncheckedCreateWithoutProfilesInput>
    connectOrCreate?: UserCreateOrConnectWithoutProfilesInput
    upsert?: UserUpsertWithoutProfilesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProfilesInput, UserUpdateWithoutProfilesInput>, UserUncheckedUpdateWithoutProfilesInput>
  }

  export type IndustryUpdateOneWithoutUserProfilesNestedInput = {
    create?: XOR<IndustryCreateWithoutUserProfilesInput, IndustryUncheckedCreateWithoutUserProfilesInput>
    connectOrCreate?: IndustryCreateOrConnectWithoutUserProfilesInput
    upsert?: IndustryUpsertWithoutUserProfilesInput
    disconnect?: IndustryWhereInput | boolean
    delete?: IndustryWhereInput | boolean
    connect?: IndustryWhereUniqueInput
    update?: XOR<XOR<IndustryUpdateToOneWithWhereWithoutUserProfilesInput, IndustryUpdateWithoutUserProfilesInput>, IndustryUncheckedUpdateWithoutUserProfilesInput>
  }

  export type UserCreateNestedOneWithoutSkillsInput = {
    create?: XOR<UserCreateWithoutSkillsInput, UserUncheckedCreateWithoutSkillsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSkillsInput
    connect?: UserWhereUniqueInput
  }

  export type SkillCreateNestedOneWithoutUsersInput = {
    create?: XOR<SkillCreateWithoutUsersInput, SkillUncheckedCreateWithoutUsersInput>
    connectOrCreate?: SkillCreateOrConnectWithoutUsersInput
    connect?: SkillWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSkillsNestedInput = {
    create?: XOR<UserCreateWithoutSkillsInput, UserUncheckedCreateWithoutSkillsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSkillsInput
    upsert?: UserUpsertWithoutSkillsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSkillsInput, UserUpdateWithoutSkillsInput>, UserUncheckedUpdateWithoutSkillsInput>
  }

  export type SkillUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<SkillCreateWithoutUsersInput, SkillUncheckedCreateWithoutUsersInput>
    connectOrCreate?: SkillCreateOrConnectWithoutUsersInput
    upsert?: SkillUpsertWithoutUsersInput
    connect?: SkillWhereUniqueInput
    update?: XOR<XOR<SkillUpdateToOneWithWhereWithoutUsersInput, SkillUpdateWithoutUsersInput>, SkillUncheckedUpdateWithoutUsersInput>
  }

  export type UserCreateNestedOneWithoutCvsInput = {
    create?: XOR<UserCreateWithoutCvsInput, UserUncheckedCreateWithoutCvsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCvsInput
    connect?: UserWhereUniqueInput
  }

  export type ApplyHistoryCreateNestedManyWithoutCvInput = {
    create?: XOR<ApplyHistoryCreateWithoutCvInput, ApplyHistoryUncheckedCreateWithoutCvInput> | ApplyHistoryCreateWithoutCvInput[] | ApplyHistoryUncheckedCreateWithoutCvInput[]
    connectOrCreate?: ApplyHistoryCreateOrConnectWithoutCvInput | ApplyHistoryCreateOrConnectWithoutCvInput[]
    createMany?: ApplyHistoryCreateManyCvInputEnvelope
    connect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
  }

  export type ApplyHistoryUncheckedCreateNestedManyWithoutCvInput = {
    create?: XOR<ApplyHistoryCreateWithoutCvInput, ApplyHistoryUncheckedCreateWithoutCvInput> | ApplyHistoryCreateWithoutCvInput[] | ApplyHistoryUncheckedCreateWithoutCvInput[]
    connectOrCreate?: ApplyHistoryCreateOrConnectWithoutCvInput | ApplyHistoryCreateOrConnectWithoutCvInput[]
    createMany?: ApplyHistoryCreateManyCvInputEnvelope
    connect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutCvsNestedInput = {
    create?: XOR<UserCreateWithoutCvsInput, UserUncheckedCreateWithoutCvsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCvsInput
    upsert?: UserUpsertWithoutCvsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCvsInput, UserUpdateWithoutCvsInput>, UserUncheckedUpdateWithoutCvsInput>
  }

  export type ApplyHistoryUpdateManyWithoutCvNestedInput = {
    create?: XOR<ApplyHistoryCreateWithoutCvInput, ApplyHistoryUncheckedCreateWithoutCvInput> | ApplyHistoryCreateWithoutCvInput[] | ApplyHistoryUncheckedCreateWithoutCvInput[]
    connectOrCreate?: ApplyHistoryCreateOrConnectWithoutCvInput | ApplyHistoryCreateOrConnectWithoutCvInput[]
    upsert?: ApplyHistoryUpsertWithWhereUniqueWithoutCvInput | ApplyHistoryUpsertWithWhereUniqueWithoutCvInput[]
    createMany?: ApplyHistoryCreateManyCvInputEnvelope
    set?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    disconnect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    delete?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    connect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    update?: ApplyHistoryUpdateWithWhereUniqueWithoutCvInput | ApplyHistoryUpdateWithWhereUniqueWithoutCvInput[]
    updateMany?: ApplyHistoryUpdateManyWithWhereWithoutCvInput | ApplyHistoryUpdateManyWithWhereWithoutCvInput[]
    deleteMany?: ApplyHistoryScalarWhereInput | ApplyHistoryScalarWhereInput[]
  }

  export type ApplyHistoryUncheckedUpdateManyWithoutCvNestedInput = {
    create?: XOR<ApplyHistoryCreateWithoutCvInput, ApplyHistoryUncheckedCreateWithoutCvInput> | ApplyHistoryCreateWithoutCvInput[] | ApplyHistoryUncheckedCreateWithoutCvInput[]
    connectOrCreate?: ApplyHistoryCreateOrConnectWithoutCvInput | ApplyHistoryCreateOrConnectWithoutCvInput[]
    upsert?: ApplyHistoryUpsertWithWhereUniqueWithoutCvInput | ApplyHistoryUpsertWithWhereUniqueWithoutCvInput[]
    createMany?: ApplyHistoryCreateManyCvInputEnvelope
    set?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    disconnect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    delete?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    connect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    update?: ApplyHistoryUpdateWithWhereUniqueWithoutCvInput | ApplyHistoryUpdateWithWhereUniqueWithoutCvInput[]
    updateMany?: ApplyHistoryUpdateManyWithWhereWithoutCvInput | ApplyHistoryUpdateManyWithWhereWithoutCvInput[]
    deleteMany?: ApplyHistoryScalarWhereInput | ApplyHistoryScalarWhereInput[]
  }

  export type JobCreateNestedManyWithoutCompanyInput = {
    create?: XOR<JobCreateWithoutCompanyInput, JobUncheckedCreateWithoutCompanyInput> | JobCreateWithoutCompanyInput[] | JobUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: JobCreateOrConnectWithoutCompanyInput | JobCreateOrConnectWithoutCompanyInput[]
    createMany?: JobCreateManyCompanyInputEnvelope
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
  }

  export type JobUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<JobCreateWithoutCompanyInput, JobUncheckedCreateWithoutCompanyInput> | JobCreateWithoutCompanyInput[] | JobUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: JobCreateOrConnectWithoutCompanyInput | JobCreateOrConnectWithoutCompanyInput[]
    createMany?: JobCreateManyCompanyInputEnvelope
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
  }

  export type JobUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<JobCreateWithoutCompanyInput, JobUncheckedCreateWithoutCompanyInput> | JobCreateWithoutCompanyInput[] | JobUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: JobCreateOrConnectWithoutCompanyInput | JobCreateOrConnectWithoutCompanyInput[]
    upsert?: JobUpsertWithWhereUniqueWithoutCompanyInput | JobUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: JobCreateManyCompanyInputEnvelope
    set?: JobWhereUniqueInput | JobWhereUniqueInput[]
    disconnect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    delete?: JobWhereUniqueInput | JobWhereUniqueInput[]
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    update?: JobUpdateWithWhereUniqueWithoutCompanyInput | JobUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: JobUpdateManyWithWhereWithoutCompanyInput | JobUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: JobScalarWhereInput | JobScalarWhereInput[]
  }

  export type JobUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<JobCreateWithoutCompanyInput, JobUncheckedCreateWithoutCompanyInput> | JobCreateWithoutCompanyInput[] | JobUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: JobCreateOrConnectWithoutCompanyInput | JobCreateOrConnectWithoutCompanyInput[]
    upsert?: JobUpsertWithWhereUniqueWithoutCompanyInput | JobUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: JobCreateManyCompanyInputEnvelope
    set?: JobWhereUniqueInput | JobWhereUniqueInput[]
    disconnect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    delete?: JobWhereUniqueInput | JobWhereUniqueInput[]
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    update?: JobUpdateWithWhereUniqueWithoutCompanyInput | JobUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: JobUpdateManyWithWhereWithoutCompanyInput | JobUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: JobScalarWhereInput | JobScalarWhereInput[]
  }

  export type CompanyCreateNestedOneWithoutJobsInput = {
    create?: XOR<CompanyCreateWithoutJobsInput, CompanyUncheckedCreateWithoutJobsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutJobsInput
    connect?: CompanyWhereUniqueInput
  }

  export type IndustryCreateNestedOneWithoutJobsInput = {
    create?: XOR<IndustryCreateWithoutJobsInput, IndustryUncheckedCreateWithoutJobsInput>
    connectOrCreate?: IndustryCreateOrConnectWithoutJobsInput
    connect?: IndustryWhereUniqueInput
  }

  export type JobSkillCreateNestedManyWithoutJobInput = {
    create?: XOR<JobSkillCreateWithoutJobInput, JobSkillUncheckedCreateWithoutJobInput> | JobSkillCreateWithoutJobInput[] | JobSkillUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobSkillCreateOrConnectWithoutJobInput | JobSkillCreateOrConnectWithoutJobInput[]
    createMany?: JobSkillCreateManyJobInputEnvelope
    connect?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
  }

  export type SavedJobCreateNestedManyWithoutJobInput = {
    create?: XOR<SavedJobCreateWithoutJobInput, SavedJobUncheckedCreateWithoutJobInput> | SavedJobCreateWithoutJobInput[] | SavedJobUncheckedCreateWithoutJobInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutJobInput | SavedJobCreateOrConnectWithoutJobInput[]
    createMany?: SavedJobCreateManyJobInputEnvelope
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
  }

  export type UserBehaviorCreateNestedManyWithoutJobInput = {
    create?: XOR<UserBehaviorCreateWithoutJobInput, UserBehaviorUncheckedCreateWithoutJobInput> | UserBehaviorCreateWithoutJobInput[] | UserBehaviorUncheckedCreateWithoutJobInput[]
    connectOrCreate?: UserBehaviorCreateOrConnectWithoutJobInput | UserBehaviorCreateOrConnectWithoutJobInput[]
    createMany?: UserBehaviorCreateManyJobInputEnvelope
    connect?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
  }

  export type ApplyHistoryCreateNestedManyWithoutJobInput = {
    create?: XOR<ApplyHistoryCreateWithoutJobInput, ApplyHistoryUncheckedCreateWithoutJobInput> | ApplyHistoryCreateWithoutJobInput[] | ApplyHistoryUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplyHistoryCreateOrConnectWithoutJobInput | ApplyHistoryCreateOrConnectWithoutJobInput[]
    createMany?: ApplyHistoryCreateManyJobInputEnvelope
    connect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
  }

  export type JobSourceTrackingCreateNestedManyWithoutJobInput = {
    create?: XOR<JobSourceTrackingCreateWithoutJobInput, JobSourceTrackingUncheckedCreateWithoutJobInput> | JobSourceTrackingCreateWithoutJobInput[] | JobSourceTrackingUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobSourceTrackingCreateOrConnectWithoutJobInput | JobSourceTrackingCreateOrConnectWithoutJobInput[]
    createMany?: JobSourceTrackingCreateManyJobInputEnvelope
    connect?: JobSourceTrackingWhereUniqueInput | JobSourceTrackingWhereUniqueInput[]
  }

  export type JobRecommendationCreateNestedManyWithoutJobInput = {
    create?: XOR<JobRecommendationCreateWithoutJobInput, JobRecommendationUncheckedCreateWithoutJobInput> | JobRecommendationCreateWithoutJobInput[] | JobRecommendationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobRecommendationCreateOrConnectWithoutJobInput | JobRecommendationCreateOrConnectWithoutJobInput[]
    createMany?: JobRecommendationCreateManyJobInputEnvelope
    connect?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
  }

  export type JobSkillUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<JobSkillCreateWithoutJobInput, JobSkillUncheckedCreateWithoutJobInput> | JobSkillCreateWithoutJobInput[] | JobSkillUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobSkillCreateOrConnectWithoutJobInput | JobSkillCreateOrConnectWithoutJobInput[]
    createMany?: JobSkillCreateManyJobInputEnvelope
    connect?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
  }

  export type SavedJobUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<SavedJobCreateWithoutJobInput, SavedJobUncheckedCreateWithoutJobInput> | SavedJobCreateWithoutJobInput[] | SavedJobUncheckedCreateWithoutJobInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutJobInput | SavedJobCreateOrConnectWithoutJobInput[]
    createMany?: SavedJobCreateManyJobInputEnvelope
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
  }

  export type UserBehaviorUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<UserBehaviorCreateWithoutJobInput, UserBehaviorUncheckedCreateWithoutJobInput> | UserBehaviorCreateWithoutJobInput[] | UserBehaviorUncheckedCreateWithoutJobInput[]
    connectOrCreate?: UserBehaviorCreateOrConnectWithoutJobInput | UserBehaviorCreateOrConnectWithoutJobInput[]
    createMany?: UserBehaviorCreateManyJobInputEnvelope
    connect?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
  }

  export type ApplyHistoryUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<ApplyHistoryCreateWithoutJobInput, ApplyHistoryUncheckedCreateWithoutJobInput> | ApplyHistoryCreateWithoutJobInput[] | ApplyHistoryUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplyHistoryCreateOrConnectWithoutJobInput | ApplyHistoryCreateOrConnectWithoutJobInput[]
    createMany?: ApplyHistoryCreateManyJobInputEnvelope
    connect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
  }

  export type JobSourceTrackingUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<JobSourceTrackingCreateWithoutJobInput, JobSourceTrackingUncheckedCreateWithoutJobInput> | JobSourceTrackingCreateWithoutJobInput[] | JobSourceTrackingUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobSourceTrackingCreateOrConnectWithoutJobInput | JobSourceTrackingCreateOrConnectWithoutJobInput[]
    createMany?: JobSourceTrackingCreateManyJobInputEnvelope
    connect?: JobSourceTrackingWhereUniqueInput | JobSourceTrackingWhereUniqueInput[]
  }

  export type JobRecommendationUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<JobRecommendationCreateWithoutJobInput, JobRecommendationUncheckedCreateWithoutJobInput> | JobRecommendationCreateWithoutJobInput[] | JobRecommendationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobRecommendationCreateOrConnectWithoutJobInput | JobRecommendationCreateOrConnectWithoutJobInput[]
    createMany?: JobRecommendationCreateManyJobInputEnvelope
    connect?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type CompanyUpdateOneRequiredWithoutJobsNestedInput = {
    create?: XOR<CompanyCreateWithoutJobsInput, CompanyUncheckedCreateWithoutJobsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutJobsInput
    upsert?: CompanyUpsertWithoutJobsInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutJobsInput, CompanyUpdateWithoutJobsInput>, CompanyUncheckedUpdateWithoutJobsInput>
  }

  export type IndustryUpdateOneWithoutJobsNestedInput = {
    create?: XOR<IndustryCreateWithoutJobsInput, IndustryUncheckedCreateWithoutJobsInput>
    connectOrCreate?: IndustryCreateOrConnectWithoutJobsInput
    upsert?: IndustryUpsertWithoutJobsInput
    disconnect?: IndustryWhereInput | boolean
    delete?: IndustryWhereInput | boolean
    connect?: IndustryWhereUniqueInput
    update?: XOR<XOR<IndustryUpdateToOneWithWhereWithoutJobsInput, IndustryUpdateWithoutJobsInput>, IndustryUncheckedUpdateWithoutJobsInput>
  }

  export type JobSkillUpdateManyWithoutJobNestedInput = {
    create?: XOR<JobSkillCreateWithoutJobInput, JobSkillUncheckedCreateWithoutJobInput> | JobSkillCreateWithoutJobInput[] | JobSkillUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobSkillCreateOrConnectWithoutJobInput | JobSkillCreateOrConnectWithoutJobInput[]
    upsert?: JobSkillUpsertWithWhereUniqueWithoutJobInput | JobSkillUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: JobSkillCreateManyJobInputEnvelope
    set?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    disconnect?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    delete?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    connect?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    update?: JobSkillUpdateWithWhereUniqueWithoutJobInput | JobSkillUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: JobSkillUpdateManyWithWhereWithoutJobInput | JobSkillUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: JobSkillScalarWhereInput | JobSkillScalarWhereInput[]
  }

  export type SavedJobUpdateManyWithoutJobNestedInput = {
    create?: XOR<SavedJobCreateWithoutJobInput, SavedJobUncheckedCreateWithoutJobInput> | SavedJobCreateWithoutJobInput[] | SavedJobUncheckedCreateWithoutJobInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutJobInput | SavedJobCreateOrConnectWithoutJobInput[]
    upsert?: SavedJobUpsertWithWhereUniqueWithoutJobInput | SavedJobUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: SavedJobCreateManyJobInputEnvelope
    set?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    disconnect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    delete?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    update?: SavedJobUpdateWithWhereUniqueWithoutJobInput | SavedJobUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: SavedJobUpdateManyWithWhereWithoutJobInput | SavedJobUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: SavedJobScalarWhereInput | SavedJobScalarWhereInput[]
  }

  export type UserBehaviorUpdateManyWithoutJobNestedInput = {
    create?: XOR<UserBehaviorCreateWithoutJobInput, UserBehaviorUncheckedCreateWithoutJobInput> | UserBehaviorCreateWithoutJobInput[] | UserBehaviorUncheckedCreateWithoutJobInput[]
    connectOrCreate?: UserBehaviorCreateOrConnectWithoutJobInput | UserBehaviorCreateOrConnectWithoutJobInput[]
    upsert?: UserBehaviorUpsertWithWhereUniqueWithoutJobInput | UserBehaviorUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: UserBehaviorCreateManyJobInputEnvelope
    set?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    disconnect?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    delete?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    connect?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    update?: UserBehaviorUpdateWithWhereUniqueWithoutJobInput | UserBehaviorUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: UserBehaviorUpdateManyWithWhereWithoutJobInput | UserBehaviorUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: UserBehaviorScalarWhereInput | UserBehaviorScalarWhereInput[]
  }

  export type ApplyHistoryUpdateManyWithoutJobNestedInput = {
    create?: XOR<ApplyHistoryCreateWithoutJobInput, ApplyHistoryUncheckedCreateWithoutJobInput> | ApplyHistoryCreateWithoutJobInput[] | ApplyHistoryUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplyHistoryCreateOrConnectWithoutJobInput | ApplyHistoryCreateOrConnectWithoutJobInput[]
    upsert?: ApplyHistoryUpsertWithWhereUniqueWithoutJobInput | ApplyHistoryUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: ApplyHistoryCreateManyJobInputEnvelope
    set?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    disconnect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    delete?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    connect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    update?: ApplyHistoryUpdateWithWhereUniqueWithoutJobInput | ApplyHistoryUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: ApplyHistoryUpdateManyWithWhereWithoutJobInput | ApplyHistoryUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: ApplyHistoryScalarWhereInput | ApplyHistoryScalarWhereInput[]
  }

  export type JobSourceTrackingUpdateManyWithoutJobNestedInput = {
    create?: XOR<JobSourceTrackingCreateWithoutJobInput, JobSourceTrackingUncheckedCreateWithoutJobInput> | JobSourceTrackingCreateWithoutJobInput[] | JobSourceTrackingUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobSourceTrackingCreateOrConnectWithoutJobInput | JobSourceTrackingCreateOrConnectWithoutJobInput[]
    upsert?: JobSourceTrackingUpsertWithWhereUniqueWithoutJobInput | JobSourceTrackingUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: JobSourceTrackingCreateManyJobInputEnvelope
    set?: JobSourceTrackingWhereUniqueInput | JobSourceTrackingWhereUniqueInput[]
    disconnect?: JobSourceTrackingWhereUniqueInput | JobSourceTrackingWhereUniqueInput[]
    delete?: JobSourceTrackingWhereUniqueInput | JobSourceTrackingWhereUniqueInput[]
    connect?: JobSourceTrackingWhereUniqueInput | JobSourceTrackingWhereUniqueInput[]
    update?: JobSourceTrackingUpdateWithWhereUniqueWithoutJobInput | JobSourceTrackingUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: JobSourceTrackingUpdateManyWithWhereWithoutJobInput | JobSourceTrackingUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: JobSourceTrackingScalarWhereInput | JobSourceTrackingScalarWhereInput[]
  }

  export type JobRecommendationUpdateManyWithoutJobNestedInput = {
    create?: XOR<JobRecommendationCreateWithoutJobInput, JobRecommendationUncheckedCreateWithoutJobInput> | JobRecommendationCreateWithoutJobInput[] | JobRecommendationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobRecommendationCreateOrConnectWithoutJobInput | JobRecommendationCreateOrConnectWithoutJobInput[]
    upsert?: JobRecommendationUpsertWithWhereUniqueWithoutJobInput | JobRecommendationUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: JobRecommendationCreateManyJobInputEnvelope
    set?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    disconnect?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    delete?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    connect?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    update?: JobRecommendationUpdateWithWhereUniqueWithoutJobInput | JobRecommendationUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: JobRecommendationUpdateManyWithWhereWithoutJobInput | JobRecommendationUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: JobRecommendationScalarWhereInput | JobRecommendationScalarWhereInput[]
  }

  export type JobSkillUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<JobSkillCreateWithoutJobInput, JobSkillUncheckedCreateWithoutJobInput> | JobSkillCreateWithoutJobInput[] | JobSkillUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobSkillCreateOrConnectWithoutJobInput | JobSkillCreateOrConnectWithoutJobInput[]
    upsert?: JobSkillUpsertWithWhereUniqueWithoutJobInput | JobSkillUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: JobSkillCreateManyJobInputEnvelope
    set?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    disconnect?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    delete?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    connect?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    update?: JobSkillUpdateWithWhereUniqueWithoutJobInput | JobSkillUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: JobSkillUpdateManyWithWhereWithoutJobInput | JobSkillUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: JobSkillScalarWhereInput | JobSkillScalarWhereInput[]
  }

  export type SavedJobUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<SavedJobCreateWithoutJobInput, SavedJobUncheckedCreateWithoutJobInput> | SavedJobCreateWithoutJobInput[] | SavedJobUncheckedCreateWithoutJobInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutJobInput | SavedJobCreateOrConnectWithoutJobInput[]
    upsert?: SavedJobUpsertWithWhereUniqueWithoutJobInput | SavedJobUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: SavedJobCreateManyJobInputEnvelope
    set?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    disconnect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    delete?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    update?: SavedJobUpdateWithWhereUniqueWithoutJobInput | SavedJobUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: SavedJobUpdateManyWithWhereWithoutJobInput | SavedJobUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: SavedJobScalarWhereInput | SavedJobScalarWhereInput[]
  }

  export type UserBehaviorUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<UserBehaviorCreateWithoutJobInput, UserBehaviorUncheckedCreateWithoutJobInput> | UserBehaviorCreateWithoutJobInput[] | UserBehaviorUncheckedCreateWithoutJobInput[]
    connectOrCreate?: UserBehaviorCreateOrConnectWithoutJobInput | UserBehaviorCreateOrConnectWithoutJobInput[]
    upsert?: UserBehaviorUpsertWithWhereUniqueWithoutJobInput | UserBehaviorUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: UserBehaviorCreateManyJobInputEnvelope
    set?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    disconnect?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    delete?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    connect?: UserBehaviorWhereUniqueInput | UserBehaviorWhereUniqueInput[]
    update?: UserBehaviorUpdateWithWhereUniqueWithoutJobInput | UserBehaviorUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: UserBehaviorUpdateManyWithWhereWithoutJobInput | UserBehaviorUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: UserBehaviorScalarWhereInput | UserBehaviorScalarWhereInput[]
  }

  export type ApplyHistoryUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<ApplyHistoryCreateWithoutJobInput, ApplyHistoryUncheckedCreateWithoutJobInput> | ApplyHistoryCreateWithoutJobInput[] | ApplyHistoryUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplyHistoryCreateOrConnectWithoutJobInput | ApplyHistoryCreateOrConnectWithoutJobInput[]
    upsert?: ApplyHistoryUpsertWithWhereUniqueWithoutJobInput | ApplyHistoryUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: ApplyHistoryCreateManyJobInputEnvelope
    set?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    disconnect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    delete?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    connect?: ApplyHistoryWhereUniqueInput | ApplyHistoryWhereUniqueInput[]
    update?: ApplyHistoryUpdateWithWhereUniqueWithoutJobInput | ApplyHistoryUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: ApplyHistoryUpdateManyWithWhereWithoutJobInput | ApplyHistoryUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: ApplyHistoryScalarWhereInput | ApplyHistoryScalarWhereInput[]
  }

  export type JobSourceTrackingUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<JobSourceTrackingCreateWithoutJobInput, JobSourceTrackingUncheckedCreateWithoutJobInput> | JobSourceTrackingCreateWithoutJobInput[] | JobSourceTrackingUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobSourceTrackingCreateOrConnectWithoutJobInput | JobSourceTrackingCreateOrConnectWithoutJobInput[]
    upsert?: JobSourceTrackingUpsertWithWhereUniqueWithoutJobInput | JobSourceTrackingUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: JobSourceTrackingCreateManyJobInputEnvelope
    set?: JobSourceTrackingWhereUniqueInput | JobSourceTrackingWhereUniqueInput[]
    disconnect?: JobSourceTrackingWhereUniqueInput | JobSourceTrackingWhereUniqueInput[]
    delete?: JobSourceTrackingWhereUniqueInput | JobSourceTrackingWhereUniqueInput[]
    connect?: JobSourceTrackingWhereUniqueInput | JobSourceTrackingWhereUniqueInput[]
    update?: JobSourceTrackingUpdateWithWhereUniqueWithoutJobInput | JobSourceTrackingUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: JobSourceTrackingUpdateManyWithWhereWithoutJobInput | JobSourceTrackingUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: JobSourceTrackingScalarWhereInput | JobSourceTrackingScalarWhereInput[]
  }

  export type JobRecommendationUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<JobRecommendationCreateWithoutJobInput, JobRecommendationUncheckedCreateWithoutJobInput> | JobRecommendationCreateWithoutJobInput[] | JobRecommendationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: JobRecommendationCreateOrConnectWithoutJobInput | JobRecommendationCreateOrConnectWithoutJobInput[]
    upsert?: JobRecommendationUpsertWithWhereUniqueWithoutJobInput | JobRecommendationUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: JobRecommendationCreateManyJobInputEnvelope
    set?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    disconnect?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    delete?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    connect?: JobRecommendationWhereUniqueInput | JobRecommendationWhereUniqueInput[]
    update?: JobRecommendationUpdateWithWhereUniqueWithoutJobInput | JobRecommendationUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: JobRecommendationUpdateManyWithWhereWithoutJobInput | JobRecommendationUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: JobRecommendationScalarWhereInput | JobRecommendationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutJobRecommendationsInput = {
    create?: XOR<UserCreateWithoutJobRecommendationsInput, UserUncheckedCreateWithoutJobRecommendationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutJobRecommendationsInput
    connect?: UserWhereUniqueInput
  }

  export type JobCreateNestedOneWithoutRecommendationsInput = {
    create?: XOR<JobCreateWithoutRecommendationsInput, JobUncheckedCreateWithoutRecommendationsInput>
    connectOrCreate?: JobCreateOrConnectWithoutRecommendationsInput
    connect?: JobWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutJobRecommendationsNestedInput = {
    create?: XOR<UserCreateWithoutJobRecommendationsInput, UserUncheckedCreateWithoutJobRecommendationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutJobRecommendationsInput
    upsert?: UserUpsertWithoutJobRecommendationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutJobRecommendationsInput, UserUpdateWithoutJobRecommendationsInput>, UserUncheckedUpdateWithoutJobRecommendationsInput>
  }

  export type JobUpdateOneRequiredWithoutRecommendationsNestedInput = {
    create?: XOR<JobCreateWithoutRecommendationsInput, JobUncheckedCreateWithoutRecommendationsInput>
    connectOrCreate?: JobCreateOrConnectWithoutRecommendationsInput
    upsert?: JobUpsertWithoutRecommendationsInput
    connect?: JobWhereUniqueInput
    update?: XOR<XOR<JobUpdateToOneWithWhereWithoutRecommendationsInput, JobUpdateWithoutRecommendationsInput>, JobUncheckedUpdateWithoutRecommendationsInput>
  }

  export type JobCreateNestedOneWithoutSkillsInput = {
    create?: XOR<JobCreateWithoutSkillsInput, JobUncheckedCreateWithoutSkillsInput>
    connectOrCreate?: JobCreateOrConnectWithoutSkillsInput
    connect?: JobWhereUniqueInput
  }

  export type SkillCreateNestedOneWithoutJobsInput = {
    create?: XOR<SkillCreateWithoutJobsInput, SkillUncheckedCreateWithoutJobsInput>
    connectOrCreate?: SkillCreateOrConnectWithoutJobsInput
    connect?: SkillWhereUniqueInput
  }

  export type JobUpdateOneRequiredWithoutSkillsNestedInput = {
    create?: XOR<JobCreateWithoutSkillsInput, JobUncheckedCreateWithoutSkillsInput>
    connectOrCreate?: JobCreateOrConnectWithoutSkillsInput
    upsert?: JobUpsertWithoutSkillsInput
    connect?: JobWhereUniqueInput
    update?: XOR<XOR<JobUpdateToOneWithWhereWithoutSkillsInput, JobUpdateWithoutSkillsInput>, JobUncheckedUpdateWithoutSkillsInput>
  }

  export type SkillUpdateOneRequiredWithoutJobsNestedInput = {
    create?: XOR<SkillCreateWithoutJobsInput, SkillUncheckedCreateWithoutJobsInput>
    connectOrCreate?: SkillCreateOrConnectWithoutJobsInput
    upsert?: SkillUpsertWithoutJobsInput
    connect?: SkillWhereUniqueInput
    update?: XOR<XOR<SkillUpdateToOneWithWhereWithoutJobsInput, SkillUpdateWithoutJobsInput>, SkillUncheckedUpdateWithoutJobsInput>
  }

  export type UserCreateNestedOneWithoutSavedJobsInput = {
    create?: XOR<UserCreateWithoutSavedJobsInput, UserUncheckedCreateWithoutSavedJobsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSavedJobsInput
    connect?: UserWhereUniqueInput
  }

  export type JobCreateNestedOneWithoutSavedJobsInput = {
    create?: XOR<JobCreateWithoutSavedJobsInput, JobUncheckedCreateWithoutSavedJobsInput>
    connectOrCreate?: JobCreateOrConnectWithoutSavedJobsInput
    connect?: JobWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSavedJobsNestedInput = {
    create?: XOR<UserCreateWithoutSavedJobsInput, UserUncheckedCreateWithoutSavedJobsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSavedJobsInput
    upsert?: UserUpsertWithoutSavedJobsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSavedJobsInput, UserUpdateWithoutSavedJobsInput>, UserUncheckedUpdateWithoutSavedJobsInput>
  }

  export type JobUpdateOneRequiredWithoutSavedJobsNestedInput = {
    create?: XOR<JobCreateWithoutSavedJobsInput, JobUncheckedCreateWithoutSavedJobsInput>
    connectOrCreate?: JobCreateOrConnectWithoutSavedJobsInput
    upsert?: JobUpsertWithoutSavedJobsInput
    connect?: JobWhereUniqueInput
    update?: XOR<XOR<JobUpdateToOneWithWhereWithoutSavedJobsInput, JobUpdateWithoutSavedJobsInput>, JobUncheckedUpdateWithoutSavedJobsInput>
  }

  export type SkillCreateNestedManyWithoutIndustryInput = {
    create?: XOR<SkillCreateWithoutIndustryInput, SkillUncheckedCreateWithoutIndustryInput> | SkillCreateWithoutIndustryInput[] | SkillUncheckedCreateWithoutIndustryInput[]
    connectOrCreate?: SkillCreateOrConnectWithoutIndustryInput | SkillCreateOrConnectWithoutIndustryInput[]
    createMany?: SkillCreateManyIndustryInputEnvelope
    connect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
  }

  export type JobCreateNestedManyWithoutIndustryInput = {
    create?: XOR<JobCreateWithoutIndustryInput, JobUncheckedCreateWithoutIndustryInput> | JobCreateWithoutIndustryInput[] | JobUncheckedCreateWithoutIndustryInput[]
    connectOrCreate?: JobCreateOrConnectWithoutIndustryInput | JobCreateOrConnectWithoutIndustryInput[]
    createMany?: JobCreateManyIndustryInputEnvelope
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
  }

  export type UserProfileCreateNestedManyWithoutIndustryInput = {
    create?: XOR<UserProfileCreateWithoutIndustryInput, UserProfileUncheckedCreateWithoutIndustryInput> | UserProfileCreateWithoutIndustryInput[] | UserProfileUncheckedCreateWithoutIndustryInput[]
    connectOrCreate?: UserProfileCreateOrConnectWithoutIndustryInput | UserProfileCreateOrConnectWithoutIndustryInput[]
    createMany?: UserProfileCreateManyIndustryInputEnvelope
    connect?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
  }

  export type SkillUncheckedCreateNestedManyWithoutIndustryInput = {
    create?: XOR<SkillCreateWithoutIndustryInput, SkillUncheckedCreateWithoutIndustryInput> | SkillCreateWithoutIndustryInput[] | SkillUncheckedCreateWithoutIndustryInput[]
    connectOrCreate?: SkillCreateOrConnectWithoutIndustryInput | SkillCreateOrConnectWithoutIndustryInput[]
    createMany?: SkillCreateManyIndustryInputEnvelope
    connect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
  }

  export type JobUncheckedCreateNestedManyWithoutIndustryInput = {
    create?: XOR<JobCreateWithoutIndustryInput, JobUncheckedCreateWithoutIndustryInput> | JobCreateWithoutIndustryInput[] | JobUncheckedCreateWithoutIndustryInput[]
    connectOrCreate?: JobCreateOrConnectWithoutIndustryInput | JobCreateOrConnectWithoutIndustryInput[]
    createMany?: JobCreateManyIndustryInputEnvelope
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
  }

  export type UserProfileUncheckedCreateNestedManyWithoutIndustryInput = {
    create?: XOR<UserProfileCreateWithoutIndustryInput, UserProfileUncheckedCreateWithoutIndustryInput> | UserProfileCreateWithoutIndustryInput[] | UserProfileUncheckedCreateWithoutIndustryInput[]
    connectOrCreate?: UserProfileCreateOrConnectWithoutIndustryInput | UserProfileCreateOrConnectWithoutIndustryInput[]
    createMany?: UserProfileCreateManyIndustryInputEnvelope
    connect?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
  }

  export type SkillUpdateManyWithoutIndustryNestedInput = {
    create?: XOR<SkillCreateWithoutIndustryInput, SkillUncheckedCreateWithoutIndustryInput> | SkillCreateWithoutIndustryInput[] | SkillUncheckedCreateWithoutIndustryInput[]
    connectOrCreate?: SkillCreateOrConnectWithoutIndustryInput | SkillCreateOrConnectWithoutIndustryInput[]
    upsert?: SkillUpsertWithWhereUniqueWithoutIndustryInput | SkillUpsertWithWhereUniqueWithoutIndustryInput[]
    createMany?: SkillCreateManyIndustryInputEnvelope
    set?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    disconnect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    delete?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    connect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    update?: SkillUpdateWithWhereUniqueWithoutIndustryInput | SkillUpdateWithWhereUniqueWithoutIndustryInput[]
    updateMany?: SkillUpdateManyWithWhereWithoutIndustryInput | SkillUpdateManyWithWhereWithoutIndustryInput[]
    deleteMany?: SkillScalarWhereInput | SkillScalarWhereInput[]
  }

  export type JobUpdateManyWithoutIndustryNestedInput = {
    create?: XOR<JobCreateWithoutIndustryInput, JobUncheckedCreateWithoutIndustryInput> | JobCreateWithoutIndustryInput[] | JobUncheckedCreateWithoutIndustryInput[]
    connectOrCreate?: JobCreateOrConnectWithoutIndustryInput | JobCreateOrConnectWithoutIndustryInput[]
    upsert?: JobUpsertWithWhereUniqueWithoutIndustryInput | JobUpsertWithWhereUniqueWithoutIndustryInput[]
    createMany?: JobCreateManyIndustryInputEnvelope
    set?: JobWhereUniqueInput | JobWhereUniqueInput[]
    disconnect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    delete?: JobWhereUniqueInput | JobWhereUniqueInput[]
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    update?: JobUpdateWithWhereUniqueWithoutIndustryInput | JobUpdateWithWhereUniqueWithoutIndustryInput[]
    updateMany?: JobUpdateManyWithWhereWithoutIndustryInput | JobUpdateManyWithWhereWithoutIndustryInput[]
    deleteMany?: JobScalarWhereInput | JobScalarWhereInput[]
  }

  export type UserProfileUpdateManyWithoutIndustryNestedInput = {
    create?: XOR<UserProfileCreateWithoutIndustryInput, UserProfileUncheckedCreateWithoutIndustryInput> | UserProfileCreateWithoutIndustryInput[] | UserProfileUncheckedCreateWithoutIndustryInput[]
    connectOrCreate?: UserProfileCreateOrConnectWithoutIndustryInput | UserProfileCreateOrConnectWithoutIndustryInput[]
    upsert?: UserProfileUpsertWithWhereUniqueWithoutIndustryInput | UserProfileUpsertWithWhereUniqueWithoutIndustryInput[]
    createMany?: UserProfileCreateManyIndustryInputEnvelope
    set?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    disconnect?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    delete?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    connect?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    update?: UserProfileUpdateWithWhereUniqueWithoutIndustryInput | UserProfileUpdateWithWhereUniqueWithoutIndustryInput[]
    updateMany?: UserProfileUpdateManyWithWhereWithoutIndustryInput | UserProfileUpdateManyWithWhereWithoutIndustryInput[]
    deleteMany?: UserProfileScalarWhereInput | UserProfileScalarWhereInput[]
  }

  export type SkillUncheckedUpdateManyWithoutIndustryNestedInput = {
    create?: XOR<SkillCreateWithoutIndustryInput, SkillUncheckedCreateWithoutIndustryInput> | SkillCreateWithoutIndustryInput[] | SkillUncheckedCreateWithoutIndustryInput[]
    connectOrCreate?: SkillCreateOrConnectWithoutIndustryInput | SkillCreateOrConnectWithoutIndustryInput[]
    upsert?: SkillUpsertWithWhereUniqueWithoutIndustryInput | SkillUpsertWithWhereUniqueWithoutIndustryInput[]
    createMany?: SkillCreateManyIndustryInputEnvelope
    set?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    disconnect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    delete?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    connect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    update?: SkillUpdateWithWhereUniqueWithoutIndustryInput | SkillUpdateWithWhereUniqueWithoutIndustryInput[]
    updateMany?: SkillUpdateManyWithWhereWithoutIndustryInput | SkillUpdateManyWithWhereWithoutIndustryInput[]
    deleteMany?: SkillScalarWhereInput | SkillScalarWhereInput[]
  }

  export type JobUncheckedUpdateManyWithoutIndustryNestedInput = {
    create?: XOR<JobCreateWithoutIndustryInput, JobUncheckedCreateWithoutIndustryInput> | JobCreateWithoutIndustryInput[] | JobUncheckedCreateWithoutIndustryInput[]
    connectOrCreate?: JobCreateOrConnectWithoutIndustryInput | JobCreateOrConnectWithoutIndustryInput[]
    upsert?: JobUpsertWithWhereUniqueWithoutIndustryInput | JobUpsertWithWhereUniqueWithoutIndustryInput[]
    createMany?: JobCreateManyIndustryInputEnvelope
    set?: JobWhereUniqueInput | JobWhereUniqueInput[]
    disconnect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    delete?: JobWhereUniqueInput | JobWhereUniqueInput[]
    connect?: JobWhereUniqueInput | JobWhereUniqueInput[]
    update?: JobUpdateWithWhereUniqueWithoutIndustryInput | JobUpdateWithWhereUniqueWithoutIndustryInput[]
    updateMany?: JobUpdateManyWithWhereWithoutIndustryInput | JobUpdateManyWithWhereWithoutIndustryInput[]
    deleteMany?: JobScalarWhereInput | JobScalarWhereInput[]
  }

  export type UserProfileUncheckedUpdateManyWithoutIndustryNestedInput = {
    create?: XOR<UserProfileCreateWithoutIndustryInput, UserProfileUncheckedCreateWithoutIndustryInput> | UserProfileCreateWithoutIndustryInput[] | UserProfileUncheckedCreateWithoutIndustryInput[]
    connectOrCreate?: UserProfileCreateOrConnectWithoutIndustryInput | UserProfileCreateOrConnectWithoutIndustryInput[]
    upsert?: UserProfileUpsertWithWhereUniqueWithoutIndustryInput | UserProfileUpsertWithWhereUniqueWithoutIndustryInput[]
    createMany?: UserProfileCreateManyIndustryInputEnvelope
    set?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    disconnect?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    delete?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    connect?: UserProfileWhereUniqueInput | UserProfileWhereUniqueInput[]
    update?: UserProfileUpdateWithWhereUniqueWithoutIndustryInput | UserProfileUpdateWithWhereUniqueWithoutIndustryInput[]
    updateMany?: UserProfileUpdateManyWithWhereWithoutIndustryInput | UserProfileUpdateManyWithWhereWithoutIndustryInput[]
    deleteMany?: UserProfileScalarWhereInput | UserProfileScalarWhereInput[]
  }

  export type IndustryCreateNestedOneWithoutSkillsInput = {
    create?: XOR<IndustryCreateWithoutSkillsInput, IndustryUncheckedCreateWithoutSkillsInput>
    connectOrCreate?: IndustryCreateOrConnectWithoutSkillsInput
    connect?: IndustryWhereUniqueInput
  }

  export type UserSkillCreateNestedManyWithoutSkillInput = {
    create?: XOR<UserSkillCreateWithoutSkillInput, UserSkillUncheckedCreateWithoutSkillInput> | UserSkillCreateWithoutSkillInput[] | UserSkillUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: UserSkillCreateOrConnectWithoutSkillInput | UserSkillCreateOrConnectWithoutSkillInput[]
    createMany?: UserSkillCreateManySkillInputEnvelope
    connect?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
  }

  export type JobSkillCreateNestedManyWithoutSkillInput = {
    create?: XOR<JobSkillCreateWithoutSkillInput, JobSkillUncheckedCreateWithoutSkillInput> | JobSkillCreateWithoutSkillInput[] | JobSkillUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: JobSkillCreateOrConnectWithoutSkillInput | JobSkillCreateOrConnectWithoutSkillInput[]
    createMany?: JobSkillCreateManySkillInputEnvelope
    connect?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
  }

  export type UserSkillUncheckedCreateNestedManyWithoutSkillInput = {
    create?: XOR<UserSkillCreateWithoutSkillInput, UserSkillUncheckedCreateWithoutSkillInput> | UserSkillCreateWithoutSkillInput[] | UserSkillUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: UserSkillCreateOrConnectWithoutSkillInput | UserSkillCreateOrConnectWithoutSkillInput[]
    createMany?: UserSkillCreateManySkillInputEnvelope
    connect?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
  }

  export type JobSkillUncheckedCreateNestedManyWithoutSkillInput = {
    create?: XOR<JobSkillCreateWithoutSkillInput, JobSkillUncheckedCreateWithoutSkillInput> | JobSkillCreateWithoutSkillInput[] | JobSkillUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: JobSkillCreateOrConnectWithoutSkillInput | JobSkillCreateOrConnectWithoutSkillInput[]
    createMany?: JobSkillCreateManySkillInputEnvelope
    connect?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
  }

  export type IndustryUpdateOneRequiredWithoutSkillsNestedInput = {
    create?: XOR<IndustryCreateWithoutSkillsInput, IndustryUncheckedCreateWithoutSkillsInput>
    connectOrCreate?: IndustryCreateOrConnectWithoutSkillsInput
    upsert?: IndustryUpsertWithoutSkillsInput
    connect?: IndustryWhereUniqueInput
    update?: XOR<XOR<IndustryUpdateToOneWithWhereWithoutSkillsInput, IndustryUpdateWithoutSkillsInput>, IndustryUncheckedUpdateWithoutSkillsInput>
  }

  export type UserSkillUpdateManyWithoutSkillNestedInput = {
    create?: XOR<UserSkillCreateWithoutSkillInput, UserSkillUncheckedCreateWithoutSkillInput> | UserSkillCreateWithoutSkillInput[] | UserSkillUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: UserSkillCreateOrConnectWithoutSkillInput | UserSkillCreateOrConnectWithoutSkillInput[]
    upsert?: UserSkillUpsertWithWhereUniqueWithoutSkillInput | UserSkillUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: UserSkillCreateManySkillInputEnvelope
    set?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    disconnect?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    delete?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    connect?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    update?: UserSkillUpdateWithWhereUniqueWithoutSkillInput | UserSkillUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: UserSkillUpdateManyWithWhereWithoutSkillInput | UserSkillUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: UserSkillScalarWhereInput | UserSkillScalarWhereInput[]
  }

  export type JobSkillUpdateManyWithoutSkillNestedInput = {
    create?: XOR<JobSkillCreateWithoutSkillInput, JobSkillUncheckedCreateWithoutSkillInput> | JobSkillCreateWithoutSkillInput[] | JobSkillUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: JobSkillCreateOrConnectWithoutSkillInput | JobSkillCreateOrConnectWithoutSkillInput[]
    upsert?: JobSkillUpsertWithWhereUniqueWithoutSkillInput | JobSkillUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: JobSkillCreateManySkillInputEnvelope
    set?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    disconnect?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    delete?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    connect?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    update?: JobSkillUpdateWithWhereUniqueWithoutSkillInput | JobSkillUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: JobSkillUpdateManyWithWhereWithoutSkillInput | JobSkillUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: JobSkillScalarWhereInput | JobSkillScalarWhereInput[]
  }

  export type UserSkillUncheckedUpdateManyWithoutSkillNestedInput = {
    create?: XOR<UserSkillCreateWithoutSkillInput, UserSkillUncheckedCreateWithoutSkillInput> | UserSkillCreateWithoutSkillInput[] | UserSkillUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: UserSkillCreateOrConnectWithoutSkillInput | UserSkillCreateOrConnectWithoutSkillInput[]
    upsert?: UserSkillUpsertWithWhereUniqueWithoutSkillInput | UserSkillUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: UserSkillCreateManySkillInputEnvelope
    set?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    disconnect?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    delete?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    connect?: UserSkillWhereUniqueInput | UserSkillWhereUniqueInput[]
    update?: UserSkillUpdateWithWhereUniqueWithoutSkillInput | UserSkillUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: UserSkillUpdateManyWithWhereWithoutSkillInput | UserSkillUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: UserSkillScalarWhereInput | UserSkillScalarWhereInput[]
  }

  export type JobSkillUncheckedUpdateManyWithoutSkillNestedInput = {
    create?: XOR<JobSkillCreateWithoutSkillInput, JobSkillUncheckedCreateWithoutSkillInput> | JobSkillCreateWithoutSkillInput[] | JobSkillUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: JobSkillCreateOrConnectWithoutSkillInput | JobSkillCreateOrConnectWithoutSkillInput[]
    upsert?: JobSkillUpsertWithWhereUniqueWithoutSkillInput | JobSkillUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: JobSkillCreateManySkillInputEnvelope
    set?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    disconnect?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    delete?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    connect?: JobSkillWhereUniqueInput | JobSkillWhereUniqueInput[]
    update?: JobSkillUpdateWithWhereUniqueWithoutSkillInput | JobSkillUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: JobSkillUpdateManyWithWhereWithoutSkillInput | JobSkillUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: JobSkillScalarWhereInput | JobSkillScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutBehaviorsInput = {
    create?: XOR<UserCreateWithoutBehaviorsInput, UserUncheckedCreateWithoutBehaviorsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBehaviorsInput
    connect?: UserWhereUniqueInput
  }

  export type JobCreateNestedOneWithoutBehaviorsInput = {
    create?: XOR<JobCreateWithoutBehaviorsInput, JobUncheckedCreateWithoutBehaviorsInput>
    connectOrCreate?: JobCreateOrConnectWithoutBehaviorsInput
    connect?: JobWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutBehaviorsNestedInput = {
    create?: XOR<UserCreateWithoutBehaviorsInput, UserUncheckedCreateWithoutBehaviorsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBehaviorsInput
    upsert?: UserUpsertWithoutBehaviorsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBehaviorsInput, UserUpdateWithoutBehaviorsInput>, UserUncheckedUpdateWithoutBehaviorsInput>
  }

  export type JobUpdateOneRequiredWithoutBehaviorsNestedInput = {
    create?: XOR<JobCreateWithoutBehaviorsInput, JobUncheckedCreateWithoutBehaviorsInput>
    connectOrCreate?: JobCreateOrConnectWithoutBehaviorsInput
    upsert?: JobUpsertWithoutBehaviorsInput
    connect?: JobWhereUniqueInput
    update?: XOR<XOR<JobUpdateToOneWithWhereWithoutBehaviorsInput, JobUpdateWithoutBehaviorsInput>, JobUncheckedUpdateWithoutBehaviorsInput>
  }

  export type UserCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutApplicationsInput
    connect?: UserWhereUniqueInput
  }

  export type JobCreateNestedOneWithoutApplyHistoriesInput = {
    create?: XOR<JobCreateWithoutApplyHistoriesInput, JobUncheckedCreateWithoutApplyHistoriesInput>
    connectOrCreate?: JobCreateOrConnectWithoutApplyHistoriesInput
    connect?: JobWhereUniqueInput
  }

  export type CVCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<CVCreateWithoutApplicationsInput, CVUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: CVCreateOrConnectWithoutApplicationsInput
    connect?: CVWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutApplicationsInput
    upsert?: UserUpsertWithoutApplicationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutApplicationsInput, UserUpdateWithoutApplicationsInput>, UserUncheckedUpdateWithoutApplicationsInput>
  }

  export type JobUpdateOneRequiredWithoutApplyHistoriesNestedInput = {
    create?: XOR<JobCreateWithoutApplyHistoriesInput, JobUncheckedCreateWithoutApplyHistoriesInput>
    connectOrCreate?: JobCreateOrConnectWithoutApplyHistoriesInput
    upsert?: JobUpsertWithoutApplyHistoriesInput
    connect?: JobWhereUniqueInput
    update?: XOR<XOR<JobUpdateToOneWithWhereWithoutApplyHistoriesInput, JobUpdateWithoutApplyHistoriesInput>, JobUncheckedUpdateWithoutApplyHistoriesInput>
  }

  export type CVUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<CVCreateWithoutApplicationsInput, CVUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: CVCreateOrConnectWithoutApplicationsInput
    upsert?: CVUpsertWithoutApplicationsInput
    connect?: CVWhereUniqueInput
    update?: XOR<XOR<CVUpdateToOneWithWhereWithoutApplicationsInput, CVUpdateWithoutApplicationsInput>, CVUncheckedUpdateWithoutApplicationsInput>
  }

  export type JobCreateNestedOneWithoutSourceTrackingsInput = {
    create?: XOR<JobCreateWithoutSourceTrackingsInput, JobUncheckedCreateWithoutSourceTrackingsInput>
    connectOrCreate?: JobCreateOrConnectWithoutSourceTrackingsInput
    connect?: JobWhereUniqueInput
  }

  export type JobUpdateOneRequiredWithoutSourceTrackingsNestedInput = {
    create?: XOR<JobCreateWithoutSourceTrackingsInput, JobUncheckedCreateWithoutSourceTrackingsInput>
    connectOrCreate?: JobCreateOrConnectWithoutSourceTrackingsInput
    upsert?: JobUpsertWithoutSourceTrackingsInput
    connect?: JobWhereUniqueInput
    update?: XOR<XOR<JobUpdateToOneWithWhereWithoutSourceTrackingsInput, JobUpdateWithoutSourceTrackingsInput>, JobUncheckedUpdateWithoutSourceTrackingsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type UserCreateWithoutAccountInput = {
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    profiles?: UserProfileCreateNestedManyWithoutUserInput
    skills?: UserSkillCreateNestedManyWithoutUserInput
    cvs?: CVCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountInput = {
    userID?: number
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    profiles?: UserProfileUncheckedCreateNestedManyWithoutUserInput
    skills?: UserSkillUncheckedCreateNestedManyWithoutUserInput
    cvs?: CVUncheckedCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryUncheckedCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountInput, UserUncheckedCreateWithoutAccountInput>
  }

  export type UserUpsertWithoutAccountInput = {
    update: XOR<UserUpdateWithoutAccountInput, UserUncheckedUpdateWithoutAccountInput>
    create: XOR<UserCreateWithoutAccountInput, UserUncheckedCreateWithoutAccountInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountInput, UserUncheckedUpdateWithoutAccountInput>
  }

  export type UserUpdateWithoutAccountInput = {
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    profiles?: UserProfileUpdateManyWithoutUserNestedInput
    skills?: UserSkillUpdateManyWithoutUserNestedInput
    cvs?: CVUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountInput = {
    userID?: IntFieldUpdateOperationsInput | number
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    profiles?: UserProfileUncheckedUpdateManyWithoutUserNestedInput
    skills?: UserSkillUncheckedUpdateManyWithoutUserNestedInput
    cvs?: CVUncheckedUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUncheckedUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AccountCreateWithoutUserInput = {
    email: string
    password: string
    provider: string
    createdAt?: Date | string
    active?: boolean
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    accountID?: number
    email: string
    password: string
    provider: string
    createdAt?: Date | string
    active?: boolean
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type UserProfileCreateWithoutUserInput = {
    jobTitle?: string | null
    experienceYear?: number | null
    careerLevel?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    industry?: IndustryCreateNestedOneWithoutUserProfilesInput
  }

  export type UserProfileUncheckedCreateWithoutUserInput = {
    id?: number
    jobTitle?: string | null
    experienceYear?: number | null
    careerLevel?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    industryID?: number | null
  }

  export type UserProfileCreateOrConnectWithoutUserInput = {
    where: UserProfileWhereUniqueInput
    create: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
  }

  export type UserProfileCreateManyUserInputEnvelope = {
    data: UserProfileCreateManyUserInput | UserProfileCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserSkillCreateWithoutUserInput = {
    skill: SkillCreateNestedOneWithoutUsersInput
  }

  export type UserSkillUncheckedCreateWithoutUserInput = {
    id?: number
    skillID: number
  }

  export type UserSkillCreateOrConnectWithoutUserInput = {
    where: UserSkillWhereUniqueInput
    create: XOR<UserSkillCreateWithoutUserInput, UserSkillUncheckedCreateWithoutUserInput>
  }

  export type UserSkillCreateManyUserInputEnvelope = {
    data: UserSkillCreateManyUserInput | UserSkillCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CVCreateWithoutUserInput = {
    title: string
    applications?: ApplyHistoryCreateNestedManyWithoutCvInput
  }

  export type CVUncheckedCreateWithoutUserInput = {
    id?: number
    title: string
    applications?: ApplyHistoryUncheckedCreateNestedManyWithoutCvInput
  }

  export type CVCreateOrConnectWithoutUserInput = {
    where: CVWhereUniqueInput
    create: XOR<CVCreateWithoutUserInput, CVUncheckedCreateWithoutUserInput>
  }

  export type CVCreateManyUserInputEnvelope = {
    data: CVCreateManyUserInput | CVCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SavedJobCreateWithoutUserInput = {
    savedAt?: Date | string
    job: JobCreateNestedOneWithoutSavedJobsInput
  }

  export type SavedJobUncheckedCreateWithoutUserInput = {
    id?: number
    jobID: number
    savedAt?: Date | string
  }

  export type SavedJobCreateOrConnectWithoutUserInput = {
    where: SavedJobWhereUniqueInput
    create: XOR<SavedJobCreateWithoutUserInput, SavedJobUncheckedCreateWithoutUserInput>
  }

  export type SavedJobCreateManyUserInputEnvelope = {
    data: SavedJobCreateManyUserInput | SavedJobCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserBehaviorCreateWithoutUserInput = {
    action: string
    createdAt?: Date | string
    job: JobCreateNestedOneWithoutBehaviorsInput
  }

  export type UserBehaviorUncheckedCreateWithoutUserInput = {
    id?: number
    jobID: number
    action: string
    createdAt?: Date | string
  }

  export type UserBehaviorCreateOrConnectWithoutUserInput = {
    where: UserBehaviorWhereUniqueInput
    create: XOR<UserBehaviorCreateWithoutUserInput, UserBehaviorUncheckedCreateWithoutUserInput>
  }

  export type UserBehaviorCreateManyUserInputEnvelope = {
    data: UserBehaviorCreateManyUserInput | UserBehaviorCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ApplyHistoryCreateWithoutUserInput = {
    status: string
    appliedAt?: Date | string
    job: JobCreateNestedOneWithoutApplyHistoriesInput
    cv: CVCreateNestedOneWithoutApplicationsInput
  }

  export type ApplyHistoryUncheckedCreateWithoutUserInput = {
    id?: number
    jobID: number
    cvID: number
    status: string
    appliedAt?: Date | string
  }

  export type ApplyHistoryCreateOrConnectWithoutUserInput = {
    where: ApplyHistoryWhereUniqueInput
    create: XOR<ApplyHistoryCreateWithoutUserInput, ApplyHistoryUncheckedCreateWithoutUserInput>
  }

  export type ApplyHistoryCreateManyUserInputEnvelope = {
    data: ApplyHistoryCreateManyUserInput | ApplyHistoryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type JobRecommendationCreateWithoutUserInput = {
    matchPercent: number
    createdAt?: Date | string
    job: JobCreateNestedOneWithoutRecommendationsInput
  }

  export type JobRecommendationUncheckedCreateWithoutUserInput = {
    id?: number
    jobID: number
    matchPercent: number
    createdAt?: Date | string
  }

  export type JobRecommendationCreateOrConnectWithoutUserInput = {
    where: JobRecommendationWhereUniqueInput
    create: XOR<JobRecommendationCreateWithoutUserInput, JobRecommendationUncheckedCreateWithoutUserInput>
  }

  export type JobRecommendationCreateManyUserInputEnvelope = {
    data: JobRecommendationCreateManyUserInput | JobRecommendationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithoutUserInput = {
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutUserInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateWithoutUserInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    accountID?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserProfileUpsertWithWhereUniqueWithoutUserInput = {
    where: UserProfileWhereUniqueInput
    update: XOR<UserProfileUpdateWithoutUserInput, UserProfileUncheckedUpdateWithoutUserInput>
    create: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
  }

  export type UserProfileUpdateWithWhereUniqueWithoutUserInput = {
    where: UserProfileWhereUniqueInput
    data: XOR<UserProfileUpdateWithoutUserInput, UserProfileUncheckedUpdateWithoutUserInput>
  }

  export type UserProfileUpdateManyWithWhereWithoutUserInput = {
    where: UserProfileScalarWhereInput
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyWithoutUserInput>
  }

  export type UserProfileScalarWhereInput = {
    AND?: UserProfileScalarWhereInput | UserProfileScalarWhereInput[]
    OR?: UserProfileScalarWhereInput[]
    NOT?: UserProfileScalarWhereInput | UserProfileScalarWhereInput[]
    id?: IntFilter<"UserProfile"> | number
    jobTitle?: StringNullableFilter<"UserProfile"> | string | null
    experienceYear?: IntNullableFilter<"UserProfile"> | number | null
    careerLevel?: StringNullableFilter<"UserProfile"> | string | null
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    userID?: IntFilter<"UserProfile"> | number
    industryID?: IntNullableFilter<"UserProfile"> | number | null
  }

  export type UserSkillUpsertWithWhereUniqueWithoutUserInput = {
    where: UserSkillWhereUniqueInput
    update: XOR<UserSkillUpdateWithoutUserInput, UserSkillUncheckedUpdateWithoutUserInput>
    create: XOR<UserSkillCreateWithoutUserInput, UserSkillUncheckedCreateWithoutUserInput>
  }

  export type UserSkillUpdateWithWhereUniqueWithoutUserInput = {
    where: UserSkillWhereUniqueInput
    data: XOR<UserSkillUpdateWithoutUserInput, UserSkillUncheckedUpdateWithoutUserInput>
  }

  export type UserSkillUpdateManyWithWhereWithoutUserInput = {
    where: UserSkillScalarWhereInput
    data: XOR<UserSkillUpdateManyMutationInput, UserSkillUncheckedUpdateManyWithoutUserInput>
  }

  export type UserSkillScalarWhereInput = {
    AND?: UserSkillScalarWhereInput | UserSkillScalarWhereInput[]
    OR?: UserSkillScalarWhereInput[]
    NOT?: UserSkillScalarWhereInput | UserSkillScalarWhereInput[]
    id?: IntFilter<"UserSkill"> | number
    userID?: IntFilter<"UserSkill"> | number
    skillID?: IntFilter<"UserSkill"> | number
  }

  export type CVUpsertWithWhereUniqueWithoutUserInput = {
    where: CVWhereUniqueInput
    update: XOR<CVUpdateWithoutUserInput, CVUncheckedUpdateWithoutUserInput>
    create: XOR<CVCreateWithoutUserInput, CVUncheckedCreateWithoutUserInput>
  }

  export type CVUpdateWithWhereUniqueWithoutUserInput = {
    where: CVWhereUniqueInput
    data: XOR<CVUpdateWithoutUserInput, CVUncheckedUpdateWithoutUserInput>
  }

  export type CVUpdateManyWithWhereWithoutUserInput = {
    where: CVScalarWhereInput
    data: XOR<CVUpdateManyMutationInput, CVUncheckedUpdateManyWithoutUserInput>
  }

  export type CVScalarWhereInput = {
    AND?: CVScalarWhereInput | CVScalarWhereInput[]
    OR?: CVScalarWhereInput[]
    NOT?: CVScalarWhereInput | CVScalarWhereInput[]
    id?: IntFilter<"CV"> | number
    userID?: IntFilter<"CV"> | number
    title?: StringFilter<"CV"> | string
  }

  export type SavedJobUpsertWithWhereUniqueWithoutUserInput = {
    where: SavedJobWhereUniqueInput
    update: XOR<SavedJobUpdateWithoutUserInput, SavedJobUncheckedUpdateWithoutUserInput>
    create: XOR<SavedJobCreateWithoutUserInput, SavedJobUncheckedCreateWithoutUserInput>
  }

  export type SavedJobUpdateWithWhereUniqueWithoutUserInput = {
    where: SavedJobWhereUniqueInput
    data: XOR<SavedJobUpdateWithoutUserInput, SavedJobUncheckedUpdateWithoutUserInput>
  }

  export type SavedJobUpdateManyWithWhereWithoutUserInput = {
    where: SavedJobScalarWhereInput
    data: XOR<SavedJobUpdateManyMutationInput, SavedJobUncheckedUpdateManyWithoutUserInput>
  }

  export type SavedJobScalarWhereInput = {
    AND?: SavedJobScalarWhereInput | SavedJobScalarWhereInput[]
    OR?: SavedJobScalarWhereInput[]
    NOT?: SavedJobScalarWhereInput | SavedJobScalarWhereInput[]
    id?: IntFilter<"SavedJob"> | number
    userID?: IntFilter<"SavedJob"> | number
    jobID?: IntFilter<"SavedJob"> | number
    savedAt?: DateTimeFilter<"SavedJob"> | Date | string
  }

  export type UserBehaviorUpsertWithWhereUniqueWithoutUserInput = {
    where: UserBehaviorWhereUniqueInput
    update: XOR<UserBehaviorUpdateWithoutUserInput, UserBehaviorUncheckedUpdateWithoutUserInput>
    create: XOR<UserBehaviorCreateWithoutUserInput, UserBehaviorUncheckedCreateWithoutUserInput>
  }

  export type UserBehaviorUpdateWithWhereUniqueWithoutUserInput = {
    where: UserBehaviorWhereUniqueInput
    data: XOR<UserBehaviorUpdateWithoutUserInput, UserBehaviorUncheckedUpdateWithoutUserInput>
  }

  export type UserBehaviorUpdateManyWithWhereWithoutUserInput = {
    where: UserBehaviorScalarWhereInput
    data: XOR<UserBehaviorUpdateManyMutationInput, UserBehaviorUncheckedUpdateManyWithoutUserInput>
  }

  export type UserBehaviorScalarWhereInput = {
    AND?: UserBehaviorScalarWhereInput | UserBehaviorScalarWhereInput[]
    OR?: UserBehaviorScalarWhereInput[]
    NOT?: UserBehaviorScalarWhereInput | UserBehaviorScalarWhereInput[]
    id?: IntFilter<"UserBehavior"> | number
    userID?: IntFilter<"UserBehavior"> | number
    jobID?: IntFilter<"UserBehavior"> | number
    action?: StringFilter<"UserBehavior"> | string
    createdAt?: DateTimeFilter<"UserBehavior"> | Date | string
  }

  export type ApplyHistoryUpsertWithWhereUniqueWithoutUserInput = {
    where: ApplyHistoryWhereUniqueInput
    update: XOR<ApplyHistoryUpdateWithoutUserInput, ApplyHistoryUncheckedUpdateWithoutUserInput>
    create: XOR<ApplyHistoryCreateWithoutUserInput, ApplyHistoryUncheckedCreateWithoutUserInput>
  }

  export type ApplyHistoryUpdateWithWhereUniqueWithoutUserInput = {
    where: ApplyHistoryWhereUniqueInput
    data: XOR<ApplyHistoryUpdateWithoutUserInput, ApplyHistoryUncheckedUpdateWithoutUserInput>
  }

  export type ApplyHistoryUpdateManyWithWhereWithoutUserInput = {
    where: ApplyHistoryScalarWhereInput
    data: XOR<ApplyHistoryUpdateManyMutationInput, ApplyHistoryUncheckedUpdateManyWithoutUserInput>
  }

  export type ApplyHistoryScalarWhereInput = {
    AND?: ApplyHistoryScalarWhereInput | ApplyHistoryScalarWhereInput[]
    OR?: ApplyHistoryScalarWhereInput[]
    NOT?: ApplyHistoryScalarWhereInput | ApplyHistoryScalarWhereInput[]
    id?: IntFilter<"ApplyHistory"> | number
    userID?: IntFilter<"ApplyHistory"> | number
    jobID?: IntFilter<"ApplyHistory"> | number
    cvID?: IntFilter<"ApplyHistory"> | number
    status?: StringFilter<"ApplyHistory"> | string
    appliedAt?: DateTimeFilter<"ApplyHistory"> | Date | string
  }

  export type JobRecommendationUpsertWithWhereUniqueWithoutUserInput = {
    where: JobRecommendationWhereUniqueInput
    update: XOR<JobRecommendationUpdateWithoutUserInput, JobRecommendationUncheckedUpdateWithoutUserInput>
    create: XOR<JobRecommendationCreateWithoutUserInput, JobRecommendationUncheckedCreateWithoutUserInput>
  }

  export type JobRecommendationUpdateWithWhereUniqueWithoutUserInput = {
    where: JobRecommendationWhereUniqueInput
    data: XOR<JobRecommendationUpdateWithoutUserInput, JobRecommendationUncheckedUpdateWithoutUserInput>
  }

  export type JobRecommendationUpdateManyWithWhereWithoutUserInput = {
    where: JobRecommendationScalarWhereInput
    data: XOR<JobRecommendationUpdateManyMutationInput, JobRecommendationUncheckedUpdateManyWithoutUserInput>
  }

  export type JobRecommendationScalarWhereInput = {
    AND?: JobRecommendationScalarWhereInput | JobRecommendationScalarWhereInput[]
    OR?: JobRecommendationScalarWhereInput[]
    NOT?: JobRecommendationScalarWhereInput | JobRecommendationScalarWhereInput[]
    id?: IntFilter<"JobRecommendation"> | number
    userID?: IntFilter<"JobRecommendation"> | number
    jobID?: IntFilter<"JobRecommendation"> | number
    matchPercent?: FloatFilter<"JobRecommendation"> | number
    createdAt?: DateTimeFilter<"JobRecommendation"> | Date | string
  }

  export type UserCreateWithoutProfilesInput = {
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    account: AccountCreateNestedOneWithoutUserInput
    skills?: UserSkillCreateNestedManyWithoutUserInput
    cvs?: CVCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProfilesInput = {
    userID?: number
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    accountID: number
    skills?: UserSkillUncheckedCreateNestedManyWithoutUserInput
    cvs?: CVUncheckedCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryUncheckedCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProfilesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProfilesInput, UserUncheckedCreateWithoutProfilesInput>
  }

  export type IndustryCreateWithoutUserProfilesInput = {
    name: string
    skills?: SkillCreateNestedManyWithoutIndustryInput
    jobs?: JobCreateNestedManyWithoutIndustryInput
  }

  export type IndustryUncheckedCreateWithoutUserProfilesInput = {
    id?: number
    name: string
    skills?: SkillUncheckedCreateNestedManyWithoutIndustryInput
    jobs?: JobUncheckedCreateNestedManyWithoutIndustryInput
  }

  export type IndustryCreateOrConnectWithoutUserProfilesInput = {
    where: IndustryWhereUniqueInput
    create: XOR<IndustryCreateWithoutUserProfilesInput, IndustryUncheckedCreateWithoutUserProfilesInput>
  }

  export type UserUpsertWithoutProfilesInput = {
    update: XOR<UserUpdateWithoutProfilesInput, UserUncheckedUpdateWithoutProfilesInput>
    create: XOR<UserCreateWithoutProfilesInput, UserUncheckedCreateWithoutProfilesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProfilesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProfilesInput, UserUncheckedUpdateWithoutProfilesInput>
  }

  export type UserUpdateWithoutProfilesInput = {
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    account?: AccountUpdateOneRequiredWithoutUserNestedInput
    skills?: UserSkillUpdateManyWithoutUserNestedInput
    cvs?: CVUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProfilesInput = {
    userID?: IntFieldUpdateOperationsInput | number
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    accountID?: IntFieldUpdateOperationsInput | number
    skills?: UserSkillUncheckedUpdateManyWithoutUserNestedInput
    cvs?: CVUncheckedUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUncheckedUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type IndustryUpsertWithoutUserProfilesInput = {
    update: XOR<IndustryUpdateWithoutUserProfilesInput, IndustryUncheckedUpdateWithoutUserProfilesInput>
    create: XOR<IndustryCreateWithoutUserProfilesInput, IndustryUncheckedCreateWithoutUserProfilesInput>
    where?: IndustryWhereInput
  }

  export type IndustryUpdateToOneWithWhereWithoutUserProfilesInput = {
    where?: IndustryWhereInput
    data: XOR<IndustryUpdateWithoutUserProfilesInput, IndustryUncheckedUpdateWithoutUserProfilesInput>
  }

  export type IndustryUpdateWithoutUserProfilesInput = {
    name?: StringFieldUpdateOperationsInput | string
    skills?: SkillUpdateManyWithoutIndustryNestedInput
    jobs?: JobUpdateManyWithoutIndustryNestedInput
  }

  export type IndustryUncheckedUpdateWithoutUserProfilesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    skills?: SkillUncheckedUpdateManyWithoutIndustryNestedInput
    jobs?: JobUncheckedUpdateManyWithoutIndustryNestedInput
  }

  export type UserCreateWithoutSkillsInput = {
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    account: AccountCreateNestedOneWithoutUserInput
    profiles?: UserProfileCreateNestedManyWithoutUserInput
    cvs?: CVCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSkillsInput = {
    userID?: number
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    accountID: number
    profiles?: UserProfileUncheckedCreateNestedManyWithoutUserInput
    cvs?: CVUncheckedCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryUncheckedCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSkillsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSkillsInput, UserUncheckedCreateWithoutSkillsInput>
  }

  export type SkillCreateWithoutUsersInput = {
    name: string
    industry: IndustryCreateNestedOneWithoutSkillsInput
    jobs?: JobSkillCreateNestedManyWithoutSkillInput
  }

  export type SkillUncheckedCreateWithoutUsersInput = {
    skillID?: number
    industryID: number
    name: string
    jobs?: JobSkillUncheckedCreateNestedManyWithoutSkillInput
  }

  export type SkillCreateOrConnectWithoutUsersInput = {
    where: SkillWhereUniqueInput
    create: XOR<SkillCreateWithoutUsersInput, SkillUncheckedCreateWithoutUsersInput>
  }

  export type UserUpsertWithoutSkillsInput = {
    update: XOR<UserUpdateWithoutSkillsInput, UserUncheckedUpdateWithoutSkillsInput>
    create: XOR<UserCreateWithoutSkillsInput, UserUncheckedCreateWithoutSkillsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSkillsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSkillsInput, UserUncheckedUpdateWithoutSkillsInput>
  }

  export type UserUpdateWithoutSkillsInput = {
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    account?: AccountUpdateOneRequiredWithoutUserNestedInput
    profiles?: UserProfileUpdateManyWithoutUserNestedInput
    cvs?: CVUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSkillsInput = {
    userID?: IntFieldUpdateOperationsInput | number
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    accountID?: IntFieldUpdateOperationsInput | number
    profiles?: UserProfileUncheckedUpdateManyWithoutUserNestedInput
    cvs?: CVUncheckedUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUncheckedUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SkillUpsertWithoutUsersInput = {
    update: XOR<SkillUpdateWithoutUsersInput, SkillUncheckedUpdateWithoutUsersInput>
    create: XOR<SkillCreateWithoutUsersInput, SkillUncheckedCreateWithoutUsersInput>
    where?: SkillWhereInput
  }

  export type SkillUpdateToOneWithWhereWithoutUsersInput = {
    where?: SkillWhereInput
    data: XOR<SkillUpdateWithoutUsersInput, SkillUncheckedUpdateWithoutUsersInput>
  }

  export type SkillUpdateWithoutUsersInput = {
    name?: StringFieldUpdateOperationsInput | string
    industry?: IndustryUpdateOneRequiredWithoutSkillsNestedInput
    jobs?: JobSkillUpdateManyWithoutSkillNestedInput
  }

  export type SkillUncheckedUpdateWithoutUsersInput = {
    skillID?: IntFieldUpdateOperationsInput | number
    industryID?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    jobs?: JobSkillUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type UserCreateWithoutCvsInput = {
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    account: AccountCreateNestedOneWithoutUserInput
    profiles?: UserProfileCreateNestedManyWithoutUserInput
    skills?: UserSkillCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCvsInput = {
    userID?: number
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    accountID: number
    profiles?: UserProfileUncheckedCreateNestedManyWithoutUserInput
    skills?: UserSkillUncheckedCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryUncheckedCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCvsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCvsInput, UserUncheckedCreateWithoutCvsInput>
  }

  export type ApplyHistoryCreateWithoutCvInput = {
    status: string
    appliedAt?: Date | string
    user: UserCreateNestedOneWithoutApplicationsInput
    job: JobCreateNestedOneWithoutApplyHistoriesInput
  }

  export type ApplyHistoryUncheckedCreateWithoutCvInput = {
    id?: number
    userID: number
    jobID: number
    status: string
    appliedAt?: Date | string
  }

  export type ApplyHistoryCreateOrConnectWithoutCvInput = {
    where: ApplyHistoryWhereUniqueInput
    create: XOR<ApplyHistoryCreateWithoutCvInput, ApplyHistoryUncheckedCreateWithoutCvInput>
  }

  export type ApplyHistoryCreateManyCvInputEnvelope = {
    data: ApplyHistoryCreateManyCvInput | ApplyHistoryCreateManyCvInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCvsInput = {
    update: XOR<UserUpdateWithoutCvsInput, UserUncheckedUpdateWithoutCvsInput>
    create: XOR<UserCreateWithoutCvsInput, UserUncheckedCreateWithoutCvsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCvsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCvsInput, UserUncheckedUpdateWithoutCvsInput>
  }

  export type UserUpdateWithoutCvsInput = {
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    account?: AccountUpdateOneRequiredWithoutUserNestedInput
    profiles?: UserProfileUpdateManyWithoutUserNestedInput
    skills?: UserSkillUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCvsInput = {
    userID?: IntFieldUpdateOperationsInput | number
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    accountID?: IntFieldUpdateOperationsInput | number
    profiles?: UserProfileUncheckedUpdateManyWithoutUserNestedInput
    skills?: UserSkillUncheckedUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUncheckedUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ApplyHistoryUpsertWithWhereUniqueWithoutCvInput = {
    where: ApplyHistoryWhereUniqueInput
    update: XOR<ApplyHistoryUpdateWithoutCvInput, ApplyHistoryUncheckedUpdateWithoutCvInput>
    create: XOR<ApplyHistoryCreateWithoutCvInput, ApplyHistoryUncheckedCreateWithoutCvInput>
  }

  export type ApplyHistoryUpdateWithWhereUniqueWithoutCvInput = {
    where: ApplyHistoryWhereUniqueInput
    data: XOR<ApplyHistoryUpdateWithoutCvInput, ApplyHistoryUncheckedUpdateWithoutCvInput>
  }

  export type ApplyHistoryUpdateManyWithWhereWithoutCvInput = {
    where: ApplyHistoryScalarWhereInput
    data: XOR<ApplyHistoryUpdateManyMutationInput, ApplyHistoryUncheckedUpdateManyWithoutCvInput>
  }

  export type JobCreateWithoutCompanyInput = {
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    industry?: IndustryCreateNestedOneWithoutJobsInput
    skills?: JobSkillCreateNestedManyWithoutJobInput
    savedJobs?: SavedJobCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutCompanyInput = {
    jobID?: number
    industryID?: number | null
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    skills?: JobSkillUncheckedCreateNestedManyWithoutJobInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryUncheckedCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingUncheckedCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutCompanyInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutCompanyInput, JobUncheckedCreateWithoutCompanyInput>
  }

  export type JobCreateManyCompanyInputEnvelope = {
    data: JobCreateManyCompanyInput | JobCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type JobUpsertWithWhereUniqueWithoutCompanyInput = {
    where: JobWhereUniqueInput
    update: XOR<JobUpdateWithoutCompanyInput, JobUncheckedUpdateWithoutCompanyInput>
    create: XOR<JobCreateWithoutCompanyInput, JobUncheckedCreateWithoutCompanyInput>
  }

  export type JobUpdateWithWhereUniqueWithoutCompanyInput = {
    where: JobWhereUniqueInput
    data: XOR<JobUpdateWithoutCompanyInput, JobUncheckedUpdateWithoutCompanyInput>
  }

  export type JobUpdateManyWithWhereWithoutCompanyInput = {
    where: JobScalarWhereInput
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyWithoutCompanyInput>
  }

  export type JobScalarWhereInput = {
    AND?: JobScalarWhereInput | JobScalarWhereInput[]
    OR?: JobScalarWhereInput[]
    NOT?: JobScalarWhereInput | JobScalarWhereInput[]
    jobID?: IntFilter<"Job"> | number
    companyID?: IntFilter<"Job"> | number
    industryID?: IntNullableFilter<"Job"> | number | null
    title?: StringNullableFilter<"Job"> | string | null
    location?: StringNullableFilter<"Job"> | string | null
    salary?: StringNullableFilter<"Job"> | string | null
    description?: StringNullableFilter<"Job"> | string | null
    requirement?: StringNullableFilter<"Job"> | string | null
    benefit?: StringNullableFilter<"Job"> | string | null
    jobType?: StringNullableFilter<"Job"> | string | null
    workingTime?: StringNullableFilter<"Job"> | string | null
    experienceYear?: IntNullableFilter<"Job"> | number | null
    postedAt?: DateTimeFilter<"Job"> | Date | string
    deadline?: DateTimeNullableFilter<"Job"> | Date | string | null
    sourcePlatform?: StringNullableFilter<"Job"> | string | null
    sourceLink?: StringNullableFilter<"Job"> | string | null
    isActive?: BoolFilter<"Job"> | boolean
  }

  export type CompanyCreateWithoutJobsInput = {
    companyName: string
    companyWebsite?: string | null
    companyProfile?: string | null
    address?: string | null
    companySize?: string | null
    companyLogo?: string | null
  }

  export type CompanyUncheckedCreateWithoutJobsInput = {
    companyID?: number
    companyName: string
    companyWebsite?: string | null
    companyProfile?: string | null
    address?: string | null
    companySize?: string | null
    companyLogo?: string | null
  }

  export type CompanyCreateOrConnectWithoutJobsInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutJobsInput, CompanyUncheckedCreateWithoutJobsInput>
  }

  export type IndustryCreateWithoutJobsInput = {
    name: string
    skills?: SkillCreateNestedManyWithoutIndustryInput
    userProfiles?: UserProfileCreateNestedManyWithoutIndustryInput
  }

  export type IndustryUncheckedCreateWithoutJobsInput = {
    id?: number
    name: string
    skills?: SkillUncheckedCreateNestedManyWithoutIndustryInput
    userProfiles?: UserProfileUncheckedCreateNestedManyWithoutIndustryInput
  }

  export type IndustryCreateOrConnectWithoutJobsInput = {
    where: IndustryWhereUniqueInput
    create: XOR<IndustryCreateWithoutJobsInput, IndustryUncheckedCreateWithoutJobsInput>
  }

  export type JobSkillCreateWithoutJobInput = {
    skill: SkillCreateNestedOneWithoutJobsInput
  }

  export type JobSkillUncheckedCreateWithoutJobInput = {
    id?: number
    skillID: number
  }

  export type JobSkillCreateOrConnectWithoutJobInput = {
    where: JobSkillWhereUniqueInput
    create: XOR<JobSkillCreateWithoutJobInput, JobSkillUncheckedCreateWithoutJobInput>
  }

  export type JobSkillCreateManyJobInputEnvelope = {
    data: JobSkillCreateManyJobInput | JobSkillCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type SavedJobCreateWithoutJobInput = {
    savedAt?: Date | string
    user: UserCreateNestedOneWithoutSavedJobsInput
  }

  export type SavedJobUncheckedCreateWithoutJobInput = {
    id?: number
    userID: number
    savedAt?: Date | string
  }

  export type SavedJobCreateOrConnectWithoutJobInput = {
    where: SavedJobWhereUniqueInput
    create: XOR<SavedJobCreateWithoutJobInput, SavedJobUncheckedCreateWithoutJobInput>
  }

  export type SavedJobCreateManyJobInputEnvelope = {
    data: SavedJobCreateManyJobInput | SavedJobCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type UserBehaviorCreateWithoutJobInput = {
    action: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutBehaviorsInput
  }

  export type UserBehaviorUncheckedCreateWithoutJobInput = {
    id?: number
    userID: number
    action: string
    createdAt?: Date | string
  }

  export type UserBehaviorCreateOrConnectWithoutJobInput = {
    where: UserBehaviorWhereUniqueInput
    create: XOR<UserBehaviorCreateWithoutJobInput, UserBehaviorUncheckedCreateWithoutJobInput>
  }

  export type UserBehaviorCreateManyJobInputEnvelope = {
    data: UserBehaviorCreateManyJobInput | UserBehaviorCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type ApplyHistoryCreateWithoutJobInput = {
    status: string
    appliedAt?: Date | string
    user: UserCreateNestedOneWithoutApplicationsInput
    cv: CVCreateNestedOneWithoutApplicationsInput
  }

  export type ApplyHistoryUncheckedCreateWithoutJobInput = {
    id?: number
    userID: number
    cvID: number
    status: string
    appliedAt?: Date | string
  }

  export type ApplyHistoryCreateOrConnectWithoutJobInput = {
    where: ApplyHistoryWhereUniqueInput
    create: XOR<ApplyHistoryCreateWithoutJobInput, ApplyHistoryUncheckedCreateWithoutJobInput>
  }

  export type ApplyHistoryCreateManyJobInputEnvelope = {
    data: ApplyHistoryCreateManyJobInput | ApplyHistoryCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type JobSourceTrackingCreateWithoutJobInput = {
    platform: string
    externalJobID: string
    crawledAt?: Date | string
  }

  export type JobSourceTrackingUncheckedCreateWithoutJobInput = {
    id?: number
    platform: string
    externalJobID: string
    crawledAt?: Date | string
  }

  export type JobSourceTrackingCreateOrConnectWithoutJobInput = {
    where: JobSourceTrackingWhereUniqueInput
    create: XOR<JobSourceTrackingCreateWithoutJobInput, JobSourceTrackingUncheckedCreateWithoutJobInput>
  }

  export type JobSourceTrackingCreateManyJobInputEnvelope = {
    data: JobSourceTrackingCreateManyJobInput | JobSourceTrackingCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type JobRecommendationCreateWithoutJobInput = {
    matchPercent: number
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutJobRecommendationsInput
  }

  export type JobRecommendationUncheckedCreateWithoutJobInput = {
    id?: number
    userID: number
    matchPercent: number
    createdAt?: Date | string
  }

  export type JobRecommendationCreateOrConnectWithoutJobInput = {
    where: JobRecommendationWhereUniqueInput
    create: XOR<JobRecommendationCreateWithoutJobInput, JobRecommendationUncheckedCreateWithoutJobInput>
  }

  export type JobRecommendationCreateManyJobInputEnvelope = {
    data: JobRecommendationCreateManyJobInput | JobRecommendationCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type CompanyUpsertWithoutJobsInput = {
    update: XOR<CompanyUpdateWithoutJobsInput, CompanyUncheckedUpdateWithoutJobsInput>
    create: XOR<CompanyCreateWithoutJobsInput, CompanyUncheckedCreateWithoutJobsInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutJobsInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutJobsInput, CompanyUncheckedUpdateWithoutJobsInput>
  }

  export type CompanyUpdateWithoutJobsInput = {
    companyName?: StringFieldUpdateOperationsInput | string
    companyWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    companyProfile?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableStringFieldUpdateOperationsInput | string | null
    companyLogo?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CompanyUncheckedUpdateWithoutJobsInput = {
    companyID?: IntFieldUpdateOperationsInput | number
    companyName?: StringFieldUpdateOperationsInput | string
    companyWebsite?: NullableStringFieldUpdateOperationsInput | string | null
    companyProfile?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableStringFieldUpdateOperationsInput | string | null
    companyLogo?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IndustryUpsertWithoutJobsInput = {
    update: XOR<IndustryUpdateWithoutJobsInput, IndustryUncheckedUpdateWithoutJobsInput>
    create: XOR<IndustryCreateWithoutJobsInput, IndustryUncheckedCreateWithoutJobsInput>
    where?: IndustryWhereInput
  }

  export type IndustryUpdateToOneWithWhereWithoutJobsInput = {
    where?: IndustryWhereInput
    data: XOR<IndustryUpdateWithoutJobsInput, IndustryUncheckedUpdateWithoutJobsInput>
  }

  export type IndustryUpdateWithoutJobsInput = {
    name?: StringFieldUpdateOperationsInput | string
    skills?: SkillUpdateManyWithoutIndustryNestedInput
    userProfiles?: UserProfileUpdateManyWithoutIndustryNestedInput
  }

  export type IndustryUncheckedUpdateWithoutJobsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    skills?: SkillUncheckedUpdateManyWithoutIndustryNestedInput
    userProfiles?: UserProfileUncheckedUpdateManyWithoutIndustryNestedInput
  }

  export type JobSkillUpsertWithWhereUniqueWithoutJobInput = {
    where: JobSkillWhereUniqueInput
    update: XOR<JobSkillUpdateWithoutJobInput, JobSkillUncheckedUpdateWithoutJobInput>
    create: XOR<JobSkillCreateWithoutJobInput, JobSkillUncheckedCreateWithoutJobInput>
  }

  export type JobSkillUpdateWithWhereUniqueWithoutJobInput = {
    where: JobSkillWhereUniqueInput
    data: XOR<JobSkillUpdateWithoutJobInput, JobSkillUncheckedUpdateWithoutJobInput>
  }

  export type JobSkillUpdateManyWithWhereWithoutJobInput = {
    where: JobSkillScalarWhereInput
    data: XOR<JobSkillUpdateManyMutationInput, JobSkillUncheckedUpdateManyWithoutJobInput>
  }

  export type JobSkillScalarWhereInput = {
    AND?: JobSkillScalarWhereInput | JobSkillScalarWhereInput[]
    OR?: JobSkillScalarWhereInput[]
    NOT?: JobSkillScalarWhereInput | JobSkillScalarWhereInput[]
    id?: IntFilter<"JobSkill"> | number
    jobID?: IntFilter<"JobSkill"> | number
    skillID?: IntFilter<"JobSkill"> | number
  }

  export type SavedJobUpsertWithWhereUniqueWithoutJobInput = {
    where: SavedJobWhereUniqueInput
    update: XOR<SavedJobUpdateWithoutJobInput, SavedJobUncheckedUpdateWithoutJobInput>
    create: XOR<SavedJobCreateWithoutJobInput, SavedJobUncheckedCreateWithoutJobInput>
  }

  export type SavedJobUpdateWithWhereUniqueWithoutJobInput = {
    where: SavedJobWhereUniqueInput
    data: XOR<SavedJobUpdateWithoutJobInput, SavedJobUncheckedUpdateWithoutJobInput>
  }

  export type SavedJobUpdateManyWithWhereWithoutJobInput = {
    where: SavedJobScalarWhereInput
    data: XOR<SavedJobUpdateManyMutationInput, SavedJobUncheckedUpdateManyWithoutJobInput>
  }

  export type UserBehaviorUpsertWithWhereUniqueWithoutJobInput = {
    where: UserBehaviorWhereUniqueInput
    update: XOR<UserBehaviorUpdateWithoutJobInput, UserBehaviorUncheckedUpdateWithoutJobInput>
    create: XOR<UserBehaviorCreateWithoutJobInput, UserBehaviorUncheckedCreateWithoutJobInput>
  }

  export type UserBehaviorUpdateWithWhereUniqueWithoutJobInput = {
    where: UserBehaviorWhereUniqueInput
    data: XOR<UserBehaviorUpdateWithoutJobInput, UserBehaviorUncheckedUpdateWithoutJobInput>
  }

  export type UserBehaviorUpdateManyWithWhereWithoutJobInput = {
    where: UserBehaviorScalarWhereInput
    data: XOR<UserBehaviorUpdateManyMutationInput, UserBehaviorUncheckedUpdateManyWithoutJobInput>
  }

  export type ApplyHistoryUpsertWithWhereUniqueWithoutJobInput = {
    where: ApplyHistoryWhereUniqueInput
    update: XOR<ApplyHistoryUpdateWithoutJobInput, ApplyHistoryUncheckedUpdateWithoutJobInput>
    create: XOR<ApplyHistoryCreateWithoutJobInput, ApplyHistoryUncheckedCreateWithoutJobInput>
  }

  export type ApplyHistoryUpdateWithWhereUniqueWithoutJobInput = {
    where: ApplyHistoryWhereUniqueInput
    data: XOR<ApplyHistoryUpdateWithoutJobInput, ApplyHistoryUncheckedUpdateWithoutJobInput>
  }

  export type ApplyHistoryUpdateManyWithWhereWithoutJobInput = {
    where: ApplyHistoryScalarWhereInput
    data: XOR<ApplyHistoryUpdateManyMutationInput, ApplyHistoryUncheckedUpdateManyWithoutJobInput>
  }

  export type JobSourceTrackingUpsertWithWhereUniqueWithoutJobInput = {
    where: JobSourceTrackingWhereUniqueInput
    update: XOR<JobSourceTrackingUpdateWithoutJobInput, JobSourceTrackingUncheckedUpdateWithoutJobInput>
    create: XOR<JobSourceTrackingCreateWithoutJobInput, JobSourceTrackingUncheckedCreateWithoutJobInput>
  }

  export type JobSourceTrackingUpdateWithWhereUniqueWithoutJobInput = {
    where: JobSourceTrackingWhereUniqueInput
    data: XOR<JobSourceTrackingUpdateWithoutJobInput, JobSourceTrackingUncheckedUpdateWithoutJobInput>
  }

  export type JobSourceTrackingUpdateManyWithWhereWithoutJobInput = {
    where: JobSourceTrackingScalarWhereInput
    data: XOR<JobSourceTrackingUpdateManyMutationInput, JobSourceTrackingUncheckedUpdateManyWithoutJobInput>
  }

  export type JobSourceTrackingScalarWhereInput = {
    AND?: JobSourceTrackingScalarWhereInput | JobSourceTrackingScalarWhereInput[]
    OR?: JobSourceTrackingScalarWhereInput[]
    NOT?: JobSourceTrackingScalarWhereInput | JobSourceTrackingScalarWhereInput[]
    id?: IntFilter<"JobSourceTracking"> | number
    jobID?: IntFilter<"JobSourceTracking"> | number
    platform?: StringFilter<"JobSourceTracking"> | string
    externalJobID?: StringFilter<"JobSourceTracking"> | string
    crawledAt?: DateTimeFilter<"JobSourceTracking"> | Date | string
  }

  export type JobRecommendationUpsertWithWhereUniqueWithoutJobInput = {
    where: JobRecommendationWhereUniqueInput
    update: XOR<JobRecommendationUpdateWithoutJobInput, JobRecommendationUncheckedUpdateWithoutJobInput>
    create: XOR<JobRecommendationCreateWithoutJobInput, JobRecommendationUncheckedCreateWithoutJobInput>
  }

  export type JobRecommendationUpdateWithWhereUniqueWithoutJobInput = {
    where: JobRecommendationWhereUniqueInput
    data: XOR<JobRecommendationUpdateWithoutJobInput, JobRecommendationUncheckedUpdateWithoutJobInput>
  }

  export type JobRecommendationUpdateManyWithWhereWithoutJobInput = {
    where: JobRecommendationScalarWhereInput
    data: XOR<JobRecommendationUpdateManyMutationInput, JobRecommendationUncheckedUpdateManyWithoutJobInput>
  }

  export type UserCreateWithoutJobRecommendationsInput = {
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    account: AccountCreateNestedOneWithoutUserInput
    profiles?: UserProfileCreateNestedManyWithoutUserInput
    skills?: UserSkillCreateNestedManyWithoutUserInput
    cvs?: CVCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutJobRecommendationsInput = {
    userID?: number
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    accountID: number
    profiles?: UserProfileUncheckedCreateNestedManyWithoutUserInput
    skills?: UserSkillUncheckedCreateNestedManyWithoutUserInput
    cvs?: CVUncheckedCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutJobRecommendationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutJobRecommendationsInput, UserUncheckedCreateWithoutJobRecommendationsInput>
  }

  export type JobCreateWithoutRecommendationsInput = {
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    company: CompanyCreateNestedOneWithoutJobsInput
    industry?: IndustryCreateNestedOneWithoutJobsInput
    skills?: JobSkillCreateNestedManyWithoutJobInput
    savedJobs?: SavedJobCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutRecommendationsInput = {
    jobID?: number
    companyID: number
    industryID?: number | null
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    skills?: JobSkillUncheckedCreateNestedManyWithoutJobInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryUncheckedCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutRecommendationsInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutRecommendationsInput, JobUncheckedCreateWithoutRecommendationsInput>
  }

  export type UserUpsertWithoutJobRecommendationsInput = {
    update: XOR<UserUpdateWithoutJobRecommendationsInput, UserUncheckedUpdateWithoutJobRecommendationsInput>
    create: XOR<UserCreateWithoutJobRecommendationsInput, UserUncheckedCreateWithoutJobRecommendationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutJobRecommendationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutJobRecommendationsInput, UserUncheckedUpdateWithoutJobRecommendationsInput>
  }

  export type UserUpdateWithoutJobRecommendationsInput = {
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    account?: AccountUpdateOneRequiredWithoutUserNestedInput
    profiles?: UserProfileUpdateManyWithoutUserNestedInput
    skills?: UserSkillUpdateManyWithoutUserNestedInput
    cvs?: CVUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutJobRecommendationsInput = {
    userID?: IntFieldUpdateOperationsInput | number
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    accountID?: IntFieldUpdateOperationsInput | number
    profiles?: UserProfileUncheckedUpdateManyWithoutUserNestedInput
    skills?: UserSkillUncheckedUpdateManyWithoutUserNestedInput
    cvs?: CVUncheckedUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUncheckedUpdateManyWithoutUserNestedInput
  }

  export type JobUpsertWithoutRecommendationsInput = {
    update: XOR<JobUpdateWithoutRecommendationsInput, JobUncheckedUpdateWithoutRecommendationsInput>
    create: XOR<JobCreateWithoutRecommendationsInput, JobUncheckedCreateWithoutRecommendationsInput>
    where?: JobWhereInput
  }

  export type JobUpdateToOneWithWhereWithoutRecommendationsInput = {
    where?: JobWhereInput
    data: XOR<JobUpdateWithoutRecommendationsInput, JobUncheckedUpdateWithoutRecommendationsInput>
  }

  export type JobUpdateWithoutRecommendationsInput = {
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    company?: CompanyUpdateOneRequiredWithoutJobsNestedInput
    industry?: IndustryUpdateOneWithoutJobsNestedInput
    skills?: JobSkillUpdateManyWithoutJobNestedInput
    savedJobs?: SavedJobUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutRecommendationsInput = {
    jobID?: IntFieldUpdateOperationsInput | number
    companyID?: IntFieldUpdateOperationsInput | number
    industryID?: NullableIntFieldUpdateOperationsInput | number | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    skills?: JobSkillUncheckedUpdateManyWithoutJobNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUncheckedUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUncheckedUpdateManyWithoutJobNestedInput
  }

  export type JobCreateWithoutSkillsInput = {
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    company: CompanyCreateNestedOneWithoutJobsInput
    industry?: IndustryCreateNestedOneWithoutJobsInput
    savedJobs?: SavedJobCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutSkillsInput = {
    jobID?: number
    companyID: number
    industryID?: number | null
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryUncheckedCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingUncheckedCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutSkillsInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutSkillsInput, JobUncheckedCreateWithoutSkillsInput>
  }

  export type SkillCreateWithoutJobsInput = {
    name: string
    industry: IndustryCreateNestedOneWithoutSkillsInput
    users?: UserSkillCreateNestedManyWithoutSkillInput
  }

  export type SkillUncheckedCreateWithoutJobsInput = {
    skillID?: number
    industryID: number
    name: string
    users?: UserSkillUncheckedCreateNestedManyWithoutSkillInput
  }

  export type SkillCreateOrConnectWithoutJobsInput = {
    where: SkillWhereUniqueInput
    create: XOR<SkillCreateWithoutJobsInput, SkillUncheckedCreateWithoutJobsInput>
  }

  export type JobUpsertWithoutSkillsInput = {
    update: XOR<JobUpdateWithoutSkillsInput, JobUncheckedUpdateWithoutSkillsInput>
    create: XOR<JobCreateWithoutSkillsInput, JobUncheckedCreateWithoutSkillsInput>
    where?: JobWhereInput
  }

  export type JobUpdateToOneWithWhereWithoutSkillsInput = {
    where?: JobWhereInput
    data: XOR<JobUpdateWithoutSkillsInput, JobUncheckedUpdateWithoutSkillsInput>
  }

  export type JobUpdateWithoutSkillsInput = {
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    company?: CompanyUpdateOneRequiredWithoutJobsNestedInput
    industry?: IndustryUpdateOneWithoutJobsNestedInput
    savedJobs?: SavedJobUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutSkillsInput = {
    jobID?: IntFieldUpdateOperationsInput | number
    companyID?: IntFieldUpdateOperationsInput | number
    industryID?: NullableIntFieldUpdateOperationsInput | number | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    savedJobs?: SavedJobUncheckedUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUncheckedUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUncheckedUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUncheckedUpdateManyWithoutJobNestedInput
  }

  export type SkillUpsertWithoutJobsInput = {
    update: XOR<SkillUpdateWithoutJobsInput, SkillUncheckedUpdateWithoutJobsInput>
    create: XOR<SkillCreateWithoutJobsInput, SkillUncheckedCreateWithoutJobsInput>
    where?: SkillWhereInput
  }

  export type SkillUpdateToOneWithWhereWithoutJobsInput = {
    where?: SkillWhereInput
    data: XOR<SkillUpdateWithoutJobsInput, SkillUncheckedUpdateWithoutJobsInput>
  }

  export type SkillUpdateWithoutJobsInput = {
    name?: StringFieldUpdateOperationsInput | string
    industry?: IndustryUpdateOneRequiredWithoutSkillsNestedInput
    users?: UserSkillUpdateManyWithoutSkillNestedInput
  }

  export type SkillUncheckedUpdateWithoutJobsInput = {
    skillID?: IntFieldUpdateOperationsInput | number
    industryID?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    users?: UserSkillUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type UserCreateWithoutSavedJobsInput = {
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    account: AccountCreateNestedOneWithoutUserInput
    profiles?: UserProfileCreateNestedManyWithoutUserInput
    skills?: UserSkillCreateNestedManyWithoutUserInput
    cvs?: CVCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSavedJobsInput = {
    userID?: number
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    accountID: number
    profiles?: UserProfileUncheckedCreateNestedManyWithoutUserInput
    skills?: UserSkillUncheckedCreateNestedManyWithoutUserInput
    cvs?: CVUncheckedCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryUncheckedCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSavedJobsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSavedJobsInput, UserUncheckedCreateWithoutSavedJobsInput>
  }

  export type JobCreateWithoutSavedJobsInput = {
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    company: CompanyCreateNestedOneWithoutJobsInput
    industry?: IndustryCreateNestedOneWithoutJobsInput
    skills?: JobSkillCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutSavedJobsInput = {
    jobID?: number
    companyID: number
    industryID?: number | null
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    skills?: JobSkillUncheckedCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryUncheckedCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingUncheckedCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutSavedJobsInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutSavedJobsInput, JobUncheckedCreateWithoutSavedJobsInput>
  }

  export type UserUpsertWithoutSavedJobsInput = {
    update: XOR<UserUpdateWithoutSavedJobsInput, UserUncheckedUpdateWithoutSavedJobsInput>
    create: XOR<UserCreateWithoutSavedJobsInput, UserUncheckedCreateWithoutSavedJobsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSavedJobsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSavedJobsInput, UserUncheckedUpdateWithoutSavedJobsInput>
  }

  export type UserUpdateWithoutSavedJobsInput = {
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    account?: AccountUpdateOneRequiredWithoutUserNestedInput
    profiles?: UserProfileUpdateManyWithoutUserNestedInput
    skills?: UserSkillUpdateManyWithoutUserNestedInput
    cvs?: CVUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSavedJobsInput = {
    userID?: IntFieldUpdateOperationsInput | number
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    accountID?: IntFieldUpdateOperationsInput | number
    profiles?: UserProfileUncheckedUpdateManyWithoutUserNestedInput
    skills?: UserSkillUncheckedUpdateManyWithoutUserNestedInput
    cvs?: CVUncheckedUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUncheckedUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type JobUpsertWithoutSavedJobsInput = {
    update: XOR<JobUpdateWithoutSavedJobsInput, JobUncheckedUpdateWithoutSavedJobsInput>
    create: XOR<JobCreateWithoutSavedJobsInput, JobUncheckedCreateWithoutSavedJobsInput>
    where?: JobWhereInput
  }

  export type JobUpdateToOneWithWhereWithoutSavedJobsInput = {
    where?: JobWhereInput
    data: XOR<JobUpdateWithoutSavedJobsInput, JobUncheckedUpdateWithoutSavedJobsInput>
  }

  export type JobUpdateWithoutSavedJobsInput = {
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    company?: CompanyUpdateOneRequiredWithoutJobsNestedInput
    industry?: IndustryUpdateOneWithoutJobsNestedInput
    skills?: JobSkillUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutSavedJobsInput = {
    jobID?: IntFieldUpdateOperationsInput | number
    companyID?: IntFieldUpdateOperationsInput | number
    industryID?: NullableIntFieldUpdateOperationsInput | number | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    skills?: JobSkillUncheckedUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUncheckedUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUncheckedUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUncheckedUpdateManyWithoutJobNestedInput
  }

  export type SkillCreateWithoutIndustryInput = {
    name: string
    users?: UserSkillCreateNestedManyWithoutSkillInput
    jobs?: JobSkillCreateNestedManyWithoutSkillInput
  }

  export type SkillUncheckedCreateWithoutIndustryInput = {
    skillID?: number
    name: string
    users?: UserSkillUncheckedCreateNestedManyWithoutSkillInput
    jobs?: JobSkillUncheckedCreateNestedManyWithoutSkillInput
  }

  export type SkillCreateOrConnectWithoutIndustryInput = {
    where: SkillWhereUniqueInput
    create: XOR<SkillCreateWithoutIndustryInput, SkillUncheckedCreateWithoutIndustryInput>
  }

  export type SkillCreateManyIndustryInputEnvelope = {
    data: SkillCreateManyIndustryInput | SkillCreateManyIndustryInput[]
    skipDuplicates?: boolean
  }

  export type JobCreateWithoutIndustryInput = {
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    company: CompanyCreateNestedOneWithoutJobsInput
    skills?: JobSkillCreateNestedManyWithoutJobInput
    savedJobs?: SavedJobCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutIndustryInput = {
    jobID?: number
    companyID: number
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    skills?: JobSkillUncheckedCreateNestedManyWithoutJobInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryUncheckedCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingUncheckedCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutIndustryInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutIndustryInput, JobUncheckedCreateWithoutIndustryInput>
  }

  export type JobCreateManyIndustryInputEnvelope = {
    data: JobCreateManyIndustryInput | JobCreateManyIndustryInput[]
    skipDuplicates?: boolean
  }

  export type UserProfileCreateWithoutIndustryInput = {
    jobTitle?: string | null
    experienceYear?: number | null
    careerLevel?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProfilesInput
  }

  export type UserProfileUncheckedCreateWithoutIndustryInput = {
    id?: number
    jobTitle?: string | null
    experienceYear?: number | null
    careerLevel?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userID: number
  }

  export type UserProfileCreateOrConnectWithoutIndustryInput = {
    where: UserProfileWhereUniqueInput
    create: XOR<UserProfileCreateWithoutIndustryInput, UserProfileUncheckedCreateWithoutIndustryInput>
  }

  export type UserProfileCreateManyIndustryInputEnvelope = {
    data: UserProfileCreateManyIndustryInput | UserProfileCreateManyIndustryInput[]
    skipDuplicates?: boolean
  }

  export type SkillUpsertWithWhereUniqueWithoutIndustryInput = {
    where: SkillWhereUniqueInput
    update: XOR<SkillUpdateWithoutIndustryInput, SkillUncheckedUpdateWithoutIndustryInput>
    create: XOR<SkillCreateWithoutIndustryInput, SkillUncheckedCreateWithoutIndustryInput>
  }

  export type SkillUpdateWithWhereUniqueWithoutIndustryInput = {
    where: SkillWhereUniqueInput
    data: XOR<SkillUpdateWithoutIndustryInput, SkillUncheckedUpdateWithoutIndustryInput>
  }

  export type SkillUpdateManyWithWhereWithoutIndustryInput = {
    where: SkillScalarWhereInput
    data: XOR<SkillUpdateManyMutationInput, SkillUncheckedUpdateManyWithoutIndustryInput>
  }

  export type SkillScalarWhereInput = {
    AND?: SkillScalarWhereInput | SkillScalarWhereInput[]
    OR?: SkillScalarWhereInput[]
    NOT?: SkillScalarWhereInput | SkillScalarWhereInput[]
    skillID?: IntFilter<"Skill"> | number
    industryID?: IntFilter<"Skill"> | number
    name?: StringFilter<"Skill"> | string
  }

  export type JobUpsertWithWhereUniqueWithoutIndustryInput = {
    where: JobWhereUniqueInput
    update: XOR<JobUpdateWithoutIndustryInput, JobUncheckedUpdateWithoutIndustryInput>
    create: XOR<JobCreateWithoutIndustryInput, JobUncheckedCreateWithoutIndustryInput>
  }

  export type JobUpdateWithWhereUniqueWithoutIndustryInput = {
    where: JobWhereUniqueInput
    data: XOR<JobUpdateWithoutIndustryInput, JobUncheckedUpdateWithoutIndustryInput>
  }

  export type JobUpdateManyWithWhereWithoutIndustryInput = {
    where: JobScalarWhereInput
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyWithoutIndustryInput>
  }

  export type UserProfileUpsertWithWhereUniqueWithoutIndustryInput = {
    where: UserProfileWhereUniqueInput
    update: XOR<UserProfileUpdateWithoutIndustryInput, UserProfileUncheckedUpdateWithoutIndustryInput>
    create: XOR<UserProfileCreateWithoutIndustryInput, UserProfileUncheckedCreateWithoutIndustryInput>
  }

  export type UserProfileUpdateWithWhereUniqueWithoutIndustryInput = {
    where: UserProfileWhereUniqueInput
    data: XOR<UserProfileUpdateWithoutIndustryInput, UserProfileUncheckedUpdateWithoutIndustryInput>
  }

  export type UserProfileUpdateManyWithWhereWithoutIndustryInput = {
    where: UserProfileScalarWhereInput
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyWithoutIndustryInput>
  }

  export type IndustryCreateWithoutSkillsInput = {
    name: string
    jobs?: JobCreateNestedManyWithoutIndustryInput
    userProfiles?: UserProfileCreateNestedManyWithoutIndustryInput
  }

  export type IndustryUncheckedCreateWithoutSkillsInput = {
    id?: number
    name: string
    jobs?: JobUncheckedCreateNestedManyWithoutIndustryInput
    userProfiles?: UserProfileUncheckedCreateNestedManyWithoutIndustryInput
  }

  export type IndustryCreateOrConnectWithoutSkillsInput = {
    where: IndustryWhereUniqueInput
    create: XOR<IndustryCreateWithoutSkillsInput, IndustryUncheckedCreateWithoutSkillsInput>
  }

  export type UserSkillCreateWithoutSkillInput = {
    user: UserCreateNestedOneWithoutSkillsInput
  }

  export type UserSkillUncheckedCreateWithoutSkillInput = {
    id?: number
    userID: number
  }

  export type UserSkillCreateOrConnectWithoutSkillInput = {
    where: UserSkillWhereUniqueInput
    create: XOR<UserSkillCreateWithoutSkillInput, UserSkillUncheckedCreateWithoutSkillInput>
  }

  export type UserSkillCreateManySkillInputEnvelope = {
    data: UserSkillCreateManySkillInput | UserSkillCreateManySkillInput[]
    skipDuplicates?: boolean
  }

  export type JobSkillCreateWithoutSkillInput = {
    job: JobCreateNestedOneWithoutSkillsInput
  }

  export type JobSkillUncheckedCreateWithoutSkillInput = {
    id?: number
    jobID: number
  }

  export type JobSkillCreateOrConnectWithoutSkillInput = {
    where: JobSkillWhereUniqueInput
    create: XOR<JobSkillCreateWithoutSkillInput, JobSkillUncheckedCreateWithoutSkillInput>
  }

  export type JobSkillCreateManySkillInputEnvelope = {
    data: JobSkillCreateManySkillInput | JobSkillCreateManySkillInput[]
    skipDuplicates?: boolean
  }

  export type IndustryUpsertWithoutSkillsInput = {
    update: XOR<IndustryUpdateWithoutSkillsInput, IndustryUncheckedUpdateWithoutSkillsInput>
    create: XOR<IndustryCreateWithoutSkillsInput, IndustryUncheckedCreateWithoutSkillsInput>
    where?: IndustryWhereInput
  }

  export type IndustryUpdateToOneWithWhereWithoutSkillsInput = {
    where?: IndustryWhereInput
    data: XOR<IndustryUpdateWithoutSkillsInput, IndustryUncheckedUpdateWithoutSkillsInput>
  }

  export type IndustryUpdateWithoutSkillsInput = {
    name?: StringFieldUpdateOperationsInput | string
    jobs?: JobUpdateManyWithoutIndustryNestedInput
    userProfiles?: UserProfileUpdateManyWithoutIndustryNestedInput
  }

  export type IndustryUncheckedUpdateWithoutSkillsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    jobs?: JobUncheckedUpdateManyWithoutIndustryNestedInput
    userProfiles?: UserProfileUncheckedUpdateManyWithoutIndustryNestedInput
  }

  export type UserSkillUpsertWithWhereUniqueWithoutSkillInput = {
    where: UserSkillWhereUniqueInput
    update: XOR<UserSkillUpdateWithoutSkillInput, UserSkillUncheckedUpdateWithoutSkillInput>
    create: XOR<UserSkillCreateWithoutSkillInput, UserSkillUncheckedCreateWithoutSkillInput>
  }

  export type UserSkillUpdateWithWhereUniqueWithoutSkillInput = {
    where: UserSkillWhereUniqueInput
    data: XOR<UserSkillUpdateWithoutSkillInput, UserSkillUncheckedUpdateWithoutSkillInput>
  }

  export type UserSkillUpdateManyWithWhereWithoutSkillInput = {
    where: UserSkillScalarWhereInput
    data: XOR<UserSkillUpdateManyMutationInput, UserSkillUncheckedUpdateManyWithoutSkillInput>
  }

  export type JobSkillUpsertWithWhereUniqueWithoutSkillInput = {
    where: JobSkillWhereUniqueInput
    update: XOR<JobSkillUpdateWithoutSkillInput, JobSkillUncheckedUpdateWithoutSkillInput>
    create: XOR<JobSkillCreateWithoutSkillInput, JobSkillUncheckedCreateWithoutSkillInput>
  }

  export type JobSkillUpdateWithWhereUniqueWithoutSkillInput = {
    where: JobSkillWhereUniqueInput
    data: XOR<JobSkillUpdateWithoutSkillInput, JobSkillUncheckedUpdateWithoutSkillInput>
  }

  export type JobSkillUpdateManyWithWhereWithoutSkillInput = {
    where: JobSkillScalarWhereInput
    data: XOR<JobSkillUpdateManyMutationInput, JobSkillUncheckedUpdateManyWithoutSkillInput>
  }

  export type UserCreateWithoutBehaviorsInput = {
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    account: AccountCreateNestedOneWithoutUserInput
    profiles?: UserProfileCreateNestedManyWithoutUserInput
    skills?: UserSkillCreateNestedManyWithoutUserInput
    cvs?: CVCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBehaviorsInput = {
    userID?: number
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    accountID: number
    profiles?: UserProfileUncheckedCreateNestedManyWithoutUserInput
    skills?: UserSkillUncheckedCreateNestedManyWithoutUserInput
    cvs?: CVUncheckedCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutUserInput
    applications?: ApplyHistoryUncheckedCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBehaviorsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBehaviorsInput, UserUncheckedCreateWithoutBehaviorsInput>
  }

  export type JobCreateWithoutBehaviorsInput = {
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    company: CompanyCreateNestedOneWithoutJobsInput
    industry?: IndustryCreateNestedOneWithoutJobsInput
    skills?: JobSkillCreateNestedManyWithoutJobInput
    savedJobs?: SavedJobCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutBehaviorsInput = {
    jobID?: number
    companyID: number
    industryID?: number | null
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    skills?: JobSkillUncheckedCreateNestedManyWithoutJobInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryUncheckedCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingUncheckedCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutBehaviorsInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutBehaviorsInput, JobUncheckedCreateWithoutBehaviorsInput>
  }

  export type UserUpsertWithoutBehaviorsInput = {
    update: XOR<UserUpdateWithoutBehaviorsInput, UserUncheckedUpdateWithoutBehaviorsInput>
    create: XOR<UserCreateWithoutBehaviorsInput, UserUncheckedCreateWithoutBehaviorsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBehaviorsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBehaviorsInput, UserUncheckedUpdateWithoutBehaviorsInput>
  }

  export type UserUpdateWithoutBehaviorsInput = {
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    account?: AccountUpdateOneRequiredWithoutUserNestedInput
    profiles?: UserProfileUpdateManyWithoutUserNestedInput
    skills?: UserSkillUpdateManyWithoutUserNestedInput
    cvs?: CVUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBehaviorsInput = {
    userID?: IntFieldUpdateOperationsInput | number
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    accountID?: IntFieldUpdateOperationsInput | number
    profiles?: UserProfileUncheckedUpdateManyWithoutUserNestedInput
    skills?: UserSkillUncheckedUpdateManyWithoutUserNestedInput
    cvs?: CVUncheckedUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutUserNestedInput
    applications?: ApplyHistoryUncheckedUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type JobUpsertWithoutBehaviorsInput = {
    update: XOR<JobUpdateWithoutBehaviorsInput, JobUncheckedUpdateWithoutBehaviorsInput>
    create: XOR<JobCreateWithoutBehaviorsInput, JobUncheckedCreateWithoutBehaviorsInput>
    where?: JobWhereInput
  }

  export type JobUpdateToOneWithWhereWithoutBehaviorsInput = {
    where?: JobWhereInput
    data: XOR<JobUpdateWithoutBehaviorsInput, JobUncheckedUpdateWithoutBehaviorsInput>
  }

  export type JobUpdateWithoutBehaviorsInput = {
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    company?: CompanyUpdateOneRequiredWithoutJobsNestedInput
    industry?: IndustryUpdateOneWithoutJobsNestedInput
    skills?: JobSkillUpdateManyWithoutJobNestedInput
    savedJobs?: SavedJobUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutBehaviorsInput = {
    jobID?: IntFieldUpdateOperationsInput | number
    companyID?: IntFieldUpdateOperationsInput | number
    industryID?: NullableIntFieldUpdateOperationsInput | number | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    skills?: JobSkillUncheckedUpdateManyWithoutJobNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUncheckedUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUncheckedUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUncheckedUpdateManyWithoutJobNestedInput
  }

  export type UserCreateWithoutApplicationsInput = {
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    account: AccountCreateNestedOneWithoutUserInput
    profiles?: UserProfileCreateNestedManyWithoutUserInput
    skills?: UserSkillCreateNestedManyWithoutUserInput
    cvs?: CVCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutApplicationsInput = {
    userID?: number
    fullName?: string | null
    birthYear?: number | null
    phone?: string | null
    gender?: string | null
    address?: string | null
    accountID: number
    profiles?: UserProfileUncheckedCreateNestedManyWithoutUserInput
    skills?: UserSkillUncheckedCreateNestedManyWithoutUserInput
    cvs?: CVUncheckedCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutUserInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutUserInput
    jobRecommendations?: JobRecommendationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutApplicationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
  }

  export type JobCreateWithoutApplyHistoriesInput = {
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    company: CompanyCreateNestedOneWithoutJobsInput
    industry?: IndustryCreateNestedOneWithoutJobsInput
    skills?: JobSkillCreateNestedManyWithoutJobInput
    savedJobs?: SavedJobCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutApplyHistoriesInput = {
    jobID?: number
    companyID: number
    industryID?: number | null
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    skills?: JobSkillUncheckedCreateNestedManyWithoutJobInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutJobInput
    sourceTrackings?: JobSourceTrackingUncheckedCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutApplyHistoriesInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutApplyHistoriesInput, JobUncheckedCreateWithoutApplyHistoriesInput>
  }

  export type CVCreateWithoutApplicationsInput = {
    title: string
    user: UserCreateNestedOneWithoutCvsInput
  }

  export type CVUncheckedCreateWithoutApplicationsInput = {
    id?: number
    userID: number
    title: string
  }

  export type CVCreateOrConnectWithoutApplicationsInput = {
    where: CVWhereUniqueInput
    create: XOR<CVCreateWithoutApplicationsInput, CVUncheckedCreateWithoutApplicationsInput>
  }

  export type UserUpsertWithoutApplicationsInput = {
    update: XOR<UserUpdateWithoutApplicationsInput, UserUncheckedUpdateWithoutApplicationsInput>
    create: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutApplicationsInput, UserUncheckedUpdateWithoutApplicationsInput>
  }

  export type UserUpdateWithoutApplicationsInput = {
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    account?: AccountUpdateOneRequiredWithoutUserNestedInput
    profiles?: UserProfileUpdateManyWithoutUserNestedInput
    skills?: UserSkillUpdateManyWithoutUserNestedInput
    cvs?: CVUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutApplicationsInput = {
    userID?: IntFieldUpdateOperationsInput | number
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    birthYear?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    accountID?: IntFieldUpdateOperationsInput | number
    profiles?: UserProfileUncheckedUpdateManyWithoutUserNestedInput
    skills?: UserSkillUncheckedUpdateManyWithoutUserNestedInput
    cvs?: CVUncheckedUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutUserNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutUserNestedInput
    jobRecommendations?: JobRecommendationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type JobUpsertWithoutApplyHistoriesInput = {
    update: XOR<JobUpdateWithoutApplyHistoriesInput, JobUncheckedUpdateWithoutApplyHistoriesInput>
    create: XOR<JobCreateWithoutApplyHistoriesInput, JobUncheckedCreateWithoutApplyHistoriesInput>
    where?: JobWhereInput
  }

  export type JobUpdateToOneWithWhereWithoutApplyHistoriesInput = {
    where?: JobWhereInput
    data: XOR<JobUpdateWithoutApplyHistoriesInput, JobUncheckedUpdateWithoutApplyHistoriesInput>
  }

  export type JobUpdateWithoutApplyHistoriesInput = {
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    company?: CompanyUpdateOneRequiredWithoutJobsNestedInput
    industry?: IndustryUpdateOneWithoutJobsNestedInput
    skills?: JobSkillUpdateManyWithoutJobNestedInput
    savedJobs?: SavedJobUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutApplyHistoriesInput = {
    jobID?: IntFieldUpdateOperationsInput | number
    companyID?: IntFieldUpdateOperationsInput | number
    industryID?: NullableIntFieldUpdateOperationsInput | number | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    skills?: JobSkillUncheckedUpdateManyWithoutJobNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUncheckedUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUncheckedUpdateManyWithoutJobNestedInput
  }

  export type CVUpsertWithoutApplicationsInput = {
    update: XOR<CVUpdateWithoutApplicationsInput, CVUncheckedUpdateWithoutApplicationsInput>
    create: XOR<CVCreateWithoutApplicationsInput, CVUncheckedCreateWithoutApplicationsInput>
    where?: CVWhereInput
  }

  export type CVUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: CVWhereInput
    data: XOR<CVUpdateWithoutApplicationsInput, CVUncheckedUpdateWithoutApplicationsInput>
  }

  export type CVUpdateWithoutApplicationsInput = {
    title?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneRequiredWithoutCvsNestedInput
  }

  export type CVUncheckedUpdateWithoutApplicationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
  }

  export type JobCreateWithoutSourceTrackingsInput = {
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    company: CompanyCreateNestedOneWithoutJobsInput
    industry?: IndustryCreateNestedOneWithoutJobsInput
    skills?: JobSkillCreateNestedManyWithoutJobInput
    savedJobs?: SavedJobCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutSourceTrackingsInput = {
    jobID?: number
    companyID: number
    industryID?: number | null
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
    skills?: JobSkillUncheckedCreateNestedManyWithoutJobInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutJobInput
    behaviors?: UserBehaviorUncheckedCreateNestedManyWithoutJobInput
    applyHistories?: ApplyHistoryUncheckedCreateNestedManyWithoutJobInput
    recommendations?: JobRecommendationUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutSourceTrackingsInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutSourceTrackingsInput, JobUncheckedCreateWithoutSourceTrackingsInput>
  }

  export type JobUpsertWithoutSourceTrackingsInput = {
    update: XOR<JobUpdateWithoutSourceTrackingsInput, JobUncheckedUpdateWithoutSourceTrackingsInput>
    create: XOR<JobCreateWithoutSourceTrackingsInput, JobUncheckedCreateWithoutSourceTrackingsInput>
    where?: JobWhereInput
  }

  export type JobUpdateToOneWithWhereWithoutSourceTrackingsInput = {
    where?: JobWhereInput
    data: XOR<JobUpdateWithoutSourceTrackingsInput, JobUncheckedUpdateWithoutSourceTrackingsInput>
  }

  export type JobUpdateWithoutSourceTrackingsInput = {
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    company?: CompanyUpdateOneRequiredWithoutJobsNestedInput
    industry?: IndustryUpdateOneWithoutJobsNestedInput
    skills?: JobSkillUpdateManyWithoutJobNestedInput
    savedJobs?: SavedJobUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutSourceTrackingsInput = {
    jobID?: IntFieldUpdateOperationsInput | number
    companyID?: IntFieldUpdateOperationsInput | number
    industryID?: NullableIntFieldUpdateOperationsInput | number | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    skills?: JobSkillUncheckedUpdateManyWithoutJobNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUncheckedUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUncheckedUpdateManyWithoutJobNestedInput
  }

  export type UserProfileCreateManyUserInput = {
    id?: number
    jobTitle?: string | null
    experienceYear?: number | null
    careerLevel?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    industryID?: number | null
  }

  export type UserSkillCreateManyUserInput = {
    id?: number
    skillID: number
  }

  export type CVCreateManyUserInput = {
    id?: number
    title: string
  }

  export type SavedJobCreateManyUserInput = {
    id?: number
    jobID: number
    savedAt?: Date | string
  }

  export type UserBehaviorCreateManyUserInput = {
    id?: number
    jobID: number
    action: string
    createdAt?: Date | string
  }

  export type ApplyHistoryCreateManyUserInput = {
    id?: number
    jobID: number
    cvID: number
    status: string
    appliedAt?: Date | string
  }

  export type JobRecommendationCreateManyUserInput = {
    id?: number
    jobID: number
    matchPercent: number
    createdAt?: Date | string
  }

  export type UserProfileUpdateWithoutUserInput = {
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    careerLevel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    industry?: IndustryUpdateOneWithoutUserProfilesNestedInput
  }

  export type UserProfileUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    careerLevel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    industryID?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type UserProfileUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    careerLevel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    industryID?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type UserSkillUpdateWithoutUserInput = {
    skill?: SkillUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserSkillUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    skillID?: IntFieldUpdateOperationsInput | number
  }

  export type UserSkillUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    skillID?: IntFieldUpdateOperationsInput | number
  }

  export type CVUpdateWithoutUserInput = {
    title?: StringFieldUpdateOperationsInput | string
    applications?: ApplyHistoryUpdateManyWithoutCvNestedInput
  }

  export type CVUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    applications?: ApplyHistoryUncheckedUpdateManyWithoutCvNestedInput
  }

  export type CVUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
  }

  export type SavedJobUpdateWithoutUserInput = {
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: JobUpdateOneRequiredWithoutSavedJobsNestedInput
  }

  export type SavedJobUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedJobUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBehaviorUpdateWithoutUserInput = {
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: JobUpdateOneRequiredWithoutBehaviorsNestedInput
  }

  export type UserBehaviorUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBehaviorUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplyHistoryUpdateWithoutUserInput = {
    status?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: JobUpdateOneRequiredWithoutApplyHistoriesNestedInput
    cv?: CVUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type ApplyHistoryUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    cvID?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplyHistoryUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    cvID?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobRecommendationUpdateWithoutUserInput = {
    matchPercent?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: JobUpdateOneRequiredWithoutRecommendationsNestedInput
  }

  export type JobRecommendationUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    matchPercent?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobRecommendationUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    matchPercent?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplyHistoryCreateManyCvInput = {
    id?: number
    userID: number
    jobID: number
    status: string
    appliedAt?: Date | string
  }

  export type ApplyHistoryUpdateWithoutCvInput = {
    status?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutApplicationsNestedInput
    job?: JobUpdateOneRequiredWithoutApplyHistoriesNestedInput
  }

  export type ApplyHistoryUncheckedUpdateWithoutCvInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplyHistoryUncheckedUpdateManyWithoutCvInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobCreateManyCompanyInput = {
    jobID?: number
    industryID?: number | null
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
  }

  export type JobUpdateWithoutCompanyInput = {
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    industry?: IndustryUpdateOneWithoutJobsNestedInput
    skills?: JobSkillUpdateManyWithoutJobNestedInput
    savedJobs?: SavedJobUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutCompanyInput = {
    jobID?: IntFieldUpdateOperationsInput | number
    industryID?: NullableIntFieldUpdateOperationsInput | number | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    skills?: JobSkillUncheckedUpdateManyWithoutJobNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUncheckedUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUncheckedUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUncheckedUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateManyWithoutCompanyInput = {
    jobID?: IntFieldUpdateOperationsInput | number
    industryID?: NullableIntFieldUpdateOperationsInput | number | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type JobSkillCreateManyJobInput = {
    id?: number
    skillID: number
  }

  export type SavedJobCreateManyJobInput = {
    id?: number
    userID: number
    savedAt?: Date | string
  }

  export type UserBehaviorCreateManyJobInput = {
    id?: number
    userID: number
    action: string
    createdAt?: Date | string
  }

  export type ApplyHistoryCreateManyJobInput = {
    id?: number
    userID: number
    cvID: number
    status: string
    appliedAt?: Date | string
  }

  export type JobSourceTrackingCreateManyJobInput = {
    id?: number
    platform: string
    externalJobID: string
    crawledAt?: Date | string
  }

  export type JobRecommendationCreateManyJobInput = {
    id?: number
    userID: number
    matchPercent: number
    createdAt?: Date | string
  }

  export type JobSkillUpdateWithoutJobInput = {
    skill?: SkillUpdateOneRequiredWithoutJobsNestedInput
  }

  export type JobSkillUncheckedUpdateWithoutJobInput = {
    id?: IntFieldUpdateOperationsInput | number
    skillID?: IntFieldUpdateOperationsInput | number
  }

  export type JobSkillUncheckedUpdateManyWithoutJobInput = {
    id?: IntFieldUpdateOperationsInput | number
    skillID?: IntFieldUpdateOperationsInput | number
  }

  export type SavedJobUpdateWithoutJobInput = {
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSavedJobsNestedInput
  }

  export type SavedJobUncheckedUpdateWithoutJobInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedJobUncheckedUpdateManyWithoutJobInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBehaviorUpdateWithoutJobInput = {
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBehaviorsNestedInput
  }

  export type UserBehaviorUncheckedUpdateWithoutJobInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBehaviorUncheckedUpdateManyWithoutJobInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplyHistoryUpdateWithoutJobInput = {
    status?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutApplicationsNestedInput
    cv?: CVUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type ApplyHistoryUncheckedUpdateWithoutJobInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    cvID?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplyHistoryUncheckedUpdateManyWithoutJobInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    cvID?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appliedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobSourceTrackingUpdateWithoutJobInput = {
    platform?: StringFieldUpdateOperationsInput | string
    externalJobID?: StringFieldUpdateOperationsInput | string
    crawledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobSourceTrackingUncheckedUpdateWithoutJobInput = {
    id?: IntFieldUpdateOperationsInput | number
    platform?: StringFieldUpdateOperationsInput | string
    externalJobID?: StringFieldUpdateOperationsInput | string
    crawledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobSourceTrackingUncheckedUpdateManyWithoutJobInput = {
    id?: IntFieldUpdateOperationsInput | number
    platform?: StringFieldUpdateOperationsInput | string
    externalJobID?: StringFieldUpdateOperationsInput | string
    crawledAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobRecommendationUpdateWithoutJobInput = {
    matchPercent?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutJobRecommendationsNestedInput
  }

  export type JobRecommendationUncheckedUpdateWithoutJobInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    matchPercent?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobRecommendationUncheckedUpdateManyWithoutJobInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    matchPercent?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillCreateManyIndustryInput = {
    skillID?: number
    name: string
  }

  export type JobCreateManyIndustryInput = {
    jobID?: number
    companyID: number
    title?: string | null
    location?: string | null
    salary?: string | null
    description?: string | null
    requirement?: string | null
    benefit?: string | null
    jobType?: string | null
    workingTime?: string | null
    experienceYear?: number | null
    postedAt?: Date | string
    deadline?: Date | string | null
    sourcePlatform?: string | null
    sourceLink?: string | null
    isActive?: boolean
  }

  export type UserProfileCreateManyIndustryInput = {
    id?: number
    jobTitle?: string | null
    experienceYear?: number | null
    careerLevel?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userID: number
  }

  export type SkillUpdateWithoutIndustryInput = {
    name?: StringFieldUpdateOperationsInput | string
    users?: UserSkillUpdateManyWithoutSkillNestedInput
    jobs?: JobSkillUpdateManyWithoutSkillNestedInput
  }

  export type SkillUncheckedUpdateWithoutIndustryInput = {
    skillID?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    users?: UserSkillUncheckedUpdateManyWithoutSkillNestedInput
    jobs?: JobSkillUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type SkillUncheckedUpdateManyWithoutIndustryInput = {
    skillID?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type JobUpdateWithoutIndustryInput = {
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    company?: CompanyUpdateOneRequiredWithoutJobsNestedInput
    skills?: JobSkillUpdateManyWithoutJobNestedInput
    savedJobs?: SavedJobUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutIndustryInput = {
    jobID?: IntFieldUpdateOperationsInput | number
    companyID?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    skills?: JobSkillUncheckedUpdateManyWithoutJobNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutJobNestedInput
    behaviors?: UserBehaviorUncheckedUpdateManyWithoutJobNestedInput
    applyHistories?: ApplyHistoryUncheckedUpdateManyWithoutJobNestedInput
    sourceTrackings?: JobSourceTrackingUncheckedUpdateManyWithoutJobNestedInput
    recommendations?: JobRecommendationUncheckedUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateManyWithoutIndustryInput = {
    jobID?: IntFieldUpdateOperationsInput | number
    companyID?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    salary?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    requirement?: NullableStringFieldUpdateOperationsInput | string | null
    benefit?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    workingTime?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourcePlatform?: NullableStringFieldUpdateOperationsInput | string | null
    sourceLink?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserProfileUpdateWithoutIndustryInput = {
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    careerLevel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProfilesNestedInput
  }

  export type UserProfileUncheckedUpdateWithoutIndustryInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    careerLevel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userID?: IntFieldUpdateOperationsInput | number
  }

  export type UserProfileUncheckedUpdateManyWithoutIndustryInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    experienceYear?: NullableIntFieldUpdateOperationsInput | number | null
    careerLevel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userID?: IntFieldUpdateOperationsInput | number
  }

  export type UserSkillCreateManySkillInput = {
    id?: number
    userID: number
  }

  export type JobSkillCreateManySkillInput = {
    id?: number
    jobID: number
  }

  export type UserSkillUpdateWithoutSkillInput = {
    user?: UserUpdateOneRequiredWithoutSkillsNestedInput
  }

  export type UserSkillUncheckedUpdateWithoutSkillInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
  }

  export type UserSkillUncheckedUpdateManyWithoutSkillInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
  }

  export type JobSkillUpdateWithoutSkillInput = {
    job?: JobUpdateOneRequiredWithoutSkillsNestedInput
  }

  export type JobSkillUncheckedUpdateWithoutSkillInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
  }

  export type JobSkillUncheckedUpdateManyWithoutSkillInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobID?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CVCountOutputTypeDefaultArgs instead
     */
    export type CVCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CVCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CompanyCountOutputTypeDefaultArgs instead
     */
    export type CompanyCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CompanyCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use JobCountOutputTypeDefaultArgs instead
     */
    export type JobCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = JobCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use IndustryCountOutputTypeDefaultArgs instead
     */
    export type IndustryCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = IndustryCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SkillCountOutputTypeDefaultArgs instead
     */
    export type SkillCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SkillCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AccountDefaultArgs instead
     */
    export type AccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AccountDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserProfileDefaultArgs instead
     */
    export type UserProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserProfileDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserSkillDefaultArgs instead
     */
    export type UserSkillArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserSkillDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CVDefaultArgs instead
     */
    export type CVArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CVDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CompanyDefaultArgs instead
     */
    export type CompanyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CompanyDefaultArgs<ExtArgs>
    /**
     * @deprecated Use JobDefaultArgs instead
     */
    export type JobArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = JobDefaultArgs<ExtArgs>
    /**
     * @deprecated Use JobRecommendationDefaultArgs instead
     */
    export type JobRecommendationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = JobRecommendationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use JobSkillDefaultArgs instead
     */
    export type JobSkillArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = JobSkillDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SavedJobDefaultArgs instead
     */
    export type SavedJobArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SavedJobDefaultArgs<ExtArgs>
    /**
     * @deprecated Use IndustryDefaultArgs instead
     */
    export type IndustryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = IndustryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SkillDefaultArgs instead
     */
    export type SkillArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SkillDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserBehaviorDefaultArgs instead
     */
    export type UserBehaviorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserBehaviorDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ApplyHistoryDefaultArgs instead
     */
    export type ApplyHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ApplyHistoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use JobSourceTrackingDefaultArgs instead
     */
    export type JobSourceTrackingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = JobSourceTrackingDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}