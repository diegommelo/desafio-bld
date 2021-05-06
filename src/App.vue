<template>
  <div id="app" class="col-lg-8 mx-auto p-3 py-md-5">
    <main>    
      <HelloWorld msg="Welcome to Your Vue.js App"/>
    </main>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  methods: {

  },
  mounted: function () {
    this.$store.dispatch('getRoutes')
  }
}
</script>

<style>
#app {

}
body {
  font-size: .875rem;
}

</style>
