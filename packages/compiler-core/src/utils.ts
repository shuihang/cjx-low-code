const nonIdentifierRE = /^\d|[^$\w]/
export const isSimpleIdentifier = (name: string): boolean => !nonIdentifierRE.test(name)
