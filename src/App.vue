<template>
  <palette />
</template>

<script>
import Palette from "@/workflow/Palette";

export default {
  name: 'App',
  components: {
    Palette,
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
