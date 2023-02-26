import jlib from "../utils/jlib"
import "./graph.css"
// Type definitions
export enum PortType  { IN, OUT }
export type Point   = { x: number; y: number; }
export type Node    = { uuid: string; x: number; y: number; w: number; h: number; }
export type Wire    = { uuid0: string; portType0: PortType; portIndex0: number; uuid1: string; portType1: PortType; portIndex1: number; }
export type Graph   = { uuid: string, scale: 1.0; task: Task; nodes: Array<Node>; wires: Array<Wire>; cache: Map<string, any>; }
export type Task    = { type: number; cursor: Point; node: Node; }
export const nodeName = (node: Node) => (`node@${node.uuid}`)
export const wireName = (wire: Wire) => (`wire@${wire.uuid0}@${wire.portType0}@${wire.portIndex0}@${wire.uuid1}@${wire.portType1}@${wire.portIndex1}`)
// Reuse template fragments
export const JNode = (props: Node, g: Graph) => (`<div id="${nodeName(props)}" class="node" style="left: ${props.x}px; top: ${props.y}px; transform: scale(${g.scale})"></div>`)
const getPath = (p0: Point, p1: Point) => ``
export const JWire = (props: Wire, g: Graph) => (`<path id="${wireName(props)}" fill="none" d=""/>`)
export const JGraph = (props: Graph) => (`
<div id="graph@${props.uuid}" class="cover graph">
    <svg xmlns="http://www.w3.org/2000/svg" class="cover palette">
    ${props.wires.map(wire => JWire(wire, props)).join('')}    
    </svg>
    ${props.nodes.map(node => JNode(node, props)).join('')}
</div>
`)
const place = (node: Node, ref: HTMLElement, p: Point) => {
    node.x = p.x; node.y = p.y;
    ref.style.left = `${p.x}px`
    ref.style.top  = `${p.y}px`
}
// event process
const handleMouseDownOnNode = (e: MouseEvent, g: Graph, data: Node) => {
    console.info('mouse down on node')
    if (e.buttons === 1) {
        g.task = { type: 1, cursor: { x: e.clientX, y: e.clientY }, node: {...data} }
    }
}
const handleMouseUpOnNode = (e: MouseEvent, g: Graph, data) => {}
const handleMouseDownOnGroup = (e: MouseEvent, g: Graph, data) => {}
const handleMouseUpOnGroup = (e: MouseEvent, g: Graph, data) => {}
const handleMouseDownOnPort = (e: MouseEvent, g: Graph, data) => {}
const handleMouseUpOnPort = (e: MouseEvent, g: Graph, data) => {}
const handleMouseDownOnGraph = (e: MouseEvent, g: Graph, data) => {}
const handleMouseUpOnGraph = (e: MouseEvent, g: Graph) => {
    g.task.type = -1
}
const handleMouseMoveOnGraph = (e: MouseEvent, g: Graph) => {
    if (e.buttons === 1 && g.task.type === 1) {
        place(g.cache.get(nodeName(g.task.node)), jlib.ref(nodeName(g.task.node)),
            {x: g.task.node.x + e.clientX - g.task.cursor.x, y: g.task.node.y + e.clientY - g.task.cursor.y})
    }
}
const handleWheelSlide = (e: MouseEvent, g: Graph, data) => {}
const handleWheelDown = (e: MouseEvent, g: Graph, data) => {}
// Functional hook
// Component lifecycle
export const mount = (g: Graph, el: HTMLElement) => {
    el.innerHTML = JGraph(g)
    const graph = jlib.ref(`graph@${g.uuid}`)
    graph.addEventListener('mouseup'  , e => handleMouseUpOnGraph(e, g))
    graph.addEventListener('mousemove', e => handleMouseMoveOnGraph(e, g))
    g.nodes.forEach(node => {
        const ref = jlib.ref(nodeName(node))
        node.w = ref.clientWidth; node.h = ref.clientHeight
        ref.addEventListener('mousedown', e => handleMouseDownOnNode(e, g, node))
    })
}

export default {
    nodeName, wireName,
    JNode, JWire, JGraph,
    mount,
}