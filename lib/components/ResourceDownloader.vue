<script>
export default {

    data() {
        return {
            downloading: false,
            downloadResourceStatus: null,
            jsonServices: [
                'BLOG_COMMENT',
                'DOCUMENT',
                'PLAYLIST',
            ],
        }
    },

    methods: {

        async downloadResource(resource) {

            // fetch blob
            let blob
            try {
                blob = await this.fetchResource(resource)
            } catch (error) {
                if (error.error == 1401 && error.message) {
                    alert(error.message)
                } else {
                    console.log(error)
                    alert("fetchResource error:\n\n" + error)
                }
                return
            }

            // also need properties, for mimetype
            let properties
            try {
                properties = await qortalRequest({
                    action: 'GET_QDN_RESOURCE_PROPERTIES',
                    service: resource.service,
                    name: resource.name,
                    identifier: resource.identifier,
                })
            } catch(error) {
                if (error.error == 1401 && error.message) {
                    alert(error.message)
                } else {
                    console.log(error)
                    alert("properties error: \n\n" + error)
                }
                return
            }

            const mimeType = properties.mimeType
            const extension = {
                'application/json': 'json',
                'image/gif': 'gif',
                'image/jpeg': 'jpg',
                'image/png': 'png',
                'image/webp': 'webp',
                'video/mp4': 'mp4',
            }[mimeType] || 'dat'

            await this.saveFile(resource, blob, {mimeType, extension})
        },

        async fetchResource(resource) {
            this.downloading = true

            // nb. can't use $qordial.fetchResourceBlob() here since
            // we need to track progress after starting the fetch
            const url = `/arbitrary/${resource.service}/${resource.name}/${resource.identifier || 'default'}`
            let response = fetch(url)

            // start tracking progress, to show user
            this.downloadProgressUpdate(resource)

            // wait for the fetch to give us a blob
            try {
                response = await response
            } catch (error) {
                console.log(error)
                alert("await fetch error:\n\n" + error)
                throw new Error("and what about now")
            }

            // but no blob if resource not found
            if (response.status == 404) {
                this.downloading = false
                throw new Error("Got a 404 trying to fetch resource!")
            }

            const blob = await response.blob()

            // check properties to make sure fetch completed okay
            // (this may throw an error in which case that bubbles up)
            try {
                await qortalRequest({
                    action: 'GET_QDN_RESOURCE_PROPERTIES',
                    service: resource.service,
                    name: resource.name,
                    identifier: resource.identifier,
                })
            } catch (error) {
                this.downloading = false
                throw error
            }

            this.downloading = false
            return blob
        },

        async downloadProgressUpdate(resource) {

            // get current status
            let response
            try {
                response = await qortalRequest({
                    action: 'GET_QDN_RESOURCE_STATUS',
                    service: resource.service,
                    name: resource.name,
                    identifier: resource.identifier,
                })
            } catch(error) {
                console.log(error)
                alert("status error:\n\n" + error)
                return
            }

            // update progress display
            this.downloadResourceStatus = response

            // keep doing this until download completes
            if (this.downloading) {
                setTimeout(this.downloadProgressUpdate, 1000, resource)
            }
        },

        async saveFile(resource, blob, options) {
            const mimeType = options?.mimeType || 'application/octet-stream'
            const extension = options?.extension || 'dat'
            const filename = options?.filename || `${resource.identifier || resource.name}.${extension}`

            try {
                const response = await qortalRequest({
                    action: 'SAVE_FILE',
                    blob,
                    filename,
                    mimeType,
                })
                if (response !== true) {
                    alert("hm, did save fail!?")
                    return false
                }

            } catch (error) {
                // TODO: this seems awfully fragile but not sure how else to
                // check for the "user rejected" scenario, which can safely
                // be ignored.  (other errors should be shown)
                if (! ["User declined request",
                       "User declined the download",
                      ].includes(error.error)) {
                    alert("save error:\n\n" + JSON.stringify(error, null, 2))
                }
                return false
            }

            return true
        },
    },
}
</script>

<template>
  <o-loading full-page
             v-model:active="downloading"
             >
    <div class="card" style="min-width: 50rem;">
      <div class="card-header">
        <div class="card-header-title">Download in progress...</div>
      </div>
      <div class="card-content">

        <div v-if="downloadResourceStatus" style="white-space: nowrap;">
          <o-field label="Status" horizontal>
            {{ downloadResourceStatus.title }}
          </o-field>
          <o-field label="Description" horizontal>
            {{ downloadResourceStatus.description }}
          </o-field>
          <o-field label="Local Chunks" horizontal>
            {{ downloadResourceStatus.localChunkCount }}
          </o-field>
          <o-field label="Total Chunks" horizontal>
            {{ downloadResourceStatus.totalChunkCount }}
          </o-field>
          <o-field label="Percent Loaded" horizontal>
            {{ Number(downloadResourceStatus.percentLoaded / 100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}) }}
          </o-field>

          <progress class="progress is-large"
                    :value="downloadResourceStatus.localChunkCount"
                    :max="downloadResourceStatus.totalChunkCount" />
        </div>

      </div>
    </div>
  </o-loading>
</template>
