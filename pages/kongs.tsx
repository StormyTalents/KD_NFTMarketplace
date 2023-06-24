import React from 'react'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import paginate from '../utls/paginate';
import profileImg from '../public/card.jpg';

declare var window: any


const Holdings = () => {
  const [wallet, setWallet] = useState();
  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);

  const [onSale, setOnSale] = useState(0);
  const [listedNfts, setListedNfts] = useState([]);
  const [saleIds, setSaleIds] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const Web3 = require('web3')
  const rpcURL = "https://dev.kardiachain.io/"
  const web3 = new Web3(rpcURL)

  const nftContractABI = require('../contract-abi.json');
  const nftContractAddress = "0xf6FFA2a5685c2Ad53eEDa1197f54FFc1b22f5c1c";

   // marketplace 
   const contractABI = require('../marketplace-contract-abi.json');
   const contractAddress = "0x3D86B80898b223C0F26166670AA8638af263cBA2";

   let marketplace = new web3.eth.Contract(contractABI, contractAddress);
  

  let contract = new web3.eth.Contract(nftContractABI, nftContractAddress);
  let rawdata;

  let onSaleTokens;


  async function getCurrentWallet(): Promise<void> {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      const account = accounts[0]
      setWallet(account)
    }
  }

  const walletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        console.log(accounts[0]);
        setWallet(accounts[0])
      })
    }
  }

  useEffect(() => {
    getCurrentWallet();
    walletListener();
    onSaleNfts();
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [wallet])

  useEffect(() => {
    fetchNFTs();
  }, [balance]);


  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setWallet(account)
    } else {
      window.open('https://metamask.io/', '_blank');
    }
  }

  const fetchBalance = async () => {
    if (wallet) {
      const bal = await contract.methods.balanceOf(wallet).call();
      setBalance(bal);
    }
  }

  const fetchNFTs = async () => {
    let rarityTraits = []
    setHoldings([]);
    for (let i = 0; i < balance; i++) {
      const tokenID = await contract.methods.tokenOfOwnerByIndex(wallet, i).call();
      let tokenMetadataURI = await contract.methods.tokenURI(tokenID).call();

      tokenMetadataURI = `https://purple-given-reindeer-860.mypinata.cloud/ipfs/${tokenMetadataURI.split("ipfs://")[1]}`
      const tokenMetadata = await fetch(tokenMetadataURI).then((response) => response.json())
      let tokenImage = tokenMetadata.image;
      tokenImage = `https://purple-given-reindeer-860.mypinata.cloud/ipfs/${tokenImage.split("ipfs://")[1]}`
      const tokenName = tokenMetadata.name;

      rawdata = await fetch("https://purple-given-reindeer-860.mypinata.cloud/ipfs/QmbtUP6P16E93jf66JTTspb62UsJPBVq6T6r84nMXGx6oV?_gl=1*1ejikdi*_ga*MTUyMzc1NTk3Mi4xNjcwMzcyNzA2*_ga_5RMPXG14TE*MTY3NjAzMTgxOC4yMi4xLjE2NzYwMzE4NzkuNjAuMC4w").then((response) => response.json())

      const nft = rawdata.find((nft) => +nft.edition === +tokenMetadata.name.split("#")[1]);



      // console.log(tokenName);
      setHoldings(holdings => [...holdings, { id: holdings.length, name: tokenName, image: tokenImage, token: tokenID, rank: nft.rank }])
    }
  }


  const onSaleNfts = async () => {
    const userAddress = window.ethereum.selectedAddress;
    console.log(userAddress);
    onSaleTokens = await marketplace.methods.getListedNFTsByUser(userAddress).call()
    setOnSale(onSaleTokens.length);
    setSaleIds(saleIds => [...saleIds, ...onSaleTokens])
  }

  const onSaleClick = async () => {
    setHoldings([]);
    for (let i = 0; i < onSale; i++){
        let tokenMetadataURI = await contract.methods.tokenURI(saleIds[i]).call();

        tokenMetadataURI = `https://purple-given-reindeer-860.mypinata.cloud/ipfs/${tokenMetadataURI.split("ipfs://")[1]}`
        const tokenMetadata = await fetch(tokenMetadataURI).then((response) => response.json())
        let tokenImage = tokenMetadata.image;
        tokenImage = `https://purple-given-reindeer-860.mypinata.cloud/ipfs/${tokenImage.split("ipfs://")[1]}`
        const tokenName = tokenMetadata.name;

        rawdata = await fetch("https://purple-given-reindeer-860.mypinata.cloud/ipfs/QmbtUP6P16E93jf66JTTspb62UsJPBVq6T6r84nMXGx6oV?_gl=1*1ejikdi*_ga*MTUyMzc1NTk3Mi4xNjcwMzcyNzA2*_ga_5RMPXG14TE*MTY3NjAzMTgxOC4yMi4xLjE2NzYwMzE4NzkuNjAuMC4w").then((response) => response.json())

        const nft = rawdata.find((nft) => +nft.edition === +tokenMetadata.name.split("#")[1]);

        // console.log(tokenName);
        setHoldings(holdings => [...holdings, { id: holdings.length, name: tokenName, image: tokenImage, token: saleIds[i], rank: nft.rank }])
    }

    
  }
  
  const handlePageChange = page => {
    setCurrentPage(page);
  };
  
  const paginateHoldings = paginate(holdings, currentPage, pageSize)

  return (
    <div className="w-full min-h-screen holdings__wrapper">
      <div className="top__bar cover__pg w-full text-center bg-gray-200 py-2 min-h-[20rem]">
      </div>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-16 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* <div className="profile__card relative bottom-[12rem]">
                  <Image className='rounded-lg ' src={profileImg} width={250} height={250} alt={''}></Image>
                  <div className='mt-8  bg-gray-200 rounded-lg p-4'>
                    <h2 className='text-2xl font-bol'>Kai Kongs</h2>
                    <p className='mt-2'>The first ever algorithmically generated PFP collection on KardiaChain. There are 10,000 Kongs running rampant on the KardiaChain Network!</p>
                  </div>
                </div> */}


        <div className='flex justify-between mb-12'>
          <button className="text-sm sm:text-2xl font-bold tracking-tight bg-[#f6f4f0] w-fit p-4 rounded-lg" onClick={fetchNFTs}>Your Holdings ({balance})</button>

          <button className="text-sm sm:text-2xl font-bold tracking-tight bg-[#f6f4f0] w-fit p-4 rounded-lg" onClick={onSaleClick}>On Sale ({onSale})</button>
        </div>

        <div className='wallet_btn w-[12rem] '>
          {!wallet && (
            <button onClick={connectWallet} className="w-full flex justify-center gap-x-4 items-center bg-[#44912d] text-white hover:bg-[sky-700] font-bold py-2 px-4 rounded-lg inline-flex"> Connect <img src="/metamask.png" width='30' alt="metamask icon" /> </button>
          )}
        </div>

        {wallet && (
          <div className=" grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {/* {holdings.map(nft => (
                            <HoldingCard name={nft.name} image={nft.image} id={nft.id}></HoldingCard>
                        ))} */}
            {balance < 1 ? (
              <p className='text-xl p-2 bg-red-400 rounded-lg'>No NFTs found.</p>
            ) : holdings.length == 0 && (
              <span className="loader"></span>
            )}

            {paginateHoldings.map(nft => (
              <div key={nft.id} className="group relative bg-[#f6f4f0] rounded-lg">
                <a href={`/nft/${nft.token}`}>
                  <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md  lg:aspect-none lg:h-80">
                    <img placeholder='blur' src={nft.image} alt={nft.name} className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
                  </div>
                  <div className='p-4 flex justify-between items-center'>
                    <span className='p-2'>{nft.name}</span>
                    <span className='text-sm'>Rank #{nft.rank}</span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}

        <Pagination items={balance} pageSize={pageSize} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>
    </div>
  )
}

export default Holdings