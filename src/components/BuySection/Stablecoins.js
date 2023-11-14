import { useState,useEffect } from 'react';

import {
  Box,
  Select,
  Text
} from 'grommet';
import { ethers } from "ethers";

import abis from "../../contracts/abis";

import { useAppContext } from '../../hooks/useAppState';


export default function Stablecoins(props) {


  const { state } = useAppContext();

  const [value,setValue] = useState();
  const [busdBalance, setBalance] = useState();


  useEffect(() => {
    const items = state.stablecoins.filter(item => {
      return item.symbol === value
    });
    const newBusd = new ethers.Contract(items[0].id,abis.srg,props.provider);
    props.setBusd(newBusd);
  },[value])


  useEffect(() => {
    if(props.busd  && state.coinbase){
      props.busd.balanceOf(state.coinbase).then(newBalance => {
        setBalance(newBalance.toString());
        props.busd.on("Transfer", async (from,to,value) => {
          if(
            from.toLowerCase() === state.coinbase.toLowerCase() ||
            to.toLowerCase() === state.coinbase.toLowerCase()
          ){
            const newBalance = await props.busd.balanceOf(state.coinbase);
            setBalance(newBalance.toString());
          }
        });
      });
    }
  },[props]);

  return (

      <Box align="center" pad="medium" className="select" margin={{top:"xsmall"}}>
      {
        state.stablecoins &&
        <>
        <Select

          options={state.stablecoins.map(item => item.symbol)}
          value={value}
          onChange={({ option }) => {
            setValue(option)
          }}
          color="black"
        />
        {
          busdBalance &&
          <Text color="black" size="xsmall">Balance: {Number(ethers.utils.formatEther(busdBalance)).toFixed(2)}</Text>
        }
        </>
      }
      </Box>

  )
}
