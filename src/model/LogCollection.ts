import InfluxDB, { FieldType } from "../db/influxdb";

const DB_NAME = "log_collection";

const obj = {
    measurement: DB_NAME,
    fields: {
        desc: FieldType.STRING,
        meta: FieldType.STRING,
        ip: FieldType.STRING,
        userAgent: FieldType.STRING,
        url: FieldType.STRING,
        os: FieldType.STRING,
        createTime: FieldType.INTEGER,
    },
    tags: ["title", "platform", "clientid", "version"],
};
const db = InfluxDB([obj]);

interface ITags {
    [index: string]: string;

    title?: any;
    platform?: any;
    clientid?: any;
    version?: any;
}

interface IField {
    [index: string]: string | number;

    desc: string;
    meta: string;
    ip: string;
    userAgent: string;
    url: string;
    os: string;
    createTime: number;
}

export default {
    insert(tags: ITags, fields: IField): Promise<void> {
        return db.writePoints([
            {
                measurement: DB_NAME,
                tags: tags,
                fields: fields,
            },
        ]);
    },
    async search(pageIndex: number = 0, searchData: ITags, limit = 20) {
        let sql = "select * from " + DB_NAME;
        if (searchData) {
            sql += " where 1=1";
            if (searchData.title) {
                sql += " and title=~/" + searchData.title + "/";
            }
            if (searchData.platform) {
                sql += " and platform='" + searchData.platform + "'";
            }
            if (searchData.clientid) {
                sql += " and clientid='" + searchData.clientid + "'";
            }
            if (searchData.version) {
                sql += " and version='" + searchData.version + "'";
            }
        }
        if (pageIndex) {
            sql += ` limit ${limit} offset ${pageIndex * limit}`;
        }
        console.log(sql);
        const res = await db.query(sql);
        const list: any[] = [];
        res.forEach((item) => {
            list.push(item);
        });
        return list;
    },
    clear() {
        return db.dropMeasurement(DB_NAME);
    },
};
