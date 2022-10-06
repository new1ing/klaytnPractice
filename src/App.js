import { getBalance, readCount, setCount, fetchCardsOf } from './api/UseCaver';
import '/Users/new1ing/Bapp/klay-market/src/App.css';
import '/Users/new1ing/Bapp/klay-market/src/market.css';
import { useState } from 'react';
import QRcode from 'qrcode.react';
import * as KlipAPI from './api/UseKlip';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Container, Card, Nav, Form, Button } from 'react-bootstrap';
import { MARKET_CONTRACT_ADDRESS } from './constants/constants.cypress';

function onPressButton(balance) {
  console.log('hi');
}

const onPressButton2 = (_balance, _setBalance) => {
  _setBalance(_balance);
}
const DEFAULT_QR_CODE = 'DEFAULT';
const DEFAULT_ADDRESS = '0x0000000000000000000';

function App() {
  // readCount();
  // getBalance('0xF49Ea6d1C17a756B20A7F10087871aF8dCE7AF5d');


  // State Data (GlobalData, address, nft)
  const [nfts, setNfts] = useState([]);   // tokenID, tokenURI
  const [myBalance, setMyBalance] = useState('0');
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  // UI
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [tab, setTab] = useState("MARKET");   // MARKET, WALLET, MINT
  const [mintImageUrl, setMintImageUrl] = useState("");

  // Tab
  // mintInput

  //Modal

  // functions ->
  // fetchMarketNFTs
  const fetchMarketNFTs = async () => {
    // 배열의 형태로 nft 정보를 가져와야함
    // balanceOf -> 내가 가진 전체 NFT 토큰 개수를 가져온다
    // tokenOfOwnerByIndex -> 내가 가진 NFT token ID를 하나씩 가져오고
    // tokenURI -> 가져온 tokenID를 이용해서 tokenURI를 가져옴
    const _nfts = await fetchCardsOf(MARKET_CONTRACT_ADDRESS);
    setNfts(_nfts);
  };
  // fetchMyNFTs
  const fetchMyNFTs = async () => {
    // 배열의 형태로 nft 정보를 가져와야함
    // balanceOf -> 내가 가진 전체 NFT 토큰 개수를 가져온다
    // tokenOfOwnerByIndex -> 내가 가진 NFT token ID를 하나씩 가져오고
    // tokenURI -> 가져온 tokenID를 이용해서 tokenURI를 가져옴
    const _nfts = await fetchCardsOf(myAddress);
    setNfts(_nfts);
  };
  // onClickMint
  const onClickMint = async (uri) => {
    if (myAddress === DEFAULT_ADDRESS) alert("NO ADDRESS");
    const randomTokenId = parseInt(Math.random() * 10000000);
    KlipAPI.mintCardWithURI(myAddress, randomTokenId, uri, setQrvalue, (result) => {
      alert(JSON.stringify(result));
    })
  }
  // onClickMyCard
  // onClickMarketCard

  // getUserData
  const getUserData = () => {
    KlipAPI.getAddress(setQrvalue, async (address) => {
      setMyAddress(address);
      const _balance = await getBalance(address);
      setMyBalance(_balance);
    });
  };

  return (
    <div className="App">
      <div style={{ backgroundColor: "black", padding: 10 }}>
        {/* 주소 잔고 */}
        <div style={{ fontSize: 30, fontWeight: "bold", paddingLeft: 5, marginTop: 10 }}>내 지갑</div>
        {myAddress}
        <br />
        <Alert variant={"balance"} style={{ backgroundColor: "pink", fontSize: 25 }} onClick={getUserData}>{myBalance}</Alert>
        {/* Qrcode UI */}
        <Container style={{ backgroundColor: "white", width: 300, height: 300, padding: 20 }}>
          <QRcode value={qrvalue} size={256} style={{ margin: "auto" }} />
        </Container>

        {/* 갤러리(마켓, 내 지갑) */}
        {tab === "MARKET" || tab === "WALLET" ? (
          <div className="container" style={{ padding: 0, width: "100%" }}>
            {nfts.map((nft, index) => (
              <Card.Img className="img-responsive" src={nfts[index].uri} />
            ))}
          </div>
        ) : null};

        {/* 발행 페이지 */}
        {tab === "MINT" ? (
          <div className='container' style={{ padding: 0, width: "100%" }}>
            <Card className='text-center' style={{ color: "black", height: "50%", borderColor: "#C5B358" }}>
              <Card.Body style={{ opacity: 0.9, backgroundColor: "black" }}>
                {mintImageUrl !== "" ? (
                  <Card.Img src={mintImageUrl} height={"50%"} />
                ) : null}

                <Form>
                  <Form.Group>
                    <Form.Control
                      value={mintImageUrl}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setMintImageUrl(e.target.value);
                      }}
                      type="text"
                      placeholder='이미지 주소를 입력해주세요'
                    />
                  </Form.Group>
                  <br />
                  <Button onClick={() => { onClickMint(mintImageUrl) }}
                    variant="primary"
                    style={{ backgroundColor: "#810034", borderColor: "#810034" }}>
                    발행하기
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        ) : null}

      </div>

      <button onClick={fetchMyNFTs}>
        NFT 가져오기
      </button>

      {/* 모달 */}

      {/* 탭 */}
      <nav style={{ backgroundColor: "#1b1717", height: 45 }} className="navbar fixed-bottom navbar-light" role="navigation">
        <Nav className="w-100">
          <div className="d-flex flex-row justify-content-around w-100">
            <div onClick={() => {
              setTab("MARKET");
              fetchMarketNFTs();
            }}
              className="row d-flex flex-column justify-content-center align-items-center">
              <div>MARKET</div>
            </div>

            <div onClick={() => {
              setTab("MINT");
            }}
              className="row d-flex flex-column justify-content-center align-items-center">
              <div>MINT</div>
            </div>

            <div onClick={() => {
              setTab("WALLET");
              fetchMyNFTs();
            }}
              className="row d-flex flex-column justify-content-center align-items-center">
              <div>
                WALLET
              </div>
            </div>

          </div>
        </Nav>
      </nav>
    </div >
  );
}

export default App;
