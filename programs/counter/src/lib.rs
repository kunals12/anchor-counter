use anchor_lang::prelude::*;

declare_id!("A8s7H5BaRDMaMD5XVFhkr3cisCdJ5X44Myh5gtkfsquv");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<InitializeCounter>) -> Result<()> {
        msg!("Initializing Counter: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        ctx.accounts.counter.count = ctx.accounts.counter.count.checked_add(1).unwrap();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCounter<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init, 
        space= 8 + Counter::INIT_SPACE,
        payer= payer,
    )]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub count: u64
}
