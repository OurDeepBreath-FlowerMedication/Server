
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

module.exports = router;  