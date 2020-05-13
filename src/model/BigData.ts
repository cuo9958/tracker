import { ClickHouseDB, queryClickHouse, insertClickHouse, CreateTable, getEnhine, EnhineEnum, DataType, getTTL, ModelObject } from "../db/clickhouse";

const TABLE_NAME = "BigData";

const BigDataModel: ModelObject = {
    id: {
        type: DataType.int,
    },
    test: {
        type: DataType.string,
        default: "",
    },
    createTime: {
        type: DataType.date,
    },
};

const BigData = {
    async init() {
        const sql = CreateTable({
            tableName: TABLE_NAME,
            model: BigDataModel,
            enhine: getEnhine(EnhineEnum.MergeTree),
            partition: "toYYYYMM(createTime)",
            order: ["id"],
            ttl: getTTL("createTime", 1, "MONTH"),
        });

        try {
            console.log(sql);
            const r = await queryClickHouse(sql);
            console.log(sql, r);
        } catch (error) {
            console.log(error);
        }
    },
};

BigData.init();

export default BigData;