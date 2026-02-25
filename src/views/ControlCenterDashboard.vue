</script>

<style scoped>
.map-wrapper {
  width: 100vw;
  height: 100vh;
  background: #000;
  position: relative;
}

.map {
  width: 100vw;
  height: 100vh;
  min-width: 400px;
  min-height: 400px;
  background: #000;
}
</style>
<template>
  <div class="map-wrapper">
    <div ref="chartRef" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
import axios from "axios";

const chartRef = ref(null);
let chart = null;
const totalCallCnt = ref(0);

onMounted(async () => {
  chart = echarts.init(chartRef.value);
  chart.showLoading();

  await fetch("/world.json"); // globe 배경 fetch (필요시 텍스처 적용)

  try {
    const res = await axios.get("/api/stats");
    const data = Array.isArray(res.data) ? res.data : [];
    totalCallCnt.value = data.reduce((sum, r) => sum + (r.callCnt || 0), 0);

    console.log("API stats data:", data);


    const linesData = data
      .filter(r => r.srcX !== undefined && r.srcY !== undefined && r.destX !== undefined && r.destY !== undefined)
      .map(r => {
        const coords = [
          [r.srcX, r.srcY],
          [r.destX, r.destY]
        ];
        const line = {
          coords,
          value: r.callCnt,
          lineStyle: {
            width: Math.max(1, Math.log(r.callCnt + 1)),
            color: r.HTTP_STACD_VAL === "200" ? "#00ffff" : "#ff3333",
            opacity: 0.8
          },
          effect: {
            show: true,
            period: Math.max(1, 8 - Math.min(8, r.avgDurationSec)),
            trailWidth: 4,
            trailLength: 0.4,
            trailOpacity: 1,
            trailColor: r.HTTP_STACD_VAL === "200" ? "#00ffff" : "#ff3333"
          }
        };
        console.log("linesData row", line);
        return line;
      });

    console.log("linesData 개수:", linesData.length);
    if (linesData.length === 0) {
      console.warn("linesData가 비어있음. 시각화 데이터 없음.");
      chart.hideLoading();
      return;
    }

    chart.hideLoading();
    chart.setOption({
      backgroundColor: "#000",
      globe: {
        baseTexture: '/world.jpg', // Vue CLI는 public/ 경로를 /로 접근
        shading: "realistic",
        environment: "#222",
        realisticMaterial: {
          roughness: 0.8,
          metalness: 0
        },
        postEffect: {
          enable: true
        },
        light: {
          main: { intensity: 1.5, shadow: true },
          ambient: { intensity: 0.4 }
        },
        viewControl: {
          autoRotate: true,
          distance: 180,
          alpha: 25
        }
      },
      series: [
        {
          type: "lines3D",
          coordinateSystem: "globe",
          blendMode: "lighter",
          data: linesData
        }
      ]
    });
  } catch (e) {
    chart.hideLoading();
    console.error("API 호출 실패:", e);
  }
});

onBeforeUnmount(() => {
  if (chart) chart.dispose();
});

</script>