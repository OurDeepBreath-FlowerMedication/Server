
const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

const Routin = require('../models/tables/routin');
const RoutinDone = require('../models/tables/routinDone');

router.get('/get', async(req, res)=>{
    let device_id = req.query.deviceID;
    try{
        const [dones, ] = await sequelize.query(`SELECT routin_id, is_done, is_medication, TIME(updated_at) 
        FROM routindones WHERE device_id = '${device_id}' AND DATE(created_at) = CURDATE()
        ORDER BY start_at ASC;`);
        if(dones!=undefined && dones.length > 0){
            const todayDonePromises = dones.map(async(done)=>{
                if(done["is_medication"]==1){
                    const [medication, ] = await sequelize.query(`SELECT medication_name FROM medications WHERE device_id = '${device_id}' AND id = ${done["routin_id"]};`);
                    if(medication!=undefined){
                        return{
                            schedule_name : medication[0]["medication_name"],
                            doneTime : done["TIME(updated_at)"],
                            isDone : done["is_done"]==1
                        }
                    }
                }else{
                    const [routin, ] = await sequelize.query(`SELECT routin_name FROM routins WHERE device_id = '${device_id}' AND id = ${done["routin_id"]};`);
                    if(routin!=undefined){
                        return{
                            schedule_name : routin[0]["routin_name"],
                            doneTime : done["TIME(updated_at)"],
                            isDone : done["is_done"]==1
                        }
                    }
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