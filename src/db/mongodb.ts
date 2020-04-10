import { MongoClient } from "mongodb";
import config from "config";

interface ICONF {
    url: string;
    user: string;
    reset: string;
    name: string;
    pwd: string;
}

const cfg: ICONF = config.get("mg");

export default async function () {
    let options = {};
    if (cfg.user) {
        options = {
            replicaSet: cfg.reset,
            authSource: cfg.name,
            auth: {
                user: cfg.user,
                password: cfg.pwd,
            },
        };
    }
    const client = await MongoClient.connect(cfg.url, options);
    console.log("MongoDB连接成功", cfg.url);
    return client.db(cfg.name);
}
