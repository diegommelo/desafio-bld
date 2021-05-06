<template>
  <div id="app" class="col-lg-8 mx-auto p-3 py-md-5">
    <main>
      <div class="chart-cointaner">
        <ChartContainer msg="Welcome to Your Vue.js App"/>
      </div>
    </main>
  </div>
</template>

<script>
import ChartContainer from './components/ChartContainer.vue'

export default {
  name: 'App',
  components: {
    ChartContainer
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
