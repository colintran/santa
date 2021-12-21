# Mini website to help generate secretly the recipients of Xmas gifts
 - Each participant has name and email (to be unique)
 - Then click on ```Generate```, the site will generate a random set of recipients between participants
 - Each participant receives an email notifying his/her gift recipient. Only the server knows the full selection :)
# Usage
 - Download latest `nodejs` at [website](https://nodejs.org/en/download/)
 - Clone project to any folder by `git clone`, change directory to `santa` folder
 - Inside santa folder, run
    - `npm install` to install dependency packages
    - `node app.js` to start the mini webserver
 - You can now access to URL: `localhost:3000`
 - The page will list participants of the game
 - Click on `play` button, a mapping of a santa and his/her gift recipient is generated, then an email is sent to every santa to announce their recipient
 ## Update/Insert/Modify participants
 - You can modify/insert/update participants by adding new entries/modifying the file `conf/participants.json`
 - Run `node app.js` again to apply new configuration
 - Have fun!

# Open for improvement
 - Now there is only one rule: noone gives present to himself => the code has an extensible method to add more customized rules (e.g. if x gives y, y is notallowed to give x :) )
 - UI to insert/update participants
 	
