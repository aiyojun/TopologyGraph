<template>
  <div class="palette-top-layer">
    <button style="position:absolute;top: 50px;left: 50px;" @click="portsVisible = !portsVisible">hide ports</button>
    <button style="position:absolute;top: 20px;left: 50px;" @click="wireWithArrow = !wireWithArrow">hide arrow</button>

    <svg class="svg-layer"
         xmlns="http://www.w3.org/2000/svg"
         @mousedown.stop="mousedownOnGraph"
         @mouseup="mouseupOnGraph"
         @contextmenu="e => e.preventDefault()"
         @mousemove.stop="mousemoveOnGraph">


      <defs>
        <filter id="GaussianBlur" x="-1" y="-1" width="3.0" height="3.0">
          <feGaussianBlur result="blurOut" in="colorOut" stdDeviation="20"/>
        </filter>
      </defs>


      <g v-for="(proto, shapeIndex) in shapes" :key="`shape-${shapeIndex}`">

        <shape :proto="proto"
               @mousedown.stop="e => mousedownOnShape(e, proto, shapeIndex)" @state="state => updateShapeState(proto, state)"/>

      </g>


      <g v-for="(wire, wireIndex) in wires" :key="`wire-${wireIndex}`">
        <wire
            :scale="scale"
            :p1dir="'down'" :p2dir="'up'"
            :p1x="shapes[wire.uid0].x + (wire.port0 + 1) * scalar(shapes[wire.uid0].width) / (shapes[wire.uid0].out.length + 1)"
            :p1y="shapes[wire.uid0].y + scalar(shapes[wire.uid0].height)"
            :p2x="shapes[wire.uid1].x + (wire.port1 + 1) * scalar(shapes[wire.uid1].width) / (shapes[wire.uid1].in.length + 1)"
            :p2y="shapes[wire.uid1].y"
            :stroke="`skyblue`"
            :wire="['wire', 'curve'][0]"
            :arrow="wireWithArrow"
        />
      </g>


      <g v-if="iWireCoordinate.using" :key="`active-wire`">
        <wire
            :scale="scale"
            :p1dir="'down'" :p2dir="'up'"
            :p1x="iWireCoordinate.begin.x"
            :p1y="iWireCoordinate.begin.y"
            :p2x="iWireCoordinate.x"
            :p2y="iWireCoordinate.y"
            :stroke="`skyblue`"
            :wire="['wire', 'curve'][0]"
            :arrow="wireWithArrow"
            @click.native=""
        />
      </g>


      <g v-if="portsVisible" v-for="(proto, shapeIndex) in shapes" :key="`shape-${shapeIndex}`">
        <port v-for="(port, portIndex) in proto.in"
              :scale="proto.scale"
              :cx="proto.x + (portIndex + 1) * scalar(proto.width) / (proto.in.length + 1)" :cy="proto.y"
              @mouseup.stop="e => mouseupOnPort(e, shapeIndex, portIndex)"/>

        <port v-for="(port, portIndex) in proto.out"
              :scale="proto.scale"
              :cx="proto.x + (portIndex + 1) * scalar(proto.width) / (proto.out.length + 1)" :cy="proto.y + scalar(proto.height)"
              @mousedown.stop="e => mousedownOnPort(e, shapeIndex, portIndex, proto.x + (portIndex + 1) * scalar(proto.width) / (proto.out.length + 1), proto.y + scalar(proto.height))"/>
      </g>


    </svg>


    <div v-if="iMenu.visible" class="menu" ref="menu" :style="{position: 'absolute', left: `${iMenu.x}px`, top: `${iMenu.y}px`}">
      <ul class="menu-layer">
        <li class="menu-option" @click="_ => clickMenuOption('create')">
          <span class="menu-option-icon"></span>
          <span class="menu-option-text">Create</span>
        </li>
        <li class="menu-option">
          <span class="menu-option-icon"></span>
          <span class="menu-option-text" @click="">Delete</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import Shape from "@/workflow/Shape";
import Port from "@/workflow/Port";
import Wire from "@/workflow/Wire";

const uuid = () => {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++)
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}

export default {
  name: "Palette",
  components: {Wire, Port, Shape},
  data() {
    return {
      portsVisible: true,
      wireWithArrow: true,
      scale: 1,
      shapes: [],
      wires: [],
      iWireCoordinate: {
        using: false,
        x: 0, y: 0,
        begin: {x: 0, y: 0, shapeUid: -1, portIndex: -1},
      },
      iTask: -1,
      iCursorDown: {buttons: -1, area: -1},
      iCursorCoordinate: {x: 0, y: 0},
      iShapeIndex: -1,
      iShapeCoordinate: {x: 0, y: 0},
      iMenu: {
        visible: false,
        x: 0, y: 0,
      },
    }
  },
  created() {
    window.addEventListener('mouseup', this.mouseupOnWindow)
  },
  mounted() {
    this.createShape();
  },
  methods: {
    createShape(x = 100, y = 100) {
      this.shapes.push({
        uid: uuid(),
        x, y, scale: 1, width: 0, height: 0,
        in: [0,1], out: [0],
      });
    },
    createWire(uid0, port0, uid1, port1) {
      this.wires.push({uid0, port0, uid1, port1});
    },
    scalar(x) {
      return this.scale * x;
    },
    mouseupOnWindow(e) {
      if (this.iTask === 101 && this.iShapeIndex >= 0) {
        this.shapes[this.iShapeIndex].x = this.iShapeCoordinate.x + e.offsetX - this.iCursorCoordinate.x;
        this.shapes[this.iShapeIndex].y = this.iShapeCoordinate.y + e.offsetY - this.iCursorCoordinate.y;
      } else if (this.iTask === 102) {
        this.iWireCoordinate.using = false;
      }
      this.iTask = -1;
      this.iShapeIndex = -1;
    },
    mousedownOnShape(e, shape, index) {
      this.iCursorDown.buttons = e.buttons;
      this.iCursorDown.area = 1;
      this.iCursorCoordinate.x = e.offsetX;
      this.iCursorCoordinate.y = e.offsetY;
      if (e.buttons === 1) {
        this.iTask = 101;
        this.iShapeIndex = index;
        this.iShapeCoordinate.x = shape.x;
        this.iShapeCoordinate.y = shape.y;
      }
    },
    mouseupOnGraph(e) {
      if (this.iCursorDown.buttons === 2 && (this.iCursorCoordinate.x === e.offsetX && this.iCursorCoordinate.y === e.offsetY)) {
        this.openMenu(e);
      } else {
        this.closeMenu();
      }
    },
    mousedownOnGraph(e) {
      this.iCursorDown.buttons = e.buttons;
      this.iCursorDown.area = 0;
      this.iCursorCoordinate.x = e.offsetX;
      this.iCursorCoordinate.y = e.offsetY;
      if (e.buttons === 1) {
        this.closeMenu();
      }
    },
    mousemoveOnGraph(e) {
      if (this.iTask === 101 && e.buttons === 1 && this.iShapeIndex >= 0) {
        this.shapes[this.iShapeIndex].x = this.iShapeCoordinate.x + e.offsetX - this.iCursorCoordinate.x;
        this.shapes[this.iShapeIndex].y = this.iShapeCoordinate.y + e.offsetY - this.iCursorCoordinate.y;
      } else if (this.iTask === 102 && e.buttons === 1) {
        this.iWireCoordinate.x = e.offsetX;
        this.iWireCoordinate.y = e.offsetY;
      }
    },
    mousedownOnPort(e, shapeUid, portIndex, x, y) {
      this.iCursorDown.buttons = e.buttons;
      this.iCursorDown.area = 2;
      this.iCursorCoordinate.x = e.offsetX;
      this.iCursorCoordinate.y = e.offsetY;
      this.iTask = 102;
      this.iWireCoordinate.begin.x = x;
      this.iWireCoordinate.begin.y = y;
      this.iWireCoordinate.x = x;
      this.iWireCoordinate.y = y;
      this.iWireCoordinate.using = true;
      this.iWireCoordinate.begin.shapeUid = shapeUid;
      this.iWireCoordinate.begin.portIndex = portIndex;
    },
    mouseupOnPort(e, shapeUid, portIndex) {
      if (this.iTask === 102) {
        this.createWire(this.iWireCoordinate.begin.shapeUid, this.iWireCoordinate.begin.portIndex, shapeUid, portIndex);
      }
      this.iTask = -1;
      this.iWireCoordinate.using = false;
    },
    updateShapeState(shape, state) {
      shape.width = state.width;
      shape.height = state.height;
      console.info(`updateShapeState width: ${shape.width} , height: ${shape.height}`)
    },
    openMenu(e) {
      this.iMenu.visible = true
      this.iMenu.x = e.offsetX
      this.iMenu.y = e.offsetY
    },
    closeMenu() {
      this.iMenu.visible = false
    },
    clickMenuOption(option) {
      if (option === 'create') {
        this.createShape(this.iCursorCoordinate.x, this.iCursorCoordinate.y);
        this.closeMenu();
      }
    }
  }
}
</script>

<style scoped>

.palette-top-layer {
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
  padding: 3px 5px;
  cursor: pointer;
}

.menu-option:hover {
  background: lightskyblue;
}

.menu-option-icon {
  width: 50px;
}


</style>