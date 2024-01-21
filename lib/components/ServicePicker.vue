<script>
export default {

    props: {
        modelValue: null,
        required: {
            type: Boolean,
        },
        includeServices: {
            type: Array,
        },
    },

    emits: ['update:modelValue'],

    computed: {

        availableServices() {
            return this.includeServices || []
        },

        value: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            },
        },
    },
}
</script>

<template>
  <o-select v-model="value">
    <option v-if="!required" :value="null">(any)</option>
    <option v-for="svc in availableServices"
            :key="svc"
            :value="svc">
      {{ svc }}
    </option>
  </o-select>
</template>
