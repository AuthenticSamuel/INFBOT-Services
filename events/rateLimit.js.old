const colors = require("colors");
const capitalizeFirstLetter = require("../functions/capitalizeFirstLetter");
const getDateTime = require("../functions/getDateTime");

module.exports = (rateLimitData) => {

    console.log(colors.red.italic(`${getDateTime()} >>> Rate limit detected:`))
    for (const [key, value] of Object.entries(rateLimitData)) {
        console.log(colors.red.italic(`${getDateTime()} >>>`) + colors.white.italic(`   ${capitalizeFirstLetter(key)}: ${value}`));
    };

};