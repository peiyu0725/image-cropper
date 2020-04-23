<template>
  <div id="app">
    <h1>Image Cropper Component</h1>
    <img-cropper-upload
            :img-list="logo_img"
            :fixed-number="cropLogoOption.fixedNumber"
            :auto-crop-width="cropLogoOption.autoCropWidth"
            :auto-crop-height="cropLogoOption.autoCropHeight"
            :limit=1 :img-type="['jpg']"
            id="img" get-id="img">
    </img-cropper-upload>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      logo_img: [],
      cropLogoOption: {
          img: '',
          autoCropWidth: 480,
          autoCropHeight: 320,
          fixedNumber: [3, 2]
      },
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
