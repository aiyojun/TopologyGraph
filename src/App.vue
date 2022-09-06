<template>
  <VisionGraph />
</template>

<script>
import VisionGraph from "@/workflow/VisionGraph";

export default {
  name: 'App',
  components: {
    VisionGraph,
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: "微软雅黑", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
