import { readFileSync } from "fs";
import { CID } from "ipfs-http-client";
import {
  Web3PluginBase,
  Address,
  Contract,
  ContractAbi,
  Web3Context,
  TransactionReceipt,
  eth,
  FMT_NUMBER,
} from "web3";
import { IpfsClient } from "./utils/ipfs-client";
import { REGISTRY_ABI } from "./contracts/registry";
import { REGISTRY_CONTRACT_ADDRESS } from "./constants";

export class IPFSPlugin extends Web3PluginBase {
  public pluginNamespace = "ipfs";
  private readonly registryContract: Contract<typeof REGISTRY_ABI>;

  constructor(
    private options: {
      ipfsHost: string;
      ipfsApiKey: string;
      ipfsSecretKey: string;
      registryAbi?: ContractAbi;
      registryContractAddress?: Address;
    }
  ) {
    super();

    this.options.registryAbi = options?.registryAbi ?? REGISTRY_ABI;

    this.options.registryContractAddress =
      options?.registryContractAddress ?? REGISTRY_CONTRACT_ADDRESS;

    this.registryContract = new Contract<typeof REGISTRY_ABI>(
      this.options.registryAbi,
      this.options.registryContractAddress
    );

    this.link(this);
  }

  async storeFile(fileSrc: string): Promise<CID> {
    const file = readFileSync(fileSrc).buffer;
    try {
      const ipfsClient = IpfsClient.getInstance(
        this.options.ipfsHost,
        this.options.ipfsApiKey,
        this.options.ipfsSecretKey
      ).client;

      const { cid } = await ipfsClient.add(file);
      return cid;
    } catch (err) {
      console.log(err);
      throw Error("Error storing file on IPFS");
    }
  }

  async sendTransactionToRegistry(
    account: string,
    cid: string
  ): Promise<TransactionReceipt> {
    try {
      if (this.registryContract.methods.store === undefined) {
        throw new Error("Provided registryAbi is missing store method");
      }

      const tx: TransactionReceipt = await await (
        this.registryContract.methods as any //added any because of issue https://github.com/web3/web3.js/issues/6275
      )
        .store(cid)
        .send({
          from: account,
        });

      return tx;
    } catch (error) {
      console.error("An error occurred during the transaction process:", error);
      throw error;
    }
  }

  async getCidEventsByAddress(
    address: string, 
    fromBlockNumber = 4546394 // creation of Registry contract https://sepolia.etherscan.io/block/4546394
    ): Promise<void> {

      const chunkLimit = 5000 //max limit of events per request
    
      const toBlockNumber = +(await eth.getBlockNumber(this, FMT_NUMBER.NUMBER as any))
      const totalBlocks = toBlockNumber - fromBlockNumber
      const chunks = []

      if (chunkLimit > 0 && totalBlocks > chunkLimit) {
        const count = Math.ceil(totalBlocks / chunkLimit)
        let startingBlock = fromBlockNumber

        for (let index = 0; index < count; index++) {
          const fromRangeBlock = startingBlock
          const toRangeBlock =
            index === count - 1 ? toBlockNumber : startingBlock + chunkLimit
          startingBlock = toRangeBlock + 1

          chunks.push({ fromBlock: fromRangeBlock, toBlock: toRangeBlock })
        }
      } else {
        chunks.push({ fromBlock: fromBlockNumber, toBlock: toBlockNumber })
      }

      for (const chunk of chunks) {
        try{
          const events = await this.registryContract.getPastEvents(
            'CIDStored' as any,
            {
              filter: { owner: address },
              fromBlock: chunk.fromBlock,
              toBlock: chunk.toBlock
            }
          )
          if(events.length > 0){
            console.log(events)
          }
        }catch(err){
          console.log(err)
        }
      }

  }

  public link(parentContext: Web3Context) {
    super.link(parentContext);
    this.registryContract.link(parentContext);
  }
}

// Module Augmentation
declare module "web3" {
  interface Web3Context {
    ipfs: IPFSPlugin;
  }
}
