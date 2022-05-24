const anchor=require('@project-serum/anchor')
const assert=require('assert')
const { SystemProgram }=anchor.web3

describe("calc", () => {
  const provider=anchor.Provider.local()
  anchor.setProvider(provider)
  const calculator=anchor.web3.Keypair.generate()
  const program=anchor.workspace.Calc
  console.log(program.rpc.create)

  it("Create a new calculator", async () => {
    await program.rpc.create("Welcome", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [calculator]
    })
    const account=await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.greeting==="Welcome")
  })

  it("Addition function", async () => {
    await program.rpc.add(new anchor.BN(2), new anchor.BN(5), {
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account=await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(7)))
  })

  it("Subtraction function", async () => {
    await program.rpc.sub(new anchor.BN(4), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account=await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(1)))
  })

  it("Multiplication function", async () => {
    await program.rpc.mul(new anchor.BN(4), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account=await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(12)))
  })

  it("Division function", async () => {
    await program.rpc.div(new anchor.BN(7), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account=await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(2)), account.remainder.eq(new anchor.BN(2)))
    console.log(account.result, account.remainder)
  })

})