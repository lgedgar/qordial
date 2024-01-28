<script setup>
import CopyableText from './CopyableText.vue'
</script>

<script>
export default {

    props: {
        value: {
            required: true,
        },
    },
}
</script>

<template>
  <CopyableText :text="value" />
</template>
