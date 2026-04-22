/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { describe, it, expect, beforeAll } from 'bun:test';
import { initDatabase, db } from './db';
import { processWager } from './engine/core';
import type { WagerResult } from './engine/types';
import { randomBytes, createHash } from 'crypto';

describe('Unified Core Engine Expansion', () => {
    const TEST_USER = 'test-player-123';

    beforeAll(async () => {
        await initDatabase();
        // Seed wallet + RNG entry for test user (required by FK constraints in rng_seeds)
        const serverSeed = randomBytes(32).toString('hex');
        const hashedServerSeed = createHash('sha256').update(serverSeed).digest('hex');
        await db.execute(`INSERT OR IGNORE INTO wallets (user_id, balance) VALUES (?, 10000)`, [TEST_USER]);
        await db.execute(`INSERT OR IGNORE INTO rng_seeds (user_id, server_seed, client_seed, hashed_server_seed, nonce) VALUES (?, ?, ?, ?, 0)`, [
            TEST_USER,
            serverSeed,
            'test-client-seed',
            hashedServerSeed
        ]);
    });

    it('should process a Coin Toss wager through the core pipeline', async () => {
        const result: WagerResult = await processWager(
            TEST_USER,
            'coin-toss',
            'skill',
            10, // 10 VLY — within house liquidity ceiling (~15.5 VLY at default reserve)
            { prediction: 'HEADS' }
        );

        expect(result.gameCategory).toBe('skill');
        expect(result.state.outcome).toBeDefined();
        expect(['HEADS', 'TAILS']).toContain(result.state.outcome);
        
        if (result.state.outcome === 'HEADS') {
            expect(result.payout).toBe(20); // 2.0 multiplier
        } else {
            expect(result.payout).toBe(0);
        }
    });

    it('should process a Blackjack wager through the core pipeline', async () => {
        const result: WagerResult = await processWager(
            TEST_USER,
            'blackjack',
            'cards',
            10, // 10 VLY — within house liquidity ceiling (~15.5 VLY at default reserve)
            { count: 10 } // Deal enough for hits
        );

        expect(result.gameCategory).toBe('cards');
        expect(result.state.dealt).toBeDefined();
        expect(Array.isArray(result.state.dealt)).toBe(true);
        expect(result.state.dealt.length).toBeGreaterThanOrEqual(4);
        
        // Payout at 10 VLY base: 0 (Loss), 10 (Push), 20 (Win at 2.0x), 25 (Blackjack at 2.5x)
        expect([0, 10, 20, 25]).toContain(result.payout);
    });
});
