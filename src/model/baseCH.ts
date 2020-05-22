import { DataType } from "../db/clickhouse";
/**
 * 自定义数据表，
 * 添加固定参数，uuid,createTime
 * 必须配置生命周期,默认30天
 */

export const Op = {
    gt: "gt",
    lt: "lt",
    in: "in",
};
//操作符
const OP = {
    //大于
    gt(v: string | number, type: string) {
        if (type === DataType.double || type === DataType.float || type.includes("int")) {
            return ">" + v;
        }
        return ">'" + v + "'";
    },
    lt(v: string | number, type: string) {
        if (type === DataType.double || type === DataType.float || type.includes("int")) {
            return "<" + v;
        }
        return "<'" + v + "'";
    },
    in(list: string[], type: string) {
        if (type === DataType.string) {
            return ` in ('${list.join("','")}')`;
        }
        return ` in (${list.join(",")})`;
    },
};
abstract class Base {
    abstract init(obj: any[], opts?: IOpts): void;
}

interface IColumn {
    name: string;
    type: string;
    default?: string | number;
}
interface IOpts {
    //ttl:定义单行的生命周期
    ttl?: number;
    ttleType?: string;
    isCreate?: boolean;
    order?: string[];
    indexKey?: string;
}

interface IQueryOpts {
    //查询操作
    model: object;
    //返回的字段名
    attrs?: string[];
}

//计算字符串的hash，返回UInt64。sipHash64
//toDayOfYear，转成天，1-366
//toMonth,转成月，1-12
//now,today,yesterday
//toYYYYMM,toYYYYMMDD,toYYYYMMDDhhmmss
//addYears, addMonths, addWeeks, addDays, addHours, addMinutes, addSeconds, addQuarters,增加
//减少subtractYears, subtractMonths, subtractWeeks, subtractDays, subtractHours, subtractMinutes, subtractSeconds, subtractQuarters
//formatDateTime,格式化，％F（2018-01-02），％T(22:33:44)

/**
 * 创建类，
 * 默认引擎，
 * 自动增加id、createTime字段，
 * 默认分区createTime
 * 默认生命周期，createTime 30天
 */
export default class Test extends Base {
    constructor(dbName: string, opts?: IOpts) {
        super();
        this.dbName = dbName;
        if (!opts) return;
        if (opts.ttl) {
            this.TTL = opts.ttl;
        }
        if (opts.ttleType) {
            this.TTL_TYPE = opts.ttleType;
        }
        if (opts.isCreate) {
            this.isCreate = opts.isCreate;
        }
        if (opts.order) {
            this.order = opts.order.concat("id");
        }
        if (opts.indexKey) {
            this.indexKey = opts.indexKey;
        }
    }
    dbName = "test_db";
    private indexName = "tit";
    //title,排序标准
    private indexKey = "";
    private isCreate = false;
    private TTL = 30;
    private TTL_TYPE = "DAY";
    private engine = "MergeTree()";
    private partition = "toYYYYMM(createTime)";
    private order: string[] = ["id"];
    private columns: IColumn[] = [];
    /**
     * 初始化表
     */
    init(obj: IColumn[]) {
        //初始化数据结构
        this.columns = obj;
        //创建数据库
        if (this.isCreate) {
            this.createTable();
        }
    }
    /**
     * 创建数据库
     * @param databaseName 数据库名称
     */
    createDataBase(databaseName: string) {
        const sql = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
    }
    /**
     * 创建表,自动增加id、createTime字段
     */
    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS ${this.dbName} (
            id UUID DEFAULT generateUUIDv4(),
            createTime DateTime DEFAULT now(),
            ${this.getBodyList(this.columns)}
        ) ENGINE=${this.engine} PARTITION BY ${this.partition} ORDER BY (${this.order.join(",")}) TTL createTime + INTERVAL ${this.TTL} ${this.TTL_TYPE}`;

        console.log("建表", sql);
    }
    /**
     * 删除表
     */
    delTable() {
        const sql = `DROP TABLE IF EXISTS ${this.dbName};`;
        console.log(sql);
    }
    /**
     * 查看表结构
     */
    getTableInfo() {
        const sql = `DESCRIBE TABLE ${this.dbName}`;
    }
    /**
     * 修改表字段
     * @param key 字段名
     * @param op 操作符
     * @param type 类型，删除的时候不需要
     */
    modifyColumn(key: string, op: "ADD" | "DROP" | "MODIFY", type: string) {
        const sql = `ALTER TABLE ${this.dbName} ${op} COLUMN ${key} ${type}`;
        console.log("修改表", sql);
    }
    //添加
    insert(obj: any) {
        const list1: string[] = ["id", "createTime"];
        const list2: string[] = ["generateUUIDv4()", "now()"];
        this.columns.forEach((item: IColumn) => {
            const v = obj[item.name] || this.getDefault(item.type);
            const isSet = this.isString(item);
            list1.push(item.name);
            list2.push(isSet ? `'${v}'` : v);
        });

        const sql = `INSERT INTO ${this.dbName} (${list1.join(",")}) VALUES (${list2.join(",")});`;
        console.log("添加", sql);
    }
    /**
     * 批量插入
     * @param list 数组
     */
    insertList(list: any[]) {
        const list1: string[] = ["id", "createTime"];
        const list2: string[] = [];

        this.columns.forEach((item: IColumn) => {
            list1.push(item.name);
        });

        list.forEach((col) => {
            const list3: string[] = ["generateUUIDv4()", "now()"];
            this.columns.forEach((item: IColumn) => {
                const v = col[item.name] || this.getDefault(item.type);
                const isSet = this.isString(item);
                list3.push(isSet ? `'${v}'` : v);
            });
            list2.push(`(${list3.join(",")})`);
        });

        const sql = `INSERT INTO ${this.dbName} (${list1.join(",")}) VALUES ${list2.join(",")};`;
        console.log("批量插入", sql);
    }
    //基础搜索
    query(data: IQueryOpts) {
        const attrs = data.attrs ? data.attrs.join(",") : "*";
        const list: string[] = [];
        for (const key in data.model) {
            const val = data.model[key];
            const col: IColumn | undefined = this.getColumn(key);
            if (!col) continue;
            //有操作符
            if (typeof val === "object") {
                for (const o in val) {
                    if (OP[o]) {
                        list.push(key + OP[o](val[o], col.type));
                    }
                }
            } else {
                if (col.type === DataType.string) {
                    list.push(`${key}='${val}'`);
                } else {
                    list.push(`${key}=${val}`);
                }
            }
        }
        let where = "";
        if (list.length > 0) {
            where = "where " + list.join(" and ");
        }
        const sql = `select ${attrs} from ${this.dbName} ${where}`;
        console.log("查询", sql);
    }
    //个数
    count(data: any = {}) {
        const sql = `select count() from ${this.dbName}`;
    }
    //总计
    sum(key: string) {
        const sql = `SELECT sum(${key}) FROM ${this.dbName}`;
    }
    min(key: string) {
        const sql = `SELECT min(${key}) FROM ${this.dbName}`;
    }
    max(key: string) {
        const sql = `SELECT max(${key}) FROM${this.dbName}`;
    }
    //查询val，返回arg1
    argMin(arg1: string, val: string) {
        const sql = `SELECT argMin(${arg1}, ${val}) FROM salary`;
    }
    argMax(arg1: string, val: string) {
        const sql = `SELECT argMax(${arg1}, ${val}) FROM salary`;
    }

    /**
     * 解析查询条件
     * @param obj 对象
     */
    private getQueryList(obj: any) {}
    /**
     * 生成字段和值
     * @param names 字段名
     */
    private getBodyList(names: IColumn[]) {
        const list: string[] = [];
        names.forEach((item: IColumn) => {
            let res = "";
            switch (item.type) {
                case DataType.uuid:
                    //SELECT generateUUIDv4()
                    res = `${item.name} ${item.type}`;
                    break;
                case DataType.int:
                    res = `${item.name} ${item.type} DEFAULT ${item.default || 0}`;
                    break;
                case DataType.string:
                    res = `${item.name} ${item.type} DEFAULT '${item.default || ""}'`;
                    break;
            }

            list.push(res);
        });
        return list.join(",");
    }
    /**
     * 判断是否需要加引号
     * @param key key
     */
    private isString(column: IColumn) {
        return column.type === DataType.string;
    }
    /**
     * 获取字段信息
     * @param key 字段
     */
    private getColumn(key: string) {
        let info: IColumn | undefined;
        this.columns.forEach((item) => {
            if (item.name === key) info = item;
        });
        return info;
    }
    /**
     * 获取默认值
     * @param type 类型
     */
    private getDefault(type: string) {
        if (type === DataType.string) return "";
        if (type === DataType.int) return 0;
        if (type === DataType.float) return 0;
        if (type === DataType.double) return 0;
        if (type === DataType.date) return "now()";
        if (type === DataType.dateTime) return "now()";
        return "";
    }
}

const testDB = new Test("test_db", {
    ttl: 1,
    isCreate: true,
});

const obj = [
    {
        name: "test1",
        type: DataType.string,
        default: "",
    },
    // {
    //     name: "date2",
    //     type: DataType.date,
    // },
];
// testDB.init(obj);

// testDB.query();

// testDB.delTable();

// testDB.insert({
//     test1: "1232",
// });

// testDB.insertList([
//     {
//         test1: "222",
//     },
//     {
//         test1: "123222",
//     },
// ]);

// testDB.query({
//     model: {
//         test1: "222",
//     },
// });

// testDB.query({
//     model: {
//         test1: {
//             [Op.in]: ["123", "222"],
//         },
//     },
// });