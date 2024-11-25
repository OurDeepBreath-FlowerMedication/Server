const Sequelize = require('sequelize');

module.exports = class DelList extends Sequelize.Model {
    static init(sequelize) {
        return super.init({    
            device_id : {
                type : Sequelize.STRING(20),
                allowNull : false,
                references: {
                    model: 'devices', 
                    key: 'device_id', 
                },
                onDelete: 'CASCADE',
                comment : "디바이스 아이디"
            }, 
            is_medication : {
                type : Sequelize.BOOLEAN,
                comment : "어떤 일정에 대한 삭제인지 결정"
            },
            del_id : {
                type : Sequelize.INTEGER,
                allowNull : false,
                comment : "약 섭취 알림 시간"
            }
        },
        {
            sequelize,
            underscored : true,
            modelName : 'DelList',
            tableName : 'dellists',
            charset : 'utf8',
            collate : 'utf8_general_ci',
            paranoid : false,
            timestamps : false
        });
    }
};