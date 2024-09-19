const Sequelize = require('sequelize');

module.exports = class Medication extends Sequelize.Model {
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
            medication_day : {
                type : Sequelize.STRING(30),
                allowNull : false,
                comment : "약 섭취 요일"
            },
            medication_interval : {
                type : Sequelize.INTEGER,
                allowNull : false,
                comment : "약 섭취 알림 시간"
            },
            medication_meal : {
                type : Sequelize.INTEGER,
                allowNull : false,
                comment : "약 섭취 식사"
            },
            medication_name : {
                type : Sequelize.STRING(100),
                allowNull : false,
                comment : "일정 명칭"
            },
            medication_use :{
                type : Sequelize.BOOLEAN,
                allowNull : false,
                comment : "복약기 사용 여부"
            }
        },
        {
            sequelize,
            underscored : true,
            modelName : 'Medication',
            tableName : 'medications',
            charset : 'utf8',
            collate : 'utf8_general_ci',
            paranoid : false,
            timestamps : false
        });
    }
};