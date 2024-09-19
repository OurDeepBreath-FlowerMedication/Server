const Sequelize = require('sequelize');

module.exports = class Device extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            device_id : {
                type : Sequelize.STRING(20),
                allowNull : false,
                unique : true,
                primaryKey : true,
                comment : "디바이스 아이디"
            }
        },
        {
            sequelize,
            underscored : true,
            modelName : 'Device',
            tableName : 'devices',
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci',
            timestamps : false
        });
    }
};