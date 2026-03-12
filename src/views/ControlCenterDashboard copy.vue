<template>
  <div ref="chartRef" style="width:100vw;height:100vh;"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import "echarts-gl";

const chartRef = ref(null);
let chart = null;
let detailDiv = null;

onMounted(async () => {
  chart = echarts.init(chartRef.value);
  chart.showLoading();

  // 지도 데이터 로드
  const worldRes = await fetch("/world.json");
  const worldJson = await worldRes.json();
  echarts.registerMap("world", worldJson);

  // API 데이터 로드
  const res = await fetch("/api/data");
  const data = await res.json();

  console.log("API 데이터:", data);

  chart.hideLoading();

  // 좌표 생성 함수
  function getRandomCountryCoord(code) {
    if (code === "002") {
      return [ -125 + Math.random() * 59, 24 + Math.random() * 25 ]; // 미국
    } else if (code === "003") {
      return [ 113 + Math.random() * 40, -44 + Math.random() * 34 ]; // 호주
    } else if (code === "999") {
      // 러시아 전역: 경도 37~180, 위도 41~81 (동서/남북 최대 범위)
      const lon = 37 + Math.random() * 143; // 37~180
      const lat = 41 + Math.random() * 40;  // 41~81
      return [lon, lat];
    } else {
      //return [ 126.8 + Math.random() * 0.3, 37.4 + Math.random() * 0.3 ]; // 서울
      return [ 15.2663 + Math.random() * 0.3, -4.4419 + Math.random() * 0.3 ]; // 콩고
    }
  }
  function getRandomKoreaCoord() {
    return [ 15.2663 + Math.random() * 3.5, -4.4419 + Math.random() * 4.5 ]; // 콩고
  }

  // 스타일 계산
  const maxDuration = Math.max(...data.map(item => item.avgDurationSec));
  const minDuration = Math.min(...data.map(item => item.avgDurationSec));
  const maxCallCnt = Math.max(...data.map(item => item.callCnt));
  const minCallCnt = Math.min(...data.map(item => item.callCnt));

  const routes = [];
  data.forEach(item => {
    // 색상
    const status = item.status || item.httpStatus || item.HTTP_STACD_VAL;
    let color;
    if (status === 200 || status === "200" || status === 200.0) {
      color = '#007aff';
    } else {
      const failPalette = ['#ff0000', '#ff3300', '#ff6600', '#ff9900', '#ffcc00'];
      let failIdx = 0;
      if (maxCallCnt !== minCallCnt) {
        failIdx = Math.floor(4 * (item.callCnt - minCallCnt) / (maxCallCnt - minCallCnt));
      }
      color = failPalette[failIdx];
    }
    // 두께
    let width = 1;
    if (maxCallCnt !== minCallCnt) {
      width = 1 + 9 * (item.callCnt - minCallCnt) / (maxCallCnt - minCallCnt);
    }
    // 속도
    let speed = 1;
    if (maxDuration !== minDuration) {
      speed = 1 + 99 * (maxDuration - item.avgDurationSec) / (maxDuration - minDuration);
    }
    // 양방향
    routes.push({
      coords: [getRandomCountryCoord(item.airport_code), getRandomKoreaCoord()],
      lineStyle: { color, width },
      effect: { speed },
      detail: item
    });
    routes.push({
      coords: [getRandomKoreaCoord(), getRandomCountryCoord(item.airport_code)],
      lineStyle: { color, width },
      effect: { speed },
      detail: item
    });
  });

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
      postEffect: { enable: true },
      groundPlane: { show: false },
      light: {
        main: { intensity: 1, alpha: 30 },
        ambient: { intensity: 0 }
      },
      viewControl: {
        distance: 70,
        alpha: 89,
        panMouseButton: 'left',
        rotateMouseButton: 'right',
        enablePick: true // 마우스 픽 활성화
      },
      itemStyle: { color: '#000' },
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
        lineStyle: { width: 0.2, opacity: 0.05 },
        data: routes
      }
    ]
  });

  // 상세 DIV 생성
  const detailDiv = document.createElement('div');
  detailDiv.style.position = 'fixed';
  detailDiv.style.background = 'rgba(30,30,30,0.95)';
  detailDiv.style.color = '#fff';
  detailDiv.style.padding = '10px 16px';
  detailDiv.style.borderRadius = '10px';
  detailDiv.style.fontSize = '13px';
  detailDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
  detailDiv.style.zIndex = 9999;
  detailDiv.style.display = 'none';
  detailDiv.style.pointerEvents = 'none';
  document.body.appendChild(detailDiv);

  // 클릭 이벤트로 div 표시
  chart.on('click', function(params) {

    console.log("params:", params);

    if (params.seriesType === 'lines' && params.data?.detail) {
      const d = params.data.detail;
      detailDiv.innerHTML = `
        <b>API_CALL_CD:</b> ${d.airport_code || ''}<br/>
        <b>ACCS_URL_PATH:</b> ${d.route_path || ''}<br/>
        <b>HTTP_STATUS:</b> ${d.status || ''}<br/>
        <b>callCnt:</b> ${d.callCnt || ''}<br/>
        <b>avgDurationSec:</b> ${d.avgDurationSec || ''}
      `;
      detailDiv.style.display = 'block';
      detailDiv.style.left = params.event.event.clientX + 15 + 'px';
      detailDiv.style.top = params.event.event.clientY + 15 + 'px';
    } else {
      detailDiv.style.display = 'none';
    }
  });

  // 화면 클릭 시 div 숨김
  chart.getZr().on('click', function() {
    if (detailDiv.style.display === 'block') {
      detailDiv.style.display = 'none';
    }
  });

  // onBeforeUnmount는 <script setup>에서 직접 사용해야 함
}); // <- 이 부분 제거

onBeforeUnmount(() => {
  if (chart) chart.dispose();
  if (detailDiv) document.body.removeChild(detailDiv);
});
</script>
