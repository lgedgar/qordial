<script setup>
import useClipboard from 'vue-clipboard3'
</script>

<script>
export default {

    props: {
        value: {
            required: true,
        },
    },

    methods: {

        async copyIdentifier() {
            const { toClipboard } = useClipboard()
            await toClipboard(this.value)
        },
    },
}
</script>

<template>
  <span>
    {{ value }}
    <a v-if="value"
       href="#" @click.prevent="copyIdentifier()">
      <o-icon icon="copy" />
    </a>
  </span>
</template>
