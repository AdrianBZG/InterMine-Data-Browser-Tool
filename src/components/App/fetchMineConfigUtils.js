import { fetchClasses, fetchInstances, fetchLists } from 'src/apiRequests'

export const interminesPromise = (cachedIntermines, registry) =>
	cachedIntermines ? Promise.resolve(cachedIntermines.intermines) : fetchInstances(registry)

export const modelClassesPromise = (cachedModelClasses, rootUrl) =>
	cachedModelClasses ? Promise.resolve(cachedModelClasses.modelClasses) : fetchClasses(rootUrl)

export const listsPromise = (cachedLists, rootUrl) =>
	cachedLists ? Promise.resolve(cachedLists.lists) : fetchLists(rootUrl)

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
