import { IPFSHTTPClient, create } from "ipfs-http-client";

export class IpfsClient {
  private static instance: IpfsClient;
  public client: IPFSHTTPClient;

  private constructor(host: string, apiKey: string, secretKey: string) {
    const auth =
      "Basic " + Buffer.from(apiKey + ":" + secretKey).toString("base64");
    this.client = create({
      host: host,
      port: 5001,
      protocol: "https",
      apiPath: "/api/v0",
      headers: {
        authorization: auth,
      },
    });
  }

  public static getInstance(
    host: string,
    apiKey: string,
    secretKey: string
  ): IpfsClient {
    if (!IpfsClient.instance) {
      IpfsClient.instance = new IpfsClient(host, apiKey, secretKey);
    }
    return IpfsClient.instance;
  }
}
