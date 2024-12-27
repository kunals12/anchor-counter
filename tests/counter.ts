import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Keypair, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

const IDL = require("../target/idl/counter.json");
const programID = new PublicKey(IDL.address);

describe("counter", () => {
  let context;
  let provider: BankrunProvider;
  let payer;
  let program: anchor.Program<Counter>;

  before(async() => {
    context = await startAnchor(
      "",
      [{ name: "counter", programId: programID }],
      []
    );
    provider = new BankrunProvider(context);
    payer = provider.wallet as anchor.Wallet;
    program= new anchor.Program<Counter>(
      IDL,
      provider
    );
  })

  
  // Generate a new keypair for the counter account
  const counterKeypair = new Keypair();
  it("Is initialized!", async () => {
    await program.methods
      .initialize()
      .accounts({
        payer: payer.publicKey,
        counter: counterKeypair.publicKey,
      })
      .signers([counterKeypair])
      .rpc();
    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey);
    assert(currentCount.count.toNumber() === 0, "Expected initialized count to be 0");
  });

  it("increment counter", async() => {
    await program.methods.increment().accounts({
      counter: counterKeypair.publicKey
    }).rpc();
    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey);
    assert(currentCount.count.toNumber() === 1, "Count must be equal to 1");
  })
});
