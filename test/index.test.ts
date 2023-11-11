import { Web3, core } from "web3";
import { IPFSPlugin } from "../src";

describe("TemplatePlugin Tests", () => {
  const host = "ipfs.infura.io:5001";
  const apiKey = "";
  const secret = "";
  it("should register IPFSPlugins on Web3Context instance", () => {
    const web3Context = new core.Web3Context("http://127.0.0.1:8545");
    web3Context.registerPlugin(
      new IPFSPlugin({
        ipfsHost: host,
        ipfsApiKey: apiKey,
        ipfsSecretKey: secret,
      })
    );
    expect(web3Context.ipfs).toBeDefined();
  });

  describe("IPFSPlugins method tests", () => {
    let web3: Web3;

    xit("should store file on IPFS and register to contract", async () => {
      web3 = new Web3("https://sepolia.drpc.org");
      web3.eth.accounts.wallet.add(
        "PRIVATE_KEY"
      );
      web3.registerPlugin(
        new IPFSPlugin({
          ipfsHost: host,
          ipfsApiKey: apiKey,
          ipfsSecretKey: secret,
        })
      );
      const cid = await web3.ipfs.storeFile("test/test.txt");
      await web3.ipfs.sendTransactionToRegistry(
        web3.eth.accounts.wallet[0].address,
        cid.toString()
      );
      console.log(cid);
    }, 7000000);

    it("should get all CID events from contract of specific address", async () => {
      web3 = new Web3("https://sepolia.drpc.org");
      web3.registerPlugin(
        new IPFSPlugin({
          ipfsHost: host,
          ipfsApiKey: apiKey,
          ipfsSecretKey: secret,
        })
      );
      
      await web3.ipfs.getCidEventsByAddress(
        '0xA068cE9Ab80d83043C5Ed8aC5C20A0F288783cc5'
      );

    }, 70000);

  });
});
