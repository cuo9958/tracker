const Redis = require("ioredis");
const config = require("config");

const cluster = new Redis(config.redis, {
    reconnectOnError: function(err) {
        console.log("redis连接失败", err);
        return false;
    }
});
console.log("连接redis");

module.exports = cluster;
