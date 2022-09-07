<template>
  <svg
      class="container"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      :width="edge" :height="edge"
      :style="{transform: `rotate(${value ? `${degree}` : '0'}deg)`}"
      @click="switchState"
      stroke="#000" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter"
      fill="none" color="#000">
    <polyline points="10 6 16 12 10 18 10 18"/>
  </svg>
</template>

<script>
export default {
  name: "opener",
  props: {
    edge : {type: Number , default: 24},
    value: {type: Boolean, default: true},
    degree: {type: Number , default: 90},
  },
  methods: {
    switchState() {this.$emit('input', !this.value)}
  },
}
</script>

<style scoped>

.container {
  cursor: pointer;
  transition: transform 0.5s;
  user-select: none;
}




</style>