import BaseCH, { Op } from "./baseCH";
import { DataType } from "../db/clickhouse";

const BigData = new BaseCH("t_bigdata", {
    ttl: 10,
    // isCreate: true,
});

BigData.init([
    {
        name: "title", //标题，有长度限制
        type: DataType.string,
    },
    {
        name: "platform", //平台类型
        type: DataType.string,
    },
    {
        name: "clientid", //用户id
        type: DataType.string,
    },
    {
        name: "version", //自定义版本号
        type: DataType.string,
    },
    {
        name: "meta", //附加数据
        type: DataType.string,
    },
    {
        name: "desc", //消息详情
        type: DataType.string,
    },
    {
        name: "ip", //ip地址
        type: DataType.string,
    },
    {
        name: "userAgent", //来源头
        type: DataType.string,
    },
    {
        name: "url", //来源url
        type: DataType.string,
    },
    {
        name: "page_key", //页面key，可以附加的主key
        type: DataType.string,
    },
    {
        name: "event_key", //事件key
        type: DataType.string,
    },
]);

interface IModel {
    title?: string;
    platform?: string;
    clientid?: string;
    version?: string;
    meta?: string;
    desc?: string;
    ip?: string;
    userAgent?: string;
    url?: string;
    page_key?: string;
    event_key?: string;
}
export default {
    insert(model: IModel) {
        return BigData.insert(model);
    },
    query(data: IModel, pageindex: number, limit = 20) {
        let model = {};
        return BigData.query({
            model,
        });
    },
};
