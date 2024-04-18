<script setup>
import { mapStores } from 'pinia'
import {useQordialAuthStore} from '../stores/qordialAuth'
</script>

<script>
export default {

    computed: {
        ...mapStores(useQordialAuthStore),
    },
}
</script>

<template>
  <div>

    <o-button v-if="!qordialAuthStore.address"
              variant="primary"
              @click="$qordial.authenticate()">
      please authenticate
    </o-button>

    <span v-if="qordialAuthStore.address">
      {{ qordialAuthStore.username }}
    </span>

  </div>
</template>
