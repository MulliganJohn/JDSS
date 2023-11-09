const {TCPHttpMethod, TCPHttpRequest} = require("tcp-http-client");
const { URL } = require('url');

class HttpRequests {
    static getCookiePostRequest() {
      const obj = {
          acr_values: 'urn:riot:bronze',
          claims: '',
          client_id: 'riot-client',
          nonce: HttpRequests.generate_uuidv4(),
          redirect_uri: 'http://localhost/redirect',
          response_type: 'token id_token',
          scope: 'openid link ban lol_region',
          toString() {
            return JSON.stringify(this);
          }
        };
        const request = new TCPHttpRequest(new URL("https://auth.riotgames.com/api/v1/authorization"), TCPHttpMethod.POST);
        request.addHeader("User-Agent", "jhttp/1.0");
        request.addHeader("Connection", "Keep-Alive");
        request.addHeader("Host", "auth.riotgames.com");
        request.addHeader("Accept", "application/json, text/json, text/x-json, text/javascript, application/xml, text/xml");
        request.addContent(obj.toString(), "application/json");
        return request;
    }
    static getBearerPutRequest(account){
      const obj = {
        type: "auth",
        username: account.username,
        password: account.password,
        remember: false,
        language: "en_US",
        toString() {
          return JSON.stringify(this);
        }
      };
      const request = new TCPHttpRequest(new URL("https://auth.riotgames.com/api/v1/authorization"), TCPHttpMethod.PUT);
      request.addHeader("User-Agent", "RiotClient/");
      request.addHeader("Host", "auth.riotgames.com");
      request.addHeader("Connection", "Keep-Alive");
      request.addContent(obj.toString(), "application/json");
      return request;
    }

    static getStoreGetRequest(account){
      let request;
      switch (account.region) {
        case 'NA1':
          request = new TCPHttpRequest(new URL("https://na.store.leagueoflegends.com/storefront/v3/history/purchase?language=en_US"), TCPHttpMethod.GET);
          request.addHeader("Host", "na.store.leagueoflegends.com");
          break;
        case 'EUW1':
          request = new TCPHttpRequest(new URL("https://euw.store.leagueoflegends.com/storefront/v3/history/purchase?language=en_US"), TCPHttpMethod.GET);
          request.addHeader("Host", "euw.store.leagueoflegends.com");
          break;
        case 'EUN1':
          request = new TCPHttpRequest(new URL("https://eun.store.leagueoflegends.com/storefront/v3/history/purchase?language=en_US"), TCPHttpMethod.GET);
          request.addHeader("Host", "eun.store.leagueoflegends.com");
          break;
        default:
          throw new Error("Region Not Found");
      }
      request.addHeader("Accept", "application/json, text/json, text/x-json, text/javascript, application/xml, text/xml");
      request.addHeader("Accept-Encoding", "gzip, deflate, br");
      request.addHeader("User-Agent", "jhttp/1.0");
      request.addHeader("Pragma", "no-cache");
      request.addHeader("Authorization", "Bearer " + account.token);
      return request;
    }


    static getNamesLolGetRequest(name){
      const request = new TCPHttpRequest(new URL("https://api.nameslol.com/na/summoner/" + name), TCPHttpMethod.GET);
      request.addHeader("host", "api.nameslol.com")
      request.addHeader("User-Agent", "jhttp/1.0");
      request.addHeader("Accept", "application/json, text/json, text/x-json, text/javascript, application/xml, text/xml");
      return request;
    }

    static getCheckNameGetRequest(snipe, account)
    {
        const request = new TCPHttpRequest(new URL("https://na.store.leagueoflegends.com/storefront/v3/summonerNameChange/verify/" + snipe.snipeName), TCPHttpMethod.GET);
        request.addHeader("Authorization", "Bearer " + account.token);
        request.addHeader("User-Agent", "RiotClient/");
        return request;
    }

    static getChangeNamePostRequest(snipe, account)
    {
        const request = new TCPHttpRequest(new URL("https://na.store.leagueoflegends.com/storefront/v3/summonerNameChange/purchase?language=en_US"), TCPHttpMethod.POST);
        const item = {
          inventoryType: "SUMMONER_CUSTOMIZATION",
          ipCost: 13900,
          itemId: 1,
          quantity: 1
        };
        // Create the main object
        const obj = {
          accountId: account.accountID,
          summonerName: snipe.snipeName,
          items: [item],  // Creates an array and add the item object to it
          toString() {
            return JSON.stringify(this);
          }
        };
        request.addContent(obj.toString(), "application/json");
        request.addHeader("host", "na.store.leagueoflegends.com");
        request.addHeader("User-Agent", "jhttp/1.0");
        request.addHeader("Authorization", "Bearer " + account.token);
        return request;
    }

    static getLoginPageGetRequest(){
      const request = new TCPHttpRequest(new URL("https://login.leagueoflegends.com/"), TCPHttpMethod.GET);
      request.addHeader("Host", "login.leagueoflegends.com");
      request.addHeader("Connection", "Keep-Alive");
      request.addHeader("User-Agent", "jhttp/1.0");
      request.addHeader("Accept", "application/json, text/json, text/x-json, text/javascript, application/xml, text/xml");
      return request;
    }

    static getLoginRedirectGetRequest(uri){
      const request = new TCPHttpRequest(new URL(uri), TCPHttpMethod.GET);
      request.addHeader("Host", "auth.riotgames.com");
      request.addHeader("User-Agent", "jhttp/1.0");
      request.addHeader("Connection", "Keep-Alive");
      request.addHeader("Accept", "application/json, text/json, text/x-json, text/javascript, application/xml, text/xml");
      return request;
    }

    static getAuthRedirectGetRequest(uri){
      const request = new TCPHttpRequest(new URL(uri), TCPHttpMethod.GET);
      request.addHeader("Host", "login.leagueoflegends.com");
      request.addHeader("User-Agent", "jhttp/1.0");
      request.addHeader("Connection", "Keep-Alive");
      request.addHeader("Accept", "application/json, text/json, text/x-json, text/javascript, application/xml, text/xml");
      return request;
    }
  
    static generate_uuidv4() {
        return 'xxxxxxxxxxxx4xxxyxxxxx'.replace(/[xy]/g,
        function(c) {
           var uuid = Math.random() * 16 | 0, v = c == 'x' ? uuid : (uuid & 0x3 | 0x8);
           return uuid.toString(16);
        });
     }

  }
  module.exports = HttpRequests;