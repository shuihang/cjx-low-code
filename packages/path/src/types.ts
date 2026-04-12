import type { Path } from './path'

export type Segments = Array<string | number>

export type MatcherFunction = ((path: Segments) => boolean) & {
  path: Path
}

export type Pattern = string | number | Path | Segments | MatcherFunction | RegExp

export type DestructorRule = {
  key?: string | number
  path?: Array<number | string>
}

export type DestructorRules = DestructorRule[]
