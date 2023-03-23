import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Buy from './Buy';
import Progress from './Progress';
import Info from './Info';
import Loading from './Loading';

// Artifacts
import CROWDSALE_ABI from '../abis/Crowdsale.json'
import TOKEN_ABI from '../abis/Token.json'

// Config
import config from '../config.json';

function App() {
  const loadBlockchainData = async () => {
    const provider = new ethers.provider.Web3Provider()
  }

  return (
    
  );
}

export default App;
