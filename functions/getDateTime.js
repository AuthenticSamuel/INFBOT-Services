/**
 * ! Get datetime for console
 */

module.exports = () => {
    const getDate = new Date();
    return `${getDate.toLocaleString()}`;
}