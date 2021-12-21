const express = require('express');
const app = express();
const router = express.Router();
const random = require('random');
const Participant = require('./model/participant');
const path = require('path');
const rootPath = require('./util/rootPath');
app.set('view engine','ejs');
const viewsPath = path.join(rootPath, 'views');
app.set('views',viewsPath);
// add static folder
app.use(express.static(path.join(rootPath, 'public')));

let generateOnePermutation = (participants, random) => {
    const uniqueIdx = new Set(Array.from(Array(participants.length).keys()));
    let res = [];
    for (let i = 0; i< participants.length; i++){
        let currentSize = uniqueIdx.size;
        const randIdx = random.int((min = 0), (max=currentSize-1));
        
        // Pick 1 value randomly and remove it from set
        const aRangeIt = uniqueIdx[Symbol.iterator]();
        let aIter = aRangeIt.next();//first item
        for (let j=0; j < randIdx; j++){
           aIter = aRangeIt.next();
        }
        res.push(aIter.value);
        uniqueIdx.delete(aIter.value);
    }
    return res;
}

// [0,1,2,3] => [0:3,1:1,2:2,3:0] e.g.
let getOneMappingSanta = (participants, random) => {
    let res = new Map();
    const oneRandomSelection = generateOnePermutation(participants, random);
    for (let i=0; i<participants.length; ++i){
        res.set(i, oneRandomSelection[i]);
    }
    return res;
};

let checkNoOneGivePresentToHimSelf = oneMappingSanta => {
    for (const [key, val] of oneMappingSanta){
        if (key === val){
            // console.log("Invalid, person %d give present to himself",key);
            return false;
        }
    }
    return true;
}

let checkRules = (rules, oneMappingSanta) => {
    let isValid = true;
    rules.forEach(rule => {
        isValid = isValid & rule(oneMappingSanta);
    });
    return isValid;
}

let utestCheckNoOneGivePresentToHimSelf = () => {
    const oneInvalidSanta = new Map();
    oneInvalidSanta.set(0,2);
    oneInvalidSanta.set(1,1);
    oneInvalidSanta.set(2,0);
    console.log("utestCheckNoOneGivePresentToHimSelf Invalid case: ",checkNoOneGivePresentToHimSelf(oneInvalidSanta)?"KO":"OK");

    const oneValidSanta = new Map();
    oneValidSanta.set(0,1);
    oneValidSanta.set(1,2);
    oneValidSanta.set(2,0);
    console.log("utestCheckNoOneGivePresentToHimSelf Valid case: ",checkNoOneGivePresentToHimSelf(oneValidSanta)?"OK":"KO");
}

let utestCheckRules = () => {
    let rules = [checkNoOneGivePresentToHimSelf];
    let oneInvalidSanta = new Map();
    oneInvalidSanta.set(0,2);
    oneInvalidSanta.set(1,1);
    oneInvalidSanta.set(2,0);

    console.log("utestCheckRules Invalid case: ", checkRules(rules, oneInvalidSanta)?"KO":"OK");
}

utestCheckNoOneGivePresentToHimSelf();
utestCheckRules();

let getOneValidMappingSanta = (participantIndexes, random) => {
    const rules = [checkNoOneGivePresentToHimSelf];
    const maxTurn = 100;
    for (let i=0; i<maxTurn; ++i){
        const oneMappingSanta = getOneMappingSanta(participantIndexes, random);
        if (checkRules(rules, oneMappingSanta)){
            return oneMappingSanta;
        }
    }
    return undefined;
}

let updateRecipients = (participants, oneValidMappingSanta) => {
    for (const [key, val] of oneValidMappingSanta){
        participants[key].recipient = participants[val].name;
    }
}

let playSecretSanta = (participants, random) => {
    const oneValidMappingSanta = getOneValidMappingSanta(participants, random);
    if (oneValidMappingSanta === undefined){
        console.log("Cannot generate a valid Santa mapping!, please retry");
        return;
    }
    console.log("One secret santa mapping: %s",oneValidMappingSanta);
    updateRecipients(participants, oneValidMappingSanta);
}

let participants = [];
Participant.getParticipants().then(people => {
    participants = [...people];
}).catch(err => {
    console.log(err);
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

router.get('/',(req,res,next) => {
    res.render('index', {participants: participants});
})

router.post('/play', (req,res,next) => {
    playSecretSanta(participants, random);
    console.log("Inside /play mdw");
    res.redirect('/');
})

router.get('/addPerson', (req,res,next) =>{
    res.render('person');
})

// Assumption: all persons have unique names
router.post('/addPerson', (req,res,next) =>{
    const personName = req.body.name;
    console.log('new person added: %s',personName);
    // ensure unicity of name
    if (participants.findIndex(p => {
        return p.name === personName;
    }) === -1) {
        participants.push({
            name: personName
        });
        Participant.persist(participants);
    } else {
        console.log('Participant: %s exists, please add another person.', personName);
    }
    res.redirect('/');
})

router.get('/edit-person/:personName', (req,res,next) =>{
    const personName = req.params.personName;
    res.render('edit-person', {person:{name: personName}});
})

router.post('/edit-person/:personName', (req,res,next) =>{
    const oldName = req.params.personName;
    const newName = req.body.name;
    if (participants.findIndex(p  => {
        return p.name === newName;
    }) === -1){
        for (let p of participants){
            if (p.name === oldName){
                p.name = newName;
            }
            if (p.recipient === oldName){
                p.recipient = newName;
            }
        }
        Participant.persist(participants);
        console.log('participants: %s',JSON.stringify(participants));
    } else {
        console.log('New name is collided with other name, please change.');
    }
    res.redirect('/');
})

router.get('/delete-person/:personName', (req,res,next) => {
    const personName = req.params.personName;
    console.log("person name: %s", personName);
    participants = participants.filter(p => {
        return p.name !== personName;
    })
    Participant.persist(participants);
    // for consistency, reset recipient list if already assigned
    for (let p of participants) {
        p.recipient = undefined;
    }
    res.redirect('/');
})

app.use('/',router);
app.listen(3000);