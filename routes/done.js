
const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

const Routin = require('../models/tables/routin');
const RoutinDone = require('../models/tables/routinDone');

router.get('/get', async(req, res)=>{
    let device_id = req.query.deviceID;
    try{
        const [dones, ] = await sequelize.query(`SELECT routin_id, is_done, name, TIME(updated_at) 
        FROM routindones WHERE device_id = '${device_id}' AND DATE(created_at) = CURDATE()
        ORDER BY start_at ASC;`);
        if(dones!=undefined && dones.length > 0){
            const todayDonePromises = dones.map(async(done)=>{
                return{
                    schedule_name : done["name"],
                    doneTime : done["TIME(updated_at)"],
                    isDone : done["is_done"]==1
                }
            });
            const todayDone = await Promise.all(todayDonePromises)
            res.json(todayDone);
        }else{
            res.status(550);
            res.json(null);
        }
    }catch(e){
        res.status(500);
    }
});

// 라즈베리 파이에서 일정 관리하기 위해 호출
router.get('/getrsp', async(req, res)=>{
    let device_id = req.query.deviceID;
    try{
        const [dones, ] = await sequelize.query(`SELECT * FROM routindones 
        WHERE device_id = '${device_id}' AND DATE(created_at) = CURDATE()
        ORDER BY start_at ASC;`);
        if(dones!=undefined && dones.length > 0){
            const todayDonePromises = dones.map(async(done)=>{
                return{
                    id : done["id"],
                    schedule_name : done["name"],
                    routin_id : done["routin_id"],
                    is_medication : done["is_medication"],
                    start_at : done["start_at"],
                    end_at : done["end_at"]
                }
            });
            const todayDone = await Promise.all(todayDonePromises)
            res.json(todayDone);
        }else{
            res.status(550);
            res.json(null);
        }
    }catch(e){
        res.status(500);
    }
});

// 라즈베리 파이 수행 후 업데잍트
router.get('/update', async(req, res)=>{
    let device_id = req.query.deviceID;
    let done_id = req.query.doneID;
    try{
        const [ , ] = await sequelize.query(`UPDATE routindones SET is_done = true WHERE device_id = '${device_id}' AND id = ${done_id}`);
        res.json({success: true});
    }catch(e){
        res.status(500);
    }
});

module.exports = router;  