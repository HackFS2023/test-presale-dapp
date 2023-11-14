import React from 'react';

import Banner from '../components/Banner';
import BuySection from '../components/BuySectionNoKYC';

import HowToBuy from '../components/HowToBuy';

import {
  Box,
} from 'grommet';



export default function PreSale() {
  return (
    <>
    <Box flex={false} align="center">
      <Box pad={{top:"medium"}} alignContent="center"  width="large" >
        <BuySection/>
      </Box>
    </Box>
    </>
  )
}
