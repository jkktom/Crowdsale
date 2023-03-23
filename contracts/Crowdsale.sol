// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Token.sol";

contract Crowdsale {

	Token public token;
	uint256 public price;
	uint256 public maxTokens;
	uint256 public tokensSold;

	event Buy(uint256 amount, address buyer);

	constructor(
		Token _token,
		uint256 _price,
		uint256 _maxTokens
	) {
		token = _token;
		price = _price;
		maxTokens = _maxTokens;
	}

	receive() external payable {
		uint256 amount = msg.value / price;
		buyTokens(amount*1e18);
	}

	function buyTokens(uint256 _amount) public payable {
		require(msg.value * 1e18 == price * _amount);
		require(token.balanceOf(address(this)) >= _amount);
		require(token.transfer(msg.sender, _amount));

		tokensSold += _amount;

		emit Buy(_amount, msg.sender);
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