import { config } from "./config";
import { abi as hurbeAbi, cardAbi } from "../abis/hurbe";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import type { Revenue } from "@/types";

export const hurbeId: `0x${string}` =
  "0xc382e9881a8d87b9125c56fecb0309f4c7716cca";
export const hurbeTokenId: `0x${string}` =
  "0x42975a0b9343199ec47e62F2829F2c3E3e26230c";

const Contract = {
  // === Streamer Functions ===
  async createStreamer(
    cardBaseURI: string,
    name: string,
    symbol: string,
    mintPrice: string,
    cardExlusiveBaseURI: string
  ): Promise<`0x${string}` | null> {
    try {
      const result = await writeContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "create",
        args: [cardBaseURI, name, symbol, mintPrice, cardExlusiveBaseURI],
      });

      const receipt = await waitForTransactionReceipt(config, { hash: result });

      return receipt.transactionHash;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async startStream(
    streamId: `0x${string}`,
    exclusive: boolean,
    tips: boolean
  ): Promise<`0x${string}` | null> {
    try {
      const result = await writeContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "startStream",
        args: [streamId, exclusive, tips],
      });

      const receipt = await waitForTransactionReceipt(config, { hash: result });

      return receipt.transactionHash;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async uploadVideo(
    videoId: `0x${string}`,
    exclusive: boolean,
    tips: boolean
  ): Promise<`0x${string}` | null> {
    try {
      const result = await writeContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "uploadVideo",
        args: [videoId, exclusive, tips],
      });

      const receipt = await waitForTransactionReceipt(config, { hash: result });

      return receipt.transactionHash;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async endStream(streamId: `0x${string}`): Promise<`0x${string}` | null> {
    try {
      const result = await writeContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "endStream",
        args: [streamId],
      });

      const receipt = await waitForTransactionReceipt(config, { hash: result });

      return receipt.transactionHash;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async pauseTip(streamId: `0x${string}`): Promise<`0x${string}` | null> {
    try {
      const result = await writeContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "pauseTip",
        args: [streamId],
      });

      const receipt = await waitForTransactionReceipt(config, { hash: result });

      return receipt.transactionHash;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  // === Viewers Functions ===
  async tipStream(
    streamId: `0x${string}`,
    amount: string
  ): Promise<`0x${string}` | null> {
    try {
      const result = await writeContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "tipStream",
        args: [streamId, BigInt(amount)],
      });

      const receipt = await waitForTransactionReceipt(config, { hash: result });

      return receipt.transactionHash;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async tipVideo(
    videoId: `0x${string}`,
    amount: string
  ): Promise<`0x${string}` | null> {
    try {
      const result = await writeContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "tipVideo",
        args: [videoId, BigInt(amount)],
      });

      const receipt = await waitForTransactionReceipt(config, { hash: result });

      return receipt.transactionHash;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async mintCard(
    streamer: `0x${string}`,
    to: `0x${string}`,
    exclusive: boolean,
    value: bigint
  ): Promise<`0x${string}` | null> {
    try {
      const result = await writeContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "mintCard",
        args: [streamer, to, exclusive],
        value,
        gas: BigInt(3_000_000)
      });

      const receipt = await waitForTransactionReceipt(config, { hash: result });

      return receipt.transactionHash;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getCardId(
    streamer: `0x${string}`,
    exclusive: boolean
  ): Promise<`0x${string}` | null> {
    try {
      return (await readContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "getCardId",
        args: [streamer, exclusive],
      })) as `0x${string}`;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getMintPrice(cardId: `0x${string}`): Promise<bigint> {
    try {
      // @ts-ignore
      return await readContract(config, {
        abi: cardAbi,
        address: cardId,
        functionName: "getMintPrice",
      });
    } catch (error) {
      console.log(error);
      return BigInt(0);
    }
  },

  async claimTfuel(amount: bigint): Promise<`0x${string}` | null> {
    try {
      const result = await writeContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "claimTfuel",
        args: [amount],
      });

      const receipt = await waitForTransactionReceipt(config, { hash: result });

      return receipt.transactionHash;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async claimHurbe(amount: bigint): Promise<`0x${string}` | null> {
    try {
      const result = await writeContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "claimHurbe",
        args: [amount],
        gas: BigInt(3_000_000)
      });

      const receipt = await waitForTransactionReceipt(config, { hash: result });

      return receipt.transactionHash;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async claimAll(): Promise<`0x${string}` | null> {
    try {
      const result = await writeContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "claimAll",
        gas: BigInt(3_000_000)
      });

      const receipt = await waitForTransactionReceipt(config, { hash: result });

      return receipt.transactionHash;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getStreamer(streamer: `0x${string}`): Promise<Revenue | null> {
    try {
      // @ts-ignore
      return await readContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "getStreamer",
        args: [streamer],
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getStream(streamId: `0x${string}`): Promise<any> {
    try {
      // @ts-ignore
      return await readContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "getStream",
        args: [streamId],
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getVideo(videoId: `0x${string}`): Promise<any> {
    try {
      // @ts-ignore
      return await readContract(config, {
        abi: hurbeAbi,
        address: hurbeId,
        functionName: "getVideo",
        args: [videoId],
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  newId(): `0x${string}` {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return `0x${Array.from(array)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")}`;
  },
};

export default Contract;
