require('dotenv').config();
const express = require('express');
const emojis = require('./emojis');
const axios = require("axios");
const replaceThumbnailSize = require("./../utils");
const router = express.Router();
const _ = require("lodash");
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});



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
      console.error('Error getting token', error);
      return null;
  }
};
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




router.get("/twitch", async (req, res) => {
  let data=[
    {
      "id": "42576585001",
      "user_id": "181077473",
      "user_login": "gaules",
      "user_name": "Gaules",
      "game_id": "32399",
      "game_name": "Counter-Strike",
      "type": "live",
      "title": "FURIA vs Bad News Kangaroos ESL Pro League Season 19 -  !Sorteio - Siga Gaules nas redes sociais!",
      "viewer_count": 57041,
      "started_at": "2024-05-03T11:15:51Z",
      "language": "pt",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_gaules-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Português",
        "brazil",
        "Portugues",
        "cs",
        "CS2",
        "counterstrike",
        "Brasil"
      ],
      "is_mature": true,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/ea0fe422-84bd-4aee-9d10-fd4b0b3a7054-profile_image-300x300.png",
      "localization_names": "pt",
      "description": "Mais um guerreiro da Maior Tribo do Mundo! Atuei como jogador profissional de CS por quase uma década, fui o primeiro treinador a ser campeão do mundo em 2007 com o MIBR. Acertei um pouco, errei muito, ganhei bastante coisa e tbm perdi demais! Atualmente faço live todos os dias aqui na Twitch! "
    },
    {
      "id": "42289008104",
      "user_id": "31239503",
      "user_login": "eslcs",
      "user_name": "ESLCS",
      "game_id": "32399",
      "game_name": "Counter-Strike",
      "type": "live",
      "title": "LIVE: ENCE vs GamerLegion - ESL Pro League Season 19 - Group C",
      "viewer_count": 35045,
      "started_at": "2024-05-03T10:32:18Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_eslcs-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "English"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/1975b18f-fa7d-443f-b191-fba08f92f3a2-profile_image-300x300.jpeg",
      "localization_names": "en",
      "description": "Home of everything Counter-Strike"
    },
    {
      "id": "42289584664",
      "user_id": "70075625",
      "user_login": "silvername",
      "user_name": "SilverName",
      "game_id": "138585",
      "game_name": "Hearthstone",
      "type": "live",
      "title": "BetBoom Classic: Hearthstone Battleground / Day 1",
      "viewer_count": 25840,
      "started_at": "2024-05-03T13:54:55Z",
      "language": "ru",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_silvername-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "Русский",
        "Hardcore"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/b880d4ea-9d95-4ffc-a1f3-00eb1cb332ae-profile_image-300x300.png",
      "localization_names": "ru",
      "description": "я фрик"
    },
    {
      "id": "40612316037",
      "user_id": "50985620",
      "user_login": "papaplatte",
      "user_name": "Papaplatte",
      "game_id": "509658",
      "game_name": "Just Chatting",
      "type": "live",
      "title": "imagine man guckt // spongebob elden ring weiter // sm64 // vllt feuer und flamme gucken // mal kieken wat sonst so wa",
      "viewer_count": 25549,
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
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/04abc1b4-7bad-4b55-8da8-c0f1cf031bda-profile_image-300x300.png",
      "localization_names": "de",
      "description": "der dümmste streamer auf ganz twitch imagine subbing to papaplatte OMEGALUL so trash unlustig unkreativ nicht gut in video spielen, wer hier sein geld lässt ist einfach nur dämlich"
    },
    {
      "id": "41270215271",
      "user_id": "545050196",
      "user_login": "kato_junichi0817",
      "user_name": "加藤純一です",
      "game_id": "509658",
      "game_name": "Just Chatting",
      "type": "live",
      "title": "キャバクラ配信",
      "viewer_count": 12838,
      "started_at": "2024-05-03T16:02:11Z",
      "language": "ja",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_kato_junichi0817-{width}x{height}.jpg",
      "tag_ids": [],
      "tags": [
        "加藤純一",
        "雑談",
        "雑談歓迎",
        "雑談〇",
        "雑談大好き",
        "日本語",
        "MURASHGAMING",
        "MRGWIN"
      ],
      "is_mature": false,
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/a4977cfd-1962-41ec-9355-ab2611b97552-profile_image-300x300.png",
      "localization_names": "ja",
      "description": "命尽き果てるまで"
    }
  ];
  res.send(data);

  // console.log(client_id);
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

    console.log(token, "token");
    if (token) {
    
      console.log("WERWEREWREWR",token);
      const getStreamsRequest = await axios.get(
        "https://api.twitch.tv/helix/streams?first=5",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "client-id": client_id,
          },
        }
      ).then(e=>{
          const newStreamsData = e.data.data;
          let allStreams = newStreamsData.slice();
          let urls= [],user_urls=[];
          // // console.log(newStreamsData);
          for(let i =0;i<5;i++ ) {
            urls.push(`https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[i].user_id}`);  
            user_urls.push(`https://api.twitch.tv/helix/users?id=${newStreamsData[i].user_id}`);
          //   // user_tags.push(`https://api.twitch.tv/helix/tags/streams`);
          }
      
          const promise1 = axios.get(urls[0], options);
          const promise2 = axios.get(urls[1], options);
          const promise3 = axios.get(urls[2], options);
          const promise4 = axios.get(urls[3], options);
          const promise5 = axios.get(urls[4], options);
          
          const promiseUser1 = axios.get(user_urls[0], options);
          const promiseUser2 = axios.get(user_urls[1], options);
          const promiseUser3 = axios.get(user_urls[2], options);
          const promiseUser4 = axios.get(user_urls[3], options);
          const promiseUser5 = axios.get(user_urls[4], options);
          
          axios
          .all([
            promise1,
            promise2,
            promise3,
            promise4,
            promise5,
            promiseUser1,
            promiseUser2,
            promiseUser3,
            promiseUser4,
            promiseUser5,
          ]).then(
            axios.spread((...response) => {
              let gameName = [];
              let imageUrl = [];
              let tags = [];
              let description=[];
              response.map((data, i) => {
              
                data.data.data.map((res)=>{
                  if(res.hasOwnProperty("broadcaster_language")){
                    tags.push({
                      localization_names:res["broadcaster_language"]
                    })
                  }
                  if (res.hasOwnProperty("profile_image_url")) {
                    imageUrl.push({
                      profile_image_url: res["profile_image_url"],
                    });
                  }
                  if (res.hasOwnProperty("description")) {
                    description.push({
                      description: res["description"],
                    });
                  }
                  if (res.hasOwnProperty("game_id")) {
                    gameName.push({ game_name: res.game_name });
                  }
                })
              });
              _.merge(allStreams, imageUrl);
              _.merge(allStreams, gameName);
              _.merge(allStreams, tags);
              _.merge(allStreams, description);
              console.log(allStreams);
              // res.send(
              //   allStreams
              // );
            })
          );
      });
    }
  } catch (error) {
    console.log("ERROR206");
  }
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


router.get("/twitch/categories/all", async (req, res) => {
  let data={
    "topGames": [
      {
        "id": "509658",
        "name": "Just Chatting",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/509658-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 206536
      },
      {
        "id": "32982",
        "name": "Grand Theft Auto V",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/32982_IGDB-{width}x{height}.jpg",
        "igdb_id": "1020",
        "gameViewers": 179496
      },
      {
        "id": "32399",
        "name": "Counter-Strike",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/32399-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 204053
      },
      {
        "id": "516575",
        "name": "VALORANT",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/516575-{width}x{height}.jpg",
        "igdb_id": "126459",
        "gameViewers": 146221
      },
      {
        "id": "21779",
        "name": "League of Legends",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/21779-{width}x{height}.jpg",
        "igdb_id": "115",
        "gameViewers": 123957
      },
      {
        "id": "30921",
        "name": "Rocket League",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/30921-{width}x{height}.jpg",
        "igdb_id": "11198",
        "gameViewers": 83704
      },
      {
        "id": "33214",
        "name": "Fortnite",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/33214-{width}x{height}.jpg",
        "igdb_id": "1905",
        "gameViewers": 46502
      },
      {
        "id": "512710",
        "name": "Call of Duty: Warzone",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/512710-{width}x{height}.jpg",
        "igdb_id": "131800",
        "gameViewers": 43546
      },
      {
        "id": "29595",
        "name": "Dota 2",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/29595-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 45741
      },
      {
        "id": "138585",
        "name": "Hearthstone",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/138585-{width}x{height}.jpg",
        "igdb_id": "1279",
        "gameViewers": 51228
      },
      {
        "id": "55453844",
        "name": "Street Fighter 6",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/55453844_IGDB-{width}x{height}.jpg",
        "igdb_id": "191692",
        "gameViewers": 47734
      },
      {
        "id": "143106037",
        "name": "EA Sports FC 24",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/143106037_IGDB-{width}x{height}.jpg",
        "igdb_id": "256092",
        "gameViewers": 43704
      },
      {
        "id": "18122",
        "name": "World of Warcraft",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/18122-{width}x{height}.jpg",
        "igdb_id": "123",
        "gameViewers": 35805
      },
      {
        "id": "2106425216",
        "name": "Gray Zone Warfare",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/2106425216_IGDB-{width}x{height}.jpg",
        "igdb_id": "275070",
        "gameViewers": 33218
      },
      {
        "id": "511224",
        "name": "Apex Legends",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/511224-{width}x{height}.jpg",
        "igdb_id": "114795",
        "gameViewers": 17861
      },
      {
        "id": "491487",
        "name": "Dead by Daylight",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/491487-{width}x{height}.jpg",
        "igdb_id": "18866",
        "gameViewers": 16761
      },
      {
        "id": "515025",
        "name": "Overwatch 2",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/515025-{width}x{height}.jpg",
        "igdb_id": "125174",
        "gameViewers": 18738
      },
      {
        "id": "1601959379",
        "name": "Bunny Garden",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/1601959379_IGDB-{width}x{height}.jpg",
        "igdb_id": "294658",
        "gameViewers": 23501
      },
      {
        "id": "2094865572",
        "name": "SMITE 2",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/2094865572_IGDB-{width}x{height}.jpg",
        "igdb_id": "282566",
        "gameViewers": 22380
      },
      {
        "id": "493057",
        "name": "PUBG: BATTLEGROUNDS",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/493057-{width}x{height}.jpg",
        "igdb_id": "27789",
        "gameViewers": 20640
      },
      {
        "id": "27471",
        "name": "Minecraft",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/27471_IGDB-{width}x{height}.jpg",
        "igdb_id": "121",
        "gameViewers": 15121
      },
      {
        "id": "417528",
        "name": "Albion Online",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/417528_IGDB-{width}x{height}.jpg",
        "igdb_id": "19698",
        "gameViewers": 21606
      },
      {
        "id": "509672",
        "name": "IRL",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/509672-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 21072
      },
      {
        "id": "29452",
        "name": "Virtual Casino",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/29452_IGDB-{width}x{height}.jpg",
        "igdb_id": "45517",
        "gameViewers": 20597
      },
      {
        "id": "513143",
        "name": "Teamfight Tactics",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/513143-{width}x{height}.jpg",
        "igdb_id": "120176",
        "gameViewers": 20176
      },
      {
        "id": "26936",
        "name": "Music",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/26936-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 13944
      },
      {
        "id": "263490",
        "name": "Rust",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/263490_IGDB-{width}x{height}.jpg",
        "igdb_id": "3277",
        "gameViewers": 17755
      },
      {
        "id": "27546",
        "name": "World of Tanks",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/27546-{width}x{height}.jpg",
        "igdb_id": "1184",
        "gameViewers": 19380
      },
      {
        "id": "1469308723",
        "name": "Software and Game Development",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/1469308723-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 18743
      },
      {
        "id": "518203",
        "name": "Sports",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/518203-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 17874
      },
      {
        "id": "620146360",
        "name": "Another Crab's Treasure",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/620146360_IGDB-{width}x{height}.jpg",
        "igdb_id": "200903",
        "gameViewers": 17825
      },
      {
        "id": "14333696",
        "name": "Goose Goose Duck",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/14333696_IGDB-{width}x{height}.jpg",
        "igdb_id": "144442",
        "gameViewers": 17728
      },
      {
        "id": "29307",
        "name": "Path of Exile",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/29307_IGDB-{width}x{height}.jpg",
        "igdb_id": "1911",
        "gameViewers": 17437
      },
      {
        "id": "498566",
        "name": "Slots",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/498566-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 17296
      },
      {
        "id": "493887283",
        "name": "Casino",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/493887283_IGDB-{width}x{height}.jpg",
        "igdb_id": "54797",
        "gameViewers": 16356
      },
      {
        "id": "489776",
        "name": "Fallout 4",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/489776_IGDB-{width}x{height}.jpg",
        "igdb_id": "9630",
        "gameViewers": 14724
      },
      {
        "id": "518630",
        "name": "Manor Lords",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/518630_IGDB-{width}x{height}.jpg",
        "igdb_id": "137206",
        "gameViewers": 15897
      },
      {
        "id": "497057",
        "name": "Destiny 2",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/497057-{width}x{height}.jpg",
        "igdb_id": "25657",
        "gameViewers": 14403
      },
      {
        "id": "491931",
        "name": "Escape from Tarkov",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/491931_IGDB-{width}x{height}.jpg",
        "igdb_id": "15536",
        "gameViewers": 13907
      },
      {
        "id": "513181",
        "name": "Genshin Impact",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/513181_IGDB-{width}x{height}.jpg",
        "igdb_id": "119277",
        "gameViewers": 10303
      },
      {
        "id": "490377",
        "name": "Sea of Thieves",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/490377-{width}x{height}.jpg",
        "igdb_id": "11137",
        "gameViewers": 12786
      },
      {
        "id": "509660",
        "name": "Art",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/509660-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 7754
      },
      {
        "id": "493959",
        "name": "Red Dead Redemption 2",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/493959_IGDB-{width}x{height}.jpg",
        "igdb_id": "25076",
        "gameViewers": 12451
      },
      {
        "id": "512953",
        "name": "ELDEN RING",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/512953_IGDB-{width}x{height}.jpg",
        "igdb_id": "119133",
        "gameViewers": 10884
      },
      {
        "id": "655697363",
        "name": "Abiotic Factor",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/655697363_IGDB-{width}x{height}.jpg",
        "igdb_id": "219126",
        "gameViewers": 11787
      },
      {
        "id": "184018545",
        "name": "INDIKA",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/184018545_IGDB-{width}x{height}.jpg",
        "igdb_id": "166824",
        "gameViewers": 11331
      },
      {
        "id": "460316",
        "name": "Brawlhalla",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/460316_IGDB-{width}x{height}.jpg",
        "igdb_id": "10233",
        "gameViewers": 11281
      },
      {
        "id": "417752",
        "name": "Talk Shows & Podcasts",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/417752-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 10748
      },
      {
        "id": "386821",
        "name": "Black Desert",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/386821_IGDB-{width}x{height}.jpg",
        "igdb_id": "6292",
        "gameViewers": 9642
      },
      {
        "id": "509659",
        "name": "ASMR",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/509659-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 10020
      },
      {
        "id": "512034",
        "name": "Stellar Blade",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/512034_IGDB-{width}x{height}.jpg",
        "igdb_id": "117170",
        "gameViewers": 9178
      },
      {
        "id": "66082",
        "name": "Games + Demos",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/66082-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 2023
      },
      {
        "id": "460630",
        "name": "Tom Clancy's Rainbow Six Siege",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/460630_IGDB-{width}x{height}.jpg",
        "igdb_id": "7360",
        "gameViewers": 7301
      },
      {
        "id": "115977",
        "name": "The Witcher 3: Wild Hunt",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/115977_IGDB-{width}x{height}.jpg",
        "igdb_id": "1942",
        "gameViewers": 8406
      },
      {
        "id": "788447527",
        "name": "Squad Busters",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/788447527_IGDB-{width}x{height}.jpg",
        "igdb_id": "234344",
        "gameViewers": 8375
      },
      {
        "id": "490744",
        "name": "Stardew Valley",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/490744_IGDB-{width}x{height}.jpg",
        "igdb_id": "17000",
        "gameViewers": 7699
      },
      {
        "id": "490422",
        "name": "StarCraft II",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/490422-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 7828
      },
      {
        "id": "2692",
        "name": "Super Mario 64",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/2692_IGDB-{width}x{height}.jpg",
        "igdb_id": "1074",
        "gameViewers": 7745
      },
      {
        "id": "394758168",
        "name": "Content Warning",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/394758168_IGDB-{width}x{height}.jpg",
        "igdb_id": "294661",
        "gameViewers": 7329
      },
      {
        "id": "71375",
        "name": "Star Citizen",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/71375_IGDB-{width}x{height}.jpg",
        "igdb_id": "1595",
        "gameViewers": 7494
      },
      {
        "id": "2748",
        "name": "Magic: The Gathering",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/2748-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 7072
      },
      {
        "id": "497497",
        "name": "Brawl Stars",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/497497_IGDB-{width}x{height}.jpg",
        "igdb_id": "55945",
        "gameViewers": 6725
      },
      {
        "id": "766571430",
        "name": "HELLDIVERS 2",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/766571430_IGDB-{width}x{height}.jpg",
        "igdb_id": "250616",
        "gameViewers": 6504
      },
      {
        "id": "488190",
        "name": "Poker",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/488190-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 7175
      },
      {
        "id": "460637",
        "name": "Dead Island 2",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/460637_IGDB-{width}x{height}.jpg",
        "igdb_id": "7329",
        "gameViewers": 6907
      },
      {
        "id": "19619",
        "name": "Tibia",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/19619_IGDB-{width}x{height}.jpg",
        "igdb_id": "9596",
        "gameViewers": 6369
      },
      {
        "id": "538054672",
        "name": "TEKKEN 8",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/538054672_IGDB-{width}x{height}.jpg",
        "igdb_id": "217590",
        "gameViewers": 6625
      },
      {
        "id": "687129551",
        "name": "Trackmania",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/687129551_IGDB-{width}x{height}.jpg",
        "igdb_id": "133807",
        "gameViewers": 6616
      },
      {
        "id": "459931",
        "name": "Old School RuneScape",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/459931_IGDB-{width}x{height}.jpg",
        "igdb_id": "79824",
        "gameViewers": 6396
      },
      {
        "id": "1337444628",
        "name": "Call of Duty: Modern Warfare III",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/1337444628-{width}x{height}.jpg",
        "igdb_id": "260780",
        "gameViewers": 5420
      },
      {
        "id": "65632",
        "name": "DayZ",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/65632_IGDB-{width}x{height}.jpg",
        "igdb_id": "2117",
        "gameViewers": 5713
      },
      {
        "id": "24241",
        "name": "FINAL FANTASY XIV ONLINE",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/24241_IGDB-{width}x{height}.jpg",
        "igdb_id": "386",
        "gameViewers": 4653
      },
      {
        "id": "743",
        "name": "Chess",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/743-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 5595
      },
      {
        "id": "91423",
        "name": "Dark Souls II",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/91423_IGDB-{width}x{height}.jpg",
        "igdb_id": "2368",
        "gameViewers": 5327
      },
      {
        "id": "516588",
        "name": "Rise Online",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/516588_IGDB-{width}x{height}.jpg",
        "igdb_id": "133581",
        "gameViewers": 5315
      },
      {
        "id": "27284",
        "name": "Retro",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/27284-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 4406
      },
      {
        "id": "272263131",
        "name": "Animals, Aquariums, and Zoos",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/272263131-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 4810
      },
      {
        "id": "490100",
        "name": "Lost Ark",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/490100-{width}x{height}.jpg",
        "igdb_id": "26128",
        "gameViewers": 4746
      },
      {
        "id": "490292",
        "name": "DARK SOULS III",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/490292_IGDB-{width}x{height}.jpg",
        "igdb_id": "11133",
        "gameViewers": 4546
      },
      {
        "id": "808406262",
        "name": "POOLS",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/808406262_IGDB-{width}x{height}.jpg",
        "igdb_id": "274791",
        "gameViewers": 4492
      },
      {
        "id": "499973",
        "name": "Always On",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/499973-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 4271
      },
      {
        "id": "490948",
        "name": "The Isle",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/490948_IGDB-{width}x{height}.jpg",
        "igdb_id": "25838",
        "gameViewers": 4346
      },
      {
        "id": "512923",
        "name": "Baldur's Gate 3",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/512923_IGDB-{width}x{height}.jpg",
        "igdb_id": "119171",
        "gameViewers": 4051
      },
      {
        "id": "509663",
        "name": "Special Events",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/509663-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 4232
      },
      {
        "id": "213930085",
        "name": "Honkai: Star Rail",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/213930085_IGDB-{width}x{height}.jpg",
        "igdb_id": "178282",
        "gameViewers": 3969
      },
      {
        "id": "506246",
        "name": "Fallout 76",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/506246-{width}x{height}.jpg",
        "igdb_id": "103020",
        "gameViewers": 3615
      },
      {
        "id": "13263",
        "name": "EVE Online",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/13263_IGDB-{width}x{height}.jpg",
        "igdb_id": "2584",
        "gameViewers": 4242
      },
      {
        "id": "1584229450",
        "name": "Nordic Ashes: Survivors of Ragnarok",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/1584229450_IGDB-{width}x{height}.jpg",
        "igdb_id": "206671",
        "gameViewers": 4098
      },
      {
        "id": "13389",
        "name": "Age of Empires II",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/13389-{width}x{height}.jpg",
        "igdb_id": "",
        "gameViewers": 4028
      },
      {
        "id": "1138021153",
        "name": "At Tony's",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/1138021153_IGDB-{width}x{height}.jpg",
        "igdb_id": "279356",
        "gameViewers": 3893
      },
      {
        "id": "2033060011",
        "name": "Surmount: A Mountain Climbing Adventure",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/2033060011_IGDB-{width}x{height}.jpg",
        "igdb_id": "224185",
        "gameViewers": 3869
      },
      {
        "id": "23453",
        "name": "Fallout: New Vegas",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/23453_IGDB-{width}x{height}.jpg",
        "igdb_id": "16",
        "gameViewers": 3645
      },
      {
        "id": "1330093788",
        "name": "Voices of the Void",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/1330093788_IGDB-{width}x{height}.jpg",
        "igdb_id": "224415",
        "gameViewers": 3605
      },
      {
        "id": "32502",
        "name": "World of Warships",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/32502_IGDB-{width}x{height}.jpg",
        "igdb_id": "5587",
        "gameViewers": 3641
      },
      {
        "id": "518901",
        "name": "Eiyuden Chronicle: Hundred Heroes",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/518901_IGDB-{width}x{height}.jpg",
        "igdb_id": "137451",
        "gameViewers": 3503
      },
      {
        "id": "517645",
        "name": "Gunfire Reborn",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/517645_IGDB-{width}x{height}.jpg",
        "igdb_id": "134483",
        "gameViewers": 3555
      },
      {
        "id": "510056",
        "name": "Epic Seven",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/510056_IGDB-{width}x{height}.jpg",
        "igdb_id": "112191",
        "gameViewers": 3595
      },
      {
        "id": "498592",
        "name": "I'm Only Sleeping",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/498592_IGDB-{width}x{height}.jpg",
        "igdb_id": "71001",
        "gameViewers": 3357
      },
      {
        "id": "23020",
        "name": "ROBLOX",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/23020_IGDB-{width}x{height}.jpg",
        "igdb_id": "17269",
        "gameViewers": 2387
      },
      {
        "id": "500188",
        "name": "Hunt: Showdown",
        "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/500188_IGDB-{width}x{height}.jpg",
        "igdb_id": "7291",
        "gameViewers": 2873
      }
    ]
  };
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
  //       `https://api.twitch.tv/helix/games/top?first=100`,
  //       options
  //     )
  //     let topGames = getStreamsRequest.data.data.slice();
  //     ///////////////////////////
  //     //topgames

  //     let imageChanged = topGames.map((e) => {
  //       return axios.get(
  //         `https://api.twitch.tv/helix/streams?game_id=${e.id}&first=100`,
  //         options
  //       );
  //     });
  //     let empty_topGames = [];
  //     let topGames_fetched = await axios.all(imageChanged);
  //     topGames_fetched.map((e) => {
  //       // console.log(e.data.data);
  //       empty_topGames.push({
  //         gameViewers: e.data.data
  //           .map((e) => e.viewer_count)
  //           .reduce((acc, cur) => acc + cur, 0),
  //       });
  //     });
  //     _.merge(topGames, empty_topGames);
  //     res.json({ topGames });
  //   }
  // } catch (e) {
  //   console.log(e);
  // }
});



router.get("/twitch/streams/contents", async (req, res) => {
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
  //     const getJustChatRequest = await axios.get(
  //       "https://api.twitch.tv/helix/streams?game_id=509658&first=8",
  //       options
  //     );

  //     const getFortNiteRequest = await axios.get(
  //       "https://api.twitch.tv/helix/streams?game_id=33214&first=8",
  //       options
  //     );
  //     const getFallGuyRequest = await axios.get(
  //       "https://api.twitch.tv/helix/streams?game_id=512980&first=8",
  //       options
  //     );
  //     const getMineCraftRequest = await axios.get(
  //       "https://api.twitch.tv/helix/streams?game_id=27471&first=9",
  //       options
  //     );
  //     const newJustChatRequest = getJustChatRequest.data.data.slice();

  //     const newFortNiteRequest = getFortNiteRequest.data.data.slice();
  //     const newFallGuyRequest = getFallGuyRequest.data.data.slice();
  //     const newMineCraftRequest = getMineCraftRequest.data.data.slice();
  //     // https://api.twitch.tv/helix/channels
  //     let justChatStreams = newJustChatRequest.map((e) => {
  //       return axios.get(
  //         `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
  //         options
  //       );
  //     });

  //     let empty_just_chat = [];
  //     //
  //     let justChatFetched = await axios.all(justChatStreams);
  //     justChatFetched.map((e) => {
  //       e.data.data.map((e) => {
  //         empty_just_chat.push({ game_name: e.game_name });
  //       });
  //     });

  //     //justCHAT IMAGEURL FOLLWERS DESCRI
  //     let just_chat_profile_image_url_and_followers_andDescriptions = newJustChatRequest.map(
  //       (e) => {
  //         return axios.get(
  //           `https://api.twitch.tv/helix/users?id=${e.user_id}`,
  //           options
  //         );
  //       }
  //     );

  //     let empty_just_chat_profile_image_url_and_followers_andDescriptions = [];
  //     let just_chat_profile_image_url_and_followers_andDescriptionsFetched = await axios.all(
  //       just_chat_profile_image_url_and_followers_andDescriptions
  //     );
  //     just_chat_profile_image_url_and_followers_andDescriptionsFetched.map(
  //       (e) => {
  //         e.data.data.map((e) => {
  //           // console.log(e);
  //           empty_just_chat_profile_image_url_and_followers_andDescriptions.push(
  //             {
  //               description: e.description,
  //               profile_image_url: e.profile_image_url,
  //               followers: e.view_count,
  //             }
  //           );
  //         });
  //       }
  //     );
  //     //justchat TAGs
  //     let just_chat_tags = newJustChatRequest.map((e) => {
  //       return axios.get(
  //         `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
  //         options
  //       );
  //     });
  //     let empty_just_chat_tag = [];
  //     //
  //     let just_chat_tags_fetched = await axios.all(just_chat_tags);
  //     just_chat_tags_fetched.map((e) => {
  //       // console.log(e.data.data);
  //       empty_just_chat_tag.push({
  //         "localization_names": e.data.data.map(
  //           (e) => e.broadcaster_language
  //         ),
  //       });
  //     });

  //     let fortNiteStreams = newFortNiteRequest.map((e) => {
  //       return axios.get(
  //         `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
  //         options
  //       );
  //     });
  //     let empty_fortNite_streams = [];
  //     //
  //     let fortNiteStreams_fetched = await axios.all(fortNiteStreams);
  //     fortNiteStreams_fetched.map((e) => {
  //       e.data.data.map((e) => {
  //         empty_fortNite_streams.push({
  //           game_name: e.game_name,
  //         });
  //       });
  //     });
  //     //image followers dscription
  //     let fortNiteStreams_image_followers_description = newFortNiteRequest.map(
  //       (e) => {
  //         return axios.get(
  //           `https://api.twitch.tv/helix/users?id=${e.user_id}`,
  //           options
  //         );
  //       }
  //     );
  //     let empty_fortNiteStreams_image_followers_description = [];
  //     //
  //     let fortNiteStreams_image_followers_description_fetched = await axios.all(
  //       fortNiteStreams_image_followers_description
  //     );
  //     fortNiteStreams_image_followers_description_fetched.map((e) => {
  //       e.data.data.map((e) => {
  //         empty_fortNiteStreams_image_followers_description.push({
  //           description: e.description,
  //           profile_image_url: e.profile_image_url,
  //           followers: e.view_count,
  //         });
  //       });
  //     });

  //     //tags
  //     let fortNite_tags = newFortNiteRequest.map((e) => {
  //       return axios.get(
  //         `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
  //         options
  //       );
  //     });
  //     let empty_fortNite_tags = [];
  //     //
  //     let fortNite_tags_fetched = await axios.all(fortNite_tags);
  //     fortNite_tags_fetched.map((e) => {
  //       empty_fortNite_tags.push({
  //         "localization_names": e.data.data.map(
  //           (e) => e.broadcaster_language
  //         ),
  //       });
  //     });

  //     ////////////////////////////////////////////////
  //     //Fallguy streams

  //     let FallGuyStreams = newFallGuyRequest.map((e) => {
  //       return axios.get(
  //         `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
  //         options
  //       );
  //     });
  //     let empty_FallGuyStreams = [];
  //     //
  //     let FallGuyStreams_fetched = await axios.all(FallGuyStreams);
  //     FallGuyStreams_fetched.map((e) => {
  //       e.data.data.map((e) => {
  //         empty_FallGuyStreams.push({
  //           game_name: e.game_name,
  //         });
  //       });
  //     });

  //     //
  //     let fallGuyStreams_image_followers_description = newFallGuyRequest.map(
  //       (e) => {
  //         return axios.get(
  //           `https://api.twitch.tv/helix/users?id=${e.user_id}`,
  //           options
  //         );
  //       }
  //     );
  //     let empty_fallGuyStreams_image_followers_description = [];
  //     //
  //     let fallGuyStreams_image_followers_description_fetched = await axios.all(
  //       fallGuyStreams_image_followers_description
  //     );
  //     fallGuyStreams_image_followers_description_fetched.map((e) => {
  //       e.data.data.map((e) => {
  //         empty_fallGuyStreams_image_followers_description.push({
  //           description: e.description,
  //           profile_image_url: e.profile_image_url,
  //           followers: e.view_count,
  //         });
  //       });
  //     });
  //     let fallGuy_tags = newFallGuyRequest.map((e) => {
  //       return axios.get(
  //         `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
  //         options
  //       );
  //     });
  //     let empty_fallGuy_tag = [];
  //     //
  //     let fallGuy_tags_fetched = await axios.all(fallGuy_tags);
  //     fallGuy_tags_fetched.map((e) => {
  //       empty_fallGuy_tag.push({
  //         localization_names: e.data.data.map(
  //           (e) => e.broadcaster_language
  //         ),
  //       });
  //     });

  //     ////////////////////////////////////////

  //     let minCraftStreams = newMineCraftRequest.map((e) => {
  //       return axios.get(
  //         `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
  //         options
  //       );
  //     });
  //     let empty_minCraftStreams = [];
  //     //
  //     let minCraftStreams_fetched = await axios.all(minCraftStreams);
  //     minCraftStreams_fetched.map((e) => {
  //       e.data.data.map((e) => {
  //         empty_minCraftStreams.push({
  //           game_name: e.game_name,
  //         });
  //       });
  //     });

  //     //
  //     let minCraft_image_followers_and_description = newMineCraftRequest.map(
  //       (e) => {
  //         return axios.get(
  //           `https://api.twitch.tv/helix/users?id=${e.user_id}`,
  //           options
  //         );
  //       }
  //     );
  //     let empty_minCraft_image_followers_and_description = [];
  //     //
  //     let minCraft_image_followers_and_description_fetched = await axios.all(
  //       minCraft_image_followers_and_description
  //     );
  //     minCraft_image_followers_and_description_fetched.map((e) => {
  //       e.data.data.map((e) => {
  //         empty_minCraft_image_followers_and_description.push({
  //           description: e.description,
  //           profile_image_url: e.profile_image_url,
  //           followers: e.view_count,
  //         });
  //       });
  //     });
  //     //
  //     let mineCraft_tags = newMineCraftRequest.map((e) => {
  //       return axios.get(
  //         `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
  //         options
  //       );
  //     });
  //     let empty_mineCraft_tags = [];
  //     //
  //     let mineCraft_tags_fetched = await axios.all(mineCraft_tags);
  //     mineCraft_tags_fetched.map((e) => {
  //       empty_mineCraft_tags.push({
  //         localization_names: e.data.data.map(
  //           (e) => e.broadcaster_language
  //         ),
  //       });
  //     });

  //     _.merge(newJustChatRequest, empty_just_chat);
  //     _.merge(newJustChatRequest, empty_just_chat_tag);
  //     _.merge(
  //       newJustChatRequest,
  //       empty_just_chat_profile_image_url_and_followers_andDescriptions
  //     );

  //     //      newFortNiteRequest newMineCraftRequest newFallGuyRequest
  //     _.merge(newMineCraftRequest, empty_minCraftStreams);
  //     _.merge(
  //       newMineCraftRequest,
  //       empty_minCraft_image_followers_and_description
  //     );
  //     _.merge(newMineCraftRequest, empty_mineCraft_tags);

  //     //
  //     _.merge(newFallGuyRequest, empty_FallGuyStreams);
  //     _.merge(
  //       newFallGuyRequest,
  //       empty_fallGuyStreams_image_followers_description
  //     );
  //     _.merge(newFallGuyRequest, empty_fallGuy_tag);
  //     //
  //     _.merge(newFortNiteRequest, empty_fortNite_streams);
  //     _.merge(
  //       newFortNiteRequest,
  //       empty_fortNiteStreams_image_followers_description
  //     );
  //     _.merge(newFortNiteRequest, empty_fortNite_tags);

  //     res.send({
  //       frontPage: {
  //         justChat: newJustChatRequest,
  //         fallGuy: newFallGuyRequest,
  //         fortNite: newFortNiteRequest,
  //         mineCraft: newMineCraftRequest,
  //       },
  //     });
  //   }
  // } catch (e) {
  //   console.log("error");
  // }
  let data={
    "frontPage": {
      "justChat": [
        {
          "id": "40612316037",
          "user_id": "50985620",
          "user_login": "papaplatte",
          "user_name": "Papaplatte",
          "game_id": "509658",
          "game_name": "Just Chatting",
          "type": "live",
          "title": "imagine man guckt // spongebob elden ring weiter // sm64 // vllt feuer und flamme gucken // mal kieken wat sonst so wa",
          "viewer_count": 26037,
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
          "is_mature": false,
          "localization_names": [
            "de"
          ],
          "description": "der dümmste streamer auf ganz twitch imagine subbing to papaplatte OMEGALUL so trash unlustig unkreativ nicht gut in video spielen, wer hier sein geld lässt ist einfach nur dämlich",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/04abc1b4-7bad-4b55-8da8-c0f1cf031bda-profile_image-300x300.png",
          "followers": 0
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
          "viewer_count": 17446,
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
          "is_mature": false,
          "localization_names": [
            "ru"
          ],
          "description": "",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/338e8041-6289-4ba4-9029-d11f54153443-profile_image-300x300.png",
          "followers": 0
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
          "is_mature": false,
          "localization_names": [
            "en"
          ],
          "description": "Welcome to BotezLive, a chess show hosted by two sisters, Alexandra (24) and Andrea (20). Both grew up playing chess competitively and represented Team Canada in many international events. We also stream Just Chatting and occasionally other games.",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/ec097930-dea0-4819-aafb-cd0e935a60f9-profile_image-300x300.png",
          "followers": 0
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
          "viewer_count": 5155,
          "started_at": "2024-05-03T13:29:22Z",
          "language": "ja",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_vodkavdk-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "日本語",
            "ネタバレ禁止"
          ],
          "is_mature": false,
          "localization_names": [
            "ja"
          ],
          "description": "YOUTUBEで実況動画をあげている【ぼどか】の配信チャンネルです。",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/d7b3f8e8-b6e0-4c72-ad9b-f0bab5cdc21a-profile_image-300x300.png",
          "followers": 0
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
          "viewer_count": 5001,
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
          "is_mature": true,
          "localization_names": [
            "en"
          ],
          "description": "veibae@mythictalent.com for business 📈i dont have an instagram stop asking",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/639305d3-1451-44a5-a8b1-1710458d7de8-profile_image-300x300.png",
          "followers": 0
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
          "is_mature": true,
          "localization_names": [
            "en"
          ],
          "description": "",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/1a97d942-2cd3-4123-8bbf-fb31e583f7ee-profile_image-300x300.png",
          "followers": 0
        },
        {
          "id": "40612080565",
          "user_id": "44748026",
          "user_login": "stintik",
          "user_name": "Stintik",
          "game_id": "509658",
          "game_name": "Just Chatting",
          "type": "live",
          "title": "аривуар",
          "viewer_count": 3875,
          "started_at": "2024-05-03T13:03:22Z",
          "language": "ru",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_stintik-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "Русский"
          ],
          "is_mature": false,
          "localization_names": [
            "ru"
          ],
          "description": "чо читать умеешь",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/1fdc84cb-9f9d-48a3-b84f-b5944d76cb82-profile_image-300x300.png",
          "followers": 0
        },
        {
          "id": "40612164101",
          "user_id": "501438035",
          "user_login": "niklaswilson",
          "user_name": "NiklasWilson",
          "game_id": "509658",
          "game_name": "Just Chatting",
          "type": "live",
          "title": "Find the Pro Reaction dannach Arda Video !prime !ere !gamingkanal",
          "viewer_count": 3745,
          "started_at": "2024-05-03T13:36:28Z",
          "language": "de",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_niklaswilson-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "Deutsch"
          ],
          "is_mature": false,
          "localization_names": [
            "de"
          ],
          "description": "Niklas Wilson Sommer, Deutscher Fußballprofi für den 1.FC Nürnberg ",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/9c352f7e-c9a1-4a2a-81b5-e5301e73fa4a-profile_image-300x300.png",
          "followers": 0
        }
      ],
      "fallGuy": [
        {
          "id": "42288849576",
          "user_id": "52569727",
          "user_login": "smash690",
          "user_name": "Smash690",
          "game_id": "512980",
          "game_name": "Fall Guys",
          "type": "live",
          "title": "Hii✨19k+👑|| !Maps || !Prime || !CC || !Twitter || !Discord ||",
          "viewer_count": 80,
          "started_at": "2024-05-03T08:52:19Z",
          "language": "en",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_smash690-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "English"
          ],
          "is_mature": false,
          "description": "I like to play games &lt;3 ",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/cd2d3523-4782-4419-86df-ca4cb9dc2e8d-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "en"
          ]
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
          "viewer_count": 70,
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
          "description": "стремлюсь к тому, чего не знаю",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/06e6da37-ad11-4369-92e3-2e2a9622292d-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "ru"
          ]
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
          "viewer_count": 60,
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
          "description": "Streamer e representante oficial do Fall Guys no Brasil, vice-campeão da Twitch Rivals (Fall Guys Season 1 Showdown – Brazil) e criador de conteúdo Family friendly na Twitch. Live sem palavrão e com muita interação.",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/39891235-651a-4859-9d39-bb0c40bc8443-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "pt"
          ]
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
          "viewer_count": 31,
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
          "description": "Grand adepte du démineur et autres jeux de qualité                J'adore streamer mais je ne possède pas vraiment de particularité",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/8ecc93dd-6e9f-4e69-b16b-494b3e158018-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "fr"
          ]
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
          "viewer_count": 30,
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
          "description": "Hi i'm Birdy I'm 30 years old and like to play Video Games a lot :) I'm a Variety Streamer from Wellington New Zealand and I love video games!Ask me anything, i'm always down for a chat & some fun banter, but don't go too far ;) ILY &lt;3",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/f7d84e38-1a0b-4736-9e37-b677702b58fc-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "en"
          ]
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
          "viewer_count": 24,
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
          "description": "",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/f948ccff-a80a-4044-bdc7-f2987c044848-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "es"
          ]
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
          "viewer_count": 24,
          "started_at": "2024-05-03T15:39:55Z",
          "language": "pl",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_twardy___-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "Polski",
            "English"
          ],
          "is_mature": false,
          "description": "",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/twardy___-profile_image-bf61775b9b3c1c7c-300x300.jpeg",
          "followers": 0,
          "localization_names": [
            "pl"
          ]
        }
      ],
      "fortNite": [
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
          "description": "Family-Friendly • Positivity • Fortnite Creator • Born in Nova Scotia • Canadian/Lebanese • #EhTeam",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/c3a2d34f-a063-45f1-b857-c33788527c83-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "en"
          ]
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
          "viewer_count": 4651,
          "started_at": "2024-05-03T15:10:51Z",
          "language": "en",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_sypherpk-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "English"
          ],
          "is_mature": false,
          "description": "27 year old professional streamer and educational commentator -- Follow the stream for a mix of competitiveness and content creation! -- @SypherPK on all socials for updates and more. #PKHOOD👹",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/75260307-584a-4eb7-99ba-d2708d27795e-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "en"
          ]
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
          "viewer_count": 3525,
          "started_at": "2024-05-03T14:30:51Z",
          "language": "es",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_vegetta777-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "vegetta777",
            "Español"
          ],
          "is_mature": false,
          "description": "💜 Cuando veas un unicornio en el cielo avísame! salgamos juntos del manicomio a buscarlo y seamos felices ^^ brbrbrbr Youtuber incomprendido, pero lleno de amor!💜 Business: vegetta777@vizz-agency.com",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/bbe9b7f7-8c58-4734-adab-52c2c791b9a6-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "es"
          ]
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
          "description": "Happiest Streamer on Twitch! 😊Happy@Dulcedo.com 💌",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/08630419-ec9f-4535-a771-05a93f4df94b-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "en"
          ]
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
          "viewer_count": 1874,
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
          "description": "",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/8d1e5966-b579-44df-8b8a-6398021ac7e1-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "en"
          ]
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
          "description": "Empezamos a las 13:00 hora española todos los días SIIIIIIIIUUUUUUUUU",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/d0958171-8d95-4694-a226-7c72896e2bf9-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "es"
          ]
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
          "description": "( ͡° ͜ʖ ͡°) | 📩 TooseFN@gmail.com",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/f3930471-86f3-422d-91d4-30c23c1bd6c0-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "ru"
          ]
        }
      ],
      "mineCraft": [
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
          "description": "Ich streame nicht mehr jeden Tag... - letshugo@ins.gg",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/111bbc84-a87d-49fc-9b8e-8b9bf0c67297-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "de"
          ]
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
          "viewer_count": 1299,
          "started_at": "2024-05-03T12:38:15Z",
          "language": "ru",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_pwgood-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "Русский"
          ],
          "is_mature": false,
          "description": "Микро стример",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/5221d54c-3507-42cc-bea4-2832cd1300d7-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "ru"
          ]
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
          "description": "Impulse is a member of Hermitcraft playing mostly Minecraft and makes videos for YouTube.  Check the social links for details! ",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/2dd0feb9-1117-4ac4-9d46-0d547e382529-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "en"
          ]
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
          "description": "Playing Hardcore Vanilla Minecraft 7 days a week! ",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/jonbams-profile_image-a36e353ac8ef33b7-300x300.png",
          "followers": 0,
          "localization_names": [
            "en"
          ]
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
          "description": "YouTube - жена, Twitch - любовница. Люблю обеих!",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/45f180f9-906d-42c5-a3ad-0148c777677f-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "ru"
          ]
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
          "viewer_count": 428,
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
          "description": "Имя - Максимка / Реклама и сотрудничество - santosodonnell14@gmail.com",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/b86bd4c5-1fa1-4645-be20-a645e2cac282-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "ru"
          ]
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
          "description": "Super schlecht in jedem Game, denkt aber er ist immer der beste von allen. Wer den Typ unterstützt dem ist nicht mehr zu helfen.",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/gtimetv-profile_image-2101e38cafec5e76-300x300.jpeg",
          "followers": 0,
          "localization_names": [
            "de"
          ]
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
          "description": "Minecraft mit Niveau und Verstand neu erfahren. ",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/449e0a0a-3400-4370-829c-3c93a111ba82-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "de"
          ]
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
          "viewer_count": 348,
          "started_at": "2024-05-03T15:13:39Z",
          "language": "en",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_fruitberries-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "NoBackseating",
            "English"
          ],
          "is_mature": false,
          "description": "guy",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/4a1b51a9-0094-4cb8-bdf4-dba7c7e64dea-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "en"
          ]
        }
      ]
    }
  };
  res.send(data);
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
  let data=[
    {
      "id": "509658",
      "name": "Just Chatting",
      "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/509658-{width}x{height}.jpg",
      "igdb_id": "",
      "gameViewers": 112585
    },
    {
      "id": "32982",
      "name": "Grand Theft Auto V",
      "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/32982_IGDB-{width}x{height}.jpg",
      "igdb_id": "1020",
      "gameViewers": 110476
    },
    {
      "id": "32399",
      "name": "Counter-Strike",
      "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/32399-{width}x{height}.jpg",
      "igdb_id": "",
      "gameViewers": 178627
    },
    {
      "id": "516575",
      "name": "VALORANT",
      "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/516575-{width}x{height}.jpg",
      "igdb_id": "126459",
      "gameViewers": 111474
    },
    {
      "id": "21779",
      "name": "League of Legends",
      "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/21779-{width}x{height}.jpg",
      "igdb_id": "115",
      "gameViewers": 78820
    },
    {
      "id": "30921",
      "name": "Rocket League",
      "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/30921-{width}x{height}.jpg",
      "igdb_id": "11198",
      "gameViewers": 81013
    },
    {
      "id": "33214",
      "name": "Fortnite",
      "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/33214-{width}x{height}.jpg",
      "igdb_id": "1905",
      "gameViewers": 30491
    },
    {
      "id": "29595",
      "name": "Dota 2",
      "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/29595-{width}x{height}.jpg",
      "igdb_id": "",
      "gameViewers": 36682
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
  //       "https://api.twitch.tv/helix/games/top?first=8",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "client-id": client_id,
  //         },
  //       }
  //     );

  //     const newStreamsData = getStreamsRequest.data.data;
  //     // --------------------

  //     // console.log(newStreamsData);

  //     let allStreams = newStreamsData.slice();
  //     let URL1 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[0].id}`;
  //     let URL2 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[1].id}`;
  //     let URL3 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[2].id}`;
  //     let URL4 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[3].id}`;
  //     let URL5 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[4].id}`;
  //     let URL6 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[5].id}`;
  //     let URL7 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[6].id}`;
  //     let URL8 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[7].id}`;

  //     const promise1 = axios.get(URL1, options);
  //     const promise2 = axios.get(URL2, options);
  //     const promise3 = axios.get(URL3, options);
  //     const promise4 = axios.get(URL4, options);
  //     const promise5 = axios.get(URL5, options);
  //     const promise6 = axios.get(URL6, options);
  //     const promise7 = axios.get(URL7, options);
  //     const promise8 = axios.get(URL8, options);

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
  //       ])
  //       .then(
  //         axios.spread((...response) => {
  //           // console.log(response);
  //           let gameViewers = [];
  //           response.map((data, i) => {
  //             // console.log(data.data);
  //             gameViewers.push({
  //               gameViewers: data.data.data
  //                 .map((e) => e.viewer_count)
  //                 .reduce((acc, cur) => acc + cur, 0),
  //             });
  //           });
  //           _.merge(allStreams, gameViewers);

  //           res.send(allStreams);
  //         })
  //       );
  //   }
  // } catch (error) {
  //   console.log("ERROR287");
  // }
});


router.get("/twitch/streams", async (req, res, next) => {
  let data={
    "frontPage": {
      "allStreams": [
        {
          "id": "42576585001",
          "user_id": "181077473",
          "user_login": "gaules",
          "user_name": "Gaules",
          "game_id": "32399",
          "game_name": "Counter-Strike",
          "type": "live",
          "title": "FURIA vs Bad News Kangaroos ESL Pro League Season 19 -  !Sorteio - Siga Gaules nas redes sociais!",
          "viewer_count": 58237,
          "started_at": "2024-05-03T11:15:51Z",
          "language": "pt",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_gaules-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "Português",
            "brazil",
            "Portugues",
            "cs",
            "CS2",
            "counterstrike",
            "Brasil"
          ],
          "is_mature": true,
          "description": "Mais um guerreiro da Maior Tribo do Mundo! Atuei como jogador profissional de CS por quase uma década, fui o primeiro treinador a ser campeão do mundo em 2007 com o MIBR. Acertei um pouco, errei muito, ganhei bastante coisa e tbm perdi demais! Atualmente faço live todos os dias aqui na Twitch! ",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/ea0fe422-84bd-4aee-9d10-fd4b0b3a7054-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "pt"
          ]
        },
        {
          "id": "42289008104",
          "user_id": "31239503",
          "user_login": "eslcs",
          "user_name": "ESLCS",
          "game_id": "32399",
          "game_name": "Counter-Strike",
          "type": "live",
          "title": "LIVE: ENCE vs GamerLegion - ESL Pro League Season 19 - Group C",
          "viewer_count": 35399,
          "started_at": "2024-05-03T10:32:18Z",
          "language": "en",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_eslcs-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "English"
          ],
          "is_mature": false,
          "description": "Home of everything Counter-Strike",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/1975b18f-fa7d-443f-b191-fba08f92f3a2-profile_image-300x300.jpeg",
          "followers": 0,
          "localization_names": [
            "en"
          ]
        },
        {
          "id": "42289584664",
          "user_id": "70075625",
          "user_login": "silvername",
          "user_name": "SilverName",
          "game_id": "138585",
          "game_name": "Hearthstone",
          "type": "live",
          "title": "BetBoom Classic: Hearthstone Battleground / Day 1",
          "viewer_count": 26265,
          "started_at": "2024-05-03T13:54:55Z",
          "language": "ru",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_silvername-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "Русский",
            "Hardcore"
          ],
          "is_mature": false,
          "description": "я фрик",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/b880d4ea-9d95-4ffc-a1f3-00eb1cb332ae-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "ru"
          ]
        },
        {
          "id": "40612316037",
          "user_id": "50985620",
          "user_login": "papaplatte",
          "user_name": "Papaplatte",
          "game_id": "509658",
          "game_name": "Just Chatting",
          "type": "live",
          "title": "imagine man guckt // spongebob elden ring weiter // sm64 // vllt feuer und flamme gucken // mal kieken wat sonst so wa",
          "viewer_count": 26037,
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
          "is_mature": false,
          "description": "der dümmste streamer auf ganz twitch imagine subbing to papaplatte OMEGALUL so trash unlustig unkreativ nicht gut in video spielen, wer hier sein geld lässt ist einfach nur dämlich",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/04abc1b4-7bad-4b55-8da8-c0f1cf031bda-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "de"
          ]
        },
        {
          "id": "40612357957",
          "user_id": "24147592",
          "user_login": "gotaga",
          "user_name": "Gotaga",
          "game_id": "30921",
          "game_name": "Rocket League",
          "type": "live",
          "title": "GENTLEMATES ALPINE vs. Nordschleife - Swisstage - Round 1",
          "viewer_count": 23093,
          "started_at": "2024-05-03T14:47:25Z",
          "language": "fr",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_gotaga-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "Français",
            "DropsActivés"
          ],
          "is_mature": false,
          "description": "Je m’appelle Corentin Houssein, j'ai 30 ans et je suis un ancien joueur professionnel sur les opus Call Of Duty sous le pseudonyme Gotaga. De nombreuses fois champion d'Europe et de France, j'ai longtemps été le joueur français le plus titré sur consoles.",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/69e324f6-fc7d-4131-89ed-227a955637cf-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "fr"
          ]
        },
        {
          "id": "41269309847",
          "user_id": "49207184",
          "user_login": "fps_shaka",
          "user_name": "fps_shaka",
          "game_id": "1601959379",
          "game_name": "Bunny Garden",
          "type": "live",
          "title": "流石に俺に任せてほしい｜バニーガーデン",
          "viewer_count": 22991,
          "started_at": "2024-05-03T10:59:40Z",
          "language": "ja",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_fps_shaka-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "日本語",
            "ネタバレ禁止",
            "ネタバレ注意",
            "大会のネタバレ禁止",
            "匂わせしないで"
          ],
          "is_mature": false,
          "description": "",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/61f568bf-884b-4126-b17c-fc525c6d3bd4-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "ja"
          ]
        },
        {
          "id": "40612336021",
          "user_id": "97610047",
          "user_login": "brokybrawkstv",
          "user_name": "brokybrawkstv",
          "game_id": "516575",
          "game_name": "VALORANT",
          "type": "live",
          "title": "GENTLE MATES vs TEAM LIQUID ! #VCTWatchParty",
          "viewer_count": 21018,
          "started_at": "2024-05-03T14:40:20Z",
          "language": "fr",
          "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_brokybrawkstv-{width}x{height}.jpg",
          "tag_ids": [],
          "tags": [
            "Français"
          ],
          "is_mature": false,
          "description": "Anciennement joueur professionnel sur Call of Duty ! Suis moi dans mon aventure Twitch avec la #BrokyArmy ! Je passe du mode \" Try Hard \" à \" Chill \" très rapidement mais le plus important c'est qu'on s'amuse tous ensemble !",
          "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/0bb7c133-1a7b-4699-8012-de46bd393c09-profile_image-300x300.png",
          "followers": 0,
          "localization_names": [
            "fr"
          ]
        }
      ],
      "topGames": [
        {
          "id": "509658",
          "name": "Just Chatting",
          "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/509658-{width}x{height}.jpg",
          "igdb_id": "",
          "gameViewers": 112585
        },
        {
          "id": "32982",
          "name": "Grand Theft Auto V",
          "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/32982_IGDB-{width}x{height}.jpg",
          "igdb_id": "1020",
          "gameViewers": 110476
        },
        {
          "id": "32399",
          "name": "Counter-Strike",
          "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/32399-{width}x{height}.jpg",
          "igdb_id": "",
          "gameViewers": 178627
        },
        {
          "id": "516575",
          "name": "VALORANT",
          "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/516575-{width}x{height}.jpg",
          "igdb_id": "126459",
          "gameViewers": 111474
        },
        {
          "id": "21779",
          "name": "League of Legends",
          "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/21779-{width}x{height}.jpg",
          "igdb_id": "115",
          "gameViewers": 78820
        },
        {
          "id": "30921",
          "name": "Rocket League",
          "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/30921-{width}x{height}.jpg",
          "igdb_id": "11198",
          "gameViewers": 80862
        },
        {
          "id": "33214",
          "name": "Fortnite",
          "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/33214-{width}x{height}.jpg",
          "igdb_id": "1905",
          "gameViewers": 30491
        },
        {
          "id": "29595",
          "name": "Dota 2",
          "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/29595-{width}x{height}.jpg",
          "igdb_id": "",
          "gameViewers": 36682
        }
      ]
    }
  };
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
  //       "https://api.twitch.tv/helix/streams?first=8",
  //       options
  //     );
  //     const getTopGamesRequest = await axios.get(
  //       "https://api.twitch.tv/helix/games/top?first=8",
  //       options
  //     );

  //     const newStreamsData = getStreamsRequest.data.data.slice();
  //     const newTopGamesRequest = getTopGamesRequest.data.data.slice();
  //     ///////////////////////////
  //     //topgames

  //     let topGames = newTopGamesRequest.map((e) => {
  //       // console.log(e);
  //       return axios.get(
  //         `https://api.twitch.tv/helix/streams?game_id=${e.id}`,
  //         options
  //       );
  //     });
  //     let empty_topGames = [];
  //     //
  //     let topGames_fetched = await axios.all(topGames);
  //     topGames_fetched.map((e) => {
  //       empty_topGames.push({
  //         gameViewers: e.data.data
  //           .map((e) => e.viewer_count)
  //           .reduce((acc, cur) => acc + cur, 0),
  //       });
  //     });

  //     ///////////////////////////

  //     //To Get Game_NAME

  //     let game_name_data = newStreamsData.map((e) => {
  //       return axios.get(
  //         `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
  //         options
  //       );
  //     });
  //     let empty_game_name = [];
  //     //
  //     let game_name_fetched = await axios.all(game_name_data);
  //     game_name_fetched.map((e) => {
  //       e.data.data.map((e) => {
  //         // console.log(e);
  //         empty_game_name.push({ game_name: e.game_name });
  //       });
  //     });

  //     ///////////////////////////
  //     let profileImageUrlAndFollowersAndDescriptions = newStreamsData.map(
  //       (e) => {
  //         return axios.get(
  //           `https://api.twitch.tv/helix/users?id=${e.user_id}`,
  //           options
  //         );
  //       }
  //     );

  //     let emptyProfileImageUrlAndFollowersAndDescriptions = [];
  //     let profileImageUrlAndFollowersAndDescriptionsFected = await axios.all(
  //       profileImageUrlAndFollowersAndDescriptions
  //     );
  //     profileImageUrlAndFollowersAndDescriptionsFected.map((e) => {
  //       e.data.data.map((e) => {
  //         // console.log(e);
  //         emptyProfileImageUrlAndFollowersAndDescriptions.push({
  //           description: e.description,
  //           profile_image_url: e.profile_image_url,
  //           followers: e.view_count,
  //         });
  //       });
  //     });

  //     /////////////////////////////////////////////////

  //     let tags = newStreamsData.map((e) => {
  //       return axios.get(
  //         `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
  //         options
  //       );
  //     });
  //     let empty_tags = [];

  //     let tags_fetched = await axios.all(tags);
  //     tags_fetched.map((e) => {
  //       empty_tags.push({
  //         localization_names: e.data.data.map(
  //           (e) => e.broadcaster_language
  //         ),
  //       });
  //     });
  //     //////////////////////////////
  //     //justchat STREAMS
  //     //////////////////////////////////////////////////
  //     //FORTNITE STREAMS

  //     // console.log(empty_topGames);
  //     _.merge(newTopGamesRequest, empty_topGames);
  //     _.merge(newStreamsData, empty_game_name);
  //     _.merge(newStreamsData, emptyProfileImageUrlAndFollowersAndDescriptions);
  //     _.merge(newStreamsData, empty_tags);

  //     res.send({
  //       frontPage: {
  //         allStreams: newStreamsData,
  //         topGames: newTopGamesRequest,
  //       },
  //     });
  //   }
  // } catch (e) {
  //   res.status(500);
  //   next(e);
  // }
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



router.get("/twitch/streams/:id", async (req, res) => {
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

    if (token) {
      const getStreamsRequest = await axios.get(
        `https://api.twitch.tv/helix/streams?game_id=${req.params.id}&first=100`,
        options
      );

      const getTopGames = await axios.get(
        `https://api.twitch.tv/helix/games?id=${req.params.id}`,
        options
      );

      const topGames = getTopGames.data.data;
      const sliced = getStreamsRequest.data.data.slice();
      const totalViews = getStreamsRequest.data.data
        .map((el) => el.viewer_count)
        .reduce((acc, curr) => {
          return acc + curr;
        });
      //
      const profileImage = getStreamsRequest.data.data.slice();

      let vr = profileImage.map((e) => {
        return axios.get(
          `https://api.twitch.tv/helix/users?id=${e.user_id}`,
          options
        );
      });

      let empty_followers = [];
      //

      let imageResult = await axios.all(vr);
      let ta2 = [];
      imageResult.map((e) => {
        // e.data.data.map((e) => console.log(e.vi));
        empty_followers.push({
          totalFollow: e.data.data
            .map((e) => e.view_count)
            .reduce((acc, cur) => acc + cur, 0),
        });

        e.data.data.map((e) => {
          // console.log(e)
          ta2.push({
            profile_image_url: e.profile_image_url,
            description: e.description,
          });
        });
      });
      const totalF = empty_followers
        .map((e) => e.totalFollow)
        .reduce((acc, cur) => acc + cur, 0);

      _.merge(sliced, ta2);

      //
      // let tags = [];
      let ar = getStreamsRequest.data.data.map((data) => {
        // console.log("------------>",data.tag_ids[0]);
        return axios.get(
          `https://api.twitch.tv/helix/users?id=${data.user_id}`,
          options
        );
      });
      let result = await axios.all(ar);
      let ta = [];
      result.map((e) => {
        e.data.data.map((e) => {
          // localization_names:res["broadcaster_language"]

          ta.push({ localization_names: e.broadcaster_language });
        });
      });
      _.merge(sliced, ta);
      res.json({
        totalFollowers: totalF,
        selectedGame: topGames,
        totalCurrentWatching: totalViews,
        streams: sliced,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/twitch/streams/user/:id", async (req, res) => {
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
    console.log(e);
  }
});

router.use('/emojis', emojis);

module.exports = router;
