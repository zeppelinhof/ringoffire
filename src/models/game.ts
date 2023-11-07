export class Game {
    public id: string;
    public players: string[] = [];
    public stack: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;
    public currentGameNumber: number;


    constructor(gameNumber) {
        console.log('Game Constructor aus game.ts');
        for (let i = 0; i < 10; i++) {
            this.stack.push('blue_' + i + '_large.png');
            this.stack.push('green_' + i + '_large.png');
            this.stack.push('red_' + i + '_large.png');
            this.stack.push('yellow_' + i + '_large.png');
        }
        shuffle(this.stack);
        this.currentGameNumber = gameNumber;
    }

    toJson() {
        return {
            players: this.players,
            stack: this.stack,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer
        };
    }
}

export function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
};