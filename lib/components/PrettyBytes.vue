<script>
export default {

    props: {
        value: null,
    },
}
</script>

<template>
  <span :title="`${value} bytes`">
    {{ $qordial.formatBytes(value) }}
  </span>

</template>
