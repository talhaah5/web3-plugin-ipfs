import { Web3, core } from "web3";
import { IPFSPlugin } from "../src";

describe("TemplatePlugin Tests", () => {
  const host = "ipfs.infura.io:5001";
  const apiKey = '2Y0JPCktAnUI9DTMERJ3BfIvs9Q'
  const secret = '494bfcba49e00d9a9d5fcc5bd1e6c3b2'
  it("should register IPFSPlugins on Web3Context instance", () => {
    const web3Context = new core.Web3Context("http://127.0.0.1:8545");
    web3Context.registerPlugin(new IPFSPlugin({
      ipfsHost: host, 
      ipfsApiKey: apiKey, 
      ipfsSecretKey: secret
    }));
    expect(web3Context.ipfs).toBeDefined();
  });

  describe("IPFSPlugins method tests", () => {
    let web3: Web3;

    it("should store file on IPFS and register to contract", async () => {
      web3 = new Web3(("https://sepolia.drpc.org"));
      web3.eth.accounts.wallet.add('0xf0ce7ced295a088f3673d764adf52bdd48110ee5efe39ebf02ca3ac18453bad0');
      web3.registerPlugin(new IPFSPlugin({
        ipfsHost: host, 
        ipfsApiKey: apiKey, 
        ipfsSecretKey: secret
      }));
      const cid = await web3.ipfs.storeFile("test/test.txt");
      await web3.ipfs.sendTransactionToRegistry(web3.eth.accounts.wallet[0].address, cid.toString());
      console.log(cid);
    },70000);
  });
});
