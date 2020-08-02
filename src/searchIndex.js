import { nanoid } from 'nanoid'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./searchIndex.worker.js'

class SearchIndex {
	constructor() {
		this._callbacks = new Map()
		this._worker = new Worker()

		this._worker.onerror = (event) => {
			const { callbackId, error } = event.data
			this._updateCallbacks({ callbackId, error, hasBeenCached: false })
		}

		this._worker.onmessage = (event) => {
			const { callbackId, hasBeenCached } = event.data
			this._updateCallbacks({ callbackId, hasBeenCached, error: null })
		}
	}

	index({ indexConfig, exportConfig, values, cacheKey, indexName }) {
		return new Promise((resolve, reject) => {
			const callbackId = nanoid()
			const data = {
				callbackId,
				resolve,
				reject,
				hasBeenCached: false,
				error: null,
				complete: false,
			}

			this._callbacks.set(callbackId, data)

			this._worker.postMessage({
				values,
				indexConfig,
				exportConfig,
				callbackId,
				cacheKey,
				indexName,
			})
		})
	}

	_updateCallbacks({ callbackId, hasBeenCached, error }) {
		const target = this._callbacks.get(callbackId)
		target.complete = true
		target.hasBeenCached = hasBeenCached
		target.error = error

		this._callbacks.forEach((data, key) => {
			if (!data.complete) {
				return
			}

			this._callbacks.delete(key)

			if (data.error) {
				data.reject(data.error)
			} else {
				data.resolve(data.hasBeenCached)
			}
		})
	}
}

export const indexWorker = new SearchIndex()
