const colors = require("colors");
const getDateTime = require("./getDateTime");

module.exports = (state) => {
    
    let result = "";
    switch (state) {
        case "creating": result = "A user is creating a new voice channel..."; break;
        case "created": result = "Voice channel created successfully."; break;
        case "deleting": result = "Deleting an empty voice channel..."; break;
        case "deleted": result = "Voice channel deleted successfully."; break;
    };
    return console.log(colors.yellow(`${getDateTime()} >>> ${result}`));

};