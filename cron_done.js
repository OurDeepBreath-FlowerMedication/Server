// 매 시간마다 done 데이터 생성
const cron = require('node-cron');
const { sequelize } = require('./models');

const RoutinDone = require('./models/tables/routinDone');

const doneCreate = () =>{
    cron.schedule('0 0 6 * * *', async() => {
        const dayIndex = (new Date().getDay()+6)%7;
        try{
            const [divs, ] = await sequelize.query(`SELECT device_id FROM devices`);
            divs.forEach(async(div)=> {
                const [routins, ] = await sequelize.query(`SELECT id, routin_day, time_start FROM routins WHERE device_id = '${div['device_id']}'`);
                routins.forEach(async(routin)=>{
                    var days = routin['routin_day'].split(",");
                    if(days[dayIndex]=="1"){
                        await RoutinDone.create({
                            device_id : div['device_id'],
                            routin_id :routin['id'],
                            is_done : false,
                            is_medication : false,
                            start_at : routin['time_start']
                        })
                    }
                })

                const [medications, ] = await sequelize.query(
                    `SELECT m.id, m.medication_day, r.time_start
                    FROM medications as m
                    JOIN routins as r on m.device_id = r.device_id AND m.medication_meal = r.routin_id 
                    WHERE m.device_id = '${div['device_id']}'`);
                medications.forEach(async(medication)=>{
                    console.log(medication)
                    var days = medication['medication_day'].split(",");
                    if(days[dayIndex]=="1"){
                        await RoutinDone.create({
                            device_id : div['device_id'],
                            routin_id : medication['id'],
                            is_done : false,
                            is_medication : true,
                            start_at : medication['time_start']
                        })
                    }
                })
            });
        }catch(err){
            console.log(err);
        }
    })
}

module.exports = { doneCreate };