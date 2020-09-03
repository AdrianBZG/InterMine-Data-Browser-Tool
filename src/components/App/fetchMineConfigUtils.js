export const maybeFetchPromise = (cachedValue, fetchFn) => {
	return cachedValue ? Promise.resolve(cachedValue) : fetchFn()
}

export const interminesConfig = (interminesResp) =>
	interminesResp.data.instances.map((mine) => ({
		name: mine.name,
		rootUrl: mine.url,
	}))

export const modelClassesConfig = (modelClassesResp) =>
	Object.entries(modelClassesResp.classes)
		.map(([_key, value]) => ({
			displayName: value.displayName,
			name: value.name,
		}))
		.sort((a, b) => a.name.localeCompare(b.name))

export const listsConfig = (listsResp) =>
	listsResp.map(({ name, title, type }) => ({ name, title, type }))
