import React,{useEffect,useState} from "react";

import {
  Box,
  Text,
  Meter,
  ResponsiveContext
} from "grommet";

import {
  relayInit,
  SimplePool,
  nip05
} from 'nostr-tools'

const relays = [
  'wss://relay.damus.io',
  'wss://eden.nostr.land',
  'wss://nostr-pub.wellorder.net',
  'wss://relay.nostr.info',
  'wss://relay.snort.social',
  'wss://nostr-01.bolt.observer'
]

const pool = new SimplePool()


const BarMeter = () => {
  const size = React.useContext(ResponsiveContext);
  const [value,setValue] = useState(48);

  useEffect(() => {




    let sub = pool.sub(
      relays,
      [
        {
          authors: [
            "6c423c7ce2f1f848c7235fb830136b1242d8530d329e2fe103d21b71f25edb8a"
          ],
          kinds: [0]
        }
      ]
    )

    sub.on('event', data => {
      console.log(data);
      const content = JSON.parse(data.content);
      if(!isNaN(Number(content.about)) && Number(content.about) > 0){
        if(Number(content.about > 100)){
          setValue(100);
        } else {
          setValue(content.about);
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
