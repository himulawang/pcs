var CandyWar = function() {
    this.timer = 30;
    this.candyGenerateRate = [
        25,
        30,
        20,
        50
    ];
    this.candyScore = [
        1,
        2,
        3,
        4
    ];
    this.candyImageUrl = [
        'red.png',
        'green.png',
        'yellow.png',
        'white.png'
    ];
    this.candyImage = [];
    
};

CandyWar.prototype.startGame = function() {
};

CandyWar.prototype.generateCandy = function() {

};

var Util = {};
Util.random = function random(start, end) {
    var n = end - start;
    return start + Math.floor(Math.random() * n);
};
Util.getElementByProbability = function getElementByProbability(probabilityList) {
    // verify probabilityList is hash
    if (!this.isHash(probabilityList)) return false;

    // delete probability = 0 element & sum probabilities
    var all = 0;
    for (var i in probabilityList) {
        if (probabilityList[i] == 0) {
            delete probabilityList[i];
        } else {
            all += probabilityList[i];
        }
    }

    // no element in list
    if (all === 0) return false;

    // get id by probability
    var seed = this.random(1, all);
    var sum = 0;
    for (var i in probabilityList) {
        sum += probabilityList[i];
        if (seed <= sum) {
            return i;
        }
    }

    return false;
};
Util.preLoadImage = function preLoadImage(url) {
    var img = new Image();   
    /*
    img.onload = function () {   
    img.onload = null;   
        callback(img);   
    }   
    */
    img.src = url;   
    return img;
};
