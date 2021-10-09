module.exports = function (date) {

    let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short"
    };
    
    return date.toLocaleDateString(undefined, options);

}