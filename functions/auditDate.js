module.exports = () => {

    let getDate = new Date();
    return `${getDate.toLocaleString("fr-FR", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC", timeZoneName: "short", })}`;
    
};