import React from 'react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { at } from 'lodash';
import { BsArrowDown } from 'react-icons/bs';
import { type } from 'os';
// import metdataRarity from "../../../public/_metadata_with_rarity.json";

declare var window: any



const nft = () => {
    const router = useRouter();
    const {id} = router.query;
    const [wallet, setWallet] = useState();
    const [nftTraits, setnftTraits] = useState([]);
    const [imageUrl, setImageUrl] = useState<any | null>(null);
    const [tokeName, setTokenName] = useState();
    const [tokenRank, setTokenRank] = useState();

    const [isListed, setIsListed] = useState();
    const [tokenPrice, setTokenPrice] = useState();
    const [tokenOwner, setTokenOwner] = useState();

    const [isOwner, setIsOwner] = useState(false);
    const [status, setStatus] = useState({ message: null, type: null });

    const [pageLoading, setPageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    

    let tokenMetadata;

    // const Web3 = require('web3');
    // let web3 = new Web3(Web3.givenProvider);

    const Web3 = require('web3');
    const rpcURL = "https://dev.kardiachain.io/";
    const web3 = new Web3(Web3.givenProvider || rpcURL);

    // marketplace 
    const contractABI = require('../../../marketplace-contract-abi.json');
    const contractAddress = "0x3D86B80898b223C0F26166670AA8638af263cBA2";
    let marketplace = new web3.eth.Contract(contractABI, contractAddress);
    // nft 
    const nftContractABI = require('../../../contract-abi.json');
    const nftContractAddress = "0xf6FFA2a5685c2Ad53eEDa1197f54FFc1b22f5c1c";
  
    let nftContract = new web3.eth.Contract(nftContractABI, nftContractAddress);
  
    const [price, setPrice] = useState<any | null>(null);

    const handlePriceChange = (event) => {
        setPrice(event.target.value)
    }

    const connectWallet = async () => {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const account = accounts[0];
          setWallet(account)
        } else {
          window.open('https://metamask.io/', '_blank');
        }
      }

    async function getCurrentWallet(): Promise<void> {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' })
            const account = accounts[0]
            console.log(account);
            setWallet(account)
        }
    }

    useEffect(() => {
        getCurrentWallet();
        walletListener();
      }, []);

    const walletListener = () => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
            console.log(accounts[0]);
            setWallet(accounts[0])
            })
        }
    }
    

    // const getStatus = async 


    const listSale = async () => {
        setIsLoading(true);
        if (price % 1 == 0){
            try{
                console.log(Web3.utils.toWei(`${price}`, 'ether'));
                await nftContract.methods.setApprovalForAll(contractAddress, true).send({from: wallet})
                
                const tx = await marketplace.methods.listMarketItem(nftContractAddress, id, price).send({from: wallet})
                await tx
                
                setIsLoading(false);
                location.reload();
                setStatus({message: 'Listed successfully', type: "success"})
            } catch (err){
                console.log(err);
                setIsLoading(false);
            }
        } else {
            setStatus({message: "Price can be in only whole numbers.", type: "error"})
            setIsLoading(false);
        }
    }

    const buyItem = async () => {
        try {
            // console.log();
            await marketplace.methods.createMarketSale(nftContractAddress, id).send({from: wallet, value: web3.utils.toWei(`${(tokenPrice)}`, 'ether')})
            location.reload();
            setStatus({message: 'Purchase successful', type: "success"})
        } catch (err) {
            console.log(err);
        }
        // "0x" + Web3.utils.toBN(Web3.utils.toWei(``, "ether")).toString(16)}
    }


    const removeListing = async () => {
        setIsLoading(true);
        try {
            const tx = await marketplace.methods.removeListing(id, nftContractAddress).send({from: wallet})
            await tx;

            location.reload()
            setStatus({message: "Successfully removed listing", type: "error"});
        } catch (err){
            console.log(err);
        }
    }
    

    const fetchMetadata = async () => {
        let tokenMetadataURI = `https://purple-given-reindeer-860.mypinata.cloud/ipfs/bafybeicc7qf4nu6scvwse7xt3g3uadcmf2t467qus75arezj3m57ei4qvq/${id}.json`
        tokenMetadata = await fetch(tokenMetadataURI).then((response) => response.json())
        // setMetadata(tokenMetadata);
        tokenMetadata.attributes.map((attr: any) => {
            setnftTraits( nftTraits => [...nftTraits, attr]);
        });

        const rawdata = await fetch("https://purple-given-reindeer-860.mypinata.cloud/ipfs/QmbtUP6P16E93jf66JTTspb62UsJPBVq6T6r84nMXGx6oV?_gl=1*1ejikdi*_ga*MTUyMzc1NTk3Mi4xNjcwMzcyNzA2*_ga_5RMPXG14TE*MTY3NjAzMTgxOC4yMi4xLjE2NzYwMzE4NzkuNjAuMC4w").then((response) => response.json())
        // const nfts = JSON.parse(rawdata);
        
        const listingStatus = await marketplace.methods.isListed(id).call();
        setIsListed(listingStatus);

        const price = await marketplace.methods.getPrice(id).call();
        setTokenPrice(price);


        if (listingStatus == true){
            let owner = await marketplace.methods.getSeller(id).call();
            owner = owner.toLowerCase();
            setTokenOwner(owner);
            console.log(wallet);
            if (owner == wallet){
                setIsOwner(true);
            }
        } else {
            let owner = await nftContract.methods.ownerOf(id).call();
            console.log(owner);
            console.log(wallet);
            owner = owner.toLowerCase();
            setTokenOwner(owner.toLowerCase());

            if (owner == wallet){
                setIsOwner(true);
            }
        }

        // if (listingStatus == true){
        //     console.log(true);
        //     const owner = await marketplace.methods.getSeller(id).call();
        //     console.log(owner);

        //     console.log(wallet)
        // }


        setTokenName(tokenMetadata.name);

        const nft = rawdata.find((nft) => +nft.edition === +tokenMetadata.name.split("#")[1]);
        setTokenRank(nft.rank);

        let img = tokenMetadata.image;
        setImageUrl(`https://purple-given-reindeer-860.mypinata.cloud/ipfs/${img.split("ipfs://")[1]}`)
        setPageLoading(false);
    }

    useEffect(() => {
        if (id != null){
            fetchMetadata();
        }
    }, [id, wallet])


    // useEffect(() => {
    //     console.log(isOwner)
    // }, [isOwner])

    useEffect(() => {
        // nftTraits.map(atrr => {
        //     console.log(attr);
        // })
    }, [nftTraits])

    function sentenceCase (str) {
        if ((str===null) || (str===''))
            return false;
        else
        str = str.toString();
         
        return str.replace(/\w\S*/g,
        function(txt){return txt.charAt(0).toUpperCase() +
            txt.substr(1).toLowerCase();});
        }

    if (pageLoading){
        return (
            <div className='w-full min-h-screen flex justify-center items-center'>
                <span className="loader"></span>
            </div>
        )
    } else {
        return (
            
            <section className="text-gray-600 body-font overflow-hidden">
            <div className="container px-5 py-24 mx-auto">
                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                    <img className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src={imageUrl}/>
                    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                        <div className='flex gap-4 items-center'>
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{tokeName}</h1>
                            <span>- Rank #{tokenRank}</span>
                        </div>
                        <span className='text-sm'>owned by {`${tokenOwner}`.slice(0, 5) + '..'}</span>

                        <p className='text-lg mt-4 text-black'>There are 10,000 Kongs running rampant on the KardiaChain Network!</p>
                        
                        {isListed && (
                            <div className='my-6'>
                                <h2 className='text-black text-2xl flex justify-center items-center gap-2 w-fit'>{tokenPrice} KAI <span className='p-1 bg-gray-100 text-xs rounded-lg'>On Sale</span> </h2>
                            </div>
                        )}

                        <div className="nft__controlls mt-6">
                            <div className='flex gap-2'>
                                
                                {!isListed ? 
                                    
                                    !wallet ? (
                                        <button onClick={connectWallet} className="w-full flex justify-center gap-x-4 items-center bg-[#44912d] text-white hover:bg-[sky-700] font-bold py-2 px-4 rounded-lg inline-flex"> Connect <img src="/metamask.png" width='30' alt="metamask icon" /> </button>
                                    ) :
                                    wallet &&   
                                        isOwner &&
                                        <div>
                                            <div className='flex gap-2'>
                                            <input disabled={isLoading} type="number" placeholder='KAI' id="price" name="price" className="bg-gray-100 bg-opacity-50 rounded-lg border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out w-[7rem]" onChange={handlePriceChange} />

                                            <button disabled={isLoading} onClick={listSale} className='px-3 py-2 bg-blue-600 rounded-lg text-white'>List For Sale</button>
                                        </div> 

                                        <p className='mt-6 border-2 border-black p-2 text-black'>
                                        Marketplace Royalty: 7.5% <br />
                                        5% - Project Wallet <br />
                                        2.5% - Team <br />
                                        All royalties will be used for future airdrops, development, giveaways, events, and more.
                                        </p>
                                        </div>
                                 : <></>}


                                {isListed && (
                                    !wallet ? (
                                                <button onClick={connectWallet} className="w-full flex justify-center gap-x-4 items-center bg-[#44912d] text-white hover:bg-[sky-700] font-bold py-2 px-4 rounded-lg inline-flex"> Connect <img src="/metamask.png" width='30' alt="metamask icon" /> </button>) :
                                    
                                    wallet && 
                                        !isOwner ? (<button disabled={isLoading} onClick={buyItem} className='p-3 bg-green-600 rounded-lg text-white'>Buy Now</button>)
                                        :
                                        <button disabled={isLoading} onClick={removeListing}  className='p-2 mt-6 bg-gray-500 rounded-lg text-white'>Remove Listing</button>
                                         
                                )}

                            </div>
                        </div>

                        <div className='nft__desc mt-12'>
                            {/* <div className="rarity__panel">
                                    <details>
                                        <summary>
                                            <h2 className='text-xl text-black flex justify-between items-center w-full'>Properties <BsArrowDown/> </h2>
                                        </summary>

                                        <div className="flex flex-wrap mt-3 gap-4">
                                            {nftTraits.map(attr => (
                                                <div className="card bg-gray-200 p-4 rounded-lg">
                                                <h2 className='text-blue-800'>{attr.trait_type}</h2>
                                                <span>{sentenceCase(attr.value)}</span>
                                            </div>
                                            ))}
                                        </div>
                                    </details>
                            </div> */}

                            {/* <div className="mt-12 social__icons flex gap-2">
                                <a className="text-gray-500">
                                    <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                    </svg>
                                </a>
                                <a className="text-gray-500">
                                <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                </svg>
                                </a>
                                <a className="text-gray-500">
                                <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                </svg>
                                </a>
                            </div>   */}

                        </div>
                    </div>
                </div>
            </div>

            {status.message && (
            status.type === "error" ?
                <div className="p-4 fixed bottom-0 right-4 mb-4 text-sm rounded-lg bg-red-200 text-red-800" role="alert">
                <span>{status.message}</span>
                </div>
                :
                <div className="p-4 fixed bottom-0 right-4 mb-4 text-sm rounded-lg bg-green-200 text-green-800" role="alert">
                <span>{status.message}</span>
                </div>

            )}

            </section>
        )
    }

}

export default nft