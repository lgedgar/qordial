
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
        }
    },
}
