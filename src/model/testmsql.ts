import { Model, DataTypes } from "sequelize";
import db from "../db/mysql";

class Files extends Model {}
Files.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            defaultValue: "",
            comment: "文件名称",
        },
    },
    {
        sequelize: db,
        freezeTableName: true,
        tableName: "t_files",
    }
);

//强制初始化数据库
// Files.sync({ force: true });

module.exports = {
    insert: function (model: any) {
        return Files.create(model);
    },
    get: function (id: number) {
        return Files.findOne({
            where: {
                id,
            },
        });
    },
};
