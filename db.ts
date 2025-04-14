// import * as dotenv from 'dotenv'
// dotenv.config()

const debug = true

export class PlayersDB {
    startTime: Map<string, number>
    totalTime: Map<string, number>

    constructor() {
        this.startTime = new Map<string, number>()
        this.totalTime = new Map<string, number>()
    }

    updatePlayer(id: string, active: boolean, time: number = Math.round(Date.now() * 0.001)) {

        if (active) {
            if (!this.startTime.has(id)) {
                this.startTime.set(id, time);
                debug && console.log(`${id}: started`);
            }
        } else {
            if (this.startTime.has(id)) {
                const startTime = this.startTime.get(id)!;
                const elapsedTime = time - startTime;
                const updatedTime = this.getTime(id) + elapsedTime;
                this.totalTime.set(id, updatedTime);
                this.startTime.delete(id);
                debug && console.log(`${id}: stopped, elapsed: ${elapsedTime}, total: ${updatedTime}`);
            }
        }
    }

    getTime(id: string): number {
        return this.totalTime.get(id) || 0;
    }
}