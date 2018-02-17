pragma solidity ^0.4.18;


/**
 * @title Ownable
 * @dev Allows a contract to have an owner
 */
contract Ownable {

    address public owner;

    function Ownable() public {
        // Set the owner as the contract creator
        owner = msg.sender;
    }

    function changeOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    /**
     * @dev Modifier that only allows execution of a function by the owner of the contract
     */
    modifier onlyOwner() {
        require (msg.sender == owner);
        _;
    }

}
