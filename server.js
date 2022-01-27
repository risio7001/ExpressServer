const express = require("express"); // express 선언
const app = express();  //  express 객체 담기

const router = require("./route/route");    //  router 가져오기

app.use(express.json());    // req.body로 데이터 받아오기
app.use(express.urlencoded({extended:false}));  // req.body로 데이터 받아오기

app.use(router);    // 라우터로 분기 시키기

app.listen(5001,()=>{   // 포트열고 대기
    console.log("serverOn : 5000");
})