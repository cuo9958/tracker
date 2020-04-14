/**
 * 缓存模块
 * 1.本地保持缓存
 * 2.及时更新
 * 3.更新频率控制，防止同时多次更新
 */
import local_cache from "@cuo9958/local_cache";

const cache_key = "";

/**
 * 缓存失败的时候刷新方法
 */
function onExpire(key: string) {}

//缓存方法
const Caches = new local_cache({
    maxAge: 1000,
    update: onExpire,
});

export default {
    /**
     * 获取
     * @param key key
     */
    get(key: string) {},
    /**
     * 设置
     * @param key key
     * @param val val
     */
    set(key: string, val: object) {},
    /**
     * 缓存是否存在
     * @param key key
     */
    has(key: string) {},
    /**
     * 删除
     * @param key key
     */
    del(key: string) {},
    /**
     * 清楚第一层缓存，下次重新获取
     */
    reset() {},
};
