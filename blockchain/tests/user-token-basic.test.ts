import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure that user-token is defined",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get('deployer')!;
        let block = chain.mineBlock([
            Tx.contractCall('user-token', 'get-name', [], deployer.address),
            Tx.contractCall('user-token', 'get-symbol', [], deployer.address),
            Tx.contractCall('user-token', 'get-decimals', [], deployer.address),
        ]);
        assertEquals(block.receipts.length, 3);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectOk().expectAscii("User Token");
        block.receipts[1].result.expectOk().expectAscii("UT");
        block.receipts[2].result.expectOk().expectUint(6);
    },
});
