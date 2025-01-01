<template>
    <div ref="chart" :style="{ width: '100%', height: '500px' }"></div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import * as echarts from 'echarts';
  
  // Define props for dynamic chart data
  const props = defineProps<{
    categories: string[];
    seriesData: number[];
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
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: props.categories,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: props.seriesData,
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
  
  // Watch for prop changes to update the chart dynamically
  watch(
    () => [props.categories, props.seriesData],
    () => {
      if (echartsInstance) {
        echartsInstance.setOption({
          xAxis: [
            {
              data: props.categories,
            },
          ],
          series: [
            {
              data: props.seriesData,
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
  