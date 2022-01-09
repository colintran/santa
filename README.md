# Mini website to help generate the recipients of Xmas gifts
 - Each participant has name (to be unique, without any space in a name)
 - Then click on ```Generate```, the site will generate a random set of recipients between participants, and show a result on ```Recipient``` column
# Usage
 - Download latest `nodejs` at [website](https://nodejs.org/en/download/)
 - Clone project to any folder by `git clone`, change directory to `santa` folder
 - Inside ```santa``` folder, run
    - `npm install` to install dependency packages
    - `node app.js` to start the mini webserver
 - You can now access to URL: `localhost:3000`
 - The page will list participants of the game
 - Click on `Generate` button, a mapping of a santa and his/her gift recipient is generated and displayed on ```Recipient``` column
 - Have fun!
 ## Update/Insert/Modify participants
 - You can modify/insert/update participants via Web GUI:
   - Add Person by ```Add Person``` button
   - Rename a person by simply clicking on the participant name, a page will enable you to change name. If new name duplicates with other player, it will not be taken
   - Add person(s) that a santa can't offer the gift to by ```Edit``` button on corresponding cell

# Open for improvement
 - More attractive UI
 - Up to your imagination!
 	
