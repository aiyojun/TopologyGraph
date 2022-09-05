<template>
  <g xmlns="http://www.w3.org/2000/svg">
<!--    :stroke="border" :stroke-width="borderWidth * scale"-->
    <circle :cx="cx" :cy="cy" :r="r * scale"
            :fill="'rgba(255,255,255,.3)'"
            @mouseover="zoom_in"
            @mouseout="zoom_out"
            class="port"
    />
  </g>
</template>

<script>
export default {
  name: "Port",
  data() {
    return {
      r: 6,
      borderWidth: 2,
      ratio: 1.6,
    };
  },
  props: {
    cx: {type: Number, default: 0},
    cy: {type: Number, default: 0},
    scale: {type: Number, default: 1},
    border: {type: String, default: 'darkseagreen'},
  },
  methods: {
    zoom_in() {
      this.r *= this.ratio;
      this.borderWidth *= this.ratio;
    },
    zoom_out() {
      this.r /= this.ratio;
      this.borderWidth /= this.ratio;
    }
  }
}
</script>

<style scoped>

.port {cursor: pointer;}

</style>