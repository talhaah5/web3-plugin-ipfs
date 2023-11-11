import { readFileSync } from "fs";
import { CID } from "ipfs-http-client";
import {
  Web3PluginBase,
  Address,
  Contract,
  ContractAbi,
  Web3Context,
  TransactionReceipt,
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

  async getCidEventsByAddress(address: string): Promise<void> {

    const event = await this.registryContract.getPastEvents(
      'CIDStored' as any,
      {
        filter: { owner: address },
        fromBlock: 'earliest',
      },
    );

    console.log(event);
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
