var CustomERC721Token = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const contract_owner = accounts[0];
    const account_one = accounts[1];
    const account_two = accounts[2];
    const TOKENNAME = 'ORANGE(S)';
    const TOKENSYMBOL = 'ORG';
    const MINTEDTOKENS = 5;
    const TOKENURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new(TOKENNAME, TOKENSYMBOL, {from: contract_owner});

            // TODO: mint multiple tokens
            for(let i = 1; i <= MINTEDTOKENS; i++){
                await this.contract.mint(accounts[i], i);
            }
        })

        it('should return total supply', async function () { 
            let totsupply = await this.contract.totalSupply();
            assert.equal(totsupply, MINTEDTOKENS, 'The inputted number of orange-tokens to be minted does not match actual minted number!');
            
        })

        it('should get token balance', async function () { 
            let tokenBalance = await this.contract.balanceOf(account_one);
            assert.equal(tokenBalance, 1, 'Token balances not matching!');
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenURI = await this.contract.tokenURI(1);
            assert.equal(tokenURI, TOKENURI+1, 'TokenURI does not calculated one from contract!');
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one, account_two, 1, {from: account_one});
            let newTokenOwner = await this.contract.ownerOf(1);
            assert.equal(newTokenOwner, account_two,'Transfer of token-ownership does not work!');
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new(TOKENNAME, TOKENSYMBOL, {from: contract_owner});
        })

        it('should fail when minting if address is not contract owner', async function () { 
            try{
                let result = await this.contract.mint(account_two, 1, {from: account_one});
            }
            catch(e){   
                result = false;
            }
            assert.equal(result, false, 'Only the owner of the contract should be able to mint tokens!');
        })

        it('should return contract owner', async function () { 
            let contractOwner = await this.contract.getOwner();
            assert.equal(contractOwner, contract_owner,'Owner of contract not correct!');
            
        })

    });
})

/*Reference - what characteristics should a token have:
Ownership — How is token ownership handled?
Creation — How are tokens created?
Transfer & Allowance — How are tokens transferred, and how do we allow other addresses (contracts or externally owned accounts) transfer capability?
Burn — How do we burn or destroy a token?
--> Form medium article: https://medium.com/blockchannel/walking-through-the-erc721-full-implementation-72ad72735f3c*/