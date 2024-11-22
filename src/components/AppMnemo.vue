<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Pump } from '@/models/pump'
import { AnalogSensor } from '@/models/analog_sensor'
import { Container } from '@/models/container'
import AnalogSensorFaceplate from './AnalogSensorFaceplate.vue'

const ENABLED_COLOR = 'green'
const DISABLED_COLOR = 'gray'

const GOOD_COLOR = 'green'
const WARNING_COLOR = 'yellow'
const ALARM_COLOR = 'red'

const SIMULATION_STEP_SECONDS = 0.5

const pumpN1 = ref<Pump>(new Pump('H1', 5, 8, 1.5))
const sensorF1 = ref<AnalogSensor>(new AnalogSensor('F1', 'м3/ч', 0, 10))
const sensorL1 = ref<AnalogSensor>(new AnalogSensor('L1', '%', 0, 100, 10, 20))
const containerE1 = ref<Container>(new Container(0.5, 0.2))

const analogSensorFaceplate = ref<typeof AnalogSensorFaceplate>()

function init() {
  sensorF1.value.value = pumpN1.value.currentPerfomance
  sensorL1.value.value = containerE1.value.level
}

function doSimulation() {
  sensorF1.value.value = pumpN1.value.currentPerfomance
  sensorL1.value.value = containerE1.value.level

  const decrement = (SIMULATION_STEP_SECONDS * sensorF1.value.value) / 3600
  containerE1.value.volume -= decrement
}

onMounted(() => {
  init()
  setInterval(() => {
    doSimulation()
  }, SIMULATION_STEP_SECONDS * 1000)
})

function enablePump() {
  if (!pumpN1.value.isEnabled) pumpN1.value.enable()
}

function translate(
  x: number,
  outMin: number,
  outMax: number,
  inMin: number = 0,
  inMax: number = 100,
) {
  return ((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

function getBackgroundColorForAnalogSensor(s: AnalogSensor): string | undefined {
  if (s.isALActive || s.isAHActive) return ALARM_COLOR
  if (s.isWLActive || s.isWHActive) return WARNING_COLOR
  return GOOD_COLOR
}

function openAnalogSensorFaceplate(s: AnalogSensor) {
  if (!analogSensorFaceplate.value) return

  analogSensorFaceplate.value.open(s)
}
</script>
<template>
  <div class="mnemo_container">
    <AnalogSensorFaceplate ref="analogSensorFaceplate"></AnalogSensorFaceplate>
    <svg
      width="1280"
      height="720"
      viewBox="0 0 338.66665 190.5"
      version="1.1"
      id="svg1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:svg="http://www.w3.org/2000/svg"
    >
      <defs id="defs1" />
      <g inkscape:label="Слой 1" inkscape:groupmode="layer" id="layer1">
        <rect
          style="
            fill: #008000;
            stroke: none;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          id="rect10"
          width="20"
          :height="translate(containerE1.level, 0, 90)"
          x="127.64582"
          :y="translate(containerE1.level, 158.758, 68.758339)"
          :style="{
            fill: getBackgroundColorForAnalogSensor(sensorL1),
          }"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 1.99749;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="m 116.64537,67.745962 c 0,0 5.77332,-14.832396 34.63992,-14.832396 28.86659,0 35.36158,14.832396 35.36158,14.832396"
          id="path2"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 1.99749;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="m 116.64561,157.92727 c 0,0 5.77332,14.8324 34.63992,14.8324 28.86659,0 35.36158,-14.8324 35.36158,-14.8324"
          id="path2-3"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="M 116.64561,67.927203 V 157.92727"
          id="path3"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="M 186.64561,67.927203 V 157.92727"
          id="path4"
        />
        <rect
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2.39178;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          id="rect4"
          width="20.000002"
          height="90.000008"
          x="127.64582"
          y="68.758339"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="M 187.64586,73.75834 H 317.64585"
          id="path5"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="M 116.64586,148.75842 H 91.645848"
          id="path6"
        />
        <circle
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          id="path7"
          cx="78.887497"
          cy="161.25815"
          r="17.5"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="m 66.664594,173.75841 -47.812877,1e-5"
          id="path8"
          sodipodi:nodetypes="cc"
        />
        <ellipse
          style="
            fill: none;
            stroke: none;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          id="path9"
          cx="16.387489"
          cy="78.758347"
          rx="7.5000005"
          ry="5"
        />
        <circle
          style="
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          @click="enablePump()"
          :style="{
            fill: pumpN1.isEnabled && !pumpN1.isStartingFlash ? ENABLED_COLOR : DISABLED_COLOR,
          }"
          id="path10"
          cx="78.887497"
          cy="161.23866"
          r="12.519489"
        />
        <ellipse
          style="
            fill: #ffffff;
            stroke: #000000;
            stroke-width: 2.27081;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          id="path11"
          cx="35.362591"
          cy="143.25815"
          rx="14.364598"
          ry="14.364597"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="m 35.362594,157.62301 -0.08655,16.1354"
          id="path13"
          sodipodi:nodetypes="cc"
        />
        <text
          xml:space="preserve"
          style="
            font-size: 13.2292px;
            fill: none;
            stroke: #000000;
            stroke-width: 0.8;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          x="30.840893"
          y="141.24657"
          id="text13"
        >
          <tspan
            sodipodi:role="line"
            id="tspan13"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 13.2292px;
              font-family: 'GOST type A';
              -inkscape-font-specification: 'GOST type A';
              fill: #000000;
              stroke-width: 0.8;
              stroke-dasharray: none;
            "
            x="30.840893"
            y="141.24657"
          >
            F1
          </tspan>
        </text>
        <text
          xml:space="preserve"
          style="
            font-size: 13.2292px;
            fill: none;
            stroke: #000000;
            stroke-width: 0.8;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          x="74.042816"
          y="139.65909"
          id="text13-2-9"
        >
          <tspan
            sodipodi:role="line"
            id="tspan13-2-5"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 13.2292px;
              font-family: 'GOST type A';
              -inkscape-font-specification: 'GOST type A';
              fill: #000000;
              stroke-width: 0.8;
              stroke-dasharray: none;
            "
            x="74.042816"
            y="139.65909"
          >
            H1
          </tspan>
        </text>
        <text
          xml:space="preserve"
          style="
            font-size: 13.2292px;
            fill: none;
            stroke: #000000;
            stroke-width: 0.8;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          x="27"
          y="154"
          id="text13-4"
        >
          <tspan
            sodipodi:role="line"
            id="tspan13-9"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 13.2292px;
              font-family: 'GOST type A';
              -inkscape-font-specification: 'GOST type A';
              fill: #000000;
              stroke-width: 0.8;
              stroke-dasharray: none;
            "
            x="30"
            y="154.5"
            width="50"
          >
            {{ sensorF1.value.toFixed(1) }}
          </tspan>
        </text>
        <ellipse
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2.27081;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          id="path11-7"
          cx="129.38765"
          cy="25.970549"
          rx="14.364598"
          ry="14.364597"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="m 114.88743,25.941666 h 29.00001"
          id="path12-1"
          sodipodi:nodetypes="cc"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="m 183.63164,26.012324 h 29.00001"
          id="path12-1-6"
          sodipodi:nodetypes="cc"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="m 129.38744,40.335423 -0.0227,16.07146"
          id="path13-4"
          sodipodi:nodetypes="cc"
        />
        <text
          xml:space="preserve"
          style="
            font-size: 13.2292px;
            fill: none;
            stroke: #000000;
            stroke-width: 0.8;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          x="124.86591"
          y="23.958967"
          id="text13-0"
        >
          <tspan
            sodipodi:role="line"
            id="tspan13-6"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 13.2292px;
              font-family: 'GOST type A';
              -inkscape-font-specification: 'GOST type A';
              fill: #000000;
              stroke-width: 0.8;
              stroke-dasharray: none;
            "
            x="124.86591"
            y="23.958967"
          >
            L1
          </tspan>
        </text>
        <text
          xml:space="preserve"
          style="
            font-size: 13.2292px;
            fill: none;
            stroke: #000000;
            stroke-width: 0.8;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          x="129.35849"
          y="36.941666"
          id="text13-4-5"
        >
          <tspan
            sodipodi:role="line"
            id="tspan13-9-8"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 13.2292px;
              font-family: 'GOST type A';
              -inkscape-font-specification: 'GOST type A';
              text-align: center;
              text-anchor: middle;
              fill: #000000;
              stroke-width: 0.8;
              stroke-dasharray: none;
            "
            x="129.35849"
            y="36.941666"
          >
            {{ sensorL1.value.toFixed(0) }}
          </tspan>
        </text>
        <ellipse
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2.27081;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          id="path11-7-8"
          cx="198.13187"
          cy="25.970549"
          rx="14.364598"
          ry="14.364597"
        />
        <text
          xml:space="preserve"
          style="
            font-size: 13.2292px;
            fill: none;
            stroke: #000000;
            stroke-width: 0.8;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          x="191.34932"
          y="24.126381"
          id="text13-0-4"
        >
          <tspan
            sodipodi:role="line"
            id="tspan13-6-4"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 13.2292px;
              font-family: 'GOST type A';
              -inkscape-font-specification: 'GOST type A';
              fill: #000000;
              stroke-width: 0.8;
              stroke-dasharray: none;
            "
            x="191.34932"
            y="24.126381"
          >
            LC1
          </tspan>
        </text>
        <text
          xml:space="preserve"
          style="
            font-size: 13.2292px;
            fill: none;
            stroke: #000000;
            stroke-width: 0.8;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          x="215.18828"
          y="24.126381"
          id="text13-0-4-7"
        >
          <tspan
            sodipodi:role="line"
            id="tspan13-6-4-2"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 13.2292px;
              font-family: 'GOST type A';
              -inkscape-font-specification: 'GOST type A';
              fill: #000000;
              stroke-width: 0.8;
              stroke-dasharray: none;
            "
            x="215.18828"
            y="24.126381"
          >
            A
          </tspan>
        </text>
        <text
          xml:space="preserve"
          style="
            font-size: 13.2292px;
            fill: none;
            stroke: #000000;
            stroke-width: 0.8;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          x="257.68665"
          y="58.907772"
          id="text13-0-4-7-8"
        >
          <tspan
            sodipodi:role="line"
            id="tspan13-6-4-2-6"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 13.2292px;
              font-family: 'GOST type A';
              -inkscape-font-specification: 'GOST type A';
              fill: #000000;
              stroke-width: 0.8;
              stroke-dasharray: none;
            "
            x="257.68665"
            y="58.907772"
          >
            100%
          </tspan>
        </text>
        <text
          xml:space="preserve"
          style="
            font-size: 13.2292px;
            fill: none;
            stroke: #000000;
            stroke-width: 0.8;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          x="198.10271"
          y="36.941666"
          id="text13-4-5-5"
        >
          <tspan
            sodipodi:role="line"
            id="tspan13-9-8-3"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 13.2292px;
              font-family: 'GOST type A';
              -inkscape-font-specification: 'GOST type A';
              text-align: center;
              text-anchor: middle;
              fill: #000000;
              stroke-width: 0.8;
              stroke-dasharray: none;
            "
            x="198.10271"
            y="36.941666"
          >
            100
          </tspan>
        </text>
        <text
          xml:space="preserve"
          style="
            font-size: 13.2292px;
            fill: none;
            stroke: #000000;
            stroke-width: 0.8;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          x="146.80167"
          y="48.620789"
          id="text13-2-4"
        >
          <tspan
            sodipodi:role="line"
            id="tspan13-2-9"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 13.2292px;
              font-family: 'GOST type A';
              -inkscape-font-specification: 'GOST type A';
              fill: #000000;
              stroke-width: 0.8;
              stroke-dasharray: none;
            "
            x="146.80167"
            y="48.620789"
          >
            E1
          </tspan>
        </text>
        <text
          xml:space="preserve"
          style="
            font-size: 13.2292px;
            fill: none;
            stroke: #000000;
            stroke-width: 0.8;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          x="237.86766"
          y="93.557907"
          id="text13-2-4-5"
        >
          <tspan
            sodipodi:role="line"
            id="tspan13-2-9-1"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 13.2292px;
              font-family: 'GOST type A';
              -inkscape-font-specification: 'GOST type A';
              fill: #000000;
              stroke-width: 0.8;
              stroke-dasharray: none;
            "
            x="237.86766"
            y="93.557907"
          >
            LV1
          </tspan>
        </text>
        <g id="g17" transform="translate(0.62519833,-41.450748)">
          <path
            style="
              fill: #008000;
              stroke: none;
              stroke-width: 2;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-dasharray: none;
            "
            d="M 228.35827,116.48207 V 104.84316 L 244.00001,115"
            id="path14-5"
            sodipodi:nodetypes="ccc"
          />
          <path
            style="
              fill: #008000;
              stroke: none;
              stroke-width: 2;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-dasharray: none;
            "
            d="m 228.35827,115.48692 v 9.2875 L 244.00001,115"
            id="path14-7-2"
            sodipodi:nodetypes="ccc"
          />
          <path
            style="
              fill: #008000;
              stroke: none;
              stroke-width: 2;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-dasharray: none;
            "
            d="M 259.90921,116 V 104.84316 L 244.00001,115"
            id="path14-3-2"
            sodipodi:nodetypes="ccc"
          />
          <path
            style="
              fill: #008000;
              stroke: none;
              stroke-width: 2;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-dasharray: none;
            "
            d="m 259.90921,115.48692 v 9.2875 L 244.00001,115"
            id="path14-7-9-2"
            sodipodi:nodetypes="ccc"
          />
        </g>
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="m 228.88744,73.114586 v -9.287507 l 14.77547,9.287507"
          id="path14"
          sodipodi:nodetypes="ccc"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="m 228.88744,74.470833 v 9.287507 l 14.77547,-9.287507"
          id="path14-7"
          sodipodi:nodetypes="ccc"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="m 260.43838,73.114586 v -9.287507 l -14.77547,9.287507"
          id="path14-3"
          sodipodi:nodetypes="ccc"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="m 260.43838,74.470833 v 9.287512 l -14.77547,-9.287512"
          id="path14-7-9"
          sodipodi:nodetypes="ccc"
        />
        <circle
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          id="path15"
          cx="244.59692"
          cy="50.14027"
          r="6.9028559"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="m 244.59671,57.043126 -0.0227,16.07146"
          id="path13-4-0"
          sodipodi:nodetypes="cc"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="M 20.86259,143.50814 H 49.8626"
          id="path12-1-9"
          sodipodi:nodetypes="cc"
        />
        <ellipse
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2.27081;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          id="path11-5"
          cx="306.44534"
          cy="43.25806"
          rx="14.364598"
          ry="14.364597"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="m 306.44543,57.62294 -0.0865,16.1354"
          id="path13-48"
          sodipodi:nodetypes="cc"
        />
        <text
          xml:space="preserve"
          style="
            font-size: 13.2292px;
            fill: none;
            stroke: #000000;
            stroke-width: 0.8;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          x="301.92365"
          y="41.246479"
          id="text13-5"
        >
          <tspan
            sodipodi:role="line"
            id="tspan13-0"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 13.2292px;
              font-family: 'GOST type A';
              -inkscape-font-specification: 'GOST type A';
              fill: #000000;
              stroke-width: 0.8;
              stroke-dasharray: none;
            "
            x="301.92365"
            y="41.246479"
          >
            F2
          </tspan>
        </text>
        <text
          xml:space="preserve"
          style="
            font-size: 13.2292px;
            fill: none;
            stroke: #000000;
            stroke-width: 0.8;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          x="301.50763"
          y="54.813053"
          id="text13-4-2"
        >
          <tspan
            sodipodi:role="line"
            id="tspan13-9-82"
            style="
              font-style: normal;
              font-variant: normal;
              font-weight: normal;
              font-stretch: normal;
              font-size: 13.2292px;
              font-family: 'GOST type A';
              -inkscape-font-specification: 'GOST type A';
              fill: #000000;
              stroke-width: 0.8;
              stroke-dasharray: none;
            "
            x="301.50763"
            y="54.813053"
          >
            10
          </tspan>
        </text>
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: none;
          "
          d="m 291.94543,43.50807 h 29.00001"
          id="path12-1-9-3"
          sodipodi:nodetypes="cc"
        />
        <path
          style="
            fill: #008000;
            stroke: #000000;
            stroke-width: 1;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 2, 3;
            stroke-dashoffset: 0;
          "
          d="m 143.88744,25.941665 39.7442,0.07066"
          id="path16"
        />
        <path
          style="
            fill: none;
            stroke: #000000;
            stroke-width: 1;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 2, 3.00001;
            stroke-dashoffset: 0;
          "
          d="m 212.63165,26.012325 31.96505,-0.04178 V 43.23741"
          id="path17"
        />
        <g id="g18" transform="translate(0.52916663,-0.52916667)">
          <path
            style="
              fill: #000000;
              stroke: #000000;
              stroke-width: 1;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-dasharray: none;
              stroke-dashoffset: 0;
            "
            d="m 315.59978,74.5 6.88334,-4.287507 0.0169,4.543306"
            id="path18"
            sodipodi:nodetypes="ccc"
          />
          <path
            style="
              fill: #000000;
              stroke: #000000;
              stroke-width: 1;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-dasharray: none;
              stroke-dashoffset: 0;
            "
            d="m 315.59978,74.5 6.88334,4.287507 1e-5,-4.787507"
            id="path18-1"
            sodipodi:nodetypes="ccc"
          />
        </g>
        <g id="g18-1" transform="translate(-303.95395,99.077079)">
          <path
            style="
              fill: #000000;
              stroke: #000000;
              stroke-width: 1;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-dasharray: none;
              stroke-dashoffset: 0;
            "
            d="m 315.59978,74.5 6.88334,-4.287507 0.0169,4.543306"
            id="path18-8"
            sodipodi:nodetypes="ccc"
          />
          <path
            style="
              fill: #000000;
              stroke: #000000;
              stroke-width: 1;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-dasharray: none;
              stroke-dashoffset: 0;
            "
            d="m 315.59978,74.5 6.88334,4.287507 1e-5,-4.787507"
            id="path18-1-5"
            sodipodi:nodetypes="ccc"
          />
        </g>
      </g>

      <ellipse
        style="
          fill: rgba(0, 0, 0, 0);
          stroke-width: 2.27081;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: none;
        "
        cx="35.362591"
        cy="143.25815"
        rx="14.364598"
        ry="14.364597"
        class="clickable"
        @click="openAnalogSensorFaceplate(sensorF1)"
      />

      <ellipse
        style="
          fill: rgba(0, 0, 0, 0);
          stroke: #000000;
          stroke-width: 2.27081;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: none;
        "
        cx="129.38765"
        cy="25.970549"
        rx="14.364598"
        ry="14.364597"
        class="clickable"
        @click="openAnalogSensorFaceplate(sensorL1)"
      />
    </svg>
  </div>
</template>
<style scoped>
.mnemo_container {
  text-align: center;
}
</style>
