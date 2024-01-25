
import {useQordialAuthStore} from './stores/qordialAuth'

export const QordialPlugin = {

    install(app, options) {
        app.config.globalProperties.$qordial = {

            async authenticate() {
                const authStore = useQordialAuthStore()
                let response

                try {
                    response = await qortalRequest({action: 'GET_USER_ACCOUNT'})
                    authStore.setAddress(response.address)
                } catch (error) {
                    // nb. presumably user rejected the auth request;
                    // we can safely ignore that
                    return false
                }

                response = await qortalRequest({
                    action: 'GET_ACCOUNT_NAMES',
                    address: authStore.address,
                    limit: 1,
                })
                if (response?.[0]?.name) {
                    authStore.setUsername(response[0].name)
                }

                return true
            },

            async confirmPublish(resource) {
                let msg
                if (await this.resourceExists(resource)) {
                    msg = "Resource already EXISTS.\n\n" +
                        "This will OVERWRITE the resource."
                } else {
                    msg = "Resource does NOT yet exist.\n\n" +
                        "This will CREATE a new resource."
                }
                return confirm(msg + "\n\nContinue?")
            },

            async fetchResourceBlob(resource) {
                // TODO: for some reason FETCH_QDN_RESOURCE does not work
                // as i expect it to, and/or i was somehow using it wrong.
                // at any rate it kept giving me bad data, so now am just
                // using the core API directly to fetch all resources
                const url = `/arbitrary/${resource.service}/${resource.name}/${resource.identifier}`
                const response = await fetch(url)
                return await response.blob()
            },

            async fetchResourceObject(resource) {
                const blob = await this.fetchResourceBlob(resource)
                return JSON.parse(await blob.text())
            },

            // TODO: deprecate / remove this
            async fetchResourceJSON(resource) {
                // TODO: how does one properly announce deprecation in JS?
                // bonus points for showing stack trace to help track it down
                console.log("WARNING: fetchResourceJSON() is deprecated; use fetchResourceObject() instead")
                return await this.fetchResourceObject(resource)
            },

            async fetchResourceMetadata(resource) {
                // TODO: i don't have much luck with GET_QDN_RESOURCE_METADATA,
                // sometimes it just times out for me? anyway will just use
                // core API instead to be safe, for now
                const url = `/arbitrary/metadata/${resource.service}/${resource.name}/${resource.identifier}`
                const response = await fetch(url)
                if (response.status == 404) {
                    return
                }
                return await response.json()
            },

            // nb. this function was copied/adapted from
            // https://github.com/Qortal/q-tube/blob/0b78f493860ca0800a39524fceef3e9306b30c32/src/utils/toBase64.ts#L1
            async fileToBase64(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(file)

                    reader.onload = () => {
                        const result = reader.result
                        reader.onload = null // remove onload handler
                        reader.onerror = null // remove onerror handler
                        resolve(result)
                    }

                    reader.onerror = (error) => {
                        reader.onload = null // remove onload handler
                        reader.onerror = null // remove onerror handler
                        reject(error)
                    }
                })
            },

            // nb. this was copied from https://stackoverflow.com/a/18650828
            formatBytes(bytes, decimals = 2) {
                if (!+bytes) return '0 Bytes'

                const k = 1024
                const dm = decimals < 0 ? 0 : decimals
                const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

                const i = Math.floor(Math.log(bytes) / Math.log(k))

                return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
            },

            async objectToBase64(obj) {
                return await this.stringToBase64(JSON.stringify(obj))
            },

            async resourceExists(resource) {
                const response = await qortalRequest({
                    action: 'LIST_QDN_RESOURCES',
                    service: resource.service,
                    name: resource.name,
                    identifier: resource.identifier,
                    limit: 1,
                })
                return !!response.length
            },

            // nb. this function was copied/adapted from
            // https://github.com/Qortal/q-shop/blob/98c5e7d37d7d00d1bf3290d24afe5f20388e1885/src/utils/toBase64.ts#L11
            async stringToBase64(string) {

                // // Step 1: Convert the object to a JSON string
                // const string = JSON.stringify(obj)

                // Step 2: Create a Blob from the JSON string
                const blob = new Blob([string], { type: 'application/json' })

                // Step 3: Create a FileReader to read the Blob as a base64-encoded string
                return new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        if (typeof reader.result === 'string') {
                            // Remove 'data:application/json;base64,' prefix
                            const base64 = reader.result.replace(
                                'data:application/json;base64,',
                                ''
                            )
                            resolve(base64)
                        } else {
                            reject(new Error('Failed to read the Blob as a base64-encoded string'))
                        }
                    }
                    reader.onerror = () => {
                        reject(reader.error)
                    }
                    reader.readAsDataURL(blob)
                })
            },
        }
    },
}
