const env = require("../utils/env");    //  민감한 정보는 .env에 담고 process.env.['key']로 불러와서 사용하기 위해 js파일 만들어서 미리 import 및 config()
const { default: axios } = require("axios");
const express = require("express");
const route = express.Router(); // 라우터 불러오기

// req,res 순서 바뀌면 body 안들어옴 확인 꼭하기.
route.post("/test", async (req,res)=>{    // /test 라는 이름으로 connect
    let access_token;
    const {body} = req;
    const {reason, imp_uid, cancel_request_amount } = body;

  await axios({                           // 아임포트 토큰 access
    url: "https://api.iamport.kr/users/getToken",
    method: "post", // POST method
    headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
    data: {
      imp_key: process.env.imp_key, // REST API키
      imp_secret: process.env.imp_secret // REST API Secret
    }
  }).then(res=>{access_token = res.data.response.access_token}).catch(err=>console.log(err));
  // 신용카드 취소
  try{
    const getCancelData = await axios({
        url: "https://api.iamport.kr/payments/cancel",
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": access_token // 아임포트 서버로부터 발급받은 엑세스 토큰
        },
        data: {
          reason, // 가맹점 클라이언트로부터 받은 환불사유
          imp_uid, // imp_uid를 환불 `unique key`로 입력
          amount: cancel_request_amount, // 가맹점 클라이언트로부터 받은 환불금액
        //   checksum: cancelableAmount // [권장] 환불 가능 금액 입력
        }
      });
      const { data } = getCancelData; // 환불 결과
      res.send(data);
  }catch(err){
      console.log(err)
  }
  
})

module.exports = route; // 내보내기