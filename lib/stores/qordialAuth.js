import { defineStore } from 'pinia'

export const useQordialAuthStore = defineStore('qordialAuth', {

    state: () => ({
        address: null,
        username: null,
    }),

    actions: {

        setAddress(address) {
            this.address = address
        },

        setUsername(username) {
            this.username = username
        },
    },
})
