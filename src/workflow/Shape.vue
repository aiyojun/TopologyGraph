<template>
  <Card :proto="proto" @state="changeState"/>
</template>

<script>
import Card from "@/workflow/Card";
export default {
  name: "Shape",
  components: {Card},
  props: {proto: {type: Object, default:()=>{}},},
  methods: {
    changeState(state) {this.$emit('state', state)}
  }
}
</script>

<style scoped>

</style>