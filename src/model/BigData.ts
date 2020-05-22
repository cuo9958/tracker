import { queryClickHouse, Insert, CreateTable, getEnhine, EnhineEnum, DataType, getTTL, ModelObject, DeleteTable, Query, getUUIDv4, insertClickHouse } from "../db/clickhouse";

const TABLE_NAME = "BigData";

const BigDataModel: ModelObject = {
    //消息的标题
    title: {
        type: DataType.string,
    },
    //详情
    desc: {
        type: DataType.string,
    },
    //用户关联，主动设置或者自动获取
    uid: {
        type: DataType.string,
    },
    //来源url
    url: {
        type: DataType.string,
    },
    //额外信息
    data: {
        type: DataType.string,
    },
    version: {
        type: DataType.string,
    },
    //ip
    ip: {
        type: DataType.string,
    },
    //设备的消息
    userAgent: {
        type: DataType.string,
    },
    timeSpan: {
        type: DataType.Int(64),
    },
    //系统
    sys: {
        type: DataType.string,
    },
    //浏览器
    os: {
        type: DataType.string,
    },
    //创建时间
    createTime: {
        type: DataType.date,
    },
};

const BigData = {
    async init(del?: boolean) {
        if (del) {
            const sql1 = DeleteTable(TABLE_NAME);
            try {
                await queryClickHouse(sql1);
            } catch (error) {
                //
            }
        }
        const sql = CreateTable({
            tableName: TABLE_NAME,
            model: BigDataModel,
            enhine: getEnhine(EnhineEnum.MergeTree),
            partition: "toYYYYMM(createTime)",
            order: ["id", "createTime"],
            ttl: getTTL("createTime", 1, "MONTH"),
        });
        try {
            const r = await queryClickHouse(sql);
            console.log(sql, r);
        } catch (error) {
            console.log(error);
        }
    },
    async query(obj: object) {
        return Query(TABLE_NAME, obj, undefined, 10);
    },
    async insert(obj: object) {
        return Insert(TABLE_NAME, obj);
    },
};

// BigData.init(true);

export default BigData;