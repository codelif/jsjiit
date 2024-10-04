
function generateDateSeq(date = null) {
    if (date === null) {
        date = new Date();
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JS
    const year = String(date.getFullYear()).slice(2);
    const weekday = String(date.getDay());

    return day[0] + month[0] + year[0] + weekday + day[1] + month[1] + year[1];
}

function getRandomCharSeq(n) {
    const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    
    for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset[randomIndex];
    }

    return result;
}

