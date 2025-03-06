declare module 'util/util' {
  export function debuglog(section: string): (msg: string, ...args: any[]) => void;
  export function inspect(object: any, options?: {
    showHidden?: boolean;
    depth?: number | null;
    colors?: boolean;
    customInspect?: boolean;
    showProxy?: boolean;
    maxArrayLength?: number | null;
    breakLength?: number;
    compact?: boolean;
    sorted?: boolean;
    getters?: boolean;
  }): string;
  export function format(format: any, ...param: any[]): string;
  export function isArray(object: any): boolean;
  export function isBoolean(object: any): boolean;
  export function isNull(object: any): boolean;
  export function isNullOrUndefined(object: any): boolean;
  export function isNumber(object: any): boolean;
  export function isString(object: any): boolean;
  export function isSymbol(object: any): boolean;
  export function isUndefined(object: any): boolean;
  export function isRegExp(object: any): boolean;
  export function isObject(object: any): boolean;
  export function isDate(object: any): boolean;
  export function isError(object: any): boolean;
  export function isFunction(object: any): boolean;
  export function isPrimitive(object: any): boolean;
  export function isBuffer(object: any): boolean;
} 