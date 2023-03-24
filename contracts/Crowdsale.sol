// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Token.sol";

contract Crowdsale {

	address public owner;
	Token public token;
	uint256 public price;
	uint256 public maxTokens;
	uint256 public tokensSold;
	mapping(address => bool) public whitelist;
	bool public salesOpen = true;
	uint256 public saleStartTime;
	uint256 public saleEndTime;

	event Buy(uint256 amount, address buyer);
	event Finalize(uint256 tokensSold, uint256 ethRaised);

	constructor(
		Token _token,
		uint256 _price,
		uint256 _maxTokens
	) {
		owner = msg.sender;
		token = _token;
		price = _price;
		maxTokens = _maxTokens;
		whitelist[msg.sender] = true;
		saleStartTime = 164818440;
		// saleEndTime = 1679633762; //Current Time : 04:55 2023-03-24 Fri. Morning UTC 13:55 2023-03-24 fri KST
		saleEndTime = 1699161600;
	}

	receive() external payable {
		uint256 amount = msg.value / price;
		buyTokens(amount*1e18);
	}

	modifier onlyOwner(){
		require(msg.sender == owner,
			'caller is not the owner'
			);
		_;
	}

	modifier isWhitelisted(){
		require(whitelist[msg.sender],
			'caller is not whitelisted'
			);
		_;
	}
	
	function addToWhitelist(address _address) public onlyOwner{
		whitelist[_address] = true;
	}

	function openSale() public onlyOwner{
		salesOpen = true;
	}

	function closeSale() public onlyOwner{
		salesOpen = false;
	}

	function buyTokens(uint256 _amount) public payable isWhitelisted{
		require(salesOpen, "closed. Comeback later");
		require(
			block.timestamp >= saleStartTime && block.timestamp <= saleEndTime, 
			"The Crowdsale Ended"
			);
		require(msg.value * 1e18 == price * _amount);
		require(_amount >= 9*1e18 && _amount <= 200*1e18);
		require(token.balanceOf(address(this)) >= _amount);
		require(token.transfer(msg.sender, _amount));

		tokensSold += _amount;

		emit Buy(_amount, msg.sender);
	}

	function setPrice(uint256 _price) public onlyOwner{
		price = _price;
	}


	function finalize() public onlyOwner {
		//Send ETH to the Creator
		require(token.transfer(owner, token.balanceOf(address(this))));
		uint256 value = address(this).balance;
		(bool sent, ) = owner.call{value: value}("");
		require(sent);

		emit Finalize(tokensSold, value);
	}


}

/*
a
b
c
d
e
f
g
h
i
j
k
l
m
n
o
p
q
r
l
*/