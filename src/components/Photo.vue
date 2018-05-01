<template>
  <div class="pure-g" >

    <div class="text-box pure-u-1 pure-u-md-1 pure-u-lg-1 pure-u-xl-1" >
      <div class="l-box" >
        <h1 class="text-box-head" >Photo Gallery</h1>
        <p class="text-box-subhead" >A collection of various photos from around world</p>
      </div>
    </div>

    <div class="photo-detail pure-u-1 pure-md-1 pure-u-lg-1 pure-u-xl-1" >
      <img v-bind:src="image_url_base + '/' + photo_id + '.' + type"/>
    </div>

    <button v-on:click="deleteImage" class="pure-button" >Delete this image</button>

  </div>
</template>

<script>
import axios from 'axios'

import auth from '../auth'
import config from '../config'

export default {
  data () {
    return {
      image_url_base: config.IMAGE_BASE_URL,
      photo_id: this.$route.params.photo_id,
      type: 'jpeg',
      labels: []
    }
  },

  created () {
    this.getImage()
  },

  methods: {
    getImage: function () {
      let authHeader = auth.getIdToken()
      axios
        .get(config.API_BASE_URL + '/images/' + this.photo_id, {
          headers: { Authorization: authHeader }
        })
        .then((res) => {
          console.log(res)
          this.$data.type = res.data.type.split('/')[1]
        })
    },

    deleteImage: function () {
      let authHeader = auth.getIdToken()
      axios
        .delete(config.API_BASE_URL + '/images/' + this.photo_id, {
          headers: { Authorization: authHeader }
        })
        .then((res) => {
          console.log(this.photo_id + 'is deleted')
          alert('Deleted the image.')
          self.$router.replace('/')
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
    padding: 1em .7em;
  }

  .text-box-head {
    color: #fff;
    padding-bottom: .2em;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: .05em;
    font-size: 24px;
  }

  .text-box-subhead {
    font-weight: normal;
    letter-spacing: .1em;
    text-transform: uppercase;
  }

  h1 {
    font-size: 2em;
    margin: .67em 0;
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

  .photo-detail img {
    max-width: 100%;
    min-height: 250px;
    height: auto;
  }

  .photo img {
    max-width: 100%;
    min-height: 250px;
    height: auto;
  }

  a {
    letter-spacing: 0em;
  }
</style>
