<script>
export default {

    props: {
        value: {
            required: true,
        },
    },

    methods: {
        async showProfile() {
            await qortalRequest({
                action: 'OPEN_PROFILE',
                name: this.value,
            })
        },
    },
}
</script>

<template>
  <a href="#" @click.prevent="showProfile()">{{ value }}</a>
</template>
