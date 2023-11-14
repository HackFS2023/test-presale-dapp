import React,{ useState,useEffect } from 'react';

import {
  Box,
  Button,
  Layer,
  Text,
  Image,
  Tip,
  ResponsiveContext,
} from 'grommet';

import {
  useParams
} from 'react-router-dom';


import styled from "styled-components";
import { ethers } from "ethers";
import { Copy } from 'grommet-icons';

import { useAppContext } from '../hooks/useAppState';
//import useOrbis from '../hooks/useOrbis';

import GoldListModal from './BuySection/GoldListModal';
import BarMeter from './BuySection/BarMeter';
import Stablecoins from './BuySection/Stablecoins';



const StyledLayerBuy = styled(Layer)`
  border: 1px solid var(--lines);
  background: #FFFFFF 0% 0% no-repeat padding-box;
  box-shadow: 0px 10px 15px #00000054;
  border: 1px solid #E5E8EB;
  border-radius: 15px;
  opacity: 1;
  width: 355px;
  height: 447px;
`;



export default function BuySection(props) {

  const { state } = useAppContext();
  //const { connectSeed, addWallet, isUnderVerification } = useOrbis();

  const [value, setValue] = useState("Native");
  const [busd, setBusd] = useState();
  const [show, setShow] = useState();

  const [copy_status,setCopyStats] = useState("Click to Copy")

  const { uri } = useParams();
  const size = React.useContext(ResponsiveContext);

  const buyTokens = async (total) => {
    const signer = state.provider.getSigner();
    const goldListWithSigner = state.goldList.connect(signer);
    const amount = ethers.utils.parseEther(total).toString();
    const refAddr = localStorage.getItem("refAddr") ? localStorage.getItem("refAddr") : ethers.constants.AddressZero;
    let tx;
    if (value === "Native") {
      tx = await goldListWithSigner.claimTokensWithNative(refAddr,false,{
        value: amount
      });
    } else {
      const allowance = await busd.allowance(state.coinbase, state.goldList.address);
      if (Number(amount) > allowance) {
        const busdWithSigner = busd.connect(signer);
        const txApproval = await busdWithSigner.approve(state.goldList.address, amount);
        await txApproval.wait();
      }
      tx = await goldListWithSigner.claimTokensWithStable(busd.address, amount,refAddr,true);
    }

    await tx.wait();


  }


  const getExpectedSrg = async (total) => {
    const amount = await state.goldList.getAmountOfTokens(ethers.utils.parseEther(total).toString());
    return (amount.toString() / 10 ** 18);
  }



  return (
    <Box margin={{ horizontal: "7%" }} gap="medium" alignSelf="center" align="center" >
      <Box pad={{top: "xlarge"}}>
      {
        !state.coinbase &&
        <Button primary className="btn-primary" size={size} label="Connect" onClick={state.loadWeb3Modal} />

      }
      </Box>
      {
        state.coinbase &&
        <>
        {
          show &&
          <StyledLayerBuy
            onEsc={() => {
              setShow(false);
            }}
            onClickOutside={() => {
              setShow(false);
            }}
          >
            <Box align="left" pad="medium">
              <Text style={{
                textAlign: "left",
                font: "normal normal 600 20px/40px Exo 2",
                letterSpacing: "0px",
                color: "black",
                opacity: 1,
                paddingBottom: "20px"
              }}>Payment method</Text>

            </Box>

            {
              (
                value === "Native" ||
                (
                  value === "Stablecoin" && busd
                )
              ) &&
              <GoldListModal
                value={value}
                busd={busd}
                buyTokens={buyTokens}
                getExpectedSrg={getExpectedSrg}
              />
            }
          </StyledLayerBuy>
        }
        <Box direction="row" alignSelf="center" gap="medium">
          <Button
            primary
            size={size}
            color="#ffcc00"
            className="btn-primary"
            onClick={() => setShow(true)}
            label="Buy"
            reverse={true}
            icon={<Image src={require("../assets/lumi_button_icon.png")} fit="cover" />}
          />
        </Box>
      </>
    }
    </Box>
  )
}
