<script setup>
import useClipboard from 'vue-clipboard3'
</script>

<script>
export default {

    props: {
        text: {
            required: true,
        },
    },

    methods: {

        async copyText() {
            const { toClipboard } = useClipboard()
            await toClipboard(this.text)
        },
    },
}
</script>

<template>
  <span>
    {{ text }}
    <a v-if="text"
       href="#" @click.prevent="copyText()">
      <o-icon icon="copy" />
    </a>
  </span>
</template>
