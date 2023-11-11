import { ContractAbi } from "web3";

export const REGISTRY_ABI: ContractAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      { indexed: true, internalType: "string", name: "cid", type: "string" },
    ],
    name: "CIDStored",
    type: "event",
  },
  {
    inputs: [{ internalType: "string", name: "cid", type: "string" }],
    name: "store",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
