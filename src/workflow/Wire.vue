<template>
  <g xmlns="http://www.w3.org/2000/svg">
    <!--          :stroke-dasharray="'5, 5'"-->
    <path :d="drawPath()"
          :stroke="stroke"
          :stroke-width="strokeWidth * scale"
          fill="none"/>

    <path v-if="arrow" :d="drawArrow()" :fill="stroke" stroke="none"/>
  </g>
</template>

<script>

export default {
  name: "Wire",
  props: {
    p1dir      : { type: String, default: 'up' },
    p2dir      : { type: String, default: 'down' },
    p2x        : { type: Number, default: 200 },
    p1y        : { type: Number, default: 200 },
    p1x        : { type: Number, default: 600 },
    p2y        : { type: Number, default: 300 },
    scale      : { type: Number, default: 1 },
    delta      : { type: Number, default: 30 },
    stroke     : { type: String, default: 'white' },
    strokeWidth: { type: Number, default: 2 },
    edge       : { type: Number, default: 6 },
    wire       : { type: String, default: 'wire' },
    arrow      : { type: Boolean, default: false },
  },
  methods: {
    drawArrow() {
      return `M${this.p2x - 8} ${this.p2y - 16}`
          + `L${this.p2x + 0} ${this.p2y - 0}`
          + `L${this.p2x + 8} ${this.p2y - 16}`
          + `L${this.p2x + 0} ${this.p2y - 12}`
          + `Z`;
    },
    drawPath() {
      // if (this.p1x === null || this.p1y === null || this.p2x === null || this.p2y === null)
      //   throw new Error("<path> args error");
      let path;
      // console.info(`[wire] (${this.p1x}, ${this.p1y}) ${this.p1dir} -> (${this.p2x}, ${this.p2y})  ${this.p2dir}!`);
      let p2x = this.p2x === null ? this.p1x : this.p2x;
      let p2y = this.p2y === null ? this.p1y : this.p2y;
      const edge = this.edge * this.scale;
      let p1r = this.remap(this.p1x, this.p1y, this.p1dir, this.delta * this.scale);
      let p2r = this.remap(p2x, p2y, this.p2dir, this.delta * this.scale);
      let pmr = [(p1r[0] + p2r[0]) * 0.5, (p1r[1] + p2r[1]) * 0.5];
      if (this.wire === 'curve') {
        // path = ``;

        /*
        *         return `M${curve.start[0]} ${curve.start[1]} ` +
            `C${curve.start[0]} ${(curve.start[1] + curve.end[1]) / 2}` +
            ` ${curve.end[0]} ${(curve.start[1] + curve.end[1]) / 2}` +
            ` ${curve.end[0]} ${curve.end[1]}`;
        * */
        // if (this.p1dir === 'down' && this.p2dir === 'up' && this.p1y >= this.p2y) {
        let point1 = [this.p1x, this.p1y];
        let point2 = [this.p2x, this.p2y];
        path = `M${point1[0]} ${point1[1]} ` +
            `C${point1[0]} ${(point1[1] + point2[1]) / 2}` +
            ` ${point2[0]} ${(point1[1] + point2[1]) / 2}` +
            ` ${point2[0]} ${point2[1]}`
        ;
        // }
      } else if (this.wire === 'wire') {
        if (this.p1dir === this.p2dir && this.p1dir === 'up' && this.p1y <= p2y) {
          path = `M${this.p1x} ${this.p1y} L${p1r[0]} ${p1r[1] + edge} L${p1r[0] + edge * (this.p1x <= p2x ? 1 : -1)} ${p1r[1]} L${p2r[0] - edge * (this.p1x <= p2x ? 1 : -1)} ${p1r[1]} L${p2r[0]} ${p1r[1] + edge} L${p2r[0]} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (this.p1dir === this.p2dir && this.p1dir === 'up' && this.p1y > p2y) {
          path = `M${p2x} ${p2y} L${p2r[0]} ${p2r[1] + edge} L${p2r[0] - edge * (this.p1x <= p2x ? 1 : -1)} ${p2r[1]} L${p1r[0] + edge * (this.p1x <= p2x ? 1 : -1)} ${p2r[1]} L${p1r[0]} ${p2r[1] + edge} L${p1r[0]} ${p1r[1]} L${this.p1x} ${this.p1y}`;
        } else if (this.p1dir === this.p2dir && this.p1dir === 'down' && this.p1y > p2y) {
          path = `M${this.p1x} ${this.p1y} L${p1r[0]} ${p1r[1] - edge} L${p1r[0] + edge * (this.p1x <= p2x ? 1 : -1)} ${p1r[1]} L${p2r[0] - edge * (this.p1x <= p2x ? 1 : -1)} ${p1r[1]} L${p2r[0]} ${p1r[1] - edge} L${p2r[0]} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (this.p1dir === this.p2dir && this.p1dir === 'down' && this.p1y <= p2y) {
          path = `M${p2x} ${p2y} L${p2r[0]} ${p2r[1] - edge} L${p2r[0] - edge * (this.p1x <= p2x ? 1 : -1)} ${p2r[1]} L${p1r[0] + edge * (this.p1x <= p2x ? 1 : -1)} ${p2r[1]} L${p1r[0]} ${p2r[1] - edge} L${p1r[0]} ${p1r[1]} L${this.p1x} ${this.p1y}`;
        } else if (this.p1dir === this.p2dir && this.p1dir === 'left' && this.p1x <= p2x) {
          path = `M${this.p1x} ${this.p1y} L${p1r[0] + edge} ${p1r[1]} L${p1r[0]} ${p1r[1] + edge * (this.p1y <= p2y ? 1 : -1)} L${p1r[0]} ${p2r[1] - edge * (this.p1y <= p2y ? 1 : -1)} L${p1r[0] + edge} ${p2r[1]} L${p2r[0]} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (this.p1dir === this.p2dir && this.p1dir === 'left' && this.p1x > p2x) {
          path = `M${p2x} ${p2y} L${p2r[0] + edge} ${p2r[1]} L${p2r[0]} ${p2r[1] - edge * (this.p1y <= p2y ? 1 : -1)} L${p2r[0]} ${p1r[1] + edge * (this.p1y <= p2y ? 1 : -1)} L${p2r[0] + edge} ${p1r[1]} L${p1r[0]} ${p1r[1]} L${this.p1x} ${this.p1y}`;
        } else if (this.p1dir === this.p2dir && this.p1dir === 'right' && this.p1x <= p2x) {
          path = `M${p2x} ${p2y} L${p2r[0] - edge} ${p2r[1]} L${p2r[0]} ${p2r[1] - edge * (this.p1y <= p2y ? 1 : -1)} L${p2r[0]} ${p1r[1] + edge * (this.p1y <= p2y ? 1 : -1)} L${p2r[0] - edge} ${p1r[1]} L${p1r[0]} ${p1r[1]} L${this.p1x} ${this.p1y}`;
        } else if (this.p1dir === this.p2dir && this.p1dir === 'right' && this.p1x > p2x) {
          path = `M${this.p1x} ${this.p1y} L${p1r[0] - edge} ${p1r[1]} L${p1r[0]} ${p1r[1] + edge * (this.p1y <= p2y ? 1 : -1)} L${p1r[0]} ${p2r[1] - edge * (this.p1y <= p2y ? 1 : -1)} L${p1r[0] - edge} ${p2r[1]} L${p2r[0]} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (this.p1dir === 'left' && this.p2dir === 'right' && this.p1x <= p2x) {
          path = `M${this.p1x} ${this.p1y} L${p1r[0] + edge} ${p1r[1]} L${p1r[0]} ${p1r[1] + edge * (this.p1y <= p2y ? 1 : -1)} L${p1r[0]} ${pmr[1] - edge * (this.p1y <= p2y ? 1 : -1)} L${p1r[0] + edge} ${pmr[1]} L${p2r[0] - edge} ${pmr[1]} L${p2r[0]} ${pmr[1] + edge * (this.p1y <= p2y ? 1 : -1)} L${p2r[0]} ${p2r[1] - edge * (this.p1y <= p2y ? 1 : -1)} L${p2r[0] - edge} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (this.p1dir === 'left' && this.p2dir === 'right' && this.p1x > p2x) {
          path = `M${this.p1x} ${this.p1y} L${pmr[0] + edge} ${p1r[1]} L${pmr[0]} ${p1r[1] + edge * (this.p1y <= p2y ? 1 : -1)} L${pmr[0]} ${p2r[1] - edge * (this.p1y <= p2y ? 1 : -1)} L${pmr[0] - edge} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (this.p1dir === 'right' && this.p2dir === 'left' && this.p1x <= p2x) {
          path = `M${this.p1x} ${this.p1y} L${pmr[0] - edge} ${p1r[1]} L${pmr[0]} ${p1r[1] + edge * (this.p1y <= p2y ? 1 : -1)} L${pmr[0]} ${p2r[1] - edge * (this.p1y <= p2y ? 1 : -1)} L${pmr[0] + edge} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (this.p1dir === 'right' && this.p2dir === 'left' && this.p1x > p2x) {
          path = `M${this.p1x} ${this.p1y} L${p1r[0] - edge} ${p1r[1]} L${p1r[0]} ${p1r[1] + edge * (this.p1y <= p2y ? 1 : -1)} L${p1r[0]} ${pmr[1] - edge * (this.p1y <= p2y ? 1 : -1)} L${p1r[0] - edge} ${pmr[1]} L${p2r[0] + edge} ${pmr[1]} L${p2r[0]} ${pmr[1] + edge * (this.p1y <= p2y ? 1 : -1)} L${p2r[0]} ${p2r[1] - edge * (this.p1y <= p2y ? 1 : -1)} L${p2r[0] + edge} ${p2r[1]} L${p2x} ${p2y}`;
        } else if (this.p1dir === 'up' && this.p2dir === 'down' && this.p1y < p2y) {
          path = `M${this.p1x} ${this.p1y} `
              +`L${p1r[0]} ${p1r[1] + edge} `
              +`L${p1r[0] + edge * (this.p1x <= p2x ? 1 : -1)} ${p1r[1]} `
              +`L${pmr[0] - edge * (this.p1x <= p2x ? 1 : -1)} ${p1r[1]} `
              +`L${pmr[0]} ${p1r[1] + edge} `
              +`L${pmr[0]} ${p2r[1] - edge} `
              +`L${pmr[0] + edge * (this.p1x <= p2x ? 1 : -1)} ${p2r[1]} `
              +`L${p2r[0] - edge * (this.p1x <= p2x ? 1 : -1)} ${p2r[1]} `
              +`L${p2r[0]} ${p2r[1] - edge} `
              +`L${p2x} ${p2y}`;
        } else if (this.p1dir === 'up' && this.p2dir === 'down' && this.p1y >= p2y) {
          path = `M${this.p1x} ${this.p1y} `
              +`L${p1r[0]} ${pmr[1] + edge} `
              +`L${p1r[0] + edge * (this.p1x <= p2x ? 1 : -1)} ${pmr[1]} `
              +`L${p2r[0] - edge * (this.p1x <= p2x ? 1 : -1)} ${pmr[1]} `
              +`L${p2r[0]} ${pmr[1] - edge} `
              +`L${p2x} ${p2y}`;
        } else if (this.p1dir === 'down' && this.p2dir === 'up' && this.p1y >= p2y) {
          path = `M${this.p1x} ${this.p1y} `
              +`L${p1r[0]} ${p1r[1] - edge} `
              +`L${p1r[0] + edge * (this.p1x <= p2x ? 1 : -1)} ${p1r[1]} `
              +`L${pmr[0] - edge * (this.p1x <= p2x ? 1 : -1)} ${p1r[1]} `
              +`L${pmr[0]} ${p1r[1] - edge} `
              +`L${pmr[0]} ${p2r[1] + edge} `
              +`L${pmr[0] + edge * (this.p1x <= p2x ? 1 : -1)} ${p2r[1]} `
              +`L${p2r[0] - edge * (this.p1x <= p2x ? 1 : -1)} ${p2r[1]} `
              +`L${p2r[0]} ${p2r[1] + edge} `
              +`L${p2x} ${p2y}`;
        } else if (this.p1dir === 'down' && this.p2dir === 'up' && this.p1y < p2y) {
          const dist = Math.abs(this.p1x - pmr[0]);
          if (dist <= this.edge * this.scale) {
            const zp = dist * Math.sqrt(2);
            path = `M${this.p1x} ${this.p1y} `
                + `L${this.p1x} ${pmr[1] - zp}`
                + `L${this.p2x} ${pmr[1] + zp}`
                + `L${p2x} ${p2y}`;
          } else {
            path = `M${this.p1x} ${this.p1y} `
                +`L${p1r[0]} ${pmr[1] - edge} `
                +`L${p1r[0] + edge * (this.p1x <= p2x ? 1 : -1)} ${pmr[1]} `
                +`L${p2r[0] - edge * (this.p1x <= p2x ? 1 : -1)} ${pmr[1]} `
                +`L${p2r[0]} ${pmr[1] + edge} `
                +`L${p2x} ${p2y}`;
          }
        }
      } else if (this.wire === 'line') {
        path = `M${this.p1x} ${this.p1y} `
            + `L${p1r[0]} ${p1r[1]} `
            + `L${p2r[0]} ${p2r[1]} `
            + `L${p2x} ${p2y}`;
      } else {

      }
      // console.info("path: " + path);
      return path;
    },
    remap(px, py, dir, delta) {
      if (dir === 'up') {
        return [px, py - delta];
      } else if (dir === 'down') {
        return [px, py + delta];
      } else if (dir === 'left') {
        return [px - delta, py];
      } else if (dir === 'right') {
        return [px + delta, py];
      } else {
        throw new Error('Unknown wire direction: ' + dir + '!');
      }
    },
  }
}
</script>

<style scoped>

</style>