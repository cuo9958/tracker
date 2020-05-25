import BaseCH from "./baseCH";
import { DataType } from "../db/clickhouse";

const BigData = new BaseCH("", {
    ttl: 1,
});

BigData.init([
    {
        name: "title",
        type: DataType.string,
    },
]);

export default {};
