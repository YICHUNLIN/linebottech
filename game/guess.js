function GuessGame(startWord, min, max, context){
    this.startWord = startWord;
    this.context = context
    this.min = min;
    this.max = max;
    this.data = {}
}

GuessGame.prototype.checkStartWord = function(word) {
    if (this.startWord == word) return true;
    return false;
}

GuessGame.prototype.whenStartGame = function(userName, targetId){
    this.data[targetId] = Math.floor(Math.random()*this.max) + this.min;
    const echo = { type: 'text', text: `歡迎 ${userName} 開起一個遊戲，範圍${this.min}~~${this.max}` };
    return echo;
}

GuessGame.prototype.whenPlaying = function(content, userName, targetId) {
    const num = parseInt(content);
    let echo = {};
    if (isNaN(num)) {
        echo = { type: 'text', text: `請輸入數字，麥亂!` };
    } else {
        const text = num > this.data[targetId] ? '再小一點' : (num == this.data[targetId] ? `恭喜 ${userName} 猜對了` : '再大一點')
        echo = { type: 'text', text: text };
        if (num == this.data[targetId]){
            delete this.data[targetId];
            this.context.finish(targetId)
        }
    }
    return echo
}

module.exports = GuessGame;