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
            let blob

            try {
                blob = await this.fetchResource(resource)
            } catch (error) {
                alert("fetch error:\n\n" + JSON.stringify(error, null, 2))
                return
            }

            let mimeType
            if (this.jsonServices.includes(resource.service)) {
                // TODO: i was previously "pretty-formatting" the JSON here, but
                // no longer think that is a good idea.  maybe should remove this
                // altogether and force mime type sniffing?
                mimeType = 'application/json'

            } else {
                mimeType = await this.sniffMimeType(resource)
            }
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

            // wait for the fetch to complete, then return blob
            response = await response
            const blob = await response.blob()
            this.downloading = false
            return blob
        },

        async downloadProgressUpdate(resource) {

            // get current status
            const response = await qortalRequest({
                action: 'GET_QDN_RESOURCE_STATUS',
                service: resource.service,
                name: resource.name,
                identifier: resource.identifier,
            })

            // update progress display
            this.downloadResourceStatus = response

            // keep doing this until download completes
            if (this.downloading) {
                setTimeout(this.downloadProgressUpdate, 1000, resource)
            }
        },

        async sniffMimeType(resource) {
            const response = await qortalRequest({
                action: 'GET_QDN_RESOURCE_PROPERTIES',
                service: resource.service,
                name: resource.name,
                identifier: resource.identifier,
            })
            return response?.mimeType
        },

        async saveFile(resource, blob, options) {
            const mimeType = options?.mimeType
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
            {{ downloadResourceStatus.status }}
          </o-field>
          <o-field label="ID" horizontal>
            {{ downloadResourceStatus.id }}
          </o-field>
          <o-field label="Title" horizontal>
            {{ downloadResourceStatus.title }}
          </o-field>
          <o-field label="Description" horizontal>
            {{ downloadResourceStatus.description }}
          </o-field>
          <o-field label="Local Chunk Count" horizontal>
            {{ downloadResourceStatus.localChunkCount }}
          </o-field>
          <o-field label="Total Chunk Count" horizontal>
            {{ downloadResourceStatus.totalChunkCount }}
          </o-field>
          <o-field label="Percent Loaded" horizontal>
            {{ downloadResourceStatus.percentLoaded }}
          </o-field>
        </div>

      </div>
    </div>
  </o-loading>
</template>
