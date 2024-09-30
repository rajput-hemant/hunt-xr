import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure that tokens can't be minted by non-owner",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let wallet1 = accounts.get('wallet_1')!;
        let wallet2 = accounts.get('wallet_2')!;
        let block = chain.mineBlock([
            Tx.contractCall('user-token', 'mint', [types.uint(100), types.principal(wallet2.address)], wallet1.address)
        ]);
        if (block.isOk()) {
            assertEquals(block.receipts.length, 1);
            assertEquals(block.height, 2);
            block.receipts[0].result.expectErr().expectUint(100);
        } else {
            throw new Error("Block mining failed");
        }
    },
});
