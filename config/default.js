/**
 * 默认配置
 */

module.exports = {
    //开发环境数据库
    db: {
        host: "l-fe2.dev.bj6.daling.com",
        port: "3306",
        database: "fe_task",
        user: "fe_task",
        password: "8DS2RSAWr4HSSXSE",
        connectionLimit: 2,
    },
    //开发环境，普通redis配置
    redis: "redis://l-fe2.dev.bj6.daling.com:6379",
    ldap: {
        server: "ldap://ldap.srv.daling.com",
        baseDn: "cn=admin,dc=daling,dc=com",
        bindPassword: "daling.com",
        searchDn: "dc=daling,dc=com",
        usernameKey: "uid",
    },
    //mongodb配置
    mg: {
        name: "fe_topic",
        reset: "",
        url: "mongodb://l-fe2.dev.bj6.daling.com:27017",
    },
};
