const dgram = require('dgram');
class PrivateTimeUtil{
    constructor(netTimeMillis, sysTime){
        this.netTimeMillis = netTimeMillis;
        this.sysTime = sysTime;
        setTimeout(() => this.updateTimeDelay(), 10 * 60 * 1000);
    }

    static getNetTime(){
        return new Promise(async (resolve, reject) => {
            const server = "time.nist.gov";
            const port = 123;
            const epochOffset = 2208988800 * 1000;
            var client = dgram.createSocket("udp4");
            let ntpData = Buffer.alloc(48);
            // RFC 2030 -> LI = 0 (no warning, 2 bits), VN = 3 (IPv4 only, 3 bits), Mode = 3 (Client Mode, 3 bits) -> 1 byte
            // -> rtol(LI, 6) ^ rotl(VN, 3) ^ rotl(Mode, 0)
            // -> = 0x00 ^ 0x18 ^ 0x03
            ntpData[0] = 0x1B;
    
            var timeout = setTimeout(() => {
                client.close();
                reject("NTP Timed Out");
            }, 5000);
    
            client.on('error', (err) => {
                clearTimeout(timeout);
                reject("NTP Client Error: " + err);
            });
    
            let start = performance.now();
            client.send(ntpData, 0, ntpData.length, port, server, () =>{
                start = performance.now();
            });
    
            client.once('message', (msg) => {
                const networkOffset = performance.now() - start;
                // Offset to get to the "Transmit Timestamp" field (time at which the reply
                // departed the server for the client, in 64-bit timestamp format."
                var offsetTransmitTime = 40,
                    intpart = 0,
                    fractpart = 0;
    
                // Get the seconds part
                for (var i = 0; i <= 3; i++) {
                    intpart = 256 * intpart + msg[offsetTransmitTime + i];
                }
    
                // Get the seconds fraction
                for (i = 4; i <= 7; i++) {
                    fractpart = 256 * fractpart + msg[offsetTransmitTime + i];
                }
    
                var milliseconds = (intpart * 1000 + (fractpart * 1000) / 0x100000000) - epochOffset;
    
                // **UTC** time
                resolve(milliseconds + (networkOffset / 2));
                client.close();
                clearTimeout(timeout);
            });
        });
    }
    getUTCDate(){
        const millisOffset = performance.now() - this.sysTime; 
        return new Date(this.netTimeMillis + millisOffset);
    }
    
    getMillis(){
        const millisOffset = performance.now() - this.sysTime; 
        return this.netTimeMillis + millisOffset;
    }

    async updateTimeDelay(){
        const timeOffset = (performance.now() - this.sysTime) - (10 * 60 * 1000);
        this.netTimeMillis = await PrivateTimeUtil.getNetTime();
        this.sysTime = performance.now();
        setTimeout(() => this.updateTimeDelay(), (10 * 60 * 1000) - timeOffset);
    }
}
class TimeUtil{
    static createTime(){
        return new Promise(async (resolve, reject) => {
            try{
                if (!TimeUtil.instance) {
                    const ntpTime = await PrivateTimeUtil.getNetTime();
                    const sysTime = performance.now();
                    TimeUtil.instance = new PrivateTimeUtil(ntpTime, sysTime);
                    resolve(TimeUtil.instance);
                    console.log("Created a new TimeUtil");
                }
                else{resolve(TimeUtil.instance);}
            }
            catch (error){
                reject("Error creating TimeUtil");
            }
        });
    }
}
module.exports = TimeUtil