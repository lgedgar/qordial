<script setup>
import { mapStores } from 'pinia'
import { useQordialAuthStore } from '../stores/qordialAuth'
import ShortUniqueId from "short-unique-id"
import NameInput from './NameInput.vue'
</script>

<script>
export default {

    props: {
        appname: {
            type: String,
            default: "FEEDBACK COMPONENT IS MISSING 'appname' PROP!",
        }
    },

    data() {
        return {

            // TODO: for some reason this hack is needed, and cannot
            // figure out why. must start with dialog shown, then hide
            // it ASAP when component is mounted.  otherwise the modal
            // will not reflect the value of our showDialog flag!?
            showDialog: true,
            mountComplete: false,

            referrer: null,
            ticketType: null,
            ticketTypeOptions: [
                'bug-report',
                'feature-request',
                'comment',
            ],
            subject: null,
            description: null,
            ticketUID: new ShortUniqueId(),
            sending: false,
        }
    },

    computed: {
        ...mapStores(useQordialAuthStore),

        saveDisabled() {
            if (this.sending) {
                return true
            }
            if (!this.qordialAuthStore.username) {
                return true
            }
            if (!this.ticketType) {
                return true
            }
            if (!this.subject?.trim()) {
                return true
            }
            if (!this.description?.trim()) {
                return true
            }
            return false
        },
    },

    mounted() {
        // TODO: for some reason this hack is needed, and cannot
        // figure out why. must start with dialog shown, then hide
        // it ASAP when component is mounted.  otherwise the modal
        // will not reflect the value of our showDialog flag!?
        this.showDialog = false
        this.mountComplete = true
    },

    methods: {

        async initFeedback() {
            this.referrer = this.$route.fullPath
            this.ticketType = null
            this.subject = null
            this.description = null
            this.showDialog = true

            if (!this.qordialAuthStore.address) {
                await this.$qordial.authenticate()
            }
        },

        async publishFeedback() {
            this.sending = true

            const ticketID = this.ticketUID.rnd()
            const identifier = [
                'APPQC',
                this.appname,
                ticketID,
            ].join('_')

            let ticket = {
                appname: this.appname,
                app_referrer: this.$route.fullPath,
                ticket_type: this.ticketType,
                submitted_by: this.qordialAuthStore.username,
                submitted: Date.now(),
                subject: this.subject,
                description: this.description,
                status: (this.qordialAuthStore.username == this.appname) ? 'accepted' : 'unconfirmed',
                // "bounty_offered": null,
                // "bounty_type": null,
                ticket_id: ticketID,
                version: 1
            }

            // publish ticket to QDN
            let response
            try {
                response = await qortalRequest({
                    action: 'PUBLISH_QDN_RESOURCE',
                    name: this.qordialAuthStore.username,
                    service: 'DOCUMENT',
                    identifier,
                    data64: await this.$qordial.objectToBase64(ticket),
                })
            } catch (error) {

                // TODO: this should work, according to
                // https://oruga.io/components/Notification.html#programmatically
                // but i am just getting an error for now, cf.
                // https://github.com/oruga-ui/oruga/issues/734#issuecomment-1900862765
                // this.$oruga.notification.open({
                //     message: error?.error || error.toString(),
                //     rootClass: 'toast toast-notification',
                //     position: 'top',
                // })

                // TODO: so for now we just do this instead
                alert(`ERROR\n\n${error?.error || error.toString()}`)

                this.sending = false
                return
            }

            alert("Feedback has been submitted.")
            this.sending = false
            this.showDialog = false
        },
    },
}
</script>

<template>
  <div>
    <o-button @click="initFeedback()"
              variant="primary"
              icon-left="comment">
      Feedback
    </o-button>

    <o-modal v-model:active="showDialog">
      <div class="card">

        <div class="card-header">
          <div class="card-header-title">App Feedback</div>
        </div>

        <div class="card-content">

          <div style="display: flex; gap: 1rem;">

            <o-field label="Ticket Type">
              <o-select v-model="ticketType">
                <option v-for="type in ticketTypeOptions"
                        :key="type"
                        :value="type">
                  {{ type }}
                </option>
              </o-select>
            </o-field>

            <div style="flex-grow: 1;">
              <o-field label="App Name">
                <span>{{ appname }}</span>
              </o-field>
            </div>

            <o-field label="Your Name">
              <name-input />
            </o-field>

          </div>

          <o-field label="Subject">
            <o-input v-model.trim="subject" />
          </o-field>

          <o-field label="Description">
            <o-input v-model="description" type="textarea" />
          </o-field>

        </div>

        <div class="card-footer">
          <div class="card-footer-item buttons">

            <o-button variant="primary"
                      @click="publishFeedback()"
                      :disabled="saveDisabled">
              {{ sending ? "Working, please wait..." : "Submit Feedback" }}
            </o-button>

            <o-button @click="showDialog = false">
              Cancel
            </o-button>
          </div>
        </div>

      </div>
    </o-modal>
  </div>
</template>
