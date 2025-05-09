import { Clarinet, Tx, Chain, Account, types } from 'clarinet-js';
import { assertEquals } from 'chai';

Clarinet.test({
    name: "Ensure that token claims work",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const user1 = accounts.get("wallet_1")!;

        let block = chain.mineBlock([
            Tx.contractCall("user-token", "claim-tokens", [], user1.address)
        ]);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Test balance
        let balance = chain.callReadOnlyFn("user-token", "get-balance", [types.principal(user1.address)], deployer.address);
        assertEquals(balance.result.expectOk(), types.uint(10000));
    }
});

Clarinet.test({
    name: "Ensure that blacklisting works",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const user1 = accounts.get("wallet_1")!;

        let block = chain.mineBlock([
            Tx.contractCall("user-token", "blacklist-address", [
                types.principal(user1.address),
                types.bool(true)
            ], deployer.address)
        ]);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Try to claim tokens while blacklisted
        block = chain.mineBlock([
            Tx.contractCall("user-token", "claim-tokens", [], user1.address)
        ]);
        assertEquals(block.receipts[0].result.expectErr(), types.uint(104)); // err-blacklisted
    }
});

// Add more tests for new functionality...
