const colors = require("colors");
const getDateTime = require("./getDateTime");

/**
 * ! Handle event state logging
 */

module.exports = (command, result = "") => {
    if (result.startsWith("SUCCESS")) result = `[${colors.green(result)}]`;
    else if (result.startsWith("ERROR")) result = `[${colors.red(result)}]`;
    else if (result.startsWith("WARN")) result = `[${colors.yellow(result)}]`;
    return console.log(colors.white(`${getDateTime()} >>> A user executed the ${colors.magenta(command)} command. ${result}`));
}