import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {},
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {},
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {},
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };

