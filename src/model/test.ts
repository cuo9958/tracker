const Sequelize = require("sequelize");
const db = require("../db/mysql");

const Files = db.define(
    "t_files",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING(100),
            defaultValue: "",
            comment: "文件名称",
        },
    },
    {
        freezeTableName: true,
    }
);

//强制初始化数据库
// Files.sync({ force: true });

module.exports = {
    insert: function (model) {
        return Files.create(model);
    },
    get: function (id) {
        return Files.findOne({
            where: {
                id,
            },
        });
    },
};
