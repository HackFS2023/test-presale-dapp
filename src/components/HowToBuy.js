import React from 'react';

import {
  Box,
  Text,
  Paragraph,
  Anchor,
  ResponsiveContext,
} from 'grommet';

import { useAppContext } from '../hooks/useAppState';





export default function HowToBuy() {

  const { state } = useAppContext();

  const size = React.useContext(ResponsiveContext);
  return (
    <Box gap="large">
      <Box gap="large" pad={{top: "large",horizontal: size}}>
        <Box align="justify" alignSelf="center" gap="small" width="large">
          <Text color="#FFFFFF" size={"medium"}>
            Please Contact a <Anchor  href="https://t.me/LumiShareLUMI" target="_blank">Telegram Mod</Anchor> for any Questions | Or Email us at: <Anchor href="mailto:Info@Lumishare.io" target="_blank">Info@Lumishare.io</Anchor>
          </Text>
          <Text color="#FFFFFF" size={"medium"}>
            Please use only these 3 browsers for Safe Purchase of LUMI Tokens: <b>Chrome</b>, <b>Mozilla</b> or <b>Brave</b>.
          </Text>
          <Text color="#FFFFFF" size={"medium"}>
            Our Official Smart Contract address for LUMI Tokens on Binance Smart Chain (BSC) is:
            <Anchor
              href={`https://bscscan.com/address/${state.srg?.address}`}
              target="_blank"
              color="white"
              size={"small"}
              style={{
                overflowX: "hidden"
              }}
            > {state.srg?.address}</Anchor>
          </Text>
          <Text color="#FFFFFF" size={"medium"}>
            LUMI Tokens can be bought using Stable Coins only, like: BUSD, USDC, USDT, DAI only.
          </Text>
          <Text color="#FFFFFF" size={"medium"}>
            To Buy LUMI Tokens Your web3 wallet (Metamask or Trust wallet) must have a minimum balance of $5 Worth of BNB to purchase LUMI Tokens in order to pay the gas fees of the BSC Blockchain network.
          </Text>
          <Text color="#FFFFFF" size={"medium"}>
            Earn 5% referral income in stable coins when people buy LUMI Tokens using your unique referral link
          </Text>
        </Box>
      </Box>
      <Box align="center" alignSelf="center" gap="medium" width="large">
        <Text
          className="white-anchor"
          textAlign="center"
          size="medium">
          How To Buy LUMI ?
        </Text>
        <Box direction="row-responsive">
          <Box alignSelf="center" align="center" pad="small" width="large" >
            <iframe width="100%" height="300px" src="https://www.youtube.com/embed/Epxj6bgrhY8" title="How to Buy LUMI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          </Box>
          <Box alignSelf="center" align="center" pad="small" width="large" >
            <iframe width="100%" height="300px" src="https://www.youtube.com/embed/WllalBUyd5c" title="How to Buy LUMI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          </Box>
        </Box>
      </Box>
      <Box  aling="center" alignSelf="center">
        <Paragraph
          color="#FC5C5C"
          textAlign="center"
        >
          Please be aware of scams
        </Paragraph>
      </Box>
    </Box>
  )
}
