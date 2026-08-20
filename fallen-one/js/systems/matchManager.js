// js/systems/matchManager.js - Round Flow, True 1s Clock Timer & Match Outcome Manager (with 2v1 Boss Support)

import { ROUND_TIME, ROUNDS_TO_WIN, FIGHTER_STATES } from '../core/constants.js';
import { soundEngine } from '../audio/soundEngine.js';
import { camera } from '../core/camera.js';

export const MATCH_PHASES = {
    ROUND_INTRO: 'ROUND_INTRO',     // "ROUND 1"
    FIGHT: 'FIGHT',                 // "FIGHT!"
    ACTIVE: 'ACTIVE',               // Fighting in progress
    ROUND_OVER: 'ROUND_OVER',       // "K.O." or "TIME OVER"
    MATCH_OVER: 'MATCH_OVER'        // Results transition
};

export class MatchManager {
    constructor() {
        this.currentRound = 1;
        this.roundTimer = ROUND_TIME;
        this.lastTimerTimestamp = 0;
        this.timerAccumulator = 0;
        this.phase = MATCH_PHASES.ROUND_INTRO;
        this.phaseTimer = 0;
        this.p1RoundsWon = 0;
        this.p2RoundsWon = 0;
        this.bannerText = 'ROUND 1';
        this.bannerSubText = 'READY';
        this.bannerAlpha = 1.0;
        this.bannerScale = 1.0;
        this.winner = null;

        // Statistics
        this.startTime = Date.now();
        this.p1TotalDamage = 0;
        this.p2TotalDamage = 0;
    }

    startNewMatch(roundsToWin = ROUNDS_TO_WIN) {
        this.currentRound = 1;
        this.roundTimer = ROUND_TIME;
        this.lastTimerTimestamp = Date.now();
        this.timerAccumulator = 0;
        this.p1RoundsWon = 0;
        this.p2RoundsWon = 0;
        this.roundsToWin = roundsToWin;
        this.winner = null;
        this.p1TotalDamage = 0;
        this.p2TotalDamage = 0;
        this.startTime = Date.now();
        this.startRoundIntro();
    }

    startRoundIntro() {
        this.phase = MATCH_PHASES.ROUND_INTRO;
        this.phaseTimer = 0;
        this.roundTimer = ROUND_TIME;
        this.lastTimerTimestamp = Date.now();
        this.timerAccumulator = 0;

        let roundName = `ROUND ${this.currentRound}`;
        if (this.p1RoundsWon === 1 && this.p2RoundsWon === 1) {
            roundName = 'FINAL ROUND';
        }
        this.bannerText = roundName;
        this.bannerSubText = 'GET READY';
        this.bannerScale = 1.2;

        soundEngine.announce(roundName);
    }

    update(p1, p2, onMatchEndCallback, p3 = null) {
        this.phaseTimer++;

        switch (this.phase) {
            case MATCH_PHASES.ROUND_INTRO:
                if (this.phaseTimer >= 70) {
                    this.phase = MATCH_PHASES.FIGHT;
                    this.phaseTimer = 0;
                    this.bannerText = 'FIGHT!';
                    this.bannerSubText = '';
                    this.bannerScale = 1.5;
                    this.lastTimerTimestamp = Date.now();
                    this.timerAccumulator = 0;
                    soundEngine.announce('FIGHT!');
                }
                break;

            case MATCH_PHASES.FIGHT:
                if (this.phaseTimer >= 40) {
                    this.phase = MATCH_PHASES.ACTIVE;
                    this.bannerText = '';
                    this.lastTimerTimestamp = Date.now();
                    this.timerAccumulator = 0;
                }
                break;

            case MATCH_PHASES.ACTIVE: {
                // Precise 1-Second Timer Calibration using true millisecond clock
                const now = Date.now();
                const deltaMs = Math.min(100, now - this.lastTimerTimestamp);
                this.lastTimerTimestamp = now;
                this.timerAccumulator += deltaMs;

                while (this.timerAccumulator >= 1000) {
                    this.timerAccumulator -= 1000;
                    if (this.roundTimer > 0) {
                        this.roundTimer--;
                    }
                }

                // Check Knockout (Handles 1v1 or 2v1 Boss battle)
                const p2Defeated = p2.health <= 0 && (!p3 || p3.health <= 0);
                const p1Defeated = p1.health <= 0;

                if (p1Defeated || p2Defeated) {
                    this.handleRoundOver(p1, p2, false, p3);
                } else if (this.roundTimer <= 0) {
                    this.handleRoundOver(p1, p2, true, p3);
                }
                break;
            }

            case MATCH_PHASES.ROUND_OVER:
                if (this.phaseTimer >= 140) {
                    const reqRounds = this.roundsToWin || ROUNDS_TO_WIN;
                    if (this.p1RoundsWon >= reqRounds || this.p2RoundsWon >= reqRounds) {
                        this.phase = MATCH_PHASES.MATCH_OVER;
                        this.winner = this.p1RoundsWon >= reqRounds ? p1 : p2;
                        p1.state = this.winner === p1 ? FIGHTER_STATES.VICTORY : FIGHTER_STATES.DEFEAT;
                        p2.state = this.winner === p2 ? FIGHTER_STATES.VICTORY : FIGHTER_STATES.DEFEAT;
                        if (p3) p3.state = FIGHTER_STATES.DEFEAT;

                        if (onMatchEndCallback) {
                            onMatchEndCallback(this.getMatchResults(p1, p2, p3));
                        }
                    } else {
                        // Advance to next round
                        this.currentRound++;
                        p1.resetForRound(700, 1300);
                        p2.resetForRound(700, 1300);
                        if (p3) p3.resetForRound(700, 1500);
                        this.startRoundIntro();
                    }
                }
                break;
        }
    }

    handleRoundOver(p1, p2, isTimeOut, p3 = null) {
        this.phase = MATCH_PHASES.ROUND_OVER;
        this.phaseTimer = 0;

        camera.addTrauma(0.5);
        camera.addHitstop(20);

        if (isTimeOut) {
            this.bannerText = 'TIME OVER!';
            soundEngine.announce('TIME OVER');
            const p2CombinedHealth = p2.health + (p3 ? p3.health : 0);
            if (p1.health > p2CombinedHealth) this.p1RoundsWon++;
            else if (p2CombinedHealth > p1.health) this.p2RoundsWon++;
        } else {
            this.bannerText = 'K.O.';
            soundEngine.announce('KNOCK OUT');
            if (p1.health <= 0) this.p2RoundsWon++;
            else if (p2.health <= 0 && (!p3 || p3.health <= 0)) this.p1RoundsWon++;
        }
    }

    getMatchResults(p1, p2, p3 = null) {
        const matchDuration = Math.round((Date.now() - this.startTime) / 1000);
        return {
            winner: this.winner.name,
            winnerPortrait: this.winner.portrait,
            winnerKey: this.winner.playerKey,
            p1Rounds: this.p1RoundsWon,
            p2Rounds: this.p2RoundsWon,
            matchTime: `${matchDuration}s`,
            xpEarned: 500 + (this.winner.playerKey === 'P1' ? 400 : 100)
        };
    }
}

export const matchManager = new MatchManager();
