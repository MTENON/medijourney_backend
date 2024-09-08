function checkBody(obj, array) {

    let pattern = /^\s*$/;

    for (let i = 0; i < array.length; i++) {
        // console.log(obj[array[i]], !pattern.test(obj[array[i]]));
        if (obj[array[i]] != null && obj[array[i]] != undefined && !pattern.test(obj[array[i]])) {
        } else {
            return false
        }
    }
    return true
};

function capitalize(string) {

    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

};

module.exports = { checkBody, capitalize };