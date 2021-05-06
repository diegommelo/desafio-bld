<template>
  <div id="app" class="container">
    <main class="col-lg-8 mx-auto mt-2">
      <Loader v-if="!loaded" />
      <div v-if="loaded">
        <h2 class="h2 text-center mb-4">Relatório de rotas por período</h2>
        <p class="text-center h4 mb-4">de {{parseDate(calculatedKmAndFines.period.initial)}} a {{parseDate(calculatedKmAndFines.period.final)}}</p>
        <ChartContainer 
          v-if="loaded" 
          :kmByDay="calculatedKmAndFines.kmByDay"
          :averageKmByDay="calculatedKmAndFines.averageKmByDay"
          :totalFinesByDay="calculatedKmAndFines.totalFinesByDay" 
          :uniqueDates="uniqueDates"
        />
      </div>
      <div v-if="loaded" class="container mt-4">
        <h3 class="h3 text-center mb-4">Total no período</h3>
        <div class="d-flex flex-md-row flex-column justify-content-center">
          <div class="m-2">
            <Card type="secondary">
              <template v-slot:header>
                KM Percorrido
              </template>
              <h3 class="h3">{{calculatedKmAndFines.totalKmOnPeriod}} km</h3>
            </Card>
          </div>
          <div class="m-2">
            <Card type="danger">
              <template v-slot:header>Multas</template>
              <h3 class="h3">R$ {{calculatedKmAndFines.totalFinesOnPeriod.toFixed(2)}}</h3>
            </Card>
          </div>
          <div class="m-2">
            <Card type="success">
              <template v-slot:header>Pacotes Entregues</template>
              <h3 class="h3">{{calculatedKmAndFines.totalDeliveredPackages}}</h3>
            </Card>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ChartContainer from './components/ChartContainer.vue'
import Card from './components/Card.vue'
import Loader from './components/Loader.vue'

export default {
  name: 'App',
  components: {
    ChartContainer,
    Card,
    Loader
  },
  methods: {
    parseDate: function (date) {
      return date.split('-').reverse().join('/');
    },
    getUniqueDates: function () {
      const dates = this.routes.map((route) => {
        return route.date
      })
      const uniqueDates = [...new Set(dates)]  
      return uniqueDates;
    },
    calcKmAndFines: function () {
      const uniqueDates = this.getUniqueDates();
      let kmByDay = [];
      let finesByDay = [];
      let averageKmByDay = [];
      let deliveredPackages= [];
      uniqueDates.map((filteredDate) => {
        let filteredRouteByDay = this.routes.filter((route) => {
          return route.date === filteredDate
        })
        let kmByRouteOnDay = filteredRouteByDay.map((route) => {
          return route.finalKm - route.initialKm
        })
        let totalKmOnDay = kmByRouteOnDay.reduce((sum,km) => sum+km)
        let totalFinesByDay = filteredRouteByDay.reduce((sum,route) => sum.finesTotalAmount+route.finesTotalAmount)
        let deliveredPackagesByDay = filteredRouteByDay.reduce((sum, route) => sum.deliveredPackages + route.deliveredPackages)
        
        kmByDay.push(totalKmOnDay)
        averageKmByDay.push(totalKmOnDay / filteredRouteByDay.length)
        finesByDay.push(totalFinesByDay)
        deliveredPackages.push(deliveredPackagesByDay)
      })  

      let totalKm = kmByDay.reduce((sum, km) => sum+km)
      let totalFines = finesByDay.reduce((sum, fine) => sum+fine)
      let totalDeliveredPackages = deliveredPackages.reduce((sum, pack) => sum+pack)

      return {
        'kmByDay': kmByDay,
        'totalFinesByDay': finesByDay,
        'averageKmByDay': averageKmByDay,
        'totalKmOnPeriod': totalKm,
        'totalFinesOnPeriod': totalFines,
        'totalDeliveredPackages': totalDeliveredPackages,
        'period':{
          'initial':uniqueDates[0],
          'final':uniqueDates[uniqueDates.length -1]
        }
      };    
    }
  },
  mounted: function () {
    this.$store.dispatch('getRoutes')
  },
  computed: {
    calculatedKmAndFines () {
      return this.loaded ? this.calcKmAndFines() : null
    },
    uniqueDates () {
      return this.loaded ? this.getUniqueDates() : null
    },
  ...mapState([
    'routes',
    'loaded'
  ])
  }
}
</script>

<style>
body {
  background-color:#F3F4F6;
}
</style>
