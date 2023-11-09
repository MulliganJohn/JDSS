const { TCPHttpClient } = require("tcp-http-client");
const HttpRequests = require('../Util/HttpRequests.js');
class Sniper{
    constructor(){

    }

    static async getAvailabilityMillis(name){
        const client = new TCPHttpClient();
        return new Promise(async (resolve, reject) => {
            try{
                let response = await client.sendRequest(HttpRequests.getNamesLolGetRequest(name));
                if (response.statusCode === 200){
                    const responseContentJson = JSON.parse(response.content.toString());
                    const availabilityMillis = responseContentJson.availabilityDate;
                    if (!availabilityMillis) {
                        throw new Error("Name Not found!");
                    }
                    resolve(availabilityMillis);
                    client.dispose();
                }
                else{
                    throw new Error("Didnt get 200 response");
                }
            }
            catch (error){
                reject(new Error("Error getting availability date! " + error));
                client.dispose();
            }
        })
    }

    static snipeName(snipeTask){
        return new Promise(async (resolve, reject) => {
            const [accounts, clients] = this.getAccountsAndClients(snipeTask.accountManager.accounts)
            await this.createConnections(clients);
            let requests = [];
            const startTime = snipeTask.times.timeoffset.start;
            const endTime = snipeTask.times.timeoffset.stop;

            const requestTimeDelay = Math.max(((endTime - startTime) / clients.length), 3);
        
            while (this.getRemainingSnipeTime(snipeTask, startTime) > 0)
            {
                
            }
            let clientIndex = 0;
            for (let i = 0; i < 5; i++){
                for (const account of accounts){
                    //const nameCheckReq = HttpRequests.getCheckNameGetRequest(snipeTask, account);
                    const nameChangeReq = HttpRequests.getChangeNamePostRequest(snipeTask, account);
                    requests.push(clients[clientIndex].sendRequest(nameChangeReq));
                    clientIndex++;
                    const nextRequestTime = (clientIndex * requestTimeDelay);
                    const sleepTime = Math.max(nextRequestTime + this.getRemainingSnipeTime(snipeTask, startTime), 0);
                    await this.sleep(sleepTime);
                }
            }



            const responses = await Promise.all(requests);

            for (const response of responses){
                if (response.content.toString().includes("transactions"))
                {
                    resolve(true);
                    for (const client of clients){
                        client.dispose();
                    }
                    return;
                }
            }
            resolve(false);
            for (const client of clients){
                client.dispose();
            }
        });
    }

    static getAccountsAndClients(accountMap){
        let accounts = [];
        let clients = [];
        for (const [accountID, account] of accountMap) {
            for (let i = 0; i < 5; i++){
                clients.push(new TCPHttpClient(/* {proxy: {host: "127.0.0.1", port: 8888}} */));
            }
            accounts.push(account);
        }
        return [accounts, clients];
    }

    static getRemainingSnipeTime(snipeTask, startTime){
        return snipeTask.availabilityMillis + startTime - snipeTask.TimeUtil.getMillis();
    }

    static async createConnections(clients){
        let connections = [];
        for (const client of clients){
            try{
                const connection = client.connect(new URL("https://na.store.leagueoflegends.com/storefront/v3/summonerNameChange/purchase?language=en_US"));
                connection.catch(error => {
                    console.error(error);
                });
                connections.push(connection);
            }
            catch (error){
                console.error(error);
            }
        }
        await Promise.all(connections);
        return;
    }

    static formatTimeWithMilliseconds(date) {
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
      
        return `${hours}:${minutes}:${seconds}:${milliseconds}`;
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
module.exports = Sniper