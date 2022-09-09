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

        <linearGradient id="PrettyGradient2" x1="0%" y1="0%" x2="0" y2="100%">
          <stop offset="0%"  style="stop-color:#ffffff; stop-opacity:1" />
          <stop offset="70%" style="stop-color:#dddddd; stop-opacity:1" />
        </linearGradient>

        <linearGradient id="PrettyGradient3" x1="0%" y1="0%" x2="0" y2="100%">
          <stop offset="0%"  style="stop-color:#e3f2fd; stop-opacity:1" />
          <stop offset="70%" style="stop-color:#CBDDFF; stop-opacity:1" />
        </linearGradient>

        <linearGradient id="GreenLED" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  style="stop-color:#84bf96; stop-opacity:1" />
          <stop offset="50%" style="stop-color:#45b97c; stop-opacity:1" />
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
          <feBlend in="SourceGraphic" in2="ShadowBack" mode="normal"/>
        </filter>

        <filter id="OtherShadow" x="-1.0" y="-1.0" width="3.0" height="3.0">
          <feColorMatrix result="BlackBack" in="SourceGraphic" type="matrix"
                         values="0 0 0 0 0
                                 0 0 0 0 0
                                 0 0 0 0 0
                                 0 0 0 0.5 0" />
          <feColorMatrix result="Empty" in="SourceGraphic" type="matrix"
                         values="0 0 0 0 0
                                 0 0 0 0 0
                                 0 0 0 0 0
                                 0 0 0 0 0" />
          <feGaussianBlur result="ShadowBack" in="BlackBack" stdDeviation="10" />
          <feBlend in="Empty" in2="ShadowBack" mode="normal"/>
        </filter>
      </defs>


      <rect height="100%" width="100%" fill="url(#PrettyGradient3)"/>
<!--      <rect height="100%" width="100%" fill="#EEE6FF"/>-->

<!--      <foreignObject xmlns="http://www.w3.org/1999/xhtml" height="100%" width="100%" style="pointer-events: none;user-select: none;">-->
<!--        <div style="position: absolute; top: -30px; right: 0; user-select: none;">-->
<!--          <span class="pretty-font">VISION GRAPH</span>-->
<!--        </div>-->
<!--      </foreignObject>-->
      
<!--      <circle r="120" cx="-50" cy="50%" fill="none" stroke="#eee" stroke-width="20" filter="url(#BoxShadow)"/>-->


      <template v-for="(proto, shapeIndex) in shapes" :key="proto.uid">
        <g v-if="proto.type === 0"
           @mouseup="e => mouseupOnNode(e, proto.uid)"
           @mousedown.stop="e => mousedownOnNode(e, proto, shapeIndex)">
          <rect :height="scalar(visionStyle.height * 0.8)" :width="scalar(visionStyle.width * 0.9)"
                :x="proto.x + scalar(visionStyle.width * 0.05)" :y="proto.y + scalar(visionStyle.height * 0.10)"
                :rx="scalar(visionStyle.radius)" :ry="scalar(visionStyle.radius)"
                stroke="none" :stroke-width="scalar(0)"
                fill="url(#PrettyGradient2)" filter="url(#OtherShadow)"/>

          <rect :height="scalar(visionStyle.height)" :width="scalar(visionStyle.width)"
                :x="proto.x" :y="proto.y"
                :rx="scalar(visionStyle.radius)" :ry="scalar(visionStyle.radius)"
                fill="white"
                stroke="none" :stroke-width="scalar(0)"
          />


          <foreignObject xmlns="http://www.w3.org/1999/xhtml"
                         :x="proto.x" :y="proto.y" :height="scalar(visionStyle.height)" :width="scalar(visionStyle.width)" style="user-select: none;pointer-events: none;">
            <div style="user-select: none;position: relative;width: 100%;height: 100%;display: flex; flex-direction: column;">
              <div style="width: 100%; height: 24px; margin: 5px 0 0 10px;">
                <img alt="" :src="`vision/${proto.icon}`" style="user-select: none;width: 24px; height: 24px;"/>
              </div>
              <div style="width: 100%; margin: 5px 0 0 10px;">
                <span class="vision-node">{{ $t(`vision.${proto.name}`) }}</span>
              </div>
<!--              <div style="width: 100%;height: 40%;display: flex;justify-content: flex-start;align-items: center;">-->
<!--                <img style="user-select: none;margin-top: 10px; margin-left: 10px; max-width: 80%;max-height: 80%;" alt="" :src="`vision/${proto.icon}`">-->
<!--              </div>-->
<!--              <div style="width: 100%;height: 30%; margin-left: 10px;display: flex;justify-content: flex-start;align-items: center;"><span class="vision-node">{{ proto.name }}</span></div>-->
            </div>
          </foreignObject>

<!--          <circle :r="scalar(5)" :cx="proto.x + scalar(visionStyle.width) - scalar(15)" :cy="proto.y + scalar(15)" fill="url(#GreenLED)" stroke="none"/>-->
        </g>
        <g v-else-if="proto.type === 1">
          <wire
              :scale="scale"
              :p1dir="'right'" :p2dir="'left'"
              :p1x="shapes[indexedShapes.get(proto.uid0)].x + scalar(visionStyle.width)"
              :p1y="shapes[indexedShapes.get(proto.uid0)].y + (proto.port0 + 1) * scalar(visionStyle.height) / (shapes[indexedShapes.get(proto.uid0)].out.length + 1)"
              :p2x="shapes[indexedShapes.get(proto.uid1)].x"
              :p2y="shapes[indexedShapes.get(proto.uid1)].y + (proto.port1 + 1) * scalar(visionStyle.height) / (shapes[indexedShapes.get(proto.uid1)].in.length + 1)"
              :stroke="`rgb(41, 182, 242)`"
              :wire="['wire', 'curve'][1]"
              :arrow="wireWithArrow" />
        </g>
<!--              :stroke="`#33a3dc`"-->
<!--        <g v-else-if="proto.type === 2"-->
<!--           @mousedown.stop="e => mousedownOnNode(e, proto, shapeIndex)">-->
<!--          <circle :r="proto.r" :cx="proto.x" :cy="proto.y" fill="rgba(80,80,80,0)" filter="url(#BoxShadow)" :stroke-width="scalar(8)" stroke="rgba(80,80,80,1)"/>-->
<!--        </g>-->
      </template>

      <wire
          v-if="iWire.using" :key="`active-wire`"
          :scale="scale"
          :p1dir="'right'" :p2dir="'left'"
          :p1x="iWire.iCoordinate.x"
          :p1y="iWire.iCoordinate.y"
          :p2x="iWire.x"
          :p2y="iWire.y"
          :stroke="`rgb(41, 182, 242)`"
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
<!--          <g v-else-if="proto.type === 2">-->
<!--            <port :scale="scale"-->
<!--                  :cx="proto.x" :cy="proto.y"-->
<!--                  @mouseup.stop="e => mouseupOnPort(e, proto.uid, 0)"-->
<!--                  @mousedown.stop="e => mousedownOnPort(e, proto.uid, 0, proto.x, proto.y)"/>-->
<!--          </g>-->
        </template>
      </template>

    </svg>

    <div v-if="menu.visible" :key="`menu`" class="menu" :style="{position: 'absolute', left: `${menu.iCoordinate.x}px`, top: `${menu.iCoordinate.y}px`}">
      <ul class="menu-layer">
        <li class="menu-option" @click="_ => clickMenuOption('createNode')">
          <span class="menu-option-icon"></span>
          <span class="menu-option-text">{{ $t('graphMenu.createNode') }}</span>
        </li>
        <li class="menu-option" @click="_ => clickMenuOption('removeNode')" v-if="menu.onNode">
          <span class="menu-option-icon"></span>
          <span class="menu-option-text">{{ $t('graphMenu.removeNode') }}</span>
        </li>
        <li class="menu-option" @click="_ => clickMenuOption('switchPorts')">
          <span class="menu-option-icon"></span>
          <span class="menu-option-text">{{ portsVisible ? $t('graphMenu.hidePorts') : $t('graphMenu.showPorts') }}</span>
        </li>
        <li class="menu-option" @click="_ => clickMenuOption('clearShapes')">
          <span class="menu-option-icon"></span>
          <span class="menu-option-text">{{ $t('graphMenu.clearShapes') }}</span>
        </li>
        <li class="menu-option" @click="_ => clickMenuOption('switchLang')">
          <span class="menu-option-icon"></span>
          <span class="menu-option-text">{{ $t('graphMenu.switchLang') }}</span>
        </li>
<!--        <li class="menu-option" @click="_ => clickMenuOption('createRing')">-->
<!--          <span class="menu-option-icon"></span>-->
<!--          <span class="menu-option-text">{{ $t('graphMenu.createRing') }}</span>-->
<!--        </li>-->
      </ul>
    </div>


    <div style="position: absolute;top: 0;bottom: 0;width: 50px;display: flex;align-items: center;justify-content: center;" @mouseenter="setDockerVisible(true)">

<!--      <opener :edge="80" :degree="180"/>-->

    </div>

    <div style="position:absolute;top: 0; left: 0; width: 200px; background-color: rgba(23,24,25,.2); padding:5px 5px 5px 20px;" @mouseup="e => {e.stopPropagation();forceTaskDone();}">
      <div v-for="(group, groupIndex) in visionModules">
        <div><span class="float-title" style="font-weight: bold;">{{$t(`vision.${group.name}`)}}</span></div>
        <div v-for="(module, moduleIndex) in group.modules" :key="moduleIndex"
             style="position: relative"
             draggable="true">
<!--          <div style="width: 100%; height: 58px;display: flex;justify-content: center;align-items: center;">-->
<!--            <img alt="" style="max-height: 70%;pointer-events: none;" :src="`vision/${module.icon}`"/>-->
<!--          </div>-->
            <div v-if="module.name === selectedOne" class="selected-arrow">
              <Opener degree="0" edge="18" color="#fff"/>
            </div>
            <span class="float-font"
                  @click="e => {selectOne(module.name)}">{{`${moduleIndex+1}`}}. {{$t(`vision.${module.name}`)}}</span>
        </div>
      </div>
    </div>

    <div style="position: absolute; top: 0; right: 0; display: flex; margin: 5px;">
      <div style="width: 24px; height: 24px; margin-left: 5px; cursor: pointer;">
        <img alt="" :src="!modelState.isRunning ? `vision/play.svg` : `vision/stop.svg`" width="24" height="24" @click="modelState.isRunning = !modelState.isRunning"/>
      </div>
    </div>

<!--    <div class="vision-modules-layer" :style="{left: dockerVisible ? '0' : '-50px', transition: 'left .4s'}">-->
<!--      <div style="overflow-y: auto; margin: 5px 0;">-->
<!--        <div v-for="(module, moduleIndex) in visionModules" :key="moduleIndex" class="vision-module">-->
<!--          <img alt="" style="max-width: 90%;" src="vision/topo_white.svg"/>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->


<!--    <div style="position: absolute; top: 0; bottom: 0; width: 271px; background: rgba(255,255,255,1); border-right: 1px solid #cccccc; overflow-y: auto; "-->
<!--         :style="{left: dockerVisible ? '0' : '-271px', transition: 'left .4s'}">-->
<!--      <div style="width: 100%;height: 38px;display: flex; align-items: center; margin-top: 5px;">-->
<!--        <span style="font-size: 24px; font-weight: bold; color: #888888; margin-left: 10px;" class="gradient-text-1">{{$t(`MachineVision`)}}</span>-->
<!--      </div>-->
<!--      <div v-for="(group, groupIndex) in visionModules" :key="groupIndex" style="margin: 0 15px;">-->
<!--        <div style="display: flex; align-items: center; height: 28px; justify-content: space-between;">-->
<!--          <div style="margin-left: 5px;display: flex; align-items: center;"><span style="font-size: 13px;color: #444;">{{$t(`vision.${group.name}`)}}</span></div>-->
<!--          <div style="margin-left: 5px;display: flex; align-items: center;"><Opener :edge="16" :value="group.visible" @input="s => group.visible = s"/></div>-->
<!--        </div>-->

<!--        <div v-if="group.visible" style="margin-left: 20px;">-->
<!--          <div v-for="(module, moduleIndex) in group.modules" class="hover-font" :key="moduleIndex" style="">-->
<!--            <span style="user-select: none; font-size: 13px;text-align: center;">{{$t(`vision.${module.name}`)}}</span>-->
<!--          </div>-->
<!--        </div>-->

<!--        <div v-if="group.visible" style="display: grid; grid-template-columns: 90px 90px 90px; margin: 5px 0">-->
<!--          <div v-for="(module, moduleIndex) in group.modules" :key="moduleIndex"-->
<!--               style="width: 90px; height: 90px; display: flex; flex-direction: column; justify-content: center; align-items: center;"-->
<!--               draggable="true">-->
<!--            <div style="width: 100%; height: 58px;display: flex;justify-content: center;align-items: center;">-->
<!--              <img alt="" style="max-height: 70%;pointer-events: none;" :src="`vision/${module.icon}`"/>-->
<!--            </div>-->
<!--            <div style="width: 100%; height: 32px;display: flex;justify-content: center;align-items: center;">-->
<!--              <span style="user-select: none; color: #444; font-size: 13px;text-align: center;">{{$t(`vision.${module.name}`)}}</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

  </div>
</template>

<script>
import Port from "@/workflow/Port";
import Wire from "@/workflow/Wire";
import { ref, reactive, onBeforeMount, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import Opener from "@/workflow/opener";

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
  components: {Opener, Wire, Port},
  setup(props, context) {
    const { t, locale } = useI18n()

    const portsVisible = ref(true)
    const wireWithArrow = ref(true)

    const visionStyle = reactive({width: 160, height: 60, radius: 10})
    const dockerVisible = ref(true)

    const modelState = reactive({isRunning: false})

    const visionModules = reactive([
      {name: 'Preprocessing', modules: [
          {icon: 'dir.svg', name: 'ReadFile', in:[], out: ['image']},
        ], visible: true},
      {name: 'ImageProcess', modules: [
          {icon: 'topo.svg', name: 'ToGray', in:['rgb'], out: ['gray']},
          {icon: 'topo.svg', name: 'Pooling', in:['gray'], out: ['gray']},
          {icon: 'wave.svg', name: 'GaussianFilter', in:['gray'], out: ['gray']},
          {icon: 'topo.svg', name: 'Convolution', in:['gray'], out: ['gray']},
          {icon: 'topo.svg', name: 'Gradient', in:['gray'], out: ['gray']},
          {icon: 'topo.svg', name: 'TopHat', in:['gray'], out: ['gray']},
          {icon: 'topo.svg', name: 'BlackHat', in:['gray'], out: ['gray']},
          {icon: 'topo.svg', name: 'OpenOperation', in:['gray'], out: ['gray']},
          {icon: 'topo.svg', name: 'CloseOperation', in:['gray'], out: ['gray']},
          {icon: 'line.svg', name: 'ThresholdSegmentation', in:['gray'], out: ['gray']},
          {icon: 'binary.svg', name: 'Binaryzation', in:['gray'], out: ['gray']},
          {icon: 'reverse.svg', name: 'Inverter', in:['gray'], out: ['gray']},
          {icon: 'blance.svg', name: 'HistogramEqualization', in:['gray'], out: ['gray']},
          {icon: 'line2.svg', name: 'HoughLineDetection', in:['gray'], out: ['gray']},
          {icon: 'frame.svg', name: 'RectangleEdgeExtraction', in:['gray'], out: ['gray']},
          {icon: 'frame.svg', name: 'ContourExtraction', in:['gray'], out: ['gray']},

        ], visible: true},
      {name: 'AdvanceAlgorithm', modules: [
          {icon: 'topo.svg', name: 'KMeanAggregation', in:['?'], out: ['?']},
        ], visible: true},

      {name: 'MachineLearning', modules: [
        ], visible: true},
      {name: 'DeepLearning', modules: [
        ], visible: true},
    ])

    const modulesMapper = new Map();
    for (let j = 0; j < visionModules.length; j++) {
      for (let i = 0; i < visionModules[j].modules.length; i++) {
        const module = visionModules[j].modules[i];
        modulesMapper.set(module.name, module);
      }
    }

    const selectedOne = ref(visionModules[0].modules[0].name)
    const selectOne = one => {
      selectedOne.value = one
    }

    /**
     * 1. basic data
     */
    const shapes = reactive([])
    const clearShapes = () => {
      shapes.splice(0, shapes.length);
    }
    const indexedShapes = new Map()
    const createNode = (name, x, y, module) => {
      const uid = uuid()
      indexedShapes.set(uid, shapes.length)
      shapes.push(reactive({uid, type: 0, name, icon: module.icon, x, y, in: module.in, out: module.out}))
    }
    const createWire = (uid0, port0, uid1, port1) => {
      const uid = uuid()
      indexedShapes.set(uid, shapes.length)
      shapes.push(reactive({uid, type: 1, uid0, port0, uid1, port1}))
    }
    const createRing = (x = 100, y = 100, r = 25) => {
      const uid = uuid()
      indexedShapes.set(uid, shapes.length)
      shapes.push(reactive({uid, type: 2, r, x, y}))
    }
    const removeNode = (uid) => {
      let index = -1
      const removeSeq = []
      for (let i = 0; i < shapes.length; i++) {
        if (shapes[i].type === 0 && uid === shapes[i].uid) {
          index = i
          removeSeq.push(i)
        } else if (shapes[i].type === 1 && (shapes[i].uid0 === uid || shapes[i].uid1 === uid)) {
          removeSeq.push(i)
        }
      }
      if (index === -1) return
      for (let i = removeSeq.length - 1; i > -1; i--) {
        const idx = removeSeq[i]
        shapes.splice(idx, 1)
      }
    }

    const scale = ref(1)
    const scalar = x => {return scale.value * x}

    const menu = reactive({visible: false, iCoordinate: {x: 0, y: 0}, onNode: false, nodeUid: null})
    const openMenu = (e, nodeUid = null) => {
      menu.visible = true
      if (nodeUid === null) {
        menu.onNode = false
        menu.nodeUid = null
      } else {
        menu.onNode = true
        menu.nodeUid = nodeUid
      }
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
      if (option === 'createNode') {
        createNode(selectedOne.value, cursorRecord.iCoordinate.x, cursorRecord.iCoordinate.y, modulesMapper.get(selectedOne.value))
      } else if (option === 'removeNode') {
        removeNode(menu.nodeUid)
      } else if (option === 'switchLang') {
        switchLang()
      } else if (option === 'switchPorts') {
        portsVisible.value = !portsVisible.value
      } else if (option === 'createRing') {
        createRing()
      } else if (option === 'clearShapes') {
        clearShapes()
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
        if (cursorRecord.buttons === 1 && (cursorRecord.iCoordinate.x === e.offsetX && cursorRecord.iCoordinate.y === e.offsetY)) {
          setDockerVisible(false)
        }
        closeMenu();
      }
      cursorRecord.buttons = -1
    }
    const mouseupOnNode = (e, uid) => {
      if (cursorRecord.buttons === 2 && cursorRecord.area === 1 && (cursorRecord.iCoordinate.x === e.offsetX && cursorRecord.iCoordinate.y === e.offsetY)) {
        e.stopPropagation()
        openMenu(e, uid)
        cursorRecord.buttons = -1
        return
      }
    }
    const forceTaskDone = () => {
      cursorRecord.iTask = -1
      cursorRecord.buttons = -1
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
      cursorRecord.buttons = -1
    }
    const mousedownOnNode = (e, node, uid) => {
      if (cursorRecord.buttons !== -1) {
        if (cursorRecord.iTask !== -1) {
          cursorRecord.iTask = -1
        }
      }
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
      if (e.buttons === 1) {
        closeMenu();
      }
    }


    const mousedownOnPort = (e, uid, portIndex, x, y) => {
      cursorRecord.buttons = e.buttons
      cursorRecord.area = 2
      cursorRecord.iCoordinate.x = e.offsetX
      cursorRecord.iCoordinate.y = e.offsetY
      if (e.buttons === 1) {
        cursorRecord.iTask = 102
        iWire.iCoordinate.x = x
        iWire.iCoordinate.y = y
        iWire.x = x
        iWire.y = y
        iWire.using = true
        iWire.nodeUid = uid
        iWire.portIndex = portIndex
      }
    }
    const mouseupOnPort = (e, uid, portIndex) => {
      if (cursorRecord.iTask === 102) {
        createWire(iWire.nodeUid, iWire.portIndex, uid, portIndex)
      }
      cursorRecord.iTask = -1
      cursorRecord.buttons = -1
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
      // createNode('Gray')
    })

    const setDockerVisible = v => {dockerVisible.value = v;}

    return {
      modelState,

      visionModules,
      locale,
      dockerVisible, setDockerVisible,
      visionStyle,
      portsVisible,
      indexedShapes,
      wireWithArrow,

      selectedOne, selectOne,

      scale, scalar,
      shapes, createNode, clearShapes,
      mousedownOnGraph,
      mousemoveOnGraph,
      mouseupOnGraph,
      mouseupOnWindow,
      mousedownOnNode,
      mouseupOnNode,
      forceTaskDone,

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

@font-face {  font-family: Quicksand;  font-weight: normal;  src: url("../font/Quicksand_Light.otf");  }
@font-face {  font-family: Quicksand;  font-weight: bold;  src: url("../font/Quicksand_Bold.otf");  }

@font-face {  font-family: Roboto;  font-weight: normal;  font-style: normal;  src: url("../font/RobotoLight-aW3R.ttf");  }
@font-face {  font-family: Roboto;  font-weight: normal;  font-style: italic;  src: url("../font/RobotoLightItalic-E9nn.ttf");  }
@font-face {  font-family: Roboto;  font-weight: bold;    font-style: normal;  src: url("../font/RobotoBold-Xdoj.ttf");  }
@font-face {  font-family: Roboto;  font-weight: bold;    font-style: italic;  src: url("../font/RobotoBoldItalic-4e0x.ttf");  }

::-webkit-scrollbar {
  width: 0;
  height: 0;
}

::-webkit-scrollbar-corner {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(230, 230, 230, 1);
  background-clip: padding-box;
  border: solid transparent;
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  background-clip: padding-box;
  border: 1px solid transparent;
  /*border: none;*/
}

.top-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: none;
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
  font-size: 13px;
  color: #555555;
}

.pretty-font {
  font-size: 4.5em; font-weight: bold;
  font-style: italic; margin-right: 10px;
  color: #eee;
}

.gradient-text-1 {
  background-image:-webkit-linear-gradient(70deg, #35A5E6, #C850C0);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

.vision-node {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  font-family: Roboto, Helvetica, Avenir, Arial, sans-serif, "Microsoft YaHei";
  /*font-style: italic;*/
  /*font-weight: 600;*/
  color: #555555;
}

.vision-modules-layer {
  position: absolute;
  top: 10%;
  left: 1px;
  width: 50px;
  height: 80%;
  /*padding-top: 5px;*/
  /*padding-bottom: 5px;*/
  border-radius: 6px;
  background: rgba(100, 100, 100, 0.9);
  overflow-y: auto;
  box-shadow: 1px 1px 3px rgba(50, 50, 50, .5);

  display: flex;
  flex-direction: column;
  align-items: center;
  /*justify-content: center;*/
}

.vision-module {
  display: flex; justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 5px;
}

.vision-module:hover {
  background: rgba(80,80,80,.6);
}

.hover-font {
  /*padding: 0 5px;*/
  margin-bottom: 5px;
  cursor: pointer;
  color: #444;
  /*border: 2px solid rgba(255,255,255,0);*/
  /*border-radius: 4px;*/
}

.hover-font:hover {
  background-image: -webkit-linear-gradient(70deg, #35A5E6, #C850C0 60%)
  /*border: 2px solid;*/
  /*border-radius: 4px;*/
  /*border-image: -webkit-linear-gradient(70deg, #35A5E6, #C850C0 50%) 2 2 2 2;*/
  /*border-image-repeat: repeat;*/
  /*color: #35A5E6*/
  /*border: 1px;*/
  /*border: 1px solid rgba(255,255,255,0);*/
  /*border: 1px solid;*/
  /*border-image: -webkit-linear-gradient(70deg, #35A5E6, #C850C0);*/
}

.float-title {
  user-select: none;
  font-size: 13px;
  text-align: center;
  font-family: Roboto, Helvetica, Avenir, Arial, sans-serif, "Microsoft YaHei";
  color: #444;
}

.float-font {
  user-select: none;
  font-size: 13px;
  text-align: center;
  cursor: pointer;
  font-family: Roboto, Helvetica, Avenir, Arial, sans-serif, "Microsoft YaHei";
  color: #444;
}

.float-font:hover {
  color: #fff;
}

.selected-arrow {
  display: inline-block;
  position: absolute;
  left: -18px;
  top: 0;
  height: 0;
  width: 0;
  background-color: #84bf96;
}


</style>