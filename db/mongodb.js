const MongoClient = require("mongodb").MongoClient;
const config = require("config");

const cfg = config.get("mg");

module.exports = async function() {
    let options = {};
    if (cfg.user) {
        options = {
            replicaSet: cfg.reset,
            authSource: cfg.name,
            auth: {
                user: cfg.user,
                password: cfg.pwd
            }
        };
    }
    const client = await MongoClient.connect(cfg.url, options);
    console.log("MongoDB连接成功", cfg.url);
    return client.db(cfg.name);
};
