pragma solidity >=0.5.0;
//pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";

// TODO INTERFACE - define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract Verifier {
    function verifyTx(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c, 
        uint[2] memory input
    ) public returns(bool r);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {

    //Safe way to keep track of number of solutons submitted (see ERC721Mintable.sol)
    //using SafeMath for uint256;

    //Create variable of type Verifier for communication with verifier.sol
    Verifier private verifier;

    constructor(string memory name, string memory symbol, address verifierContractAddress) public CustomERC721Token(name, symbol) {
        
        //Initialize state variable
        verifier = Verifier(verifierContractAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        bool minted; // additionally tracking minting process
        uint256 index;
        address sender;
    }

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private submittedSolutions;

    //To count the added solutions
    uint256 numberSolutions = 0;

    // TODO Create an event to emit when a solution is added 
    event SolutionAdded(uint256 indexSolution, address addressSender, uint256 solutionsNumber);
    event NewTokenMinted(address addressOwner, uint256 id);

    //Utility function - generate unique solution key
    function getSolutionKey
                        (
                            uint[2] memory a,
                            uint[2][2] memory b,
                            uint[2] memory c, 
                            uint[2] memory input
                        )
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(a, b, c, input));
    }

    //Utility function - get number of submitted solutions
    function getSolutions() public view returns(uint256){
        return numberSolutions;
    } 

    //Utility function - get owner of tokenId
    function getOwnerOf(uint256 tokenId) public view returns(address) {
        return super.ownerOf(tokenId);
    }
    
    // TODO Create a function to add the solutions to the mapping and emit the event
    function addSolution
                    (
                        uint[2] memory a,
                        uint[2][2] memory b,
                        uint[2] memory c, 
                        uint[2] memory input
                    ) 
                    public 
    {
    
        /*Define an encoded key for the solutions-mapping in order to verify 
        the uniqueness of all submitted solutions (see FlightSuretyproject - Flightregistration)*/
        bytes32 solutionKey = getSolutionKey(a, b, c, input);
        require(submittedSolutions[solutionKey].index == 0,'Solution is not unique!');

        //Adding solutions to solutions mapping 
        submittedSolutions[solutionKey] = Solution({
            minted: false,
            index: submittedSolutions[solutionKey].index,
            sender: msg.sender
        });

        numberSolutions++;
        emit SolutionAdded(submittedSolutions[solutionKey].index, msg.sender, numberSolutions);
    }


    // TODO Create a function to mint new NFT (Non-Fungible-Token) only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSupply
    function mintNewToken
                    (
                        uint[2] memory a,
                        uint[2][2] memory b,
                        uint[2] memory c, 
                        uint[2] memory input,
                        address to,
                        uint256 tokenId
                    ) 
                    public 
    {

        //Generate unique key to retreive data structure in mapping
        bytes32 solutionKey = getSolutionKey(a,b,c,input);

        //Check verification and if token was already minted!
        require(submittedSolutions[solutionKey].minted == false, 'Token was already minted before!');
        require(verifier.verifyTx(a,b,c,input) == true, 'Token could not be verified!');

        //Function call to add new solution to mapping and setting minted status on true
        addSolution(a, b, c, input);

        //Mint token by accessing the mint function in the parents-class (by using super-keyword)
        super.mint(to, tokenId);

        submittedSolutions[solutionKey].minted = true;
        emit NewTokenMinted(to, tokenId);

    }

}


  


























