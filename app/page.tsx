"use client";

import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xe5D10BDBFFC1f0E807BD2b9f43cA9f66c0b5a15A";
const ABI = ["function genm() external"];

export default function Home() {
  async function handleGENM() {
    try {
      if (!(window as any).ethereum) {
        alert("MetaMask belum terpasang");
        return;
      }

      // ✅ INI YANG BENAR UNTUK WEB + METAMASK
      const provider = new ethers.BrowserProvider(
        (window as any).ethereum
      );

      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        signer
      );

      const tx = await contract.genm();
      await tx.wait();

      alert("GENM sukses!");
    } catch (e: any) {
      alert(e?.message || "RPC error, coba lagi nanti");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4 text-pink-500">
        Welcome Gen Onchain
      </h1>

      <p className="text-white/60 mb-6">
        Leaderboard: Not Available
      </p>

      <button
        onClick={handleGENM}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-blue-500"
      >
        GENM
      </button>

      <p className="mt-4 text-sm text-white/40">
        1x per wallet per day · Onchain
      </p>
    </main>
  );
}
