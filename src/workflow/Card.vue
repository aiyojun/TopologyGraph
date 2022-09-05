<template>
  <g xmlns="http://www.w3.org/2000/svg">
<!--    :rx="scalar(10)" :ry="scalar(10)"-->
    <rect :x="proto.x" :y="proto.y" :height="scalar(cardHeight)" :width="scalar(cardWidth)"

          stroke="none"
          :stroke-width="scalar(0.8)"
          fill="rgba(50,50,50,.5)"/>
  </g>
</template>

<script>


import Port from "@/workflow/Port";
import {onBeforeMount, ref} from "vue";
export default {
  name: "Card",
  components: {Port},
  props: {
    proto: {type: Object, default:()=>{}},
  },
  emits: ['state'],
  setup(props, context) {
    const cardWidth = ref(200)
    const cardHeight = ref(100)
    const scalar = (x) => props.proto.scale * x
    onBeforeMount(() => {
      context.emit('state', {width: cardWidth, height: cardHeight})
    });
    return { scalar, cardWidth, cardHeight }
  },
}
</script>

<style scoped>

</style>