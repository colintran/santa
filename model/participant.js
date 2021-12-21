const fs = require('fs');
const path = require('path');
const rootPath = require('../util/rootPath');
const fsPromises = require('fs/promises');

const inputFile = path.join(rootPath, 'conf','participants.json');
module.exports = class Participant {
    constructor(name){
        this.name = name;
    }
    static getParticipants() {
        return new Promise((resolve, reject) => {
            fs.readFile(inputFile, (err, fileContent) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(fileContent));
                }
            });
        });
    }
    static persist(participants){
        // keep only name of participants
        let persistedList = [];
        for (const p of participants){
            persistedList.push({name: p.name});
        }
        return fsPromises.writeFile(inputFile, JSON.stringify(persistedList))
    }
}