const colors = require("colors");
const getDateTime = require("./getDateTime");

/**
 * ! Handle voice state logging
 */

module.exports = (state) => {
    const getState = (inputState) => {
        switch (inputState) {
            case "creating": return "A user is creating a new voice channel...";
            case "created": return "Voice channel created successfully.";
            case "deleting": return "Deleting an empty voice channel...";
            case "deleted": return "Voice channel deleted successfully.";
            default: return "Unknown channel action.";
        }
    }
    return console.log(colors.yellow(`${getDateTime()} >>> ${getState(state)}`));
}