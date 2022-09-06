<template>
  <div class="top-layer">
    <svg xmlns="http://www.w3.org/2000/svg" class="svg-layer"
         @mousedown.stop="mousedownOnGraph"
         @mouseup="mouseupOnGraph"
         @contextmenu="e => e.preventDefault()"
         @mousemove.stop="mousemoveOnGraph">


      <defs>
        <linearGradient id="PrettyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  style="stop-color:#FF8989; stop-opacity:1" />
          <stop offset="70%" style="stop-color:#F8ACFF; stop-opacity:1" />
        </linearGradient>

        <filter id="GaussianBlur" x="-1.0" y="-1.0" width="3.0" height="3.0">
          <feGaussianBlur result="blurOut" in="colorOut" stdDeviation="50"/>
        </filter>

        <filter id="BoxShadow" x="-1.0" y="-1.0" width="3.0" height="3.0">
          <feColorMatrix result="BlackBack" in="SourceGraphic" type="matrix"
                         values="0 0 0 0 0
                                 0 0 0 0 0
                                 0 0 0 0 0
                                 0 0 0 0.5 0" />
          <feGaussianBlur result="ShadowBack" in="BlackBack" stdDeviation="10" />
          <feColorMatrix result="WhiteBack" in="SourceGraphic" type="matrix"
                         values="0 0 0 0 1
                                 0 0 0 0 1
                                 0 0 0 0 1
                                 0 0 0 1 0" />
          <feBlend result="StageOne" in="WhiteBack" in2="ShadowBack" mode="normal"/>
          <feBlend in="SourceGraphic" in2="StageOne" mode="normal"/>
        </filter>
      </defs>


      <rect height="100%" width="100%" fill="url(#PrettyGradient)"/>

      <foreignObject xmlns="http://www.w3.org/1999/xhtml" height="100%" width="100%">
        <div style="position: absolute; top: 0; right: 0; user-select: none;">
          <span class="pretty-font">VISION GRAPH</span>
        </div>
      </foreignObject>


      <template v-for="(proto, shapeIndex) in shapes" :key="proto.uid">
        <g v-if="proto.type === 0"
           @mousedown.stop="e => mousedownOnNode(e, proto, shapeIndex)">
          <rect :height="scalar(visionStyle.height)" :width="scalar(visionStyle.width)"
                :x="proto.x" :y="proto.y"
                :rx="scalar(5)" :ry="scalar(5)"
                stroke="none" :stroke-width="scalar(0.8)"
                fill="rgba(80,80,80,1)" filter="url(#BoxShadow)"/>

          <foreignObject xmlns="http://www.w3.org/1999/xhtml"
                         :x="proto.x" :y="proto.y" :height="scalar(visionStyle.height)" :width="scalar(visionStyle.width)">
            <div style="user-select: none; position: absolute; top: 5px; right: 10px;">
              <span class="vision-node">{{ proto.name }}</span>
            </div>
          </foreignObject>
        </g>
        <g v-else-if="proto.type === 1">
          <wire
              :scale="scale"
              :p1dir="'right'" :p2dir="'left'"
              :p1x="shapes[indexedShapes.get(proto.uid0)].x + scalar(visionStyle.width)"
              :p1y="shapes[indexedShapes.get(proto.uid0)].y + (proto.port0 + 1) * scalar(visionStyle.height) / (shapes[indexedShapes.get(proto.uid0)].out.length + 1)"
              :p2x="shapes[indexedShapes.get(proto.uid1)].x"
              :p2y="shapes[indexedShapes.get(proto.uid1)].y + (proto.port1 + 1) * scalar(visionStyle.height) / (shapes[indexedShapes.get(proto.uid1)].in.length + 1)"
              :stroke="`#33a3dc`"
              :wire="['wire', 'curve'][1]"
              :arrow="wireWithArrow" />
        </g>
      </template>

      <wire
          v-if="iWire.using" :key="`active-wire`"
          :scale="scale"
          :p1dir="'right'" :p2dir="'left'"
          :p1x="iWire.iCoordinate.x"
          :p1y="iWire.iCoordinate.y"
          :p2x="iWire.x"
          :p2y="iWire.y"
          :stroke="`#33a3dc`"
          :wire="['wire', 'curve'][1]"
          :arrow="wireWithArrow"
      />

      <template v-if="portsVisible">
        <template v-for="(proto, shapeIndex) in shapes" :key="'port-' + proto.uid">
          <g v-if="proto.type === 0">
            <port v-for="(port, portIndex) in proto.in"
                  :scale="scale"
                  :cx="proto.x" :cy="proto.y + (portIndex + 1) * scalar(visionStyle.height) / (proto.in.length + 1)"
                  @mouseup.stop="e => mouseupOnPort(e, proto.uid, portIndex)"/>

            <port v-for="(port, portIndex) in proto.out"
                  :scale="scale"
                  :cx="proto.x + scalar(visionStyle.width)" :cy="proto.y + (portIndex + 1) * scalar(visionStyle.height) / (proto.out.length + 1)"
                  @mousedown.stop="e => mousedownOnPort(e, proto.uid, portIndex, proto.x + scalar(visionStyle.width), proto.y + (portIndex + 1) * scalar(visionStyle.height) / (proto.out.length + 1))"/>
          </g>
        </template>
      </template>

    </svg>

    <div v-if="menu.visible" :key="`menu`" class="menu" :style="{position: 'absolute', left: `${menu.iCoordinate.x}px`, top: `${menu.iCoordinate.y}px`}">
      <ul class="menu-layer">
        <li class="menu-option" @click="_ => clickMenuOption('create')">
          <span class="menu-option-icon"></span>
          <span class="menu-option-text">{{ $t('graphMenu.createNode') }}</span>
        </li>
        <li class="menu-option" @click="_ => clickMenuOption('switchPorts')">
          <span class="menu-option-icon"></span>
          <span class="menu-option-text">{{ portsVisible ? $t('graphMenu.hidePorts') : $t('graphMenu.showPorts') }}</span>
        </li>
        <li class="menu-option" @click="_ => clickMenuOption('switchLang')">
          <span class="menu-option-icon"></span>
          <span class="menu-option-text">{{ $t('graphMenu.switchLang') }}</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import Port from "@/workflow/Port";
import Wire from "@/workflow/Wire";
import { ref, reactive, onBeforeMount, onMounted } from "vue";
import { useI18n } from "vue-i18n";

function uuid() {
  let s = [];
  let hexes = "0123456789abcdef";
  for (let i = 0; i < 36; i++)
    s[i] = hexes.substr(Math.floor(Math.random() * 0x10), 1);
  s[14] = "4";
  s[19] = hexes.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}

export default {
  name: "VisionGraph",
  components: {Wire, Port},
  setup(props, context) {
    const { locale } = useI18n()

    const portsVisible = ref(true)
    const wireWithArrow = ref(true)

    const visionStyle = reactive({width: 200, height: 100, radius: 5})

    /**
     * 1. basic data
     */
    const shapes = reactive([])
    const indexedShapes = new Map()
    const createNode = (name = 'Node', x = 100, y = 100) => {
      const uid = uuid()
      indexedShapes.set(uid, shapes.length)
      shapes.push(reactive({uid, type: 0, name, x, y, in: [0,1,2], out: [0,1]}))
    }
    const createWire = (uid0, port0, uid1, port1) => {
      const uid = uuid()
      indexedShapes.set(uid, shapes.length)
      shapes.push(reactive({uid, type: 1, uid0, port0, uid1, port1}))
    }

    const scale = ref(1)
    const scalar = x => {return scale.value * x}

    const menu = reactive({visible: false, iCoordinate: {x: 0, y: 0}})
    const openMenu = e => {
      menu.visible = true
      menu.iCoordinate.x = e.offsetX
      menu.iCoordinate.y = e.offsetY
    }
    const closeMenu = () => {
      menu.visible = false
    }


    const cursorRecord = reactive({
      buttons: -1, area: 0, iCoordinate: {x: 0, y: 0},
      iTask: -1, iNode: '', iNodeCoordinate: {x: 0, y: 0},
    })
    const iWire = reactive({
      using: false,
      x: 0, y: 0,
      iCoordinate: {x: 0, y: 0},
      nodeUid: '', portIndex: -1,
    })

    const clickMenuOption = option => {
      if (option === 'create') {
        createNode('Node', cursorRecord.iCoordinate.x, cursorRecord.iCoordinate.y)
      } else if (option === 'switchLang') {
        switchLang()
      } else if (option === 'switchPorts') {
        portsVisible.value = !portsVisible.value
      }
      closeMenu()
    }

    const mousedownOnGraph = e => {
      cursorRecord.buttons = e.buttons
      cursorRecord.area = 0
      cursorRecord.iCoordinate.x = e.offsetX
      cursorRecord.iCoordinate.y = e.offsetY
      if (e.buttons === 1) {
        closeMenu();
      }
    }
    const mousemoveOnGraph = e => {
      if (cursorRecord.iTask === 101 && e.buttons === 1) {
        const uid = cursorRecord.iNode
        shapes[uid].x = cursorRecord.iNodeCoordinate.x + e.offsetX - cursorRecord.iCoordinate.x;
        shapes[uid].y = cursorRecord.iNodeCoordinate.y + e.offsetY - cursorRecord.iCoordinate.y;
      } else if (cursorRecord.iTask === 102 && e.buttons === 1) {
        iWire.x = e.offsetX
        iWire.y = e.offsetY
      }
    }
    const mouseupOnGraph = e => {
      if (cursorRecord.buttons === 2 && (cursorRecord.iCoordinate.x === e.offsetX && cursorRecord.iCoordinate.y === e.offsetY)) {
        openMenu(e);
      } else {
        closeMenu();
      }
    }
    const mouseupOnWindow = e => {
      if (cursorRecord.iTask === 101) {
        const uid = cursorRecord.iNode
        shapes[uid].x = cursorRecord.iNodeCoordinate.x + e.offsetX - cursorRecord.iCoordinate.x;
        shapes[uid].y = cursorRecord.iNodeCoordinate.y + e.offsetY - cursorRecord.iCoordinate.y;
      } else if (cursorRecord.iTask === 102) {
        iWire.using = false;
      }
      cursorRecord.iTask = -1
    }
    const mousedownOnNode = (e, node, uid) => {
      cursorRecord.buttons = e.buttons
      cursorRecord.area = 1
      cursorRecord.iCoordinate.x = e.offsetX
      cursorRecord.iCoordinate.y = e.offsetY
      if (e.buttons === 1) {
        cursorRecord.iTask = 101
        cursorRecord.iNode = uid
        cursorRecord.iNodeCoordinate.x = node.x
        cursorRecord.iNodeCoordinate.y = node.y
      }
    }


    const mousedownOnPort = (e, uid, portIndex, x, y) => {
      cursorRecord.buttons = e.buttons
      cursorRecord.area = 1
      cursorRecord.iCoordinate.x = e.offsetX
      cursorRecord.iCoordinate.y = e.offsetY
      cursorRecord.iTask = 102
      iWire.iCoordinate.x = x
      iWire.iCoordinate.y = y
      iWire.x = x
      iWire.y = y
      iWire.using = true
      iWire.nodeUid = uid
      iWire.portIndex = portIndex
    }
    const mouseupOnPort = (e, uid, portIndex) => {
      if (cursorRecord.iTask === 102) {
        createWire(iWire.nodeUid, iWire.portIndex, uid, portIndex)
      }
      cursorRecord.iTask = -1
      iWire.using = false
    }

    const switchLang = () => {
      locale.value = locale.value === 'zh' ? 'en' :'zh'
    }



    /**
     * 2.
     */
    onBeforeMount(() => {
      window.addEventListener('mouseup', mouseupOnWindow)
    })
    onMounted(() => {
      createNode('Gray')
    })

    return {
      locale,
      visionStyle,
      portsVisible,
      indexedShapes,
      wireWithArrow,

      scale, scalar,
      shapes, createNode,
      mousedownOnGraph,
      mousemoveOnGraph,
      mouseupOnGraph,
      mouseupOnWindow,
      mousedownOnNode,

      menu,
      openMenu,
      closeMenu,
      clickMenuOption,

      iWire,
      mouseupOnPort,
      mousedownOnPort,
    }
  }

}
</script>

<style scoped>

.top-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.svg-layer {
  width: 100%;
  height: 100%;
}

.menu {
  background: white;
  box-shadow: 0 1px 3px rgba(50,50,50,.4);
  padding: 5px 0;
  border-radius: 4px;
}

.menu-layer {
  /*margin: 10px;*/
}

.menu-option {
  display: flex;
  align-items: center;
  text-decoration: none;
  outline: none;
  min-width: 200px;
  cursor: pointer;
  padding: 8px;
}

.menu-option:hover {
  background: #dddddd;
}

.menu-option-icon {
  width: 30px;
}

.menu-option-text {
  font-size: 14px;
  color: #555555;
}

.pretty-font {
  font-size: 4.5em; font-weight: bold;
  font-style: italic; margin-right: 10px;
  color: #666666;
}

.gradient-text-1 {
  background-image:-webkit-linear-gradient(70deg, #35A5E6, #C850C0);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

.vision-node {
  font-size: 16px;
  font-style: italic;
  font-weight: 600;
  color: #dddddd;
}

</style>