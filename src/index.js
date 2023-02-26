import {v4 as uuidv4} from "uuid"
import jlib from "./utils/jlib"
import {nodeName, mount} from "@/visual/graph.ts";

const g = {
    uuid: uuidv4().replaceAll('-', ''),
    scale: 1.0,
    task: {type: -1, cursor: null, node: null},
    nodes: [
        {uuid: uuidv4().replaceAll('-', ''), x: 0, y:0, w: 0, h: 0}
    ],
    wires: [

    ],
    cache: null
}
g.cache = new Map(Object.entries({[nodeName(g.nodes[0])]: g.nodes[0]}))

mount(g, jlib.ref('root'))

console.info(g)