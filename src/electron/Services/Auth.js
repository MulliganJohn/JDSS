const HttpRequests = require('../Util/HttpRequests.js');
const { TCPHttpClient } = require("tcp-http-client");
const TokenParser = require('../Util/TokenParser.js');
const Store = require('../Services/Store.js');
class Auth{
    

  static async login(account){
    try{
      const detailPromise = this.getAccountDetails(account);
      const namePromise = this.getSummonerName(account);
      await Promise.all([detailPromise, namePromise]);
    }
    catch (error) {
      throw new Error("Error logging in: " + error);
    }
  }

  static async getAccountDetails(account){
    const client = new TCPHttpClient(/* {proxy: {host: "127.0.0.1", port: 8888}} */);
    client.cookieContainerEnabled = true;
    try{
      await this.sendPost(client);
      await this.sendPut(client, account);
      await Store.configure(account);
      client.dispose();
    }
    catch(error){
      client.dispose();
      throw new Error(error);
    }
  }

  static async getSummonerName(account){
    const client = new TCPHttpClient();
    client.cookieContainerEnabled = true;
    try{
      const redirectURI = await this.getLoginRedirectUri(client);
      await this.sendLoginRedirectRequest(client, redirectURI);
      let response = await client.sendRequest(HttpRequests.getBearerPutRequest(account));
      const responseContentJson = JSON.parse(response.content.toString());
      const uri = responseContentJson.response?.parameters?.uri;
      if (!uri) {
          throw new Error("URI not found in the JSON.");
      }
      response = await client.sendRequest(HttpRequests.getAuthRedirectGetRequest(uri));
      const summonerName = this.parseSummonerName(response);
      account.game_name = summonerName;
      client.dispose();
    }
    catch (error){
      client.dispose();
      console.error("Error getting summoner name: " + error);
      account.game_name = undefined;
      return;
    }
  }

  static async getLoginRedirectUri(client){
    try {
      const response = await client.sendRequest(HttpRequests.getLoginPageGetRequest());
      if (response.statusCode === 302){
        const authURI = response.getHeaderValues("Location")[0].value;
        return authURI;
      }
      else{
        throw new Error("Error getting login redirect uri");
      }
    }
    catch (error) {
      throw new Error(error);
    }
  }

  static async sendLoginRedirectRequest(client, redirectURI){
    try {
      const response = await client.sendRequest(HttpRequests.getLoginRedirectGetRequest(redirectURI));
      if (response.statusCode === 303){
        return true;
      }
      else{
        throw new Error("Invalid response");
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  static async sendPost(client) {
    try{
      let response;
      for (let i = 0; i < 2; i++) {
        response = await client.sendRequest(HttpRequests.getCookiePostRequest());
        if (response.statusCode === 200) {
          return;
        }
      }
      throw new Error("Cookie post didn't give 200");
    }
    catch (error){
      throw new Error(error);
    }
  }

  static async sendPut(client, account){
    try{
      let response = await client.sendRequest(HttpRequests.getBearerPutRequest(account));
      const responseContentJson = JSON.parse(response.content);
      const uri = responseContentJson.response?.parameters?.uri;
      if (!uri) {
        throw new Error("URI not found in the JSON.");
      }
      TokenParser.setAccountInfoFromUri(uri, account);
      return;
    }
    catch (error){
      throw new Error(error);
    }
  }

  static getCookieString(setCookies){
    let sb = [];
    setCookies.forEach(header => {
      sb.push(header.value.split(";")[0] + "; ");
    });
    return sb.join("");
  }

  static parseSummonerName(response){
      const headers = response.getHeaderValues("set-cookie");
      let accountRegion = null;
      for (const header of headers){
        if (header.value && header.value.includes("PVPNET_REGION")){
          const match = /PVPNET_REGION=([^;]+)/.exec(header.value);
          const extractedValue = match ? match[1] : null;
          accountRegion = extractedValue.toUpperCase();
        }
      }
      for (const header of headers) {
        if (header.value && header.value.includes(`PVPNET_ACCT_${accountRegion}`)) {
          const match = new RegExp(`PVPNET_ACCT_${accountRegion}=([^;]+)`).exec(header.value);
          const extractedValue = match ? match[1] : null;
          return decodeURIComponent(extractedValue).replace(/\+/g, ' ');
        }
      }
      throw new Error("Couldnt find summoner name!");
  }
}
module.exports = Auth;