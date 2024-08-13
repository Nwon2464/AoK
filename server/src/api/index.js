require('dotenv').config();
const express = require('express');
const emojis = require('./emojis');
const axios = require("axios");
const replaceThumbnailSize = require("./../utils");
const router = express.Router();
const _ = require("lodash");
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

//
const data3 = require("./dataStreams3");
const data2 = require('./dataStreams2');
const data1 = require("./dataStreams");
//



//getting token 
const getToken = async () => {
  try {
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`
    );
    const token = response.data.access_token;
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-id": client_id,
      },
    };
      return token;
  } catch (error) {
      // console.error('Error getting token', error);
      return null;
  }
};

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});


router.get("/categories/all", async (req, res) => {
  try {
    const token = await getToken();
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-id": client_id,
      },
    };

    if(token){
      const { data } = await axios.get(
        `https://api.twitch.tv/helix/games/top?first=50`,
        options
      );
      // console.log(data);

      for(const e of data.data){
          e["box_art_url"] = e.box_art_url
            .replace("{width}", "285")
            .replace("{height}", "385");
      }
      res.send(data.data);
    }else{
      console.log("token invalid");
    }
  } catch (error) {
    console.log("error");
  }
});
router.get("/videos/:user_id", async (req,res) => {
  try {
    const token = await getToken();
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-id": client_id,
      },
    };

    if(token){
      const { data } = await axios.get(
        `https://api.twitch.tv/helix/videos?user_id=${req.params.user_id}&first=12${req.query.cursor?`&after=${req.query.cursor}`:""}`,
        options
      );
      console.log(data);
      res.send(data);
    }else{
      console.log("token invalid");
    }
  } catch (error) {
    console.log("error??");
  }
})
router.get("/twitch/channels" , async(req,res) =>{
  try {
    // https://api.twitch.tv/helix/search/channels
    const token = await getToken();
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-id": client_id,
      },
    };
    if(token){
      const getStreamsRequest = await axios.get(
        `https://api.twitch.tv/helix/streams?first=8&type=live`,
        options
      );


      for(const e of getStreamsRequest.data.data){
        const res = await axios.get(
          `https://api.twitch.tv/helix/users?id=${e.user_id}`,
          options
        );
        e["profile_image_url"] =  res.data.data[0].profile_image_url;
      }
      res.json(
        getStreamsRequest.data,
      );

    }else{
      console.log("token invalid");
    }
  } catch (error) {
    console.log("err");
  }
});

//fetching specific game
router.get("/twitch/streams/:id", async (req, res) => {
  try {
    const token = await getToken();
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-id": client_id,
      },
    };
    
    if (token) {
      // let pagination_value= "&after=";
      // 'https://api.twitch.tv/helix/streams?first=40&after=eyJiI...' \ 
      const getStreamsRequest = await axios.get(
        `https://api.twitch.tv/helix/streams?game_id=${req.params.id}&first=12${req.query.cursor?`&after=${req.query.cursor}`:""}`,
        options
      );
      // console.log(getStreamsRequest.data.pagination.cursor,"=====", pagination_value);

      for(const e of getStreamsRequest.data.data){
        const res = await axios.get(
          `https://api.twitch.tv/helix/users?id=${e.user_id}`,
          options
        );
        e["profile_url"] =  res.data.data[0].profile_image_url;
      }

      res.json(
        getStreamsRequest.data,
      );
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/twitch", async (req, res) => {
  let merge= [];
  for(const d in data1.frontPage){
    for(const w of data1.frontPage[d]){
      merge.push(w);
    }
  }
  //shuffle randomly
  for (let i = merge.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [merge[i], merge[j]] = [merge[j], merge[i]];
  }
  res.send(merge);
});

router.get("/twitch/streams", async (req, res, next) => {
  let merge= {};

  for(const d in data2.frontPage){
    let arr=[];
    for(const w of data2.frontPage[d]){
      arr.push(w);
    }

    // shuffle randomly
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    merge[d]= arr;
  }
  
  for(const d in data1.frontPage){
    let arr=[];
    for(const w of data1.frontPage[d]){
      arr.push(w);
    }

    // shuffle randomly
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    merge[d]= arr;
  }
  res.send(merge);
});

//fetch 4 categories sterams 
const fetchStreams = async (token, category) => {
  try {
      const response = await axios.get('https://api.twitch.tv/helix/streams?first=5', {
          headers: {
            "client-id": client_id,
            'Authorization': `Bearer ${token}`
          },
          params: {
              game_id: category,
          }
      });
      return response.data.data;
  } catch (error) {
      console.error('Error fetching streams', error);
      return [];
  }
};
//fetch 8 Top games
const getTopGames = async (token, category) => {
  try {
      const response = await axios.get('https://api.twitch.tv/helix/games/top?first=8', {
          headers: {
            "client-id": client_id,
            'Authorization': `Bearer ${token}`
          },
      });
      return response.data.data;
  } catch (error) {
      console.error('Error fetching streams', error);
      return [];
  }
};

const fetchTopStreams = async (token, category)=>{
  try{
    const response = await axios.get('https://api.twitch.tv/helix/streams?first=2', {
      headers: {
        "client-id": client_id,
        'Authorization': `Bearer ${token}`
      },
      params: {
        game_id: category,
      }
    });
    // console.log(response.data.data);
    return response.data.data;
  }catch(error){
    console.log("Error fetch top streams",error);
    return [];
  }
}

const fetchTopStreamersInfo = async (token, id)=>{
  try{
    const response = await axios.get(`https://api.twitch.tv/helix/users?id=${id}`, {
      headers: {
        "client-id": client_id,
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data.data;
  }catch(error){
    console.log("Error fetch top streams",error);
    return [];
  }
}

router.get('/tstreams', async (req, res) => {
  const token = await getToken();

  if (!token) {
      return res.status(500).json({ error: 'Failed to get token' });
  }

  const categories = {
      'Just Chatting': '509658',
      'Fortnite': '33214',
      'Fall Guys': '512980',
      'Minecraft': '27471'
  };

  const topGames = await getTopGames(token);
  const data = {
    topGames: {},
    categories: {}
  };


  for (const game of topGames) {
    data.topGames[game.name] = await fetchTopStreams(token,game.id);
    
    for(const user of data.topGames[game.name]){
      user.thumbnail_url=replaceThumbnailSize(user.thumbnail_url,440,248);
      const userInfo=await fetchTopStreamersInfo(token,user.user_id);
      if (userInfo && userInfo.length > 0) {
        const url = userInfo[0].profile_image_url;
        const replacedData = replaceThumbnailSize(url,300,300);
        _.merge(user, {
          profile_image_url: replacedData,
          description: userInfo[0].description
        });
      }
    }
  }


  for (const [category, id] of Object.entries(categories)) {
      data.categories[category] = await fetchStreams(token, id);
  }
  res.json(data);
}); 





//try experimenting fetching archives for specfic users with users id  
router.get("/et",async(req,res)=>{

  const response = await axios.post(
    `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`
  );
  const token = response.data.access_token;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      "client-id": client_id,
    },
  };
  const getStreamsRequest = await axios.get(
    "https://api.twitch.tv/helix/videos?id=2127617160",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-id": client_id,
      },
    }
  ).then(e=>{
      const newStreamsData = e.data.data;
    console.log(newStreamsData);
    });

})




router.get("/twitch/streams/contents", async (req, res) => {
  res.send("not being used currently");
});


// router.get("/twitch/categories/all", async (req, res) => {
//   try {
//     const response = await axios.post(
//       `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`
//     );
//     const token = response.data.access_token;
//     const options = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "client-id": client_id,
//       },
//     };

//     if (token) {
//       const getStreamsRequest = await axios.get(
//         `https://api.twitch.tv/helix/games/top?first=100`,
//         options
//       );
//       let topGames = getStreamsRequest.data.data.slice();
//       ///////////////////////////
//       //topgames

//       let imageChanged = topGames.map((e) => {
//         // console.log(e);
//         return axios.get(
//           `https://api.twitch.tv/helix/streams?game_id=${e.id}&first=100`,
//           options
//         );
//       });
//       let empty_topGames = [];
//       //
//       let topGames_fetched = await axios.all(imageChanged);
//       topGames_fetched.map((e) => {
//         console.log(e.data.data);
//         empty_topGames.push({
//           gameViewers: e.data.data
//             .map((e) => e.viewer_count)
//             .reduce((acc, cur) => acc + cur, 0),
//         });
//       });
//       _.merge(topGames, empty_topGames);
//       res.json({ topGames });
//     }
//   } catch (e) {
//     console.log(e);
//   }
// });


router.get("/twitch/topgames", async (req, res) => {
  try {
    const token = await getToken();
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`
    );
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-id": client_id,
      },
    };

    if (token) {
      const getStreamsRequest = await axios.get(
        `https://api.twitch.tv/helix/games/top`,
        options
      );
      res.send(getStreamsRequest.data.data);
    }
  }catch{
    console.log("twitch topgames fetching error");
  }
});



// minecraft endpoints 
//https://api.twitch.tv/helix/channels?broadcaster_id= 
// tag replace with above link or else


router.get("/twitch/minecraft", async (req, res) => {
  let data=[
    {
      "id": "40612037557",
      "user_id": "117385099",
      "user_login": "letshugotv",
      "user_name": "LetsHugoTV",
      "game_id": "27471",
      "game_name": "Minecraft",
      "type": "live",
      "title": "⚔️3 TAGE...⚔️TEST HUGOvs100 6 STUNDEN MANHUNT⚔️CONTENT PEAK⚔️",
      "viewer_count": 2671,
      "started_at": "2024-05-03T12:46:45Z",
      "language": "de",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_letshugotv-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Deutsch",
        "content",
        "LetsHugo"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/111bbc84-a87d-49fc-9b8e-8b9bf0c67297-profile_image-300x300.png",
      "localization_names": "de"
    },
    {
      "id": "42289245224",
      "user_id": "116738112",
      "user_login": "pwgood",
      "user_name": "PWGood",
      "game_id": "27471",
      "game_name": "Minecraft",
      "type": "live",
      "title": "🎰 ДОПИЛИВАЮ САМОЕ СЛУЧАЙНОЕ КАЗИНО С БОБРОМ МОЗГОВОЙ ШТУРМ ТВОРЧЕСТВО -\u003E СНАПШОТ ЖЕСТКИЙ -\u003E МЕЖСЕЗОНЬЕ | PepeLand 8 День 256 !сервер",
      "viewer_count": 1275,
      "started_at": "2024-05-03T12:38:15Z",
      "language": "ru",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_pwgood-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Русский"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/5221d54c-3507-42cc-bea4-2832cd1300d7-profile_image-300x300.png",
      "localization_names": "ru"
    },
    {
      "id": "44136028491",
      "user_id": "41176642",
      "user_login": "impulsesv",
      "user_name": "impulseSV",
      "game_id": "27471",
      "game_name": "Minecraft",
      "type": "live",
      "title": "Hermitcraft S10 Action - Time to Lay Some Tracks! | !prime",
      "viewer_count": 1213,
      "started_at": "2024-05-03T15:57:09Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_impulsesv-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "English"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/2dd0feb9-1117-4ac4-9d46-0d547e382529-profile_image-300x300.png",
      "localization_names": "en"
    },
    {
      "id": "42576962553",
      "user_id": "28252159",
      "user_login": "jonbams",
      "user_name": "JonBams",
      "game_id": "27471",
      "game_name": "Minecraft",
      "type": "live",
      "title": "BUILDING THE WORLDS MOST DANGEROUS WOLF ARMY! 1.20.6 VANILLA (HARDCORE)",
      "viewer_count": 718,
      "started_at": "2024-05-03T13:30:09Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_jonbams-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "English"
      ],
      "is_mature": true,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/jonbams-profile_image-a36e353ac8ef33b7-300x300.png",
      "localization_names": "en"
    },
    {
      "id": "42289491912",
      "user_id": "722015923",
      "user_login": "dushenka_",
      "user_name": "Dushenka_",
      "game_id": "27471",
      "game_name": "Minecraft",
      "type": "live",
      "title": "🌞🌚 Сражаюсь с богами Дня и Ночи | МШ Межсезонье | Новый мерч !свечки",
      "viewer_count": 556,
      "started_at": "2024-05-03T13:35:31Z",
      "language": "ru",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_dushenka_-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Майнкрафт",
        "Душенька",
        "Русский",
        "Общение"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/45f180f9-906d-42c5-a3ad-0148c777677f-profile_image-300x300.png",
      "localization_names": "ru"
    },
    {
      "id": "42289036600",
      "user_id": "413038247",
      "user_login": "santos",
      "user_name": "Santos",
      "game_id": "27471",
      "game_name": "Minecraft",
      "type": "live",
      "title": "Ну сегодня точно МЕ система и автокрафты | !сборка !тг !бусти !дс",
      "viewer_count": 444,
      "started_at": "2024-05-03T10:48:32Z",
      "language": "ru",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_santos-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Русский",
        "Майншилд",
        "красивыймальчик"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/b86bd4c5-1fa1-4645-be20-a645e2cac282-profile_image-300x300.png",
      "localization_names": "ru"
    },
    {
      "id": "42289236952",
      "user_id": "60160906",
      "user_login": "gtimetv",
      "user_name": "GTimeTV",
      "game_id": "27471",
      "game_name": "Minecraft",
      "type": "live",
      "title": "Heute Season 2 Start von CC! !WoT !LevlUp !Gportal",
      "viewer_count": 417,
      "started_at": "2024-05-03T12:33:45Z",
      "language": "de",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_gtimetv-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Deutsch",
        "KeineTipps",
        "Pro",
        "Grind",
        "FirstPlaythrough",
        "KeineSpoiler",
        "KeineBackseatgaming"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/gtimetv-profile_image-2101e38cafec5e76-300x300.jpeg",
      "localization_names": "de"
    },
    {
      "id": "42289339448",
      "user_id": "31021656",
      "user_login": "thejocraft_live",
      "user_name": "thejocraft_live",
      "game_id": "27471",
      "game_name": "Minecraft",
      "type": "live",
      "title": "CREATE LIVE 5 | Großindustrie - Wir bauen ein GIGANTISCHES KRAFTWERK",
      "viewer_count": 400,
      "started_at": "2024-05-03T13:02:02Z",
      "language": "de",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_thejocraft_live-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "minecraft",
        "redstone",
        "tjc",
        "thejocraft",
        "craftattack",
        "satisfactory",
        "Deutsch",
        "SevTechAges",
        "MinecraftFreizeitpark",
        "createlive"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/449e0a0a-3400-4370-829c-3c93a111ba82-profile_image-300x300.png",
      "localization_names": "de"
    },
    {
      "id": "44135831739",
      "user_id": "133725096",
      "user_login": "fruitberries",
      "user_name": "fruitberries",
      "game_id": "27471",
      "game_name": "Minecraft",
      "type": "live",
      "title": "locking in for tomorrow | surely mcc update video out soon",
      "viewer_count": 384,
      "started_at": "2024-05-03T15:13:39Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_fruitberries-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "NoBackseating",
        "English"
      ],
      "is_mature": false
    }
  ];
  res.send(data);
  // 509658
  // try {
  //   const response = await axios.post(
  //     `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`
  //   );
  //   const token = response.data.access_token;
  //   const options = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "client-id": client_id,
  //     },
  //   };

  //   if (token) {
  //     const getStreamsRequest = await axios.get(
  //       "https://api.twitch.tv/helix/streams?game_id=27471&first=9",
  //       options
  //     );

  //     const newStreamsData = getStreamsRequest.data.data;
  //     // --------------------
  //     let allStreams = newStreamsData.slice();

  //     let URL1 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[0].user_id}`;
  //     let URL2 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[1].user_id}`;
  //     let URL3 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[2].user_id}`;
  //     let URL4 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[3].user_id}`;
  //     let URL5 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[4].user_id}`;

  //     let URL6 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[5].user_id}`;
  //     let URL7 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[6].user_id}`;
  //     let URL8 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[7].user_id}`;

  //     let UserURL1 = `https://api.twitch.tv/helix/users?id=${newStreamsData[0].user_id}`;
  //     let UserURL2 = `https://api.twitch.tv/helix/users?id=${newStreamsData[1].user_id}`;
  //     let UserURL3 = `https://api.twitch.tv/helix/users?id=${newStreamsData[2].user_id}`;
  //     let UserURL4 = `https://api.twitch.tv/helix/users?id=${newStreamsData[3].user_id}`;
  //     let UserURL5 = `https://api.twitch.tv/helix/users?id=${newStreamsData[4].user_id}`;
  //     let UserURL6 = `https://api.twitch.tv/helix/users?id=${newStreamsData[5].user_id}`;
  //     let UserURL7 = `https://api.twitch.tv/helix/users?id=${newStreamsData[6].user_id}`;
  //     let UserURL8 = `https://api.twitch.tv/helix/users?id=${newStreamsData[7].user_id}`;


  //     const promise1 = axios.get(URL1, options);
  //     const promise2 = axios.get(URL2, options);
  //     const promise3 = axios.get(URL3, options);
  //     const promise4 = axios.get(URL4, options);
  //     const promise5 = axios.get(URL5, options);
  //     const promise6 = axios.get(URL6, options);
  //     const promise7 = axios.get(URL7, options);
  //     const promise8 = axios.get(URL8, options);

  //     const promiseUser1 = axios.get(UserURL1, options);
  //     const promiseUser2 = axios.get(UserURL2, options);
  //     const promiseUser3 = axios.get(UserURL3, options);
  //     const promiseUser4 = axios.get(UserURL4, options);
  //     const promiseUser5 = axios.get(UserURL5, options);
  //     const promiseUser6 = axios.get(UserURL6, options);
  //     const promiseUser7 = axios.get(UserURL7, options);
  //     const promiseUser8 = axios.get(UserURL8, options);

  //     await axios
  //       .all([
  //         promise1,
  //         promise2,
  //         promise3,
  //         promise4,
  //         promise5,
  //         promise6,
  //         promise7,
  //         promise8,

  //         promiseUser1,
  //         promiseUser2,
  //         promiseUser3,
  //         promiseUser4,
  //         promiseUser5,
  //         promiseUser6,
  //         promiseUser7,
  //         promiseUser8,
  //       ])
  //       .then(
  //         axios.spread((...response) => {
  //           let gameName = [];
  //           let imageUrl = [];
  //           let tags = [];

  //           response.map((data, i) => {
  //             console.log(data);
  //             data.data.data.map((res) => {
  //               if (res.hasOwnProperty("profile_image_url")) {
  //                 // console.log(res);
  //                 imageUrl.push({
  //                   profile_image_url: res["profile_image_url"],
  //                 });
  //               }
  //               if (res.hasOwnProperty("game_id")) {
  //                 // console.log(res);
  //                 gameName.push({ game_name: res.game_name });
  //               }
                
  //               if(res.hasOwnProperty("broadcaster_language")){
  //                 tags.push({
  //                  localization_names:res["broadcaster_language"]
  //                })
  //               }
  //             });
  //           });
  //           _.merge(allStreams, imageUrl);
  //           _.merge(allStreams, gameName);
  //           _.merge(allStreams, tags);
            
            
  //           res.send(allStreams);
  //         })
  //       );
  //   }
  // } catch (error) {
  //   console.log("ERROR628");
  // }
});


router.get("/twitch/fortnite", async (req, res) => {
  let data=[
    {
      "id": "42576468393",
      "user_id": "44424631",
      "user_login": "nickeh30",
      "user_name": "NickEh30",
      "game_id": "33214",
      "game_name": "Fortnite",
      "type": "live",
      "title": "(Drops) New Fortnite Star Wars Update | !editor | Code NickEh30 #EpicPartner",
      "viewer_count": 4937,
      "started_at": "2024-05-03T10:15:07Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_nickeh30-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Canadian",
        "Positivity",
        "BattleRoyale",
        "PC",
        "FamilyFriendly",
        "Multiplayer",
        "PVP",
        "PlayingWithViewers",
        "English"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/c3a2d34f-a063-45f1-b857-c33788527c83-profile_image-300x300.png",
      "localization_names": "en"
    },
    {
      "id": "44135822267",
      "user_id": "32140000",
      "user_login": "sypherpk",
      "user_name": "SypherPK",
      "game_id": "33214",
      "game_name": "Fortnite",
      "type": "live",
      "title": "!Drops - FORTNITE STAR WARS UPDATE - !RocketWars",
      "viewer_count": 4780,
      "started_at": "2024-05-03T15:10:51Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_sypherpk-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "English"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/75260307-584a-4eb7-99ba-d2708d27795e-profile_image-300x300.png",
      "localization_names": "en"
    },
    {
      "id": "42289784488",
      "user_id": "11355067",
      "user_login": "vegetta777",
      "user_name": "VEGETTA777",
      "game_id": "33214",
      "game_name": "Fortnite",
      "type": "live",
      "title": "🔴Todo lo NUEVO de STAR WARS en LEGO FORTNITE #ad",
      "viewer_count": 3596,
      "started_at": "2024-05-03T14:30:51Z",
      "language": "es",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_vegetta777-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "vegetta777",
        "Español"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/bbe9b7f7-8c58-4734-adab-52c2c791b9a6-profile_image-300x300.png",
      "localization_names": "es"
    },
    {
      "id": "42576606857",
      "user_id": "660840731",
      "user_login": "happyhappygal",
      "user_name": "HappyHappyGal",
      "game_id": "33214",
      "game_name": "Fortnite",
      "type": "live",
      "title": "HUGE FORTNITE UPDATE! NEW MYTHICS!",
      "viewer_count": 2239,
      "started_at": "2024-05-03T11:26:25Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_happyhappygal-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "English",
        "Christian",
        "Women",
        "Woman",
        "Girl",
        "Female",
        "PlayingWithViewers",
        "ZeroBuild",
        "FamilyFriendly",
        "Fortnite"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/08630419-ec9f-4535-a771-05a93f4df94b-profile_image-300x300.png",
      "localization_names": "en"
    },
    {
      "id": "42576858025",
      "user_id": "146790215",
      "user_login": "replays",
      "user_name": "Replays",
      "game_id": "33214",
      "game_name": "Fortnite",
      "type": "live",
      "title": "[DROPS ENABLED] Star Wars Update in Fortnite! | !merch !newvid !fuzey",
      "viewer_count": 1925,
      "started_at": "2024-05-03T13:01:10Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_replays-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "English",
        "FamilyFriendly",
        "Fortnite",
        "ZeroBuild"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/8d1e5966-b579-44df-8b8a-6398021ac7e1-profile_image-300x300.png",
      "localization_names": "en"
    },
    {
      "id": "40612036053",
      "user_id": "101395464",
      "user_login": "vicens",
      "user_name": "Vicens",
      "game_id": "33214",
      "game_name": "Fortnite",
      "type": "live",
      "title": "STAR WARS X FORTNITE ✨ !nuevo | CODIGO Vicens en la tienda 💙",
      "viewer_count": 1553,
      "started_at": "2024-05-03T12:46:24Z",
      "language": "es",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_vicens-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Español"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/d0958171-8d95-4694-a226-7c72896e2bf9-profile_image-300x300.png",
      "localization_names": "es"
    },
    {
      "id": "42289954696",
      "user_id": "121706139",
      "user_login": "toosefn",
      "user_name": "TooseFN",
      "game_id": "33214",
      "game_name": "Fortnite",
      "type": "live",
      "title": "ESL с Володей Фримоком Саней | !delay !REAL !фнкс !вбаксы !Лига  Itg",
      "viewer_count": 1505,
      "started_at": "2024-05-03T15:01:27Z",
      "language": "ru",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_toosefn-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "русский",
        "Русский"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/f3930471-86f3-422d-91d4-30c23c1bd6c0-profile_image-300x300.png",
      "localization_names": "ru"
    },
    {
      "id": "42576937161",
      "user_id": "277945156",
      "user_login": "sommerset",
      "user_name": "Sommerset",
      "game_id": "33214",
      "game_name": "Fortnite",
      "type": "live",
      "title": "Fortnite Star Wars Update!! 😱 Good morning!! | !socials",
      "viewer_count": 1391,
      "started_at": "2024-05-03T13:23:25Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_sommerset-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "English"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/ced31775-5eb0-458a-b3c2-bd94b3587ec1-profile_image-300x300.png",
      "localization_names": "en"
    }
  ];
  res.send(data);
  // 509658
  // try {
  //   const response = await axios.post(
  //     `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`
  //   );
  //   const token = response.data.access_token;
  //   const options = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "client-id": client_id,
  //     },
  //   };

  //   if (token) {
  //     const getStreamsRequest = await axios.get(
  //       "https://api.twitch.tv/helix/streams?game_id=33214&first=9",
  //       options
  //     );

  //     const newStreamsData = getStreamsRequest.data.data;
  //     // --------------------
  //     let allStreams = newStreamsData.slice();

  //     let URL1 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[0].user_id}`;
  //     let URL2 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[1].user_id}`;
  //     let URL3 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[2].user_id}`;
  //     let URL4 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[3].user_id}`;
  //     let URL5 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[4].user_id}`;

  //     let URL6 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[5].user_id}`;
  //     let URL7 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[6].user_id}`;
  //     let URL8 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[7].user_id}`;

  //     let UserURL1 = `https://api.twitch.tv/helix/users?id=${newStreamsData[0].user_id}`;
  //     let UserURL2 = `https://api.twitch.tv/helix/users?id=${newStreamsData[1].user_id}`;
  //     let UserURL3 = `https://api.twitch.tv/helix/users?id=${newStreamsData[2].user_id}`;
  //     let UserURL4 = `https://api.twitch.tv/helix/users?id=${newStreamsData[3].user_id}`;
  //     let UserURL5 = `https://api.twitch.tv/helix/users?id=${newStreamsData[4].user_id}`;
  //     let UserURL6 = `https://api.twitch.tv/helix/users?id=${newStreamsData[5].user_id}`;
  //     let UserURL7 = `https://api.twitch.tv/helix/users?id=${newStreamsData[6].user_id}`;
  //     let UserURL8 = `https://api.twitch.tv/helix/users?id=${newStreamsData[7].user_id}`;


  //     const promise1 = axios.get(URL1, options);
  //     const promise2 = axios.get(URL2, options);
  //     const promise3 = axios.get(URL3, options);
  //     const promise4 = axios.get(URL4, options);
  //     const promise5 = axios.get(URL5, options);
  //     const promise6 = axios.get(URL6, options);
  //     const promise7 = axios.get(URL7, options);
  //     const promise8 = axios.get(URL8, options);

  //     const promiseUser1 = axios.get(UserURL1, options);
  //     const promiseUser2 = axios.get(UserURL2, options);
  //     const promiseUser3 = axios.get(UserURL3, options);
  //     const promiseUser4 = axios.get(UserURL4, options);
  //     const promiseUser5 = axios.get(UserURL5, options);
  //     const promiseUser6 = axios.get(UserURL6, options);
  //     const promiseUser7 = axios.get(UserURL7, options);
  //     const promiseUser8 = axios.get(UserURL8, options);

  //     await axios
  //       .all([
  //         promise1,
  //         promise2,
  //         promise3,
  //         promise4,
  //         promise5,
  //         promise6,
  //         promise7,
  //         promise8,

  //         promiseUser1,
  //         promiseUser2,
  //         promiseUser3,
  //         promiseUser4,
  //         promiseUser5,
  //         promiseUser6,
  //         promiseUser7,
  //         promiseUser8,
  //       ])
  //       .then(
  //         axios.spread((...response) => {
  //           let gameName = [];
  //           let imageUrl = [];
  //           let tags = [];

  //           response.map((data, i) => {
  //             console.log(data);
  //             data.data.data.map((res) => {
  //               if (res.hasOwnProperty("profile_image_url")) {
  //                 // console.log(res);
  //                 imageUrl.push({
  //                   profile_image_url: res["profile_image_url"],
  //                 });
  //               }
  //               if (res.hasOwnProperty("game_id")) {
  //                 // console.log(res);
  //                 gameName.push({ game_name: res.game_name });
  //               }
                
  //               if(res.hasOwnProperty("broadcaster_language")){
  //                 tags.push({
  //                  localization_names:res["broadcaster_language"]
  //                })
  //               }
  //             });
  //           });
  //           _.merge(allStreams, imageUrl);
  //           _.merge(allStreams, gameName);
  //           _.merge(allStreams, tags);
            
            
  //           res.send(allStreams);
  //         })
  //       );
  //   }
  // } catch (error) {
  //   console.log("ERROR628");
  // }
});



router.get("/twitch/chat", async (req, res) => {
  // 509658
  let data=[
    {
      "id": "40612316037",
      "user_id": "50985620",
      "user_login": "papaplatte",
      "user_name": "Papaplatte",
      "game_id": "509658",
      "game_name": "Just Chatting",
      "type": "live",
      "title": "imagine man guckt // spongebob elden ring weiter // sm64 // vllt feuer und flamme gucken // mal kieken wat sonst so wa",
      "viewer_count": 26506,
      "started_at": "2024-05-03T14:33:16Z",
      "language": "de",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_papaplatte-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "dumm",
        "wer",
        "guckt",
        "german",
        "Deutsch"
      ],
      "is_mature": false
    },
    {
      "id": "42289328904",
      "user_id": "188890121",
      "user_login": "dmitry_lixxx",
      "user_name": "Dmitry_Lixxx",
      "game_id": "509658",
      "game_name": "Just Chatting",
      "type": "live",
      "title": "СТРИМАРЕНА ДЕНЬ 1 🕵 ТАЙНЫ УЛИЦ 💸 ДЕНЬГИ 🤵🏻 ВЛАСТЬ ПРЕСТУПЛЕНИЯ ИНТРИГИ И РАССЛЕДОВАНИЯ КУЛЬТУРА ГАНГСТЕРОВ ТВИЧА КРИМИНАЛ ОПАСНОСТЬ ♛",
      "viewer_count": 18066,
      "started_at": "2024-05-03T13:00:18Z",
      "language": "ru",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_dmitry_lixxx-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "clown",
        "контентмейкер",
        "Русский",
        "37",
        "Фрик",
        "Freak",
        "Speedrunner",
        "Шарпейчик"
      ],
      "is_mature": false
    },
    {
      "id": "44135405339",
      "user_id": "127550308",
      "user_login": "botezlive",
      "user_name": "BotezLive",
      "game_id": "509658",
      "game_name": "Just Chatting",
      "type": "live",
      "title": "FIRST PLACE IN A CHESS TOURNAMENT?? | $1,000 !Raffle presented by !Coinbase | Sardinia Chess Festival | !raffle !coinbase",
      "viewer_count": 16046,
      "started_at": "2024-05-03T12:58:31Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_botezlive-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "ADHD",
        "Competitive",
        "Siblings",
        "Music",
        "Travel",
        "Chess",
        "Strategy",
        "English",
        "DJ"
      ],
      "is_mature": false
    },
    {
      "id": "41268989431",
      "user_id": "1058151261",
      "user_login": "ai_hongo_",
      "user_name": "本郷愛",
      "game_id": "509658",
      "game_name": "Just Chatting",
      "type": "live",
      "title": "強制退去の女 feat. カルバンクライン",
      "viewer_count": 7362,
      "started_at": "2024-05-03T08:16:53Z",
      "language": "ja",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_ai_hongo_-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "日本語",
        "English",
        "雑談"
      ],
      "is_mature": false
    },
    {
      "id": "41270224375",
      "user_id": "777707810",
      "user_login": "zubarefff",
      "user_name": "zubarefff",
      "game_id": "509658",
      "game_name": "Just Chatting",
      "type": "live",
      "title": "Перед смертью у людей в наибольшей степени проявляется живость натуры 👻 Смотрим Пункт назначения 2 🔚",
      "viewer_count": 6976,
      "started_at": "2024-05-03T16:06:49Z",
      "language": "ru",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_zubarefff-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Русский",
        "Китай",
        "Зубарев",
        "КорольПельменей",
        "IRL",
        "психология"
      ],
      "is_mature": true
    },
    {
      "id": "42576925145",
      "user_id": "78219897",
      "user_login": "akademiks",
      "user_name": "Akademiks",
      "game_id": "509658",
      "game_name": "Just Chatting",
      "type": "live",
      "title": "Kendrick Lamar spins the Block on Drake AGAIN!! Disses him again and even BIG AK gets a bar!",
      "viewer_count": 4945,
      "started_at": "2024-05-03T13:20:16Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_akademiks-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "English"
      ],
      "is_mature": true
    },
    {
      "id": "41269792839",
      "user_id": "48962167",
      "user_login": "vodkavdk",
      "user_name": "ボドカさん",
      "game_id": "509658",
      "game_name": "Just Chatting",
      "type": "live",
      "title": "日課の飲酒雑談",
      "viewer_count": 4939,
      "started_at": "2024-05-03T13:29:22Z",
      "language": "ja",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_vodkavdk-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "日本語",
        "ネタバレ禁止"
      ],
      "is_mature": false
    },
    {
      "id": "44135759851",
      "user_id": "97245742",
      "user_login": "vei",
      "user_name": "vei",
      "game_id": "509658",
      "game_name": "Just Chatting",
      "type": "live",
      "title": "heeeeeeeeey 🔴 !socials !vods",
      "viewer_count": 4849,
      "started_at": "2024-05-03T14:55:28Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_vei-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Vtuber",
        "VisualASMR",
        "vei",
        "real",
        "female",
        "agirlandagamerwhoamama",
        "humminahumminabazoooooing",
        "English",
        "awooga"
      ],
      "is_mature": true
    },
    {
      "id": "44136059819",
      "user_id": "561111389",
      "user_login": "martinciriook",
      "user_name": "MartinCirioOk",
      "game_id": "509658",
      "game_name": "Just Chatting",
      "type": "live",
      "title": "SE DESCUBRE PLAN DE LOS BROS + EMMA VS MAURO - Gran Hermano",
      "viewer_count": 4452,
      "started_at": "2024-05-03T16:00:14Z",
      "language": "es",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_martinciriook-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Español",
        "irl",
        "justchatting",
        "hablando"
      ],
      "is_mature": false
    }
  ];
  res.send(data);
  // try {
  //   const response = await axios.post(
  //     `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`
  //   );
  //   const token = response.data.access_token;
  //   const options = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "client-id": client_id,
  //     },
  //   };

  //   if (token) {
  //     const getStreamsRequest = await axios.get(
  //       "https://api.twitch.tv/helix/streams?game_id=509658&first=9",
  //       options
  //     );

  //     const newStreamsData = getStreamsRequest.data.data;
  //     // --------------------
  //     let allStreams = newStreamsData.slice();

  //     let URL1 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[0].user_id}`;
  //     let URL2 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[1].user_id}`;
  //     let URL3 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[2].user_id}`;
  //     let URL4 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[3].user_id}`;
  //     let URL5 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[4].user_id}`;

  //     let URL6 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[5].user_id}`;
  //     let URL7 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[6].user_id}`;
  //     let URL8 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[7].user_id}`;

  //     let UserURL1 = `https://api.twitch.tv/helix/users?id=${newStreamsData[0].user_id}`;
  //     let UserURL2 = `https://api.twitch.tv/helix/users?id=${newStreamsData[1].user_id}`;
  //     let UserURL3 = `https://api.twitch.tv/helix/users?id=${newStreamsData[2].user_id}`;
  //     let UserURL4 = `https://api.twitch.tv/helix/users?id=${newStreamsData[3].user_id}`;
  //     let UserURL5 = `https://api.twitch.tv/helix/users?id=${newStreamsData[4].user_id}`;
  //     let UserURL6 = `https://api.twitch.tv/helix/users?id=${newStreamsData[5].user_id}`;
  //     let UserURL7 = `https://api.twitch.tv/helix/users?id=${newStreamsData[6].user_id}`;
  //     let UserURL8 = `https://api.twitch.tv/helix/users?id=${newStreamsData[7].user_id}`;


  //     const promise1 = axios.get(URL1, options);
  //     const promise2 = axios.get(URL2, options);
  //     const promise3 = axios.get(URL3, options);
  //     const promise4 = axios.get(URL4, options);
  //     const promise5 = axios.get(URL5, options);
  //     const promise6 = axios.get(URL6, options);
  //     const promise7 = axios.get(URL7, options);
  //     const promise8 = axios.get(URL8, options);

  //     const promiseUser1 = axios.get(UserURL1, options);
  //     const promiseUser2 = axios.get(UserURL2, options);
  //     const promiseUser3 = axios.get(UserURL3, options);
  //     const promiseUser4 = axios.get(UserURL4, options);
  //     const promiseUser5 = axios.get(UserURL5, options);
  //     const promiseUser6 = axios.get(UserURL6, options);
  //     const promiseUser7 = axios.get(UserURL7, options);
  //     const promiseUser8 = axios.get(UserURL8, options);

  //     await axios
  //       .all([
  //         promise1,
  //         promise2,
  //         promise3,
  //         promise4,
  //         promise5,
  //         promise6,
  //         promise7,
  //         promise8,

  //         promiseUser1,
  //         promiseUser2,
  //         promiseUser3,
  //         promiseUser4,
  //         promiseUser5,
  //         promiseUser6,
  //         promiseUser7,
  //         promiseUser8,
  //       ])
  //       .then(
  //         axios.spread((...response) => {
  //           let gameName = [];
  //           let imageUrl = [];
  //           let tags = [];

  //           response.map((data, i) => {
  //             console.log(data);
  //             data.data.data.map((res) => {
  //               if (res.hasOwnProperty("profile_image_url")) {
  //                 // console.log(res);
  //                 imageUrl.push({
  //                   profile_image_url: res["profile_image_url"],
  //                 });
  //               }
  //               if (res.hasOwnProperty("game_id")) {
  //                 // console.log(res);
  //                 gameName.push({ game_name: res.game_name });
  //               }
                
  //               if(res.hasOwnProperty("broadcaster_language")){
  //                 tags.push({
  //                  localization_names:res["broadcaster_language"]
  //                })
  //               }
  //             });
  //           });
  //           // _.merge(allStreams, imageUrl);
  //           // _.merge(allStreams, gameName);
  //           // _.merge(allStreams, tags);
            
            
  //           res.send(allStreams);
  //         })
  //       );
  //   }
  // } catch (error) {
  //   console.log("ERROR628");
  // }
});




router.get("/twitch/fallguys", async (req, res) => {
  // 509658
  let data=[
    {
      "id": "42288849576",
      "user_id": "52569727",
      "user_login": "smash690",
      "user_name": "Smash690",
      "game_id": "512980",
      "game_name": "Fall Guys",
      "type": "live",
      "title": "Hii✨19k+👑|| !Maps || !Prime || !CC || !Twitter || !Discord ||",
      "viewer_count": 85,
      "started_at": "2024-05-03T08:52:19Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_smash690-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "English"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/cd2d3523-4782-4419-86df-ca4cb9dc2e8d-profile_image-300x300.png",
      "localization_names": "en"
    },
    {
      "id": "42288647608",
      "user_id": "402282778",
      "user_login": "kiryuhaa",
      "user_name": "kiryuhaa",
      "game_id": "512980",
      "game_name": "Fall Guys",
      "type": "live",
      "title": "играю с вами😳🥵🥶🤕",
      "viewer_count": 75,
      "started_at": "2024-05-03T05:58:12Z",
      "language": "ru",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_kiryuhaa-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "кирилл",
        "мальчик",
        "безденег",
        "безудачи",
        "безмата",
        "Русский"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/06e6da37-ad11-4369-92e3-2e2a9622292d-profile_image-300x300.png",
      "localization_names": "ru"
    },
    {
      "id": "42572121753",
      "user_id": "147372524",
      "user_login": "telinha",
      "user_name": "Telinha",
      "game_id": "512980",
      "game_name": "Fall Guys",
      "type": "live",
      "title": "🔄️ [Reprise] !LOJA COM GIFT CARD PLAYSTATION, XBOX, NINTENDO SWITCH E MUITO MAIS ☁️ !nuuvem | Código apoiador: Telinha #fallguys #streamer",
      "viewer_count": 56,
      "started_at": "2024-05-02T09:48:31Z",
      "language": "pt",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_telinha-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Chatty",
        "Chilled",
        "PlayingWithViewers",
        "SafeSpace",
        "Português",
        "Loja",
        "ClosedCaptions",
        "DropsEnable",
        "FamilyFriendly",
        "Multiplayer"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/39891235-651a-4859-9d39-bb0c40bc8443-profile_image-300x300.png",
      "localization_names": "pt"
    },
    {
      "id": "44135420139",
      "user_id": "37000745",
      "user_login": "birdynzl",
      "user_name": "birdynzl",
      "game_id": "512980",
      "game_name": "Fall Guys",
      "type": "live",
      "title": "shhh im not live #RoadTo1KFollowers !alerts !social !roulette !discord #BlerpAffiliate",
      "viewer_count": 34,
      "started_at": "2024-05-03T13:03:58Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_birdynzl-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Fortnite",
        "OCE",
        "Kiwi",
        "Oceania",
        "asmr",
        "xdd",
        "Teamfight",
        "Tactics",
        "LoL",
        "18plus"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/f7d84e38-1a0b-4736-9e37-b677702b58fc-profile_image-300x300.png",
      "localization_names": "en"
    },
    {
      "id": "42289993016",
      "user_id": "496101090",
      "user_login": "batchio",
      "user_name": "Batchio",
      "game_id": "512980",
      "game_name": "Fall Guys",
      "type": "live",
      "title": "PP Viewers avec vous! Venez jouer! | !discord !lurk",
      "viewer_count": 28,
      "started_at": "2024-05-03T15:06:40Z",
      "language": "fr",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_batchio-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "sympa",
        "eclaté",
        "drôle",
        "petitstreamer",
        "aigri",
        "Français",
        "English",
        "boldo",
        "Insupportable",
        "supaire"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/8ecc93dd-6e9f-4e69-b16b-494b3e158018-profile_image-300x300.png",
      "localization_names": "fr"
    },
    {
      "id": "40612357781",
      "user_id": "758387890",
      "user_login": "zoelibra",
      "user_name": "zoelibra",
      "game_id": "512980",
      "game_name": "Fall Guys",
      "type": "live",
      "title": "FALL GUYS..MAMI DE TWITCH  -SQUADS,DUOS MAPITAS,SI TE QUIERES REIR ESTE ES TU CANAL.  👀👀🕹🕹🎮🎮🎮🥰🥰🥰🥰🥰🥰",
      "viewer_count": 28,
      "started_at": "2024-05-03T14:47:22Z",
      "language": "es",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_zoelibra-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "guys",
        "Repetir",
        "fornite",
        "Español"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/f948ccff-a80a-4044-bdc7-f2987c044848-profile_image-300x300.png",
      "localization_names": "es"
    },
    {
      "id": "42576702441",
      "user_id": "183208249",
      "user_login": "magodofliperama",
      "user_name": "MagoDoFliperama",
      "game_id": "512980",
      "game_name": "Fall Guys",
      "type": "live",
      "title": "(+18) Subathon Randola Dia 149 // SEXTOU ❗epic ❗pix ❗controle ❗memes ❗interativos ❗suba",
      "viewer_count": 25,
      "started_at": "2024-05-03T12:07:26Z",
      "language": "pt",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_magodofliperama-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Português"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/40b6f644-a378-40ee-b4e5-4303f541166d-profile_image-300x300.png",
      "localization_names": "pt"
    },
    {
      "id": "40612510021",
      "user_id": "136337175",
      "user_login": "twardy___",
      "user_name": "Twardy___",
      "game_id": "512980",
      "game_name": "Fall Guys",
      "type": "live",
      "title": "DUO B2B 5$",
      "viewer_count": 25,
      "started_at": "2024-05-03T15:39:55Z",
      "language": "pl",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_twardy___-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Polski",
        "English"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/twardy___-profile_image-bf61775b9b3c1c7c-300x300.jpeg",
      "localization_names": "pl"
    },
    {
      "id": "42289423736",
      "user_id": "637251430",
      "user_login": "frost_208",
      "user_name": "Frost_208",
      "game_id": "512980",
      "game_name": "Fall Guys",
      "type": "live",
      "title": "Wir stolpern ins Wochenende. Mit @deniswanted Seid dabei, macht mit  | !dc | !today | !commands",
      "viewer_count": 20,
      "started_at": "2024-05-03T13:20:41Z",
      "language": "de",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_frost_208-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "chattingwithviewers",
        "AMA",
        "Deutsch",
        "fungaming",
        "freundlicheCommunity",
        "Entspannt",
        "BackseatGamingAllowed",
        "MitZuschauernspielen"
      ],
      "is_mature": false
    }
  ];
  res.send(data);
  // try {
  //   const response = await axios.post(
  //     `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`
  //   );
  //   const token = response.data.access_token;
  //   const options = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "client-id": client_id,
  //     },
  //   };

  //   if (token) {
  //     const getStreamsRequest = await axios.get(
  //       "https://api.twitch.tv/helix/streams?game_id=512980&first=9",
  //       options
  //     );

  //     const newStreamsData = getStreamsRequest.data.data;
  //     // --------------------
  //     let allStreams = newStreamsData.slice();

  //     let URL1 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[0].user_id}`;
  //     let URL2 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[1].user_id}`;
  //     let URL3 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[2].user_id}`;
  //     let URL4 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[3].user_id}`;
  //     let URL5 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[4].user_id}`;

  //     let URL6 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[5].user_id}`;
  //     let URL7 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[6].user_id}`;
  //     let URL8 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[7].user_id}`;

  //     let UserURL1 = `https://api.twitch.tv/helix/users?id=${newStreamsData[0].user_id}`;
  //     let UserURL2 = `https://api.twitch.tv/helix/users?id=${newStreamsData[1].user_id}`;
  //     let UserURL3 = `https://api.twitch.tv/helix/users?id=${newStreamsData[2].user_id}`;
  //     let UserURL4 = `https://api.twitch.tv/helix/users?id=${newStreamsData[3].user_id}`;
  //     let UserURL5 = `https://api.twitch.tv/helix/users?id=${newStreamsData[4].user_id}`;
  //     let UserURL6 = `https://api.twitch.tv/helix/users?id=${newStreamsData[5].user_id}`;
  //     let UserURL7 = `https://api.twitch.tv/helix/users?id=${newStreamsData[6].user_id}`;
  //     let UserURL8 = `https://api.twitch.tv/helix/users?id=${newStreamsData[7].user_id}`;


  //     const promise1 = axios.get(URL1, options);
  //     const promise2 = axios.get(URL2, options);
  //     const promise3 = axios.get(URL3, options);
  //     const promise4 = axios.get(URL4, options);
  //     const promise5 = axios.get(URL5, options);
  //     const promise6 = axios.get(URL6, options);
  //     const promise7 = axios.get(URL7, options);
  //     const promise8 = axios.get(URL8, options);

  //     const promiseUser1 = axios.get(UserURL1, options);
  //     const promiseUser2 = axios.get(UserURL2, options);
  //     const promiseUser3 = axios.get(UserURL3, options);
  //     const promiseUser4 = axios.get(UserURL4, options);
  //     const promiseUser5 = axios.get(UserURL5, options);
  //     const promiseUser6 = axios.get(UserURL6, options);
  //     const promiseUser7 = axios.get(UserURL7, options);
  //     const promiseUser8 = axios.get(UserURL8, options);

  //     await axios
  //       .all([
  //         promise1,
  //         promise2,
  //         promise3,
  //         promise4,
  //         promise5,
  //         promise6,
  //         promise7,
  //         promise8,

  //         promiseUser1,
  //         promiseUser2,
  //         promiseUser3,
  //         promiseUser4,
  //         promiseUser5,
  //         promiseUser6,
  //         promiseUser7,
  //         promiseUser8,
  //       ])
  //       .then(
  //         axios.spread((...response) => {
  //           let gameName = [];
  //           let imageUrl = [];
  //           let tags = [];

  //           response.map((data, i) => {
  //             console.log(data);
  //             data.data.data.map((res) => {
  //               if (res.hasOwnProperty("profile_image_url")) {
  //                 // console.log(res);
  //                 imageUrl.push({
  //                   profile_image_url: res["profile_image_url"],
  //                 });
  //               }
  //               if (res.hasOwnProperty("game_id")) {
  //                 // console.log(res);
  //                 gameName.push({ game_name: res.game_name });
  //               }
                
  //               if(res.hasOwnProperty("broadcaster_language")){
  //                 tags.push({
  //                  localization_names:res["broadcaster_language"]
  //                })
  //               }
  //             });
  //           });
  //           _.merge(allStreams, imageUrl);
  //           _.merge(allStreams, gameName);
  //           _.merge(allStreams, tags);
            
            
  //           res.send(allStreams);
  //         })
  //       );
  //   }
  // } catch (error) {
  //   console.log("ERROR628");
  // }
});



router.get("/twitch/streams/user/:id", async (req, res) => {
  try {
    const token = await getToken();
    
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`
    );
    console.log(token, "token----", client_id,"---")
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-id": client_id,
      },
    };

    if (token) {
      const getStreamsRequest = await axios.get(
        `https://api.twitch.tv/helix/videos?user_id=${req.params.id}&first=50`,
        options
      );

      // console.log(getStreamsRequest.data.data);
      // const getTopGames = await axios.get(
      //   `https://api.twitch.tv/helix/videos?id=${req.params.id}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "client-id": client_id,
      //     },
      //   }
      // );
      res.json({ streams: getStreamsRequest.data.data });
    }
  } catch (e) {
    // console.log(e);
  }
});

router.use('/emojis', emojis);

module.exports = router;
