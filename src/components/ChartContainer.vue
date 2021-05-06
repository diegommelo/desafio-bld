<template>
  <div>
    <LineChart 
      v-if="this.$store.state.loaded" 
      :chartData="chartData" 
      :options="options" 
      :width="400" 
      :height="400" 
    />
  </div>
</template>

<script>
import LineChart from './Chart.vue';

export default {
  name: 'ChartContainer',
  components: {LineChart},
  props: {
    kmByDay:Array,
    averageKmByDay:Array,
    totalFinesByDay:Array,
    uniqueDates:Array
  },  
  data() {
    return {
      options:{    
        responsive:true,
        maintainAspectRatio:false,
        scales: {
          xAxes: [{
            ticks: {
              callback: function(value)  {
                return value.split('-').reverse().join('/').slice(0,5);
              }
            }
          }]
        }
      }
    }
  },
  computed: {
    chartData () {
        const formatDataForChart = {
          labels:this.uniqueDates,
          datasets:[{
            label:'Km percorrido',
            data:this.kmByDay,
            fill:false,
            borderColor: 'rgb(75, 192, 192)',
            lineTension: 0
          },
          {
            label: 'Média de Km',
            data:this.averageKmByDay,
            fill:false,
            borderColor: 'rgb(0,0,0)',
            borderDash:[5,5],
            lineTension:0
          },
          {
            label: 'Total de Multas',
            data:this.totalFinesByDay,
            fill:false,
            borderColor: 'rgb(255,74,0)',
            lineTension:0
          }]
        }
        return formatDataForChart;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
