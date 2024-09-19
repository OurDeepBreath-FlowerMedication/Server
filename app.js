const express = require('express');
const {sequelize} = require('./models');
const app = express();
const moment = require('moment-timezone');

moment.tz.setDefault('Asia/Seoul');

// 라우터 연결
const routin = require('./routes/routin');
const medication = require('./routes/medication');
const done = require('./routes/done');

// 매 6시 정각에 done 만들어지도록
const {doneCreate} = require('./cron_done.js');
doneCreate();

app.set('port', process.env.PORT || 3000);

sequelize.sync({alter: true})
    .then(()=>{
        console.log('데이테베이스 연결 성공');
    })
    .catch((err)=>{
        console.error(err);
    })

//json 파일을 해석하기 위해 호출
app.use(express.json());
app.use(express.urlencoded({extended :false}));

app.use('/routin', routin);
app.use('/medication', medication);
app.use('/done', done);

app.use((req, res, next)=>{
    res.status(404).send('404 Not Found');
});

app.use((err, req, res, next)=>{
    res.send(`${req.status}`);
});

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중');
});