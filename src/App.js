import { useState, useEffect, useMemo, useCallback } from 'react';

import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

import {
  Box,
  Layer,
  Text,
  Anchor,
  ThemeContext
} from 'grommet';
import { ethers } from "ethers";
import { ChatBox } from '@orbisclub/modules'
import "@orbisclub/modules/dist/index.modern.css";
//import { User,Connect,Nodes,Help,Projects,Clock } from 'grommet-icons';
import ReactGA from "react-ga4";

import { AppContext, useAppState } from './hooks/useAppState'

import useWeb3Modal from './hooks/useWeb3Modal'
import useGraphClient from './hooks/useGraphClient';

import Buy from './pages/PreSale';

import MainMenu from './components/MainMenu';
import DappFooter from './components/DappFooter';

import abis from "./contracts/abis";
import addresses from "./contracts/addresses";


ReactGA.initialize('G-DW0T7403L8',{
  debug: true,
  titleCase: false
});


export default function App() {

  const { state, actions } = useAppState();

  const [srg, setSrg] = useState();
  const [srgV1, setSrgV1] = useState();
  const [goldList, setGoldList] = useState();
  const [stablecoins, setStablecoins] = useState();


  const {
    provider,
    coinbase,
    netId,
    loadWeb3Modal
  } = useWeb3Modal();

  const {
    client,
    initiateClient,
    getStablecoins,
    getStakes
  } = useGraphClient();


  const getStablecoinsBalance = useCallback(async () => {
    if (!stablecoins) return;

    const stableCoinsList = stablecoins.map((stableCoin) => stableCoin.id);

    let balance = 0;
    for (const stablecoin of stableCoinsList) {
      let erc20 = new ethers.Contract(stablecoin, abis.srg, provider);
      balance += Number(ethers.utils.formatEther(await erc20.balanceOf(state.coinbase)));
    }
    return (balance);

  }, [provider, stablecoins, state.coinbase])


  useEffect(() => {
    actions.setProvider(provider)
  }, [provider])
  useEffect(() => {
    actions.setCoinbase(coinbase)
  }, [coinbase]);


  useEffect(() => {
    actions.setGetStablecoinsBalance(getStablecoinsBalance);
  }, [getStablecoinsBalance])

  useEffect(() => {
    if (coinbase && srg) {
      srg.balanceOf(coinbase).then(newBalance => {
        actions.setCoinbaseBalance(newBalance);
        srg.on("Transfer", async (from, to, value) => {
          if (
            from.toLowerCase() === coinbase.toLowerCase() ||
            to.toLowerCase() === coinbase.toLowerCase()
          ) {
            const newBalance = await srg.balanceOf(coinbase);
            actions.setCoinbaseBalance(newBalance);
          }
        });
      });
    }
  }, [coinbase, srg]);

  useEffect(() => {
    if (goldList && srg) {
      srg.balanceOf(goldList.address).then(newGoldListBalance => {
        actions.setGoldListBalance(newGoldListBalance.toString());
        srg.on("Transfer", async (from, to, value) => {
          if (
            from.toLowerCase() === goldList.address.toLowerCase() ||
            to.toLowerCase() === goldList.address.toLowerCase()
          ) {
            const newGoldListBalance = await srg.balanceOf(goldList.address);
            actions.setGoldListBalance(newGoldListBalance.toString());
          }
        });
      });
    }
  }, [goldList, srg]);

  useEffect(() => {
    if (srgV1 && coinbase) {
      srgV1.balanceOf(coinbase).then(balance => {
        actions.setSrgV1Balance(balance);
        srgV1.on("Transfer", async (from, to, value) => {
          if (
            from.toLowerCase() === coinbase.toLowerCase()
          ) {
            const newSrgV1Balance = await srgV1.balanceOf(coinbase);
            actions.setSrgV1Balance(newSrgV1Balance);
          }
        });
      });
    }
  }, [srgV1, coinbase]);




  useEffect(() => {
    actions.setNetId(netId)
  }, [netId])
  useEffect(() => {
    actions.setSrg(srg)
  }, [srg])
  useEffect(() => {
    actions.setSrgV1(srgV1)
  }, [srgV1])
  useEffect(() => {
    actions.setGoldList(goldList)
  }, [goldList])
  useEffect(() => {
    actions.setLoadWeb3Modal(loadWeb3Modal)
  }, [loadWeb3Modal])

  useEffect(() => {
    actions.setStablecoins(stablecoins)
  }, [stablecoins])



  useEffect(() => {
    initiateClient(netId);
  }, [netId]);
  useEffect(() => {
    // Goerli

    let newSrg, newGoldList, newColdStaking, newSrgV1
    // Mumbai
    if (netId === 80001) {
      newSrg = new ethers.Contract(addresses.srg.mumbai, abis.srg, provider);
      newGoldList = new ethers.Contract(addresses.goldList.mumbai, abis.goldList, provider);
      newSrgV1 = new ethers.Contract(addresses.srgV1.mumbai, abis.srg, provider);
    }
    if (netId === 56) {
      newSrg = new ethers.Contract(addresses.srg.bsc, abis.srg, provider);
      newGoldList = new ethers.Contract(addresses.goldList.bsc, abis.goldList, provider);
      newColdStaking = new ethers.Contract(addresses.coldStaking.bsc, abis.coldStaking, provider);
      newSrgV1 = new ethers.Contract(addresses.srgV1.bsc, abis.srg, provider);
    }
    setSrg(newSrg);
    setGoldList(newGoldList);
    setSrgV1(newSrgV1);
  }, [netId]);
  useMemo(async () => {
    if (client && !stablecoins) {
      const stablecoinsResult = await getStablecoins();
      const newStablecoins = await Promise.all(
        stablecoinsResult.data.stablecoins.map(async item => {
          const contract = new ethers.Contract(item.id, abis.srg, provider);
          const name = await contract.name();
          const symbol = await contract.symbol();
          return ({
            id: item.id,
            name: name,
            symbol: symbol
          });
        })
      );
      setStablecoins(newStablecoins);
      actions.setGetStakes(getStakes)
    }
  }, [client, stablecoins])



  const getExpectedSrg = async (total) => {
    const amount = await goldList.getAmountOfTokens(ethers.utils.parseEther(total).toString());
    return (amount.toString() / 10 ** 18);
  }

  return (
    <AppContext.Provider value={{ state, actions }} >
      <ThemeContext.Extend
        value={
          {
            text: {
              font: {
                family: "'Exo 2'"
              }
            },
            meter: {
              color: "#FAC73F"
            },
            anchor: {
              color: "#ffcc00"
            },
            global: {
              hover: {
                color: "white"
              },
              focus: {
                border: {
                  color: "none"
                }
              },
              colors: {
                control: '#ffcc00'
              },
              font: {
                weight: 600,
                family: "Exo 2"
              }
            },
            select: {
              options: {
                text: {
                  color: "#ffcc00"
                }
              },
              clear: {
                text: {
                  color: "black"
                }
              },
              control: {
                extend: {
                  color: "black"
                }
              }
            }
          }
        }
      >
        <Router >
          {
            /*
            <ChatBox context="kjzl6cwe1jw14808eb8yfpg3g3olvhi4os1n089xyoji6jekrsit97xtxyo9t0z" poweredByOrbis="black" />
            */
          }
          <Box>
            <MainMenu />
            {
              netId !== 80001 && //netId !== 137 && netId !== 5 && netId !== 56 &&
              <Box align="center" >
                <Layer background="status-error" responsive={false}>
                  <Box width="medium" pad="large">
                    <Text textAlign="center"><Anchor color="white" weight="bold" href="https://chainlist.network/" target="_blank">Please connect to Mumbai network</Anchor></Text>
                  </Box>
                </Layer>
              </Box>
            }
            <Box pad={{ top: "xxsmall", bottom: "small" }} height="large" flex={false}>
              <Routes>
                <Route path="/" element={<Buy />} />

                <Route render={() => {

                  return (
                    <Navigate to="/" />
                  );

                }} />
              </Routes>
            </Box>
            <DappFooter height="small" />
          </Box>
        </Router>
      </ThemeContext.Extend>
    </AppContext.Provider>
  )
}
