<script setup>
import moment from 'moment'
import { mapStores } from 'pinia'
import {useQordialAuthStore} from '../stores/qordialAuth'
</script>

<script>
export default {

    props: {
        value: null,
    },
}
</script>

<template>
  <div>
    <span v-if="value"
          :title="new Date(value)">
      {{ moment(value).fromNow() }}
    </span>
  </div>
</template>
