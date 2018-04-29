<template>
  <div id="app" >
    <div class="header" >
      <div class="pure-menu pure-menu-horizontal" >
        <a class="pure-menu-heading" href="" >Photo Gallery</a>
        <ul class="pure-menu-st" >
          <li class="pure-menu-item pure-menu-selected" >
            <a class="pure-menu-link" href="#">Home</a>
          </li>
          <li class="pure-menu-item">
            <a class="pure-menu-link" href="#upload-image">Upload</a>
          </li>
          <li class="pure-menu-item">
            <a class="pure-menu-link" href="#">Settings</a>
          </li>
          <li class="pure-menu-item">
            <a class="pure-menu-link" href="#">Login</a>
          </li>
        </ul>
      </div>
    </div>
    <router-view></router-view>
    <div class="footer">
      THis is sample app.
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.footer {
  color: #FFFFFF;
  font-size: 87.5%;
  border-top: 1px solid #eee;
  margin-top: 1em;
  padding: 1em;
  background: rgb(49, 49, 49);
}
</style>
