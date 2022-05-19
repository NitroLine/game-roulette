function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}


export {getRandomInt};