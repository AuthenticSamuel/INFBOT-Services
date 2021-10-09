module.exports = function(value) {

    let valueString = value + "";
    if (valueString.length < 2) return "0" + valueString;
    else return valueString;

}