import {useState} from 'react'
// import Web3 from 'web3'
declare var window: any

const networks = {
    shardeum: {
        chainId: `0x${Number(24).toString(16)}`,
        chainName: "KardiaChain Mainnet",
        nativeCurrency: {
            name: "KAI",
            symbol: "KAI",
            decimals: 18
        },
        rpcUrls: ["https://dev.kardiachain.io/"],
        blockExplorerUrls: ["https://explorer.kardiachain.io/"],
    }
}

const Mint = (props: any) => {
    const [qty, setQty] = useState(1);
    const Web3 = require('web3');
    let web3 = new Web3(Web3.givenProvider);
    const contractABI = require('../contract-abi.json')
    const contractAddress = "0xf6FFA2a5685c2Ad53eEDa1197f54FFc1b22f5c1c"
    
    let contract = new web3.eth.Contract(contractABI, contractAddress);  
    const [isMinting, setIsMinting] = useState(false);



    const mint = async () => {
        if (window.ethereum){
            setIsMinting(true);
            props.setStatus({message: "", type: ""})


            if (qty > 3){
                setIsMinting(false);
                props.setStatus({message: `Max 3 allowed.`, type: "error"})
                return;
            }
            
            const currentNetwork = await web3.eth.net.getId()
            await currentNetwork;

            console.log(currentNetwork);

            if (currentNetwork != "242"){

                try{
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [{...networks["shardeum"]}]
                    })
                } catch(err){
                    if(err instanceof Error){
                        setIsMinting(false);
                        props.setStatus({message: `Please switch to KardiaChain.`, type: "error"})
                    }
                }
            }

            const cost = 15000000000000000000;
            const _amount = Number(qty)
            const totalCost = cost * _amount;

            try {
                const tx = await contract.methods.mint(window.ethereum.selectedAddress, _amount).send({from: window.ethereum.selectedAddress, value: totalCost})
                await tx
                props.setStatus({message: "Mint Successfull 🎉", type: "success"})
                setIsMinting(false);
                props.getTotalSupply();

            } catch (err){
                if (err instanceof Error){
                    props.setStatus({message: `${err.message}`, type: "error"})
                }
                setIsMinting(false);
            }

            setQty(1);
        }
    }
    
    return (
        <div className='mint__control'>
            <div className="flex gap-2">
                <input type="number" name="qty" id="qty" placeholder="Qty" className="border text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 text-black focus:ring-[#e51d38] focus:border-[#e51d38]" min="1" max="3" onChange={(e) => setQty(Number(e.target.value))}  />

                <button onClick={mint} className="w-full flex justify-center items-center bg-[#44912d] hover:bg-[sky-700] text-white font-bold py-2 px-4 rounded-lg inline-flex">
                    <span>{!isMinting ? 'Mint (15 KAI)' : 'Minting ...'}</span>
                </button>
            </div>
        </div>
    )
}

export default Mint