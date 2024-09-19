const Sequelize = require('sequelize');

module.exports = class RoutinDone extends Sequelize.Model {
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
            is_done : {
                type : Sequelize.BOOLEAN,
                allowNull : false,
                comment : "일정 수행 날짜/시간"
            },
            is_medication : {
                type : Sequelize.BOOLEAN,
                allowNull : false,
                comment : "어떤 일정인지"
            },
            start_at : {
                type : Sequelize.TIME,
                allowNull : false,
                comment : "일정을 순서대로 나열하기 위해"
            }
        },
        {
            sequelize,
            underscored : true,
            modelName : 'RoutinDone',
            tableName : 'routindones',
            charset : 'utf8',
            collate : 'utf8_general_ci',
            autoIncrement: false,
            paranoid : false,
            timestamps : true
        });
    }
};