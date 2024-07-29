import crypto from "crypto";
import {httpClient} from "./api.js";

const INTERVAL = 500

export const authorization = {
  bot_token: '7435766909:AAG0Ue5yHw9h6YQ7p9AKvl1rL3usmeBNy9s',

  init: async() => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (window.Telegram &&
          window.Telegram.WebApp.initDataUnsafe &&
          window.Telegram.WebApp.initDataUnsafe.user) {
          clearInterval(interval);
          const initData = window.Telegram.WebApp.initData;
          const result = authorization.isValidHash(initData);
          if (result) {
            httpClient.defaults.headers['tg_query'] = initData;
          }
          resolve({ result, tg_query: initData });
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
    const hashGenerate = authorization._hex(authorization._HMAC_SHA256(data_check_string, secret_key))

    console.log(hashGenerate)
    console.log(hash)

    return Boolean(hashGenerate === hash)
  },

  _HMAC_SHA256: (value, key) => {
    return crypto.createHmac('sha256', key).update(value).digest()
  },

  _hex: (bytes) => {
    return bytes.toString('hex');
  }
}
