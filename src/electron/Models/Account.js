class Account {
    constructor(username, password) {
      this.username = username;
      this.password = password;
      this.token = null;
      this.game_name = null;
      this.region = null;
      this.accountID = 0.0;
      this.sub = null;
      this.rp = 0;
      this.ip = 0;
      this.summonerLevel = 0;
    }
  }
  module.exports = Account;