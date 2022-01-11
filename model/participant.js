const fs = require('fs');
const path = require('path');
const rootPath = require('../util/rootPath');
const fsPromises = require('fs/promises');

const fileDir = path.join(rootPath, 'data');
const inputFile = path.join(fileDir,'participants.json');
module.exports = class Participant {
    constructor(name){
        this.name = name;
    }
    static getParticipants() {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(inputFile)){
                resolve([]);
                //create file
                if (!fs.existsSync(fileDir)){
                    fs.mkdirSync(fileDir, {recursive:true});
                }
                fs.appendFileSync(inputFile, "[]");
                return;
            }
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
            persistedList.push({name: p.name, blocked:p.blocked});
        }
        return fsPromises.writeFile(inputFile, JSON.stringify(persistedList))
    }
}