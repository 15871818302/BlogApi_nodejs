import NodeCache from "node-cache";

// 内存缓存
const cache = new NodeCache({
  stdTTL: 600, // 默认缓存时间为10分钟
  checkperiod: 120, // 每2分钟检查一次过期的缓存
  maxKeys: 1000, // 限制缓存数量
});

export default cache;
