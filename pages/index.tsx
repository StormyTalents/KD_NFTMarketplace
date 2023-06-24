import Head from 'next/head'
import Image from 'next/image'
import img1 from '../public/1.png'
import img2 from '../public/2.png'
import img3 from '../public/3.png'
import kongImage from '../public/kong.jpeg'
import { SetStateAction, useEffect, useState } from 'react'
import Mint from '../components/Mint'
import Web3 from 'web3';
declare var window: any
import { Link } from 'react-router-dom'



export default function Home() {
  const [wallet, setWallet] = useState();
  const [status, setStatus] = useState({ message: null, type: null });
  const [maxSupply, setMaxSupply] = useState();
  const [totalSupply, setTotalSupply] = useState();

  const Web3 = require('web3')
  const rpcURL = "https://dev.kardiachain.io/"
  const web3 = new Web3(rpcURL)
  const contractABI = require('../contract-abi.json');
  const contractAddress = "0xf6FFA2a5685c2Ad53eEDa1197f54FFc1b22f5c1c";

  let contract = new web3.eth.Contract(contractABI, contractAddress);


  const getTotalSupply = async () => {
    await contract.methods.totalSupply().call()
      .then((d: any) => {
        setTotalSupply(d);
      })
  }

  async function getCurrentWallet(): Promise<void> {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      const account = accounts[0]
      setWallet(account)
    }
  }

  const walletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: SetStateAction<undefined>[]) => {
        setWallet(accounts[0])
      })
    }
  }

  useEffect(() => {
    getCurrentWallet();
    walletListener();
    getTotalSupply();
  }, [])


  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setWallet(account)
    } else {
      window.open('https://metamask.io/', '_blank');
    }
  }



  return (
    <div>

      <Head>
        <title>Kardia Kingdom</title>
        <meta name="description" content="" />
      </Head>

      <div className="App w-full min-h-screen">

        <section className="text-gray-600 body-font hero__section">
          {/* <img src="/bg.jpeg" alt="" className='absolute object-cover'/> */}
          <div className="container relative z-10 mx-auto flex items-start px-5 py-24 md:flex-row flex-col">
            <div className="lg:flex-grow md:w-[20%] lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center bg-gray-200 p-5 sm:p-10 rounded-lg">
              <h1 className="sm:text-4xl text-3xl mb-4 font-bold text-gray-900">Kardia Kingdom
              </h1>
              <p className="text-center sm:text-left h-fit leading-relaxed">Created by Moto - Kardia Kingdom is an Endless Realm Built on the KardiaChain Network. The main goal of Kardia Kingdom is to work to create a better world by giving back to people who need it the most. Kardia Kingdom as an entity is entirely Non Profit which means whenever there is profit - it will be put right back into the project for the holders/community or given out through various methods including airdrops, events, giveaways, and more.<br/> <br />

              Kardia Kingdom was created through the idea of building the first NFT community on the KardiaChain network. In order to kickstart this idea, we launched Kai Kongs - the very first algorithmically generated 10K PFP collection on the KardiaChain Network.<br /> <br />
              
              In order to build upon the idea of giving back, Kai Kongs were released at the mint price of 15 Kai/Kong ($0.10 at the time). Holding a Kai Kong is a monument to believing in our project since conception & we will not forget this. Kong holders will receive legacy airdrops/rewards for being such a strong part of our community & believing in our goals. <br /> <br />

              Kardia Kingdom collection holders will also receive future airdrops/rewards as well. The end goal of Kardia Kingdom as a marketplace is to allow creators/artists the ability to deploy their NFT art or collections onto the KardiaChain network. This will help the network & community grow which are two things we're working very hard towards.  Things are going to get very exciting - we have a lot planned.<br /> <br />

              If you're reading this - I would like to thank you personally for being here with us at such an early moment in the history of Kardia Kingdom - Moto 
              </p>

              
            </div>
            <div className="lg:max-w-lg md:w-1/2 w-full">

            </div>
          </div>
        </section>

        {/* <div className="home_wrapper wrapper flex justify-center items-center w-full min-h-screen">

        </div> */}

        <section className="text-gray-600 body-font" id='collections'>
          <div className="container px-5 py-24 mx-auto">

          <h1 className="sm:text-2xl text-3xl mb-10 font-bold text-gray-900 bg-[#f6f4f0] w-fit p-4 rounded-lg">Collections</h1>

            <div className="flex flex-wrap -m-4 justify-between">
              <div className="p-4 w-full sm:w-[30%]">
                <a href="/kongs">
                  <div className="border-2 border-gray-200 border-opacity-60 rounded-lg">
                    <div>
                      <Image className='rounded-t-lg' src={img1} width={600} height={600} alt="collections"></Image>
                    </div>
                    <div className="p-6 flex justify-between">
                      <h1 className="title-font text-lg text-center w-full font-medium text-gray-900"><b>Kai Kongs</b></h1>
                    </div>
                  </div>
                </a>
              </div>

              <div className="p-4 w-full sm:w-[30%]">
                <div className="border-2 border-gray-200 border-opacity-60 rounded-lg">
                  <div>
                    <Image className='rounded-t-lg' src={img2} width={600} height={600} alt="collections"></Image>
                  </div>
                  <div className="p-6">
                    <h1 className="title-font text-center text-lg font-medium text-gray-900"><b>???</b></h1>
                  </div>
                </div>
              </div>


              <div className="p-4 w-full sm:w-[30%]">
                <div className="border-2 border-gray-200 border-opacity-60 rounded-lg">
                  <div>
                    <Image className='rounded-t-lg' src={img3} width={600} height={600} alt="collections"></Image>
                  </div>
                  <div className="p-6">
                    <h1 className="title-font text-center text-lg font-medium text-gray-900"><b>???</b></h1>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </section>

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
      </div>
    </div>

  )
}
