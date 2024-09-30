import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";
import type {
  Account,
  Chain} from "https://deno.land/x/clarinet@v1.0.0/index.ts";
import {
  Clarinet,
  Tx,
  types,
} from "https://deno.land/x/clarinet@v1.0.0/index.ts";

Clarinet.test({
  name: "Ensure that tokens can be minted by contract owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;
    const block = chain.mineBlock([
      Tx.contractCall(
        "user-token",
        "mint",
        [types.uint(100), types.principal(wallet1.address)],
        deployer.address,
      ),
    ]);
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[0].events.expectFungibleTokenMintEvent(
      100,
      wallet1.address,
      "user-token",
    );
  },
});
