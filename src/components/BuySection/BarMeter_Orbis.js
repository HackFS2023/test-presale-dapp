import React,{useEffect,useState} from "react";

import {
  Box,
  Text,
  Meter,
  ResponsiveContext
} from "grommet";

import { Orbis } from "@orbisclub/orbis-sdk";

let orbis = new Orbis();


const BarMeter = () => {
  const size = React.useContext(ResponsiveContext);
  const [value,setValue] = useState(60);

  useEffect(() => {
    orbis.getProfile("did:pkh:eip155:1:0x853bce6243f85a3291df47b2242a1cb688c4e5c6").then(({ data, error }) => {
      if(!isNaN(Number(data.details?.profile?.description)) && Number(data.details?.profile?.description) > 0){
        if(Number(data.details.profile.description > 100)){
          setValue(100);
        } else {
          setValue(data.details.profile?.description);
        }
      }
    });
  },[]);

  return(
    <Box align="center" alignSelf="center" gap="small" float={false}>
      <Box direction="row" gap="xsmall" alignSelf="left" align="left">
        <Text className="exo_heading" size="small" color="white">Progress of LUMI sales</Text>
        <Text className="golden_heading" size="medium">{value}%</Text>
      </Box>
      <Meter
        values={[{
          value: value,
          label: value,
        }]}
        thickness="medium"
        round={true}
        aria-label="meter"
      />
    </Box>
  )
}



export default BarMeter;
