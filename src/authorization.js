import {httpClient} from "./api.js";
import CryptoJS from 'crypto-js';

const INTERVAL = 500

export const authorization = {
  bot_token: process.env.NEXT_PUBLIC_BOT_TOKEN,

  //in courier app we dont check auth on client because of troubles with crypto lib (but check on backend)
  init: async() => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (window.Telegram &&
          window.Telegram.WebApp.initDataUnsafe &&
          window.Telegram.WebApp.initDataUnsafe.user) {
          clearInterval(interval);
          const initData = window.Telegram.WebApp.initData;
          // const result = authorization.isValidHash(initData);
          // if (result) {
          httpClient.defaults.headers['tg_query'] = initData;
          // }
          resolve({ result: true, tg_query: initData });
        }
      }, INTERVAL);
    });
  },

  isValidHash: (initData) => {
    const parsedData = window.Telegram.Utils.urlParseQueryString(initData)
    const hash = parsedData.hash
    const data_keys = Object.keys(parsedData).filter(v => v !== 'hash').sort()
    const items = data_keys.map(key => key + '=' + parsedData[key])
    const data_check_string = items.join('\n')

    const secret_key = authorization._HMAC_SHA256(authorization.bot_token, 'WebAppData')
    const hashGenerate = authorization._HMAC_SHA256(data_check_string, secret_key)

    console.log(hash, hashGenerate)

    return Boolean(hashGenerate === hash)
  },

  _HMAC_SHA256: (value, key) => {
    // return crypto.createHmac('sha256', key).update(value).digest()
    return CryptoJS.HmacSHA256(value, key).toString(CryptoJS.enc.Hex);
  }
}
