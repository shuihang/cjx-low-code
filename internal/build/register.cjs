// Ensure __name helper exists to satisfy transforms that reference it during eval
if (typeof globalThis.__name !== 'function') {
	globalThis.__name = function __name(fn) { return fn }
}
