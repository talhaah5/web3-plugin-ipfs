import { readFileSync } from "fs";
import { CID } from "ipfs-http-client";
import { Web3PluginBase } from "web3";
import { IpfsClient } from "./utils/ipfs-client";

export class IPFSPlugin extends Web3PluginBase {
  public pluginNamespace = "ipfs";

  constructor(
    private ipfsHost: string,
    private ipfsApiKey: string,
    private ipfsSecretKey: string
  ) {
    super();
  }

  async storeFile(fileSrc: string): Promise<CID> {
    const file = readFileSync(fileSrc).buffer;
    try {
      const ipfsClient = IpfsClient.getInstance(
        this.ipfsHost,
        this.ipfsApiKey,
        this.ipfsSecretKey
      ).client;

      const { cid } = await ipfsClient.add(file);
      return cid;
    } catch (err) {
      console.log(err);
      throw Error("Error storing file on IPFS");
    }
  }
}

// Module Augmentation
declare module "web3" {
  interface Web3Context {
    ipfs: IPFSPlugin;
  }
}
