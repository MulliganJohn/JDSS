const { TCPHttpClient } = require("tcp-http-client");
const HttpRequests = require('../Util/HttpRequests.js');
const zlib = require('zlib');
class Store {

    static async configure(account){
        const client = new TCPHttpClient();
        try{
            const response = await client.sendRequest(HttpRequests.getStoreGetRequest(account));
            const responseContentJson = JSON.parse(this.decodeGzip(response.content));
            const playerToken = responseContentJson.player;
            if (!playerToken){
                console.log("player token error");
                throw new Error("No player token found in store configuration.");
            }
            account.accountID = playerToken?.accountId;
            account.ip = playerToken?.ip;
            account.rp = playerToken?.rp;
            account.summonerLevel = playerToken?.summonerLevel;
            client.dispose();
            return true;
        }
        catch (error){
            client.dispose();
            throw new Error("Error configuring account through store: " + error);
        }
    }

    static decodeGzip(data) {
        try {
          const decodedData = zlib.gunzipSync(data);
          return decodedData;
        } catch (error) {
          console.error('Error decoding gzip data:', error);
          return null;
        }
      }
}
module.exports = Store;