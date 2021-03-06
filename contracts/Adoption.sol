pragma solidity ^0.5.0;

contract Adoption {
address[16] public adopters;
// Adopting a pet
function adopt(uint petId) public returns (uint) {
  require(petId >= 0 && petId <= 15);
  require(adopters[petId] == address(0),"Pet Already Adopted");

  adopters[petId] = msg.sender;

  return petId;
}
// Retrieving the adopters
function getAdopters() public view returns (address[16] memory) {
  return adopters;
}
// unAdopt a pet
function unAdopt(uint petId) public returns (address) {
  require(petId >= 0 && petId <= 15);
  require(msg.sender == adopters[petId],"you dont own this pet");
  adopters[petId] = address(0);

  return address(0);
}
}

