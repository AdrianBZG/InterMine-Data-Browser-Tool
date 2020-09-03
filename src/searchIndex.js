import { nanoid } from 'nanoid'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./searchIndex.worker.js'

class SearchIndex {
	constructor() {
		this._callbacks = new Map()
		this._worker = new Worker()

		this._worker.onerror = (event) => {
			const { callbackId, error } = event.data
			this._updateCallbacks({ callbackId, error, exportedDocs: {} })
		}

		this._worker.onmessage = (event) => {
			const { callbackId, exportedDocs } = event.data
			this._updateCallbacks({ callbackId, exportedDocs, error: null })
		}
	}

	index({ indexConfig, exportConfig, values, cacheKey, indexName }) {
		return new Promise((resolve, reject) => {
			const callbackId = nanoid()
			const data = {
				callbackId,
				resolve,
				reject,
				exportedDocs: {},
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

	_updateCallbacks({ callbackId, exportedDocs, error }) {
		const target = this._callbacks.get(callbackId)
		target.complete = true
		target.exportedDocs = exportedDocs
		target.error = error

		this._callbacks.forEach((data, key) => {
			if (!data.complete) {
				return
			}

			this._callbacks.delete(key)

			if (data.error) {
				data.reject(data.error)
			} else {
				data.resolve(data.exportedDocs)
			}
		})
	}
}

export const indexWorker = new SearchIndex()
