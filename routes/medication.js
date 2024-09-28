
const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

const Medication = require('../models/tables/medication');

router.post('/create', async (req, res)=>{
    let device_id = req.query.deviceID;
    let select_days = req.body.day;
    let medication_name = req.body.medication_name;
    let meal_time = req.body.meal_time;
    let interval = req.body.interval;
    let use_device = req.body.use_device;
    
    try{
        Medication.create({
            device_id : device_id, 
            medication_day : select_days.join(","), 
            medication_interval : interval, 
            medication_meal : meal_time,
            medication_name : medication_name,
            medication_use : use_device
        })
        res.send("Successfully Save");
    }catch(e){
        console.log(e);
    }
});

router.get('/get', async(req, res)=>{
    let device_id = req.query.deviceID;
    try{
        const [medications, ] = await sequelize.query(`SELECT * FROM medications WHERE device_id = '${device_id}'`);
        
        if(medications!=undefined && medications.length > 0){
            const medicationList = medications.map(medication => {
                return {
                    day : medication["medication_day"],
                    medication_name: medication["medication_name"],
                    meal_time: medication["medication_meal"],
                    interval: medication["medication_interval"],
                    use_device: (medication["medication_use"]==1),
                    id : medication["id"]
                };
            });
            res.json(medicationList);
        }else{
            res.status(550);
        }
    }catch(e){
        res.status(500);
    }
});

router.get('/check', async(req, res)=>{
    let device_id = req.query.deviceID;
    let meal_time = req.query.mealTime;
    let mealDay = [false, false, false, false, false, false, false]
    try{
        const [medications, ] = await sequelize.query(`SELECT medication_day FROM medications WHERE device_id = '${device_id}' AND medication_meal = ${meal_time}`);
        
        if(medications!=undefined && medications.length > 0){
            let dayList = medications[0]['medication_day'].split(",")
            dayList.forEach((isEat, day) => {
                if(isEat=='1'){
                    mealDay[day] = true;
                }
            });
            res.json(mealDay);
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
        await sequelize.query(`DELETE FROM medications WHERE device_id = '${device_id}' AND id = '${routin_id}'`);
    }catch(e){
        res.status(500);
    } 
});

module.exports = router;  