function generateUniqueText() {
    return Math.floor(1000 + Math.random() * 9000);
}

function isValidMobileNumber(number) {
    const regex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
    return regex.test(number);
}

function isValidGmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
}


export { generateUniqueText, isValidGmail, isValidMobileNumber };