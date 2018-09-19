pragma solidity 0.4.24;

contract SimpleStorage {
  string ipfsHash;

  string  public name = "Happy Token";
  string  public symbol = "Happy";
  string  public standard = "Happy Token v1.0";
  string public admin = "0x2a8756Dcf5799EaFF37c827aC5822ef95A1610eF";
  uint256 public totalSupply;
  uint256 public tokenPrice = 100;
  

  function SimpleStorage (uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }



  function set(string x) public {
    ipfsHash = x;
  }

  function get() public view returns (string) {
    return ipfsHash;
  }

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    /*event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );*/

    mapping(address => uint256) public balanceOf;
    //mapping(address => mapping(address => uint256)) public allowance;

    

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        Transfer(msg.sender, _to, _value);

        return true;
    }

   

 


}
