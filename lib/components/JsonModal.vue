<script setup>
import VCodeBlock from '@wdns/vue-code-block'
</script>

<script>
export default {

    props: {
        active: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: "JSON",
        },
        json: {
            default: {},
        },
    },

    emits: ['update:active'],

    data() {
        return {
            modalActive: this.active,
        }
    },

    computed: {

        jsonString() {
            if (typeof(this.json) == 'string') {
                return this.json
            }
            return JSON.stringify(this.json, null, 2)
        },
    },

    watch: {
        modalActive(to, from) {
            this.$emit('update:active', to)
        },

        active(to, from) {
            this.modalActive = to
        },
    },
}
</script>

<template>
  <o-modal v-model:active="modalActive">
    <div class="card">

      <div class="card-header">
        <div class="card-header-title">
          <slot name="title">
            <span>{{ title }}</span>
          </slot>
        </div>
      </div>

      <div class="card-content">
        <VCodeBlock :code="jsonString" highlightjs />
      </div>
    </div>
  </o-modal>
</template>
