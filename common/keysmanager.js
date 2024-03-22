const path = require('path');
const fs = require('fs');

class KeysManager {
    constructor() {
        this.keyPath = path.join(__dirname, 'oauth2.keys.json');
    }
    getKeys() {
        if (fs.existsSync(this.keyPath)) {
            const keyFile = require(this.keyPath);
            let keys = keyFile.installed || keyFile.web;
            return keys;
        } else {
            throw new Error(`${this.keyPath} does not exist!`);
        }
    }
}

module.exports = new KeysManager();