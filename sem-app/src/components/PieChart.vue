<template>
    <div ref="chart" :style="{ width: '100%', height: '500px' }"></div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import * as echarts from 'echarts';
  
  // Define the chart data type
  interface ChartData {
    value: number;
    name: string;
  }
  
  // Define the props for chartData
  const props = defineProps<{
    chartData: ChartData[];
  }>();
  
  // Refs
  const chart = ref<HTMLDivElement | null>(null);
  let echartsInstance: echarts.ECharts | null = null;
  
  // Initialize the chart
  const initChart = () => {
    if (chart.value) {
      echartsInstance = echarts.init(chart.value);
  
      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '5%',
          left: 'center',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: props.chartData, // Access chartData from props
          },
        ],
      };
  
      echartsInstance.setOption(option);
  
      // Resize on window resize
      window.addEventListener('resize', resizeChart);
    }
  };
  
  // Resize the chart
  const resizeChart = () => {
    if (echartsInstance) {
      echartsInstance.resize();
    }
  };
  
  // Cleanup
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart);
    if (echartsInstance) {
      echartsInstance.dispose();
    }
  });
  
  // Watch for prop changes
  watch(
    () => props.chartData, // Access chartData from props
    () => {
      if (echartsInstance) {
        echartsInstance.setOption({
          series: [
            {
              data: props.chartData, // Update chart data dynamically
            },
          ],
        });
      }
    },
    { deep: true }
  );
  
  // Mount the chart when the component is ready
  onMounted(() => {
    initChart();
  });
  </script>
  
  <style scoped>
  /* Optional styles for the chart container */
  </style>
  