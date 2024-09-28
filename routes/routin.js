
const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

const Routin = require('../models/tables/routin');

router.get('/meal', async(req, res)=>{
    let device_id = req.query.deviceID;
    let result = [true, true, true];
    try{
        const [meals, ] = await sequelize.query(`SELECT routin_id FROM routins WHERE device_id = '${device_id}' AND routin_id IN (0, 1, 2) GROUP BY routin_id`);
        
        meals.forEach(meal => {
            result[meal['routin_id']] = false;
        });

        res.json({meal_time : result});
    }catch(e){
        res.status(500);
    }
});


router.post('/create', async (req, res)=>{
    let device_id = req.query.deviceID;
    let routin_num = req.body.routin_num;
    let routin_name = req.body.routin_name;
    let select_days = req.body.select_days;
    let start_hour = req.body.start_hour;
    let start_minute = req.body.start_minute ? 30 : 0;
    let end_hour = req.body.end_hour;
    let end_minute = req.body.end_minute ? 30 : 0;
    
    try{
        Routin.create({
            device_id : device_id, 
            routin_id : routin_num, 
            routin_day : select_days.join(","), 
            time_start : `${start_hour}:${start_minute}:00`,
            time_end : `${end_hour}:${end_minute}:00`,
            routin_name : routin_name
        })
        res.json({success: true});
    }catch(e){
        res.json({success: false});
        console.log(e);
    }
});

router.get('/get', async(req, res)=>{
    let device_id = req.query.deviceID;
    try{
        const [routins, ] = await sequelize.query(`SELECT * FROM routins WHERE device_id = '${device_id}'`);
        
        if(routins!=undefined && routins.length > 0){
            const routinList = routins.map(routin => {
                
                let start_time = routin["time_start"].split(":");
                let start_hour = Number(start_time[0])
                let start_min = (start_time[1]=="00")

                let end_time = routin["time_end"].split(":");
                let end_hour = Number(end_time[0])
                let end_min = (end_time[1]=="00")
                
                return {
                    day : routin["routin_day"],
                    schedule_name: routin["routin_name"],
                    start_hour: start_hour,
                    start_minute: start_min,
                    end_hour: end_hour,
                    end_minute : end_min,
                    id : routin["id"]
                };
            });
            res.json(routinList);
        }else{
            res.status(550);
        }
    }catch(e){
        res.status(500);
    }
});

router.post('/delete', async(req, res)=>{
    let device_id = req.body.deviceID;
    let routin_id = req.body.id;
    
    try{
        await sequelize.query(`DELETE FROM routins WHERE device_id = '${device_id}' AND id = '${routin_id}'`);
    }catch(e){
        res.status(500);
    } 
});


module.exports = router;  