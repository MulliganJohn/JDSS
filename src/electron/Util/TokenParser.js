class TokenParser{

    static _getAccessToken(uri){
        const accessTokenIndex = uri.indexOf("access_token=");
        const endIndex = uri.indexOf("&", accessTokenIndex);
        const accessToken = uri.substring(accessTokenIndex + 13, endIndex);
        return accessToken;
    }

    static _getIdToken(uri){
        const idTokenIndex = uri.indexOf("id_token=");
        const endIndex = uri.indexOf('&', idTokenIndex);
        const idToken = uri.substring(idTokenIndex + 9, endIndex);
        return idToken;
    }

    static setAccountInfoFromUri(uri, account){
        try{
            account.token = this._getAccessToken(uri);
            const accountInfoString = this._getIdToken(uri).split('.')[1];
            const remainder = accountInfoString.length % 4;
            const paddingLength = remainder == 0 ? 0 : 4 - remainder;
            const paddedString = accountInfoString.padEnd(accountInfoString.length + paddingLength, '=');
            const base64Decoded = Buffer.from(paddedString, 'base64').toString('utf8');
            const jsonObject = JSON.parse(base64Decoded);
            account.sub = jsonObject.sub?.toString();
            account.region = jsonObject.lol[0]?.pid?.toString();
        }
        catch (error) {
            throw new Error("Error parsing account URI: " + error);
        }
    }
}
module.exports = TokenParser