<template>
  <div ref="chartRef" style="width:100vw;height:100vh;"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import "echarts-gl";

const chartRef = ref(null);
let chart = null;

onMounted(async () => {
  chart = echarts.init(chartRef.value);
  chart.showLoading();

  // world.json fetch 및 등록
  const worldRes = await fetch("/world.json");
  const worldJson = await worldRes.json();
  echarts.registerMap("world", worldJson);

  // flights.json 데이터 fetch
  const res = await fetch("/flights.json");
  const data = await res.json();
  chart.hideLoading();

  function getAirportCoord(idx) {
    return [data.airports[idx][3], data.airports[idx][4]];
  }
  const routes = data.routes.map(airline => [getAirportCoord(airline[1]), getAirportCoord(airline[2])]);

  chart.setOption({
    geo3D: {
      map: "world",
      shading: "realistic",
      silent: true,
      environment: "#333",
      realisticMaterial: {
        roughness: 0.8,
        metalness: 0
      },
      postEffect: {
        enable: true
      },
      groundPlane: {
        show: false
      },
      light: {
        main: {
          intensity: 1,
          alpha: 30
        },
        ambient: {
          intensity: 0
        }
      },
      viewControl: {
        distance: 70,
        alpha: 89,
        panMouseButton: 'left',
        rotateMouseButton: 'right'
      },
      itemStyle: {
        color: '#000'
      },
      regionHeight: 0.5
    },
    series: [
      {
        type: 'lines3D',
        coordinateSystem: 'geo3D',
        effect: {
          show: true,
          trailWidth: 1,
          trailOpacity: 0.5,
          trailLength: 0.2,
          constantSpeed: 5
        },
        blendMode: 'lighter',
        lineStyle: {
          width: 0.2,
          opacity: 0.05
        },
        data: routes
      }
    ]
  });
});

onBeforeUnmount(() => {
  if (chart) chart.dispose();
});
</script>
