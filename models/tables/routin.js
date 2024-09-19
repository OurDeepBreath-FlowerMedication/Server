const Sequelize = require('sequelize');

module.exports = class Routin extends Sequelize.Model {
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
            routin_id : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                comment : ""
            },
            routin_day : {
                type : Sequelize.STRING(30),
                allowNull : false,
                comment : "일정 수행 요일"
            },
            time_start : {
                type : Sequelize.TIME,
                allowNull : false,
                comment : "일정 알림 시작 시간"
            },
            time_end : {
                type : Sequelize.TIME,
                allowNull : false,
                comment : "일정 알림 종료 시간"
            },
            routin_name : {
                type : Sequelize.STRING(100),
                allowNull : false,
                comment : "일정 명칭"
            }
        },
        {
            sequelize,
            underscored : true,
            modelName : 'Routin',
            tableName : 'routins',
            charset : 'utf8',
            collate : 'utf8_general_ci',
            paranoid : false,
            timestamps : false
        });
    }
};