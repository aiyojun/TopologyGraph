<template>
  <div class="home-page">
    <div class="header">

      <div class="guide">
        <div class="logo-back">
          <img class="logo" :src="Logo" alt=""/>
        </div>
      </div>

    </div>

    <div class="main">

      <div class="home-navigator">

      </div>

      <div class="main-block">

        <VisionGraph />

      </div>


    </div>
  </div>
</template>

<script>
import VisionGraph from "@/workflow/VisionGraph";
import Logo from "@/assets/logo.svg"
export default {
  name: "VisionHome",
  components: {VisionGraph},
  data() {
    return {
      Logo
    }
  }
}
</script>

<style scoped>

@media screen and (min-width: 480px) {
  .home-page {
    position: absolute; width: 100%; height: 100%; background-color: #eeeeee;
  }

  .header {
    position: relative; width: 100%; height: 60px; box-shadow: 0 1px 5px rgba(0,0,0,0.2); z-index: 2; background-color: #333;
  }

  .guide {
    width: calc(100% - 40px); height: 100%; display: flex; justify-content: space-between; margin-right: 20px; margin-left: 20px;
  }

  .main {
    z-index: 1; width: 100%; height: calc(100% - 60px); position: relative; overflow: hidden;
    display: flex;
  }

  .home-navigator {
    height: 100%;
    width: 300px;
    background-color: #fff;
    /*border-right: 1px solid #dddddd;*/
    box-shadow: 1px 0 5px rgba(23,24,25,0.1);
    position: relative;
    z-index: 3;
  }

  .main-block {
    height: 100%;
    width: calc(100% - 300px);
    position: relative;
  }

  .logo-back {
    height: 100%; display: flex; align-items: center;
  }

  .logo {
    width: 40px; height: 40px;
  }
}

@media screen and (max-width: 480px) {
  .home-page {

  }

  .header {

  }

  .main {

  }

  .home-navigator {

  }

  .main-block {

  }

  .logo-back {
    height: 100%; display: flex; align-items: center;
  }

  .logo {
    width: 36px; height: 36px;
  }
}

</style>