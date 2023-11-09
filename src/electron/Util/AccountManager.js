class AccountManager {

    constructor(){
        this.accounts = new Map();
    }

    static convertAccountToDTO(account){
        const accountDTO = {
            game_name: account.game_name,
            region: account.region,
            accountID: account.accountID,
            sub: account.sub,
            rp: account.rp,
            ip: account.ip,
            summonerLevel: account.summonerLevel
        };
        return accountDTO;
    }

    doesUsernameExist(username){
        for (const account of this.accounts.values())
        {
            if (account.username === username){
                return true;
            }
        }
        return false;
    }

    addAccount(account){
        this.accounts.set(account.accountID, account);
    }

    get(accountID){
        return this.accounts.get(accountID);
    }

    has(accountID){
        return this.accounts.has(accountID);
    }

    removeAccount(accountID){
        if (this.accounts.has(accountID)){
            this.accounts.delete(accountID);
            return true;
        }
        else{
            console.log("id not found in index: " + accountID);
            console.log(accounts);
            return false;
        }
    }
}
module.exports = AccountManager