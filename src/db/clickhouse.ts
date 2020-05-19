import { ClickHouse } from "clickhouse";
import config from "config";
import nanoid from "nanoid";
import { DateFormart } from "../utils/date";

interface ICFG {
    url: string;
    port: number;
    database: string;
}
const CFG: ICFG = config.get("chouse");
const clickhouse = new ClickHouse({
    url: CFG.url,
    port: CFG.port,
    debug: false,
    basicAuth: null,
    isUseGzip: false,
    format: "json", // "json" || "csv" || "tsv"
});

export default clickhouse;
export const ClickHouseDB = clickhouse;

export function createFactory(db = CFG.database) {
    return new ClickHouse({
        url: CFG.url,
        port: CFG.port,
        debug: false,
        basicAuth: null,
        isUseGzip: false,
        format: "json", // "json" || "csv" || "tsv"
        config: {
            database: db,
        },
    });
}
/**
 * 查询语法
 * @param sql 查询sql
 * @param reqParams 参数
 */
export function queryClickHouse(sql: string, reqParams?: object): Promise<object[]> {
    return ClickHouseDB.query(sql, reqParams).toPromise();
}
/**
 * 插入数据
 * @param sql 插入sql
 * @param data 对象
 */
export function insertClickHouse(sql: string, data?: object): Promise<object[]> {
    return ClickHouseDB.insert(sql, data).toPromise();
}
/**
 * 创建一个新的数据库
 * @param dataName 数据库名
 * @param sync 是否强制创建,默认不强制
 */
export function CreateDataBase(dataName, sync = false) {
    if (sync) return "CREATE DATABASE IF NOT EXISTS " + dataName;
    return "CREATE DATABASE " + dataName;
}
interface ModelType {
    type: string;
    default?: string | number | null;
}
export interface ModelObject {
    [name: string]: ModelType;
}
interface ICreateTable {
    tableName: string;
    model: ModelObject;
    enhine?: string;
    partition?: string;
    order?: string[];
    sample?: string;
    settings?: string;
    ttl?: string;
}
/**
 *创建一个新的表
 * @param tableName 表名
 * @param model 映射对象
 * @param enhine 索引引擎
 * @param partition 分区建
 * @param order 排序、主键
 * @param sample 抽样
 * @param settings 其他设置
 * @param ttl 过期时间
 */
export function CreateTable(opts: ICreateTable) {
    const PARTITION = opts.partition ? "PARTITION BY " + opts.partition : "";
    const ORDER = opts.order && opts.order.length > 0 ? "ORDER BY (" + opts.order.join(",") + ")" : "";
    const SAMPLE = opts.sample ? "SAMPLE BY " + opts.sample : "";
    const SETTINGS = opts.settings ? "SETTINGS " + opts.settings : "";
    const body = getBody(opts.model);
    return `CREATE TABLE IF NOT EXISTS ${opts.tableName}(
        ${body}
    )
    ${opts.enhine} ${PARTITION} ${ORDER} ${SAMPLE} ${opts.ttl} ${SETTINGS};`;
}
/**
 * 删除表
 * @param tableName 表名
 */
export function DeleteTable(tableName: string) {
    return "DROP TABLE IF EXISTS " + tableName + ";";
}
/**
 * 从对象到sql
 * @param model 对象
 */
export function getBody(model: any) {
    const list: string[] = [];
    for (const key in model) {
        const obj = model[key];
        let tmp = "`" + key + "` " + obj.type;
        if (obj.default !== undefined) {
            tmp += " DEFAULT '" + obj.default + "'";
        }
        list.push(tmp);
    }
    list.push("id " + DataType.string);
    return list.join(",");
}

/**
 * 预设的数据类型
 */
export const DataType = {
    //16位的字符串，默认：00000000-0000-0000-0000-000000000000
    uuid: "UUID",
    //ip4地址,字符串
    ipv4: "IPv4",
    ipv6: "IPv6",
    /**
     * 使用int8存储的枚举
     * @param arr 枚举字符串
     */
    Enum8(arr: string[]) {
        const list: string[] = [];
        arr.forEach((item: string, index: number) => {
            list.push(`'${item}'=${index + 1}`);
        });

        return `Enum8(${list.join(",")})`;
    },
    Enum16(arr: string[]) {
        const list: string[] = [];
        arr.forEach((item: string, index: number) => {
            list.push(`'${item}'=${index + 1}`);
        });

        return `Enum8(${list.join(",")})`;
    },
    float: "Float32",
    double: "Float64",
    int: "Int32",
    Int(len: 8 | 16 | 32 | 64) {
        return `Int${len}`;
    },
    UInt8(len: 8 | 16 | 32 | 64) {
        return `UInt${len}`;
    },
    string: "String",
    date: "Date",
    dateTime: "DateTime",
    /**
     * 嵌套的数组
     * @param type 其他类型
     */
    Array(type: string) {
        return `Array(${type})`;
    },
};
export enum EnhineEnum {
    MergeTree = "MergeTree",
    /**
     * 不在意顺序的连续插入
     */
    VersionedCollapsingMergeTree = "VersionedCollapsingMergeTree",
    /**
     * 如果要按一组规则来合并减少行数，则使用 AggregatingMergeTree 是合适的。
     */
    AggregatingMergeTree = "AggregatingMergeTree",
    SummingMergeTree = "SummingMergeTree",
}

/**
 * 获取引擎的内容
 * @param name 引擎名称
 */
export function getEnhine(name: EnhineEnum, data1 = "", data2 = "") {
    if (name === EnhineEnum.MergeTree) {
        return `ENGINE=MergeTree()`;
    }
    if (name === EnhineEnum.VersionedCollapsingMergeTree) {
        return `ENGINE=VersionedCollapsingMergeTree(${data1},${data2})`;
    }
    if (name === EnhineEnum.AggregatingMergeTree) {
        return `ENGINE=AggregatingMergeTree()`;
    }
    if (name === EnhineEnum.SummingMergeTree) {
        return `ENGINE=SummingMergeTree(${data1})`;
    }
    return "";
}
/**
 * 创建一个过期长度
 * @param name 字段名，必须是DateTime类型
 * @param len 长度
 * @param type 类型
 */
export function getTTL(name: string, len: number, type: "MONTH") {
    return `TTL ${name} + INTERVAL ${len} ${type}`;
}
// SELECT [DISTINCT] expr_list
//     [FROM [db.]table | (subquery) | table_function] [FINAL]
//     [SAMPLE sample_coeff]
//     [ARRAY JOIN ...]
//     [GLOBAL] ANY|ALL INNER|LEFT JOIN (subquery)|table USING columns_list
//     [PREWHERE expr]
//     [WHERE expr]
//     [GROUP BY expr_list] [WITH TOTALS]
//     [HAVING expr]
//     [ORDER BY expr_list]
//     [LIMIT [n, ]m]
//     [UNION ALL ...]
//     [INTO OUTFILE filename]
//     [FORMAT format]
//     [LIMIT n BY columns]
/**
 * 查询表
 * @param tableName 表名
 * @param obj 对象
 * @param attr 字段
 * @param limit 数量
 */
export function Query(tableName: string, obj?: object, attr?: string[], limit?: number) {
    let attrs = attr ? attr.join(",") : "*";
    let sql = "select " + attrs + " from " + tableName;
    let where = "";
    if (obj) {
        const list: string[] = [];
        for (const key in obj) {
            const tmp = typeof obj[key] === "string" ? "'" + obj[key] + "'" : obj[key];
            list.push("`" + key + "`=" + tmp);
        }
        if (list.length > 0) sql += " where " + where;
    }
    if (limit) {
        sql += " LIMIT " + limit;
    }
    return queryClickHouse(sql);
}

export function Insert(tableName: string, obj: object, data?: any) {
    let listKey: string[] = [];
    let listValue: Array<string | number> = [];
    for (const key in obj) {
        const v = obj[key];
        if (typeof v === "string") {
            listKey.push(key);
            listValue.push(`'${v}'`);
        }
        if (typeof v === "number") {
            listKey.push(key);
            listValue.push(v);
        }
        if (v.constructor === Date) {
            listKey.push(key);
            listValue.push(`'${DateFormart(v, "yyyy-MM-dd")}'`);
        }
    }
    listKey.push("id");
    listValue.push(`'${nanoid.nanoid()}'`);
    let sql = `INSERT INTO ${tableName} (${listKey.join(",")}) VALUES(${listValue.join(",")});`;
    console.log(sql);
    return insertClickHouse(sql, data);
}

//show databases;
//show tables;

export function getUUIDv4() {
    return "SELECT generateUUIDv4()";
}
