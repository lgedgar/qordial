
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
