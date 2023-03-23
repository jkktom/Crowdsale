const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}
const ether = tokens

describe('Crowdsale', () => {
  let token
      ,crowdsale
      ,accounts
      ,deployer
      ,user1

  beforeEach(async() => {
    //Load Contracts
    const Token
    = await ethers.getContractFactory('Token')
    const Crowdsale
    = await ethers.getContractFactory('Crowdsale')

    accounts = await ethers.getSigners()
    deployer = accounts[0]
    user1 = accounts[1]
    
    //Deploy Token
    token = await Token.deploy('Dapp Univ', 'DAPP', '1000000')
    //Deploy Crowdsale
    crowdsale = await Crowdsale.deploy(token.address, ether(1), '1000000')
    
    //Send tokens to crowdsale
    let tdt = //dt : The Deployment Transaction
      await token.connect(deployer)
      .transfer(crowdsale.address, tokens(1000000))
    await tdt.wait()
  })

  describe('Deployment', () => {
    it('sends tokens to the Crowdsale Contract', async () => {
      let a,b
      a = await token.balanceOf(crowdsale.address)
      b = tokens(1000000)
      expect(a).to.eq(b)
    })

    it('returns token address', async () => {
      let a,b
      a = await crowdsale.token()
      b = token.address
      expect(a).to.eq(b)
    })
  })

  describe('Buying Tokens', ()=> {
    let transaction
    let amount = tokens(10)

    describe('Success', ()=> {
      beforeEach(async()=> {
        transaction =
          await crowdsale.connect(user1)
          .buyTokens(amount, {value: ether(10)})
        await transaction.wait()
      })


      it('crowdsale account decreases', async ()=> {
        let a,b
        a = await token.balanceOf(crowdsale.address)
        b = tokens(999990)
        expect(a).to.eq(b)
        // console.log(a*1e-18)
      })
      it('user account increases', async ()=> {
        let a,b
        a = await token.balanceOf(user1.address)
        b = amount
        expect(a).to.eq(b)
        // console.log(a*1e-18)
      })
      it('updates contracts ether balance', async ()=> {
        let a,b
        a = await ethers.provider.getBalance(crowdsale.address)
        b = amount
        expect(a).to.eq(b)
        // console.log(a*1e-18)
      })
      it('updates tokensSold', async ()=> {
        let a,b
        a = await crowdsale.tokensSold()
        b = amount
        expect(a).to.eq(b)
        // console.log(a*1e-18)
      })
      // it('emits a buy event', async () => {
      //   await expect(transaction).to.emit(crowdsale, 'Buy')
      //     .withArgs(amount, user1.address)
      // }) // Same as below
      it('emits a buy event', async () => {
        let a,b,c,d,e
        a = transaction // beforeEach async name
        b = crowdsale // b,c : Contract Name & Event(emit) Name
        c = 'Buy'
        d = amount // d,e <- event Buy(uint256 amount, address buyer)
        e = user1.address
        await expect(a).to.emit(b,c).withArgs(d,e)
      })
    })

    describe('Failure', ()=> {
      it('rejects insufficient ETH', async()=>{
        let a,b,c
        a = tokens(10)
        b = {value:ether(9)}
        c = crowdsale.connect(user1).buyTokens(a,b)
        await expect(c).to.be.reverted
        // console.log(a*1e-18)
        // console.log(b*1e-18)
      })
    })
  })

  describe('Sending ETH', ()=> {
    let transaction
    let amount = ether(10)

    describe('Success', ()=> {
      beforeEach(async()=> {
        transaction =
          await user1.sendTransaction({to: crowdsale.address, value: amount})
        await transaction.wait()
      })

      it('updates contracts ETH balance', async ()=> {
        let a,b
        a = await ethers.provider.getBalance(crowdsale.address)
        b = amount
        expect(a).to.eq(b)
        // console.log(a*1e-18)
      })
      it('updates user token Balance', async ()=> {
        let a,b
        a = await token.balanceOf(user1.address)
        b = amount
        expect(a).to.eq(b)
        // console.log(a*1e-18)
      })
    })
  })

  describe('Finalizing', () => {
    let transaction, amount, value
    amount = tokens(10)
    value = ether(10)

    describe('Success', () => {
      beforeEach(async() => {
        transaction =
          await crowdsale.connect(user1)
          .buyTokens(amount, {value: value})
        await transaction.wait()

        transaction =
          await crowdsale.connect(deployer)
          .finalize()
        await transaction.wait()
      })

      it('transfers remaining tokens to the owner', async() => {
        expect(await token.balanceOf(crowdsale.address)).to.eq(0)
        expect(await token.balanceOf(deployer.address)).to.eq(tokens(999990))
      })
      it('transfers ETH to the owner', async() => {
        expect(await ethers.provider.getBalance(crowdsale.address)).to.eq(0)
      })
    })

    describe('Failure', () => {

    })
  })
})





// a
// b
// c 
// d
// e
// f
// g
// h
// i
// j
// k
// l
// m
// n
// o
// p
// q
// r
// l
