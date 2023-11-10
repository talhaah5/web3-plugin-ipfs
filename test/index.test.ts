import { Web3, core } from "web3";
import { IPFSPlugin } from "../src";

describe("TemplatePlugin Tests", () => {
  const host = "ipfs.infura.io:5001";
  const apiKey = "";
  const secret = "";
  it("should register IPFSPlugins on Web3Context instance", () => {
    const web3Context = new core.Web3Context("http://127.0.0.1:8545");
    web3Context.registerPlugin(new IPFSPlugin(host, apiKey, secret));
    expect(web3Context.ipfs).toBeDefined();
  });

  describe("IPFSPlugins method tests", () => {
    let web3: Web3;

    xit("should store file on IPFS", async () => {
      web3 = new Web3("http://127.0.0.1:8545");
      web3.registerPlugin(new IPFSPlugin(host, apiKey, secret));
      const cid = await web3.ipfs.storeFile("test/test.txt");
      console.log(cid);
    });
  });
});
