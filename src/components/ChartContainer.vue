<template>
  <div>
    <h1 class="h2">{{ msg }}</h1>
    <LineChart v-if="loaded" :chartData="chartData" :options="options" :width="400" :height="400" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LineChart from './Chart.vue';

export default {
  name: 'ChartContainer',
  components: {LineChart},
  data: function () {
    return {
      dates:{},
      chartLoaded:true,
      options:{
        responsive:true,
        maintainAspectRatio:false
      },
    }
  },
  props: {
    msg: String
  },
  methods: {
    getUniqueDates: function () {
      const dates = this.routes.map((route) => {
        return route.date
      })
      const uniqueDates = [...new Set(dates)]  
      return uniqueDates;
    },
    calcKmAndFinesByDay: function () {
      const uniqueDates = this.getUniqueDates();
      let kmByDay = [];
      let finesByDay = [];
      let averageKmByDay = [];
      uniqueDates.map((filteredDate) => {
        let filteredRouteByDay = this.routes.filter((route) => {
          return route.date === filteredDate
        })
        let kmByRouteOnDay = filteredRouteByDay.map((route) => {
          return route.finalKm - route.initialKm
        })
        let totalKmOnDay = kmByRouteOnDay.reduce((sum,km) => sum+km)
        let totalFinesByDay = filteredRouteByDay.reduce((sum,route) => sum.finesTotalAmount+route.finesTotalAmount)
       
        kmByDay.push(totalKmOnDay)
        averageKmByDay.push(totalKmOnDay / filteredRouteByDay.length)
        finesByDay.push(totalFinesByDay)
      })  
      return {
        'kmByDay': kmByDay,
        'totalFinesByDay': finesByDay,
        'averageKmByDay': averageKmByDay
      };    
    },
  },
  computed: {
    chartData () {
      if(this.loaded) {
        const finesAndKmByDay = this.calcKmAndFinesByDay();
        const uniqueDates = this.getUniqueDates();
        const formatDataForChart = {
          labels:uniqueDates,
          datasets:[{
            label:'Total de Km',
            data:finesAndKmByDay.kmByDay,
            fill:false,
            borderColor: 'rgb(75, 192, 192)',
            borderDash:[5,5]
          },
          {
            label: 'Média de Km',
            data:finesAndKmByDay.averageKmByDay,
            fill:false,
            borderColor: 'rgb(0,0,0)',
            borderDash:[5,5]
          },
          {
            label: 'Total de multas',
            data:finesAndKmByDay.totalFinesByDay,
            fill:false,
            borderColor: 'rgb(255,74,0)',
          }]
        }
        return formatDataForChart;
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
