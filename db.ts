// import * as dotenv from 'dotenv'
// dotenv.config()
import { readFileSync, writeFileSync } from 'fs'


const debug = true

export class PlayersDB {
    startTime: Map<string, number>
    totalTime: Map<string, number>

    constructor() {
        this.startTime = new Map<string, number>()
        this.totalTime = new Map<string, number>()

        this.saveRestore()
    }

    updatePlayer(id: string, active: boolean, time: number = Math.round(Date.now() * 0.001)) {
        if (active) {
            if (!this.startTime.has(id)) {
                this.startTime.set(id, time)
                debug && console.log(`${id}: started`)
            }
        } else {
            if (this.startTime.has(id)) {
                const startTime = this.startTime.get(id)!
                const elapsedTime = time - startTime
                const updatedTime = this.getTime(id) + elapsedTime
                this.totalTime.set(id, updatedTime)
                this.startTime.delete(id)
                debug && console.log(`${id}: stopped, elapsed: ${elapsedTime}, total: ${updatedTime}`)
            }
        }
    }

    getTime(id: string): number {
        return this.totalTime.get(id) || 0
    }

    saveData(file: string = "playtime.csv") {
        let csv = "user,time\n"
        for (const [id, time] of this.totalTime.entries())
            csv += `${id},${time}\n`
        writeFileSync(file, csv)
        debug && console.log(`saved data to ${file}`)
    }

    saveRestore(file: string = "playtime.csv") {
        const data = readFileSync(file, 'utf-8')
        const lines = data.split('\n').slice(1)
        for (const line of lines) {
            const [time, user] = line.split(',')
            this.totalTime.set(user, parseInt(time))
        }
        debug && console.log(`restored data from ${file}, entries: ${this.totalTime.size}`)
    }

    getTop(n: number = 10): Map<string, number> {
        const sorted = [...this.totalTime.entries()].sort((a, b) => b[1] - a[1])
        const top = new Map<string, number>()
        for(const i in sorted) {
            if (i == String(n)) break
            const [id, time] = sorted[i]
            top.set(id, time)
        }
        return top
    }
}