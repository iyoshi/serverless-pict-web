<template>

    <div class="pure-g" >
      <div class="text-box pure-u-l pure-u-md-1 pure-u-lg-1 pure-u-xl-1" >
        <div class="l-box">
          <h1 class="text-box-head">Photo Gallery</h1>
          <p class="text-box-subhead" >A Collection of various photos from around the world</p>
        </div>
      </div>

      <div v-for="image in images" :key="image.photo_id" class="photo pure-u-1-3 pure-u-md-1-3 pure-u-lg-1-3 pure-u-xl-1-3" >
        <router-link v-bind:to="{ name: 'Photo' ,params: { photo_id: image.photo_id }}" >
            <img v-bind:src="image_url_base + '/' +image.photo_id + '.' + image.type.split('/')[1]" />
        </router-link>
      </div>

      <div class="pure-u-1 form-box" id="upload-image" >
        <div class="l-box">
          <h2>Upload a photo</h2>
          <input v-on:change="onFileChange" type="file" name="file" placeholder="Photo from your computer" accept="image/*" required />
          <button v-on:click="uploadImage" class="pure-button pure-button-primary">Upload</button>
        </div>
      </div>

    </div>
</template>

<script>
import * as AWS from 'aws-sdk'
import axios from 'axios'

import auth from '../auth'
import config from '../config'

export default {

  data () {
    return {
      image_url_base: config.IMAGE_BASE_URL,
      uploadFile: null,
      images: []
    }
  },

  created () {
    this.listImages()
  },

  methods: {

    listImages: function () {
      let self = this
      let authHeader = auth.getIdToken()

      axios
        .get(config.API_BASE_URL + '/images', {
          headers: {
            'Authorization': authHeader
          }
        })
        .then((res) => {
          console.log(JSON.stringify(res.data))
          const images = res.data
          self.$data.images = images.photos
        })
    },

    onFileChange: function (event) {
      this.uploadFile = event.target.files[0]
    },

    uploadImage: function () {
      let file = this.uploadFile
      let json = null
      let _this = this

      const data = {
        size: file.size,
        type: file.type
      }

      let authHeader = auth.getIdToken()

      axios
        .post(config.API_BASE_URL + '/images', JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          }
        })
        .then((res) => {
          json = JSON.parse(JSON.stringify(res.data))

          AWS.config.region = config.AWS_REGION
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.COGNITO_IDENTITY_POOL_ID
          })

          let s3 = new AWS.S3()
          s3
            .upload({
              Bucket: config.PHOTOS_BUCKET,
              Key: json.photo_id + '.' + file.type.split('/')[1],
              Body: file,
              ContentType: data.type
            })
            .promise()
            .then((res) => {
              json.status = 'uploaded'
              axios
                .put(config.API_BASE_URL + '/images', json, {
                  headers: {
                    'Authorization': authHeader
                  }
                })
                .then((res) => {
                  alert('Successfully upload photo.')
                  _this.$router.go(_this.$router.currentRoute)
                })
            })
            .catch((err) => {
              alert(err)
              console.log(err)
            })
        })
        .catch((err) => {
          alert(err)
        })
    }
  }
}

</script>

<style>
  .header .pure-menu {
    border-bottom-color: black;
    border-radius: 0;
  }

  .pure-menu-link {
    padding: 1em 0.7em;
  }

  .text-box-head {
    color: #fff;
    padding-bottom: 0.2em;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 24px;
  }

  .text-box-subhead {
    font-weight: normal;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }

  .l-box {
    padding: 2em;
  }

  .text-box {
    text-align: left;
    overflow: hidden;
    position: relative;
    height: 180px;
    background: rgb(49, 49, 49);
    color: rgb(255, 190, 94);
  }

  .photo {
    height: 250px;
    overflow: hidden;
  }

  .photo img {
    max-width: 100%;
    min-height: 250px;
    height: auto;
  }

</style>
