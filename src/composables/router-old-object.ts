import {
  computed,
  nextTick,
  ref,
  toValue,
  watch,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
  type UnwrapRef,
  type WritableComputedRef,
} from 'vue'
import {
  type LocationQueryRaw,
  type LocationQueryValue,
  type LocationQueryValueRaw,
  useRoute,
  useRouter,
} from 'vue-router'

const PENDING_QUERY_KEY = Symbol('pending-query')
declare module 'vue-router' {
  interface Router {
    /**
     * Allows pending queries to not be shared in SSR.
     * @internal
     */
    [PENDING_QUERY_KEY]: null | undefined | LocationQueryRaw
  }
}

// exported to ensure the same value is used across the app
export let pendingQuery: null | undefined | LocationQueryRaw

export function useRouteQuery_OLD<
  T extends LocationQueryValueRaw | LocationQueryValueRaw[] = string,
>(
  name: string,
  {
    // consider them as strings by default
    // @ts-ignore: the default format only works for a string
    format = (v: LocationQueryValueRaw | LocationQueryValueRaw[]): T => v || '',
    // delete them from the query if they are falsy by default
    deleteIf = (v: T | undefined | null) => !v,
  } = {},
) {
  const $route = useRoute()
  const $router = useRouter()

  return computed({
    get: () => format($route.query[name]),
    set(value: T) {
      const newQuery = pendingQuery || { ...$route.query }
      newQuery[name] = value

      if (deleteIf(value)) delete newQuery[name]

      if (!pendingQuery) {
        pendingQuery = newQuery
        nextTick().then(() => {
          $router.push({ query: pendingQuery! })
          pendingQuery = null
        })
      }
    },
  })
}

export interface UseRouteQueryOptions<T> {
  /**
   * Parses the raw value from the query into the desired type. By default, it handles natively strings, numbers and booleans, everything else is parsed as JSON.
   *
   * @param rawValue - The raw value from the query
   */
  parse?: (rawValue: LocationQueryValue | LocationQueryValue[]) => T

  /**
   * Serializes the value into a string that can be used in the query. By default, it uses `JSON.stringify` for objects and arrays, and `toString` for everything else.
   *
   * @param parsedValue - parsed value as returned by `parse` or set by the user
   */
  serialize?: (
    parsedValue: UnwrapRef<T> | undefined,
  ) => LocationQueryValueRaw | LocationQueryValueRaw[]

  /**
   * Deletes the value from the query if it returns `true`. By default, it deletes the value if it is `null` or `undefined`.
   *
   * @param parsedValue - value to check if it should be deleted from the query
   */
  deleteIf?: (parsedValue: UnwrapRef<T> | undefined | null) => boolean
}

// TODO: how faster is to use startsWith twice
const IS_JSON_REGEX = /(?:^[{[]|^[1-9]\d*$)/

const DEFAULT_PARSER = <T>(
  rawValue: LocationQueryValue | LocationQueryValue[],
): T =>
  // run the arrays through the parser again
  Array.isArray(rawValue)
    ? rawValue.map(DEFAULT_PARSER)
    : rawValue &&
        (IS_JSON_REGEX.test(rawValue) ||
          rawValue === 'false' ||
          rawValue === 'true' ||
          rawValue === 'null')
      ? JSON.parse(rawValue)
      : rawValue // just the string

const DEFAULT_SERIALIZER = <T>(
  parsedValue: T,
): LocationQueryValueRaw | LocationQueryValueRaw[] =>
  Array.isArray(parsedValue)
    ? (parsedValue.map(DEFAULT_SERIALIZER) as LocationQueryValueRaw[])
    : parsedValue == null
      ? null
      : typeof parsedValue === 'object'
        ? JSON.stringify(parsedValue)
        : parsedValue.toString()

export const DEFAULT_OPTIONS = {
  parse: DEFAULT_PARSER,
  serialize: DEFAULT_SERIALIZER,
  deleteIf: <T>(v: T) => v == null,
} satisfies UseRouteQueryOptions<
  null | undefined | Record<string, unknown> | number | string | unknown[]
>

export function useRouteQuery<T extends string>(
  name: string,
  defaultValue?: T,
  // optional for strings
  options?: UseRouteQueryOptions<T>,
): Ref<UnwrapRef<T>>
export function useRouteQuery<T>(
  name: string,
  // required for anything else
  defaultValue: MaybeRefOrGetter<T>,
  options?: UseRouteQueryOptions<T>,
): Ref<UnwrapRef<T>>
export function useRouteQuery<T>(
  name: string,
  defaultValue?: MaybeRefOrGetter<T>,
  options?: UseRouteQueryOptions<T>,
): Ref<UnwrapRef<T> | undefined> {
  const $route = useRoute()
  const $router = useRouter()

  const { parse, serialize, deleteIf } = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  const queryValue = ref<T | undefined>(
    name in $route.query ? parse($route.query[name]) : toValue(defaultValue),
  )

  watch(
    () => parse($route.query[name]),
    (value) => {
      console.log(`parsed value`, value)
      queryValue.value = value as UnwrapRef<T>
    },
  )

  watch(
    queryValue,
    (value, oldValue) => {
      console.log(`queryValue change`, name, value)
      // the whole value was replaced with the watcher above
      // so we the route is already up to date
      if (value !== oldValue) return

      const newQuery = $router[PENDING_QUERY_KEY] || { ...$route.query }

      if (deleteIf(value)) {
        delete newQuery[name]
        console.log('deleted value', name)
      } else {
        newQuery[name] = serialize(value)
        console.log('serialized value', name, newQuery[name])
      }

      // only setups the push once
      if (!$router[PENDING_QUERY_KEY]) {
        $router[PENDING_QUERY_KEY] = newQuery
        nextTick().then(() => {
          $router.push({ query: $router[PENDING_QUERY_KEY]! })
          $router[PENDING_QUERY_KEY] = null
        })
      }
    },
    { deep: true },
  )

  return queryValue
}
