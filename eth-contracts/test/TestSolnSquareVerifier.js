var SolnSquareVerifier = artifacts.require('SolnSquareVerifier.sol');
var verifier = artifacts.require('verifier.sol');

contract('SolnSquareVerifier', accounts => {

    const contract_owner = accounts[0];
    const TOKENNAME = 'ORANGE(S)';
    const TOKENSYMBOL = 'ORG';

    // - use the contents from proof.json generated from zokrates steps
    const proof = { 
        "proof": {
        "a": ["0x1ba0df5159c4c75da8a30d34e28b0a2242b9634aed77c9b41b979e6081ed5033","0x04a81e18c8c57362b000213bce6d533055ba4f830dc76abf9c5bf37907ffbdd0"],
        "b": [["0x272c1132c59a11b904df2e3921eaf7b40ce948a1a24e9b36dd6e2e04cc3e9560","0x1535e1e6c5cb4d685ef68595487910d68d8813765f422b977b53e32f8c53fc94"],
            ["0x26e8a26d9bd754c038c42bb9b5b32b91a0c1463aba53b03eb8e224f1230f853a","0x2c080f65faca972f26229da56b338fc12d62261f8626ec42659bc1090e7a983d"]],
        "c": ["0x08c833d09a989255fa84bd16e9b4374fbf2c59f92f8b67298771b72c03e56f7f","0x2f85944aef8c9f217463077e0d8f85fdf5546b3b570820ade0cf9c95a3feb440"]
        },
        "inputs": ["0x0000000000000000000000000000000000000000000000000000000000000009","0x0000000000000000000000000000000000000000000000000000000000000001"],
        "raw": "1ba0df5159c4c75da8a30d34e28b0a2242b9634aed77c9b41b979e6081ed5033a72c1132c59a11b904df2e3921eaf7b40ce948a1a24e9b36dd6e2e04cc3e95601535e1e6c5cb4d685ef68595487910d68d8813765f422b977b53e32f8c53fc9488c833d09a989255fa84bd16e9b4374fbf2c59f92f8b67298771b72c03e56f7f"
    }

        beforeEach(async function () {
            let verifierContract = await verifier.new({from: contract_owner});
            this.contract = await SolnSquareVerifier.new(TOKENNAME, TOKENSYMBOL, verifierContract.address, {from: contract_owner});
        })
    
        // Test if a new solution can be added for contract - SolnSquareVerifier
        it ('test if a new solution can be added', async function () {
    
            let numberSolBefore = await this.contract.getSolutions();

            await this.contract.addSolution(
                                            proof.proof.a,
                                            proof.proof.b,
                                            proof.proof.c,
                                            proof.inputs,
                                            {from: contract_owner}
                                            );

            let numberSolAfter = await this.contract.getSolutions();
            let relDiffNumberSolutions = numberSolAfter - numberSolBefore;
            //console.log(numberSolAfter);
            //console.log(numberSolBefore); 

            assert.equal(relDiffNumberSolutions, 1, 'The solution could not be added!');
        })
    
        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it ('test if an ERC721 token can be minted', async function () {
    
            let to = accounts[1];
            let tokenId = 1;
    
            await this.contract.mintNewToken(
                                            proof.proof.a,
                                            proof.proof.b,
                                            proof.proof.c,
                                            proof.inputs,
                                            to,
                                            tokenId,
                                            {from: contract_owner}
                                            );
            
            let owner = await this.contract.getOwnerOf(tokenId);
            //console.log(owner);
    
            assert.equal(owner, to, 'ERC721 Token could not be minted!');
    
        })
    
})

