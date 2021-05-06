<template>
  <div>
    <h1 class="h2">{{ msg }}</h1>
    <LineChart v-if="loaded" :chartData="totalKmByDay" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LineChart from './Chart.vue';

export default {
  name: 'HelloWorld',
  components: {LineChart},
  data: function () {
    return {
      dates:{},
      chartLoaded:true,
      options:null,
      chartdata: [25,30,45,50]
    }
  },
  props: {
    msg: String
  },
  computed: {
    totalKmByDay () {
      if(this.loaded) {
        let kmByDay = []
        const dates = this.routes.map((route) => {
          return route.date
        })
        const uniqueDates = [...new Set(dates)]        
        uniqueDates.map((filteredDate) => {
          let totalKmTravelled=0;
          this.routes.map((route) => {
            let kmTravelled=0;
            kmTravelled = route.finalKm - route.initialKm;
            if(route.date === filteredDate) {
              totalKmTravelled = totalKmTravelled+kmTravelled;
            } 
          })
          kmByDay.push(totalKmTravelled)
        })
        const dataForChart = {
          labels:uniqueDates,
          datasets:[{
            label:'Total do dia',
            data:kmByDay,
            fill:false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        }
        return dataForChart;
      }
      return 'loading'
    },
  ...mapState([
    'routes',
    'loaded'
  ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
