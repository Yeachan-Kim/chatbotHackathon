/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */
const { format } = require("date-fns");
const path = require("path");

const peopleDb = [
  {
    이름: "김예찬",
    지역: "서구",
    성별: "남성",
    나이: 25,
    선호업종: "외식/음료",
    특이사항: "밝은 성격",
    알바연락처: "010-7229-1273",
  },
  {
    이름: "이유정",
    지역: "수성구",
    성별: "여성",
    나이: 23,
    선호업종: "교육/강사",
    특이사항: "친절",
    알바연락처: "010-5695-3712",
  },
  {
    이름: "박호강",
    지역: "북구",
    성별: "남성",
    나이: 25,
    선호업종: "유통/판매",
    특이사항: "지치지 않음",
    알바연락처: "010-5412-7241",
  },
];

const shopDb = [
  {
    지역: "서구",
    업종: "외식/음료",
    상호이름: "스시준",
    시급: "12000",
    업무: "서빙",
    사장연락처: "010-1234-5678",
    시작시간: "2024-12-09T06:00:00",
    종료시간: "2024-12-09T06:00:00",
  },
  {
    지역: "중구",
    업종: "유통/판매",
    상호이름: "왕돈",
    시급: "10000",
    업무: "주방",
    사장연락처: "010-1245-5821",
    시작시간: "2024-01-09T06:00:00",
    종료시간: "2024-01-09T06:00:00",
  },
  {
    지역: "수성구",
    업종: "운전/배달",
    상호이름: "왕가네 떡볶이",
    시급: "12000",
    업무: "배달",
    사장연락처: "010-9952-5521",
    시작시간: "2024-01-09T06:00:00",
    종료시간: "2024-01-09T06:00:00",
  },
];

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get("/", function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = { seo: seo };

  // If someone clicked the option for a random color it'll be passed in the querystring
  if (request.query.randomize) {
    // We need to load our color data file, pick one at random, and add it to the params
    const colors = require("./src/colors.json");
    const allColors = Object.keys(colors);
    let currentColor = allColors[(allColors.length * Math.random()) << 0];

    // Add the color properties to the params object
    params = {
      color: colors[currentColor],
      colorError: null,
      seo: seo,
    };
  }

  // The Handlebars code will be able to access the parameter values and build them into the page
  return reply.view("/src/pages/index.hbs", params);
});

/**
 * Our POST route to handle and react to form submissions
 *
 * Accepts body data indicating the user choice
 */
fastify.post("/", function (request, reply) {
  // Build the params object to pass to the template
  let params = { seo: seo };

  // If the user submitted a color through the form it'll be passed here in the request body
  let color = request.body.color;

  // If it's not empty, let's try to find the color
  if (color) {
    // ADD CODE FROM TODO HERE TO SAVE SUBMITTED FAVORITES

    // Load our color data file
    const colors = require("./src/colors.json");

    // Take our form submission, remove whitespace, and convert to lowercase
    color = color.toLowerCase().replace(/\s/g, "");

    // Now we see if that color is a key in our colors object
    if (colors[color]) {
      // Found one!
      params = {
        color: colors[color],
        colorError: null,
        seo: seo,
      };
    } else {
      // No luck! Return the user value as the error property
      params = {
        colorError: request.body.color,
        seo: seo,
      };
    }
  }

  // The Handlebars template will use the parameter values to update the page with the chosen color
  return reply.view("/src/pages/index.hbs", params);
});

// 수업용 코드 1 - 오픈빌더와 연결

// fastify.post("/data1", function (request, reply) {
//   console.log(request.body);

//   return {
//     version: "2.0",
//     template: {
//       outputs: [
//         {
//           simpleText: {
//             text: "서버 수정",
//           },
//         },
//       ],
//     },
//   };
// });

// 수업용 코드 2 - 오픈빌더와 연결

/*
{
  bot: { id: '659a9de29921b868bf96e0ed!', name: '수업202401' },
  intent: {
    id: '659a9deed7f9e0312a5f3ef7',
    name: '스킬연결',
    extra: { reason: [Object] }
  },
  action: {
    id: '659aa839aac2c05731652745',
    name: '스킬데이터확인',
    params: { question: '이름이 뭐에요?' },
    detailParams: { question: [Object] },
    clientExtra: {}
  },
  userRequest: {
    block: { id: '659a9deed7f9e0312a5f3ef7', name: '스킬연결' },
    user: {
      id: '2ce4a02fcf63d404f1729e3599d328ad8f83e3634ca15ee80f7fb14c44765c4343',
      type: 'botUserKey',
      properties: [Object]
    },
    utterance: '안녕하세요',
    params: { ignoreMe: 'true', surface: 'BuilderBotTest' },
    lang: 'ko',
    timezone: 'Asia/Seoul'
  },
  contexts: []
}
*/

fastify.post("/alba", function (request, reply) {
  //알바생 등록 코드
  let json = request.body;
  let params = json.action.params;
  //카카오챗으로 받은 파라미터를 변수에 담기
  const specialNote = json.action.params["특이사항"];
  const area = json.action.params["지역"];
  const preferenceJob = json.action.params["선호업종"];
  const sex = json.action.params["성별"];
  const name = json.action.params["이름"];
  const age = json.action.params["나이"];
  const phoneNumber = json.action.params["알바연락처"];

  const data = {
    //사용자에게 받은 데이터로 DB데이터 제작
    이름: name,
    지역: area,
    성별: sex,
    나이: age,
    선호업종: preferenceJob,
    특이사항: specialNote,
    알바연락처: phoneNumber,
  };
  peopleDb.push(data); //DB에 알바생 추가하기

  return {
    version: "2.0",
    template: {
      outputs: [
        {
          textCard: {
            description: "등록 완료되었습니다. \n연락을 기다려주세요!",
            buttons: [
              {
                action: "block",
                label: "처음으로 돌아가기",
                blockId: "659bb62cd8a38d4f4a88c891",
              },
            ],
          },
        },
      ],
    },
  };
});

fastify.post("/peopleList", function (request, reply) {
  //알바생 리스트 보여주기
  const carouselItems = []; //캐러셀 컨테이너

  peopleDb.forEach((person) => {
    //캐러셀에 담기 위해 알바생 DB에서 데이터를 구분하여 변수에 저장
    const personInfo = `${person["지역"]} / ${person["성별"]} / ${person["나이"]} / ${person["선호업종"]} \n${person["특이사항"]}`;
    const perPhone = person["알바연락처"];

    const categoryImageMap = {
      //성별에 따라 이미지 결정
      남성: "https://cdn.glitch.global/27c26e97-3250-4ff2-a8be-c6c64c07b9a7/%EB%82%A8%EC%9E%90.jpg?v=1704740437517",
      여성: "https://cdn.glitch.global/27c26e97-3250-4ff2-a8be-c6c64c07b9a7/%EC%97%AC%EC%9E%90.jpg?v=1704740436498",
    };
    const imageUrl =
      categoryImageMap[person["성별"]] ||
      "https://cdn.glitch.global/27c26e97-3250-4ff2-a8be-c6c64c07b9a7/%EB%82%A8%EC%9E%90.jpg?v=1704740437517";

    carouselItems.push({
      //캐러셀 컨테이너에 아이템 담기
      title: person["이름"],
      description: personInfo,
      thumbnail: {
        imageUrl: imageUrl,
      },
      buttons: [
        //알바생에게 전화하기 버튼
        {
          action: "phone",
          label: "구직자에게 전화하기",

          phoneNumber: perPhone,
        },
        {
          action: "block",
          label: "처음으로 돌아가기",
          blockId: "659bb62cd8a38d4f4a88c891",
        },
      ],
    });
  });

  return {
    version: "2.0",
    template: {
      outputs: [
        {
          carousel: {
            type: "basicCard",
            items: carouselItems,
          },
        },
      ],
    },
  };
});


fastify.post("/sajangnim", function (request, reply) {
  //사장님 등록 스킬 코드
  let json = request.body;
  //카카오챗으로 받은 파라미터를 변수에 담기
  const params = json.action.params;
  const workType = params["업종"];
  const shopName = params["상호이름"];
  const money = params["시급"];
  const work = params["업무"];
  const phoneNumber = params["사장연락처"];
  const beforeStartTime = params["시작시간"];
  const startTime = JSON.parse(beforeStartTime).value;
  const beforeEndTime = params["종료시간"];
  const endTime = JSON.parse(beforeEndTime).value;
  const place = params["지역"];

  const data = {
    //사용자에게 받은 데이터로 DB데이터 제작
    업종: workType,
    상호이름: shopName,
    시급: money,
    업무: work,
    사장연락처: phoneNumber,
    시작시간: startTime,
    종료시간: endTime,
    지역: place,
  };

  shopDb.push(data); //DB에 사장님 추가하기

  return {
    version: "2.0",
    template: {
      outputs: [
        {
          textCard: {
            description: "등록 완료되었습니다. \n연락을 기다려주세요!",
            buttons: [
              {
                action: "block",
                label: "처음으로 돌아가기",
                blockId: "659bb62cd8a38d4f4a88c891",
              },
            ],
          },
        },
      ],
    },
  };
});

fastify.post("/shopList", function (request, reply) {
  //사업장 리스트 보여주기
  const carouselItems = []; //캐러셀 컨테이너

  shopDb.forEach((shop) => {
    //캐러셀에 담기 위해 사장님 DB에서 데이터를 구분하여 변수에 저장
    const shopInfo = `${shop["지역"]}/${shop["업종"]}/${shop["시급"]}/${
      shop["업무"]
    }\n${format(new Date(shop["시작시간"]), "M월 d일 HH:mm")} ~ ${format(
      new Date(shop["종료시간"]),
      "M월 d일 HH:mm"
    )}`;

    const categoryImageMap = {
      //업종에 따라 이미지 결정
      "외식/음료":
        "https://cdn.glitch.global/27c26e97-3250-4ff2-a8be-c6c64c07b9a7/%EC%99%B8%EC%8B%9D%EC%9D%8C%EB%A3%8C.png?v=1704736060048",
      "유통/판매":
        "https://cdn.glitch.global/27c26e97-3250-4ff2-a8be-c6c64c07b9a7/%EC%9C%A0%ED%86%B5%ED%8C%90%EB%A7%A4%EC%A7%84.png?v=1704737794405",
      "문화/생활 서비스":
        "https://cdn.glitch.global/27c26e97-3250-4ff2-a8be-c6c64c07b9a7/%EB%AC%B8%ED%99%94%EC%83%9D%ED%99%9C.png?v=1704736176091",
      "사무/회계":
        "https://cdn.glitch.global/27c26e97-3250-4ff2-a8be-c6c64c07b9a7/%EC%82%AC%EB%AC%B4%ED%9A%8C%EA%B3%84.png?v=1704736179112",
      "생산/건설":
        "https://cdn.glitch.global/27c26e97-3250-4ff2-a8be-c6c64c07b9a7/%EC%83%9D%EC%82%B0%EA%B1%B4%EC%84%A4.png?v=1704736183262",
      "IT/인터넷":
        "https://cdn.glitch.global/27c26e97-3250-4ff2-a8be-c6c64c07b9a7/it%EC%9D%B8%ED%84%B0%EB%84%B7.png?v=1704736188304",
      "교육/강사":
        "https://cdn.glitch.global/27c26e97-3250-4ff2-a8be-c6c64c07b9a7/%EA%B5%90%EC%9C%A1%EA%B0%95%EC%82%AC.png?v=1704736191222",
      "디자인/미디어":
        "https://cdn.glitch.global/27c26e97-3250-4ff2-a8be-c6c64c07b9a7/%EB%94%94%EC%9E%90%EC%9D%B8%EB%AF%B8%EB%94%94%EC%96%B4.png?v=1704736726117",
      "운전/배달":
        "https://cdn.glitch.global/27c26e97-3250-4ff2-a8be-c6c64c07b9a7/%EC%9A%B4%EC%A0%84%EB%B0%B0%EB%8B%AC.png?v=1704736723531",
      기타: "https://cdn.glitch.global/27c26e97-3250-4ff2-a8be-c6c64c07b9a7/%EA%B8%B0%ED%83%80.png?v=1704736849120",
    };

    const imageUrl =
      categoryImageMap[shop["업종"]] ||
      "https://cdn.glitch.global/27c26e97-3250-4ff2-a8be-c6c64c07b9a7/%EA%B8%B0%ED%83%80.png?v=1704736849120";
    const bossPhone = shop["사장연락처"];

    carouselItems.push({
      //캐러셀 컨테이너에 아이템 담기
      title: shop["상호이름"], // replace '사람이름' with the actual property you want to use
      description: shopInfo,
      thumbnail: {
        imageUrl: imageUrl,
      },
      buttons: [
        //사장님에게 전화하기 버튼
        {
          action: "phone",
          label: "사장님에게 전화하기",
          phoneNumber: bossPhone,
        },
        {
          action: "block",
          label: "처음으로 돌아가기",
          blockId: "659bb62cd8a38d4f4a88c891",
        },
      ],
    });
  });
  return {
    version: "2.0",
    template: {
      outputs: [
        {
          carousel: {
            type: "basicCard",
            items: carouselItems,
          },
        },
      ],
    },
  };
});

// ------------------------

// 수업용 코드 3 - ChatGPT 연결

const { getChatGPT } = require("./gpt.js");

fastify.post("/recommend", async function (request, reply) {
  let json = request.body;
  console.log(json);
  let blockName = json.userRequest.block.name;
  let utterance = json.userRequest.utterance;
  let uid = json.userRequest.user.id;
  let question = json.action.params["소개글"];
  if(!question){
    question = "난 친절해";
  }
  const test = "난 해본게 없어";
  console.log("gpt에게 질문 걸었습니다.");
  console.log(question);

  const preSentence =
    "사용자의 성격에 맞는 업종을 추천해줘. 단, 대답은 반드시 제시하는 업종 9종 중에 하나로 결정해야해. 그리고 왜 그 업종을 추천하는지에 대한 이유를 50자 내로 설명해줘. 대답은 업좀:업종명 \n 이유:이유 형식으로 해줘 업종은 다음 9가지야. 1. 외식/음료2. 유통/판매3. 문화/생활 서비스4. 사무/회계5. 생산/건설6. IT/인터넷7. 교육/강사8. 디자인/미디어9. 운전/배달 다음 내용은 사용자의 성격 정보야.";
  const { answer } = await getChatGPT(preSentence, question);
  console.log("answer입니다.");
  console.log(answer);
  return {
    version: "2.0",
    template: {
      outputs: [
        {
          textCard: {
            description: answer,
            buttons: [
              {
                action: "block",
                label: "계속하기",
                blockId: "659bdd0d1b314943cd78ffed",
              },
            ],
          },
        },
      ],
    },
  };
});

// fastify.post("/data2", function (request, reply) {
//   console.log(request.body);

//   let json = request.body;
//   // 오픈빌더에서 전송하는 json 데이터에서 블럭이름, 사용자발화, 파라미터값에서 값, 사용자 아이디를 다시 전송해 봅시다.
//   let blockName = json.userRequest.block.name;
//   let utterance = json.userRequest.utterance;
//   let uid = json.userRequest.user.id;
//   let question = json.action.params.question;

//   return {
//     version: "2.0",
//     template: {
//       outputs: [
//         {
//           simpleText: {
//             text: `블럭이름 : ${blockName}
// 발화 : ${utterance}
// 사용자 아이디 : ${uid}
// 질문 : ${question}
// `,
//           },
//         },
//       ],
//     },
//   };
// });

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
