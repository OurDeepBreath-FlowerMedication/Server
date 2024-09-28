// 매 시간마다 done 데이터 생성
const cron = require('node-cron');
const { sequelize } = require('./models');

const RoutinDone = require('./models/tables/routinDone');

const doneCreate = () =>{
    cron.schedule('0 * * * * *', async() => {
        const dayIndex = (new Date().getDay()+6)%7;
        try{
            const [divs, ] = await sequelize.query(`SELECT device_id FROM devices`);
            divs.forEach(async(div)=> {
                const [routins, ] = await sequelize.query(`SELECT * FROM routins WHERE device_id = '${div['device_id']}'`);
                routins.forEach(async(routin)=>{
                    var days = routin['routin_day'].split(",");
                    if(days[dayIndex]=="1"){
                        await RoutinDone.create({
                            device_id : div['device_id'],
                            routin_id :routin['routin_id'],
                            is_done : false,
                            is_medication : -1,
                            name : routin['routin_name'],
                            start_at : routin['time_start'],
                            end_at : routin['time_end']
                        })
                    }
                })

                const [medications, ] = await sequelize.query(
                    `SELECT m.id, m.medication_day, r.time_start, r.time_end, m.medication_name, m.medication_meal, m.medication_meal
                    FROM medications as m
                    JOIN routins as r on m.device_id = r.device_id AND m.medication_meal = r.routin_id 
                    WHERE m.device_id = '${div['device_id']}'`);
                medications.forEach(async(medication)=>{
                    console.log(medication)
                    var days = medication['medication_day'].split(",");
                    if(days[dayIndex]=="1"){
                        
                        // 식전 약 섭취 타임 setting만 유효함
                        const [start_hour, start_minute, start_second] = medication['time_start'].split(':')
                        let start_time = new Date();
                        start_time.setHours(parseInt(start_hour), parseInt(start_minute), parseInt(start_second));
                        
                        const [end_hour, end_minute, end_second] = medication['time_end'].split(':')
                        let end_time = new Date();
                        end_time.setHours(parseInt(end_hour), parseInt(end_minute), parseInt(end_second));
                        
                        //식전 30분
                        if(medication['medication_meal']==0){
                            end_time = start_time;
                            start_time.setMinutes(start_time.getMinutes() - 30);
                        }
                        
                        
                        // default로 등록한 식사 끝 30분 이후 안까지 약 섭취 
                        
                        await RoutinDone.create({
                            device_id : div['device_id'],
                            routin_id : medication['medication_meal'], //medication['id'],
                            is_done : false,
                            is_medication : medication['medication_meal'],
                            name : medication['medication_name'],
                            start_at : start_time.toTimeString().split(' ')[0],
                            end_at : end_time.toTimeString().split(' ')[0]
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