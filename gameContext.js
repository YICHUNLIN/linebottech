const GuessGame = require('./game/guess');
function GameContext(lineClient){
    this.line = lineClient;
    this.games = {
        GuessGame: new GuessGame('開始猜數字', 1, 100, this)
    }
    // group: ...
    this.gameStatus = {}
}

// 當一個遊戲完成後，刪除遊戲
GameContext.prototype.finish = function(mapId){
    delete this.gameStatus[mapId];
}

GameContext.prototype.handleEvent = function(event){
    if (event.type !== 'message' || event.message.type !== 'text') {
      // ignore non-text-message event
      return Promise.resolve(null);
    }
    var t_this = this;
    var mapId = event.source.groupId || event.source.userId
    var userId = event.source.userId;
    if (event.message.text == "我不玩了"){
        var echo = {};
        if (this.gameStatus.hasOwnProperty(mapId)) {
            this.finish(mapId);
            echo = { type: 'text', text: `好喔 下次再來` };
        } else {
            echo = { type: 'text', text: `你是在不玩什麼？` };
        }
        return  this.line.replyMessage(event.replyToken, echo);
    } else if (this.gameStatus.hasOwnProperty(mapId)){
        this.line.getProfile(userId)
            .then((profile) => {
                const echo = t_this.gameStatus[mapId].whenPlaying(event.message.text, profile.displayName, mapId)
                return this.line.replyMessage(event.replyToken, echo);
            })
            .catch((err) => {
                console.log(err)
            });
    } else {
        if (this.games.GuessGame.checkStartWord(event.message.text)){
            this.gameStatus[mapId] = this.games.GuessGame
            this.line.getProfile(userId)
                .then((profile) => {
                    const echo = t_this.gameStatus[mapId].whenStartGame(profile.displayName, mapId);
                    return this.line.replyMessage(event.replyToken, echo);
                })
                .catch((err) => { console.log(err)});
        } else {
          const echo = { type: 'text', text: `沒有這種遊戲喔` };
          return  this.line.replyMessage(event.replyToken, echo);
        }
    }
}




module.exports = GameContext