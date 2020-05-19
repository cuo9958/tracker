import { ISchemaOptions, FieldType, InfluxDB } from "influx";
import config from "config";

const DBCONFIG = config.get("influx");

export default function (list: ISchemaOptions[] = []) {
    return new InfluxDB(
        Object.assign({}, DBCONFIG, {
            schema: list,
        })
    );
}

export { FieldType };
