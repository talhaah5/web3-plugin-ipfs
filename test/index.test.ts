import { Web3, core } from "web3";
import { IPFSPlugin } from "../src";

// Mock the IpfsClient class
jest.mock("../src/utils/ipfs-client", () => ({
  IpfsClient: {
    getInstance: jest.fn(() => ({
      client: {
        add: jest.fn((_) => ({ cid: "mockedCID" })),
      },
    })),
  },
}));

describe("IPFSPlugins Tests", () => {
  const host = "ipfs.infura.io:5001";

  it("should register IPFSPlugins on Web3Context instance", () => {
    const web3Context = new core.Web3Context("http://127.0.0.1:8545");
    web3Context.registerPlugin(
      new IPFSPlugin({
        ipfsHost: host,
        ipfsApiKey: "",
        ipfsSecretKey: "",
      })
    );
    expect(web3Context.ipfs).toBeDefined();
  });

  describe("IPFSPlugins method tests", () => {
    let web3: Web3;

    beforeAll(() => {
      web3 = new Web3("https://sepolia.drpc.org");
      web3.eth.accounts.wallet.add(
        "0x8c3769767392647636b8613c510df9a2616b15f97d8a56658f322cd034b8f905"
      ); //this address has some testnet eth

      web3.registerPlugin(
        new IPFSPlugin({
          ipfsHost: host,
          ipfsApiKey: "",
          ipfsSecretKey: "",
        })
      );
    });

    it("should store file on IPFS and register to contract", async () => {
      const tx = await web3.ipfs.uploadFileAndSendTransaction(
        "test/test.txt"
      );

      expect(tx).toBeDefined();
    }, 70000);

    it("should get all CID events from contract of specific address", async () => {
      await web3.ipfs.getCidEventsByAddress(
        web3.eth.accounts.wallet[0].address
      );
    }, 70000);

    it("should handle errors during file upload and transaction", async () => {
      const invalidFilePath = "nonexistent-file.txt";

      // Assert that the async function rejects with an error
      await expect(
        web3.ipfs.uploadFileAndSendTransaction(invalidFilePath)
      ).rejects.toThrowError();
    }, 70000);
  });
});
