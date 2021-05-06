<template>
  <div id="app" class="container">
    <main class="col-lg-8 mx-auto mt-2">
      <p class="text-center mx-auto" v-if="!loaded">Carregando...</p>
      <div v-if="loaded">
        <h2 class="h2 text-center mb-4">Relatório de rotas por período</h2>
        <p class="text-center h4 mb-4">de {{parseDate(calculatedKmAndFines.period.initial)}} a {{parseDate(calculatedKmAndFines.period.final)}}</p>
        <ChartContainer 
          v-if="loaded" 
          :kmByDay="calculatedKmAndFines.kmByDay"
          :averageKmByDay="calculatedKmAndFines.averageKmByDay"
          :totalFinesByDay="calculatedKmAndFines.totalFinesByDay" 
          :uniqueDates="getPeriod"
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
import { mapGetters, mapState } from 'vuex'
import ChartContainer from './components/ChartContainer.vue'
import Card from './components/Card.vue'

export default {
  name: 'App',
  components: {
    ChartContainer,
    Card
  },
  methods: {
    parseDate: function (date) {
      return date.split('-').reverse().join('/');
    },
    calcKmAndFines: function () {
      let kmByDay = [];
      let finesByDay = [];
      let averageKmByDay = [];
      let deliveredPackages= [];

      this.getFilteredRoutesByDay.map((route) => {
        let kmByRouteOnDay = route.map((filteredRoute) => filteredRoute.finalKm - filteredRoute.initialKm)
        let totalKmOnDay = kmByRouteOnDay.reduce((sum,km) => sum+km)
        let totalFinesByDay = route.reduce((sum,fine) => sum.finesTotalAmount + fine.finesTotalAmount)
        let deliveredPackagesByDay = route.reduce((sum, pack) => sum.deliveredPackages + pack.deliveredPackages)
        finesByDay.push(totalFinesByDay)
        kmByDay.push(totalKmOnDay)
        averageKmByDay.push(totalKmOnDay / route.length)
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
          'initial':this.getPeriod[0],
          'final':this.getPeriod[this.getPeriod.length -1]
        }
      };    
    }
  },
  mounted: function () {
    this.$store.dispatch('actionRoutes')
  },
  computed: {
    calculatedKmAndFines () {
      return this.loaded ? this.calcKmAndFines() : null
    },
  ...mapState([
    'routes',
    'loaded'
  ]),
  ...mapGetters([
    'getPeriod',
    'getFilteredRoutesByDay'    
  ])
  }
}
</script>

<style>
body {
  background-color:#F3F4F6;
}
</style>
