// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract poll{
    uint256 totalVotes;

    struct candidates{
        uint256 id;
        string name;
    }
    uint256[] votes;
    candidates[] details;
    mapping(uint256 => candidates) public candidate;
    mapping(address => bool) public voted;
    uint public candidatesCount;
    address public manager;

    constructor(){
        manager=msg.sender;
    }

    function addToCandidates(string memory _name) public {
        require(msg.sender==manager,"Only manager can add candidate");

        candidate[candidatesCount]=candidates(candidatesCount,_name);
        details.push(candidates(candidatesCount,_name));
        votes.push();
        candidatesCount++;
    }

    function vote(uint256 _candidatesId) public {
        require(!voted[msg.sender],"Already Voted!!");

        voted[msg.sender]=true;
        votes[_candidatesId]++;
        totalVotes++;
    }

    function getAllCandidates() public view returns(candidates[] memory){
        return details;
    }
    
    function getVotes() public view returns(uint256[] memory){
        return votes;
    }

    function getAllVotes() public view returns(uint256){
        return totalVotes;
    }
}