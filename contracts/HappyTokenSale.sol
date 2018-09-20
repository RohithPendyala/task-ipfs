pragma solidity ^0.4.2;

import "./SimpleStorage.sol";

contract HappyTokenSale {
    address admin;
    SimpleStorage public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    //event Sell(address _buyer, uint256 _amount);

    function HappyTokenSale(SimpleStorage _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    /*function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        require(tokenContract.balanceOf(this) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;

        Sell(msg.sender, _numberOfTokens);
    }*/

     function access() public payable {
        // here user must pay 500 to view the file (change to view/token price)
        require(msg.value == tokenPrice);
        //require(tokenContract.balanceOf(this) >= _numberOfTokens);

        if (msg.sender != admin) {
            require(tokenContract.transfer(admin, msg.value));
        }
    }
        

        //tokensSold += _numberOfTokens;

        //Sell(msg.sender, _numberOfTokens);
    

    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));

        selfdestruct(admin);
    }
}
