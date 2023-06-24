import React from 'react'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react';
import Pagination from '../components/Pagination';
import paginate from '../utls/paginate';
import profileImg from '../public/card.jpg';

declare var window: any


const Holdings = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [nftItems, setNftItems] = useState([]);
    const [floorToken, setFloorToken] = useState();
    const [floorPrice, setFloorPrice] = useState();
    const [totalItems, setTotalItems] = useState();
    const [volume, setVolume] = useState();
    const pageSize = 20;
    const dataFetchedRef = useRef(false);


    const Web3 = require('web3')
    const rpcURL = "https://dev.kardiachain.io/"
    const web3 = new Web3(rpcURL)
    
    const nftContractABI = require('../contract-abi.json');
    const nftContractAddress = "0xf6FFA2a5685c2Ad53eEDa1197f54FFc1b22f5c1c";
    let nftContract = new web3.eth.Contract(nftContractABI, nftContractAddress);

    // marketplace 
    const contractABI = require('../marketplace-contract-abi.json');
    const contractAddress = "0x3D86B80898b223C0F26166670AA8638af263cBA2";

    let contract = new web3.eth.Contract(contractABI, contractAddress);  
    let rawdata;


    useEffect(() => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      fetchNFTs();
      fetchMetrics();
    }, [])

  
    const fetchMetrics = async () => {
      const floorTokenId = await contract.methods.getFloorTokenId().call();
      setFloorToken(floorTokenId);

      const price = await contract.methods.getPrice(floorTokenId).call();
      setFloorPrice(price);

      const itemsListed = await contract.methods.itemsListed().call();
      setTotalItems(itemsListed);

      const marketVolume = await contract.methods.volume().call();
      setVolume(marketVolume);
    }

    const fetchNFTs = async () => {
      const marketItems = await contract.methods.getListedTokenIds().call();
      for (let i=0; i < marketItems.length; i++){
          let tokenMetadataURI = await nftContract.methods.tokenURI(marketItems[i]).call();

          tokenMetadataURI = `https://purple-given-reindeer-860.mypinata.cloud/ipfs/${tokenMetadataURI.split("ipfs://")[1]}`
          const tokenMetadata = await fetch(tokenMetadataURI).then((response) => response.json())
          let tokenImage = tokenMetadata.image;
          tokenImage = `https://purple-given-reindeer-860.mypinata.cloud/ipfs/${tokenImage.split("ipfs://")[1]}`
          const tokenName = tokenMetadata.name;

          const tokenPrice = await contract.methods.getPrice(marketItems[i]).call();


          setNftItems( nftItems => [...nftItems, {id: nftItems.length, name: tokenName, image: tokenImage, token: marketItems[i], tokenPrice: tokenPrice}])
      }
    }

    const handlePageChange = page => {
      setCurrentPage(page);
    };

    const paginateHoldings = paginate(nftItems, currentPage, pageSize)

    return (
        <div className="w-full min-h-screen holdings__wrapper">
          <div className="top__bar cover__pg w-full text-center bg-gray-100 py-2 min-h-[20rem]">
          </div>
            <div className="mx-auto mb-[5rem] max-w-2xl py-16 px-4 sm:py-16 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="profile__card relative bottom-[12rem]">
                  <div className='flex gap-4 items-end'>
                    <Image className='rounded-lg ' src={profileImg} width={250} height={250} alt={''}></Image>
                    <div className='flex mt-4 gap-3'>
                      <div className='bg-gray-100 p-4 rounded-lg'>
                        <span>{volume} KAI</span> <br></br>
                        <span className='text-sm text-gray-600'>Total Volume</span>
                      </div>

                      <div className='bg-gray-100 p-4 rounded-lg'>
                        <span>{totalItems} Kongs</span> <br></br>
                        <span className='text-sm text-gray-600'>Listed</span>
                      </div>

                      <div className='bg-gray-100 p-4 rounded-lg'>
                        <span>10,000</span> <br></br>
                        <span className='text-sm text-gray-600'>Total Kongs</span>
                      </div>

                      <div className='bg-gray-100 p-4 rounded-lg'>
                        <a href={`/nft/${floorToken}`}>{floorPrice} KAI</a> <br />
                        <span className='text-sm text-gray-600'>Floor Price</span>
                      </div>

                    </div>
                  </div>
                  <div className='mt-8  bg-gray-100 rounded-lg p-4'>
                    <h2 className='text-2xl font-bol'>Kai Kongs</h2>
                    <p className='mt-2'>The first ever personalized algorithmically generated PFP collection on the KardiaChain network created by Moto. The goal of this collection is to bring together the KardiaChain community with personalized Kong PFPs which depict their personality, style, and who they are as a person.</p>
                  </div>



                </div>


                <div className='flex justify-between'>
                  {/* <h2 className="text-2xl font-bold tracking-tight bg-gray-100 w-fit p-4 rounded-lg">Your Holdings ({balance})</h2> */}
                </div>


                <div className="mt-[-5rem] grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {nftItems.length < 1 && (
                      <p className='text-xl p-2 bg-red-400 rounded-lg'>No NFTs found.</p>
                    )}
    
                    {paginateHoldings.map(nft => (
                        <div key={nft.id} className="group relative bg-gray-100 rounded-lg">
                          <a href={`/nft/${nft.token}`}>
                            <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md  lg:aspect-none lg:h-80">
                                <img placeholder='blur' src={nft.image} alt={nft.name} className="h-full w-full object-cover object-center lg:h-full lg:w-full"/>
                            </div>
                            <div className='p-4 flex justify-between items-center'>
                              <span className='p-2'>{nft.name}</span>
                              <span className='text-sm'>{
                                nft.tokenPrice.length > 5 ? `${nft.tokenPrice}`.slice(0, 5) + '..' : nft.tokenPrice
                              } KAI</span>
                            </div>
                          </a>
                        </div>
                    ))}
                </div>


                <Pagination items={nftItems.length} pageSize={pageSize} currentPage={currentPage} onPageChange={handlePageChange}/>
            </div>
        </div>
    )
}

export default Holdings