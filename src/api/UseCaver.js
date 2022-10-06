import Caver, { Contract } from 'caver-js';
import CounterABI from '../abi/CounterABI.json';
// import KIP17ABI from '../abi/KIP17TokenABI.json';
import { COUNT_CONTRACT_ADDRESS, ACCESS_KEY_ID, SECRET_ACCESS_KEY, PRIVATE_KEY, CHAIN_ID, NFT_CONTRACT_ADDRESS } from '../constants';

const option = {
    headers: [
        {
            name: "Authorization",
            value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64")
        },
        { name: "x-chain-id", value: CHAIN_ID }
    ]
}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));  // 실행할 주소의 역할
// const CountContract = new caver.contract(CounterABI, COUNT_CONTRACT_ADDRESS);  // 실행시킬 컨트랙트의 데이터,
const NFTContract = new caver.contract(CounterABI, NFT_CONTRACT_ADDRESS);   // KIP17 변경필요


export const fetchCardsOf = async (address) => {
    // fetch balance, fetch token IDs, fetch token URIs
    const balance = await NFTContract.methods.balanceOf(address).call();
    console.log(`[NFT Balance] ${balance}`);
    // tokenId 값 가져오기
    const tokenIds = [];
    for (let i = 0; i < balance; i++) {
        const id = await NFTContract.methods.tokenOfOwnerByIndex(address, i).call();
        tokenIds.push(id);
    };
    // tokenURI 값 가져오기
    const tokenURIs = [];
    for (let i = 0; i < balance; i++) {
        const uri = await NFTContract.methods.tokenURI(tokenIds[i]).call();
        tokenURIs.push(uri);
    };
    // 가져온 값들을 nft 배열로 push.
    const nfts = [];
    for (let i = 0; i < balance; i++) {
        nfts.push({ uri: tokenURIs[i], id: tokenIds[i] });
    }
    console.log(nfts);
    return nfts;
};


// 컨트랙트의 count 함수를 호출한다.
// export const readCount = async () => {
//     const _count = await CountContract.methods.count().call();
//     console.log(_count);
// }

export const getBalance = (address) => {
    return caver.rpc.klay.getBalance(address).then((res) => {   // 계정의 klay 잔고를 가져온다.
        const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(res));   // hexToNumberString() -> 읽을 수 있는 16진수로 변환,
        // convertFromPeb() -> klay 단위로 변경.
        console.log(`BALANCE: ${balance}`);
        return balance;
    })
}

// KAS(Klatn Api Service) -> 스마트 컨트랙트를 읽고 사용하는 것을 도와준다.
// caver-js -> 코드를 컴퓨터가 이해하는 16진수로 변환해주는 역할.

// setCount()
// 주석처리 해제 필요 ->>
// export const setCount = async (newCount) => {
//     try {
//         const deployer = caver.wallet.keyring.createFromPrivateKey(PRIVATE_KEY);
//         caver.wallet.add(deployer);

//         const receipt = await CountContract.methods.setCount(newCount).send({
//             from: deployer.address,
//             gas: "0x4bfd200"
//         })
//         console.log(receipt);
//     } catch (e) {
//         console.log(`ERROR: ${e}`);
//     }
// }
