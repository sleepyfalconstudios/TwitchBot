import NodeCache from "node-cache"

const Cache = new NodeCache( { stdTTL: 86400, checkperiod: 500 } );
export { Cache }