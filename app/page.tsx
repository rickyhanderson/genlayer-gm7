"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

/* ================== CONFIG ================== */

const CONTRACT_ADDRESS = "0xe5D10BDBFFC1f0E807BD2b9f43cA9f66c0b5a15A";

const ABI = [
  "function genm() external"
];

// GANTI SESUAI RPC GENLAYER KAMU
const GENLAYER_CHAIN = {
  chainId: "0x27A7", // contoh, jangan ubah kalau sudah benar
  chainName: "GenLayer StudioNet",
  nativeCurrency: {
    name: "GEN",
    symbol: "GEN",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.genlayer.xyz"],
  blockExplorerUrls: ["https://explorer.genlayer.xyz"],
};

/* ================== PAGE ================== */

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------- WALLET ---------- */

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask belum terpasang");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    await switchNetwork();
    const signer = await provider.getSigner();
    setAccount(await signer.getAddress());
  }

  async function disconnectWallet() {
    setAccount(null);
  }

  async function switchNetwork() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: GENLAYER_CHAIN.chainId }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [GENLAYER_CHAIN],
        });
      }
    }
  }

  /* ---------- GENM ---------- */

  async function handleGENM() {
    if (!account) return alert("Connect wallet dulu");

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        signer
      );

      const tx = await contract.genm();
      await tx.wait();

      alert("GENM sukses! Onchain ✅");
    } catch (err: any) {
      alert(err?.reason || err?.message || "GENM gagal");
    } finally {
      setLoading(false);
    }
  }

  /* ================== UI ================== */

  return (
    <>
      <style>{`
        body {
          background: #000;
          color: white;
          font-family: Inter, system-ui, sans-serif;
        }

        .rgb-text {
          animation: rgb 2s infinite;
        }

        @keyframes rgb {
          0% { color: #ff4fd8; }
          33% { color: #4fd8ff; }
          66% { color: #ff4f4f; }
          100% { color: #ff4fd8; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-white/10">
        <div>
          <h1 className="text-xl font-bold">GenLayer</h1>
          <p className="text-sm text-white/60">
            Trust Infrastructure for the AI Age
          </p>
        </div>

        <div className="flex gap-3">
          {!account ? (
            <button
              onClick={connectWallet}
              className="px-4 py-2 rounded-lg bg-white text-black font-semibold"
            >
              Connect Wallet
            </button>
          ) : (
            <>
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 rounded-lg border border-white/20"
              >
                Disconnect
              </button>
            </>
          )}
        </div>
      </nav>

      {/* MAIN */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] text-center gap-6">
        <h2 className="text-5xl font-extrabold rgb-text">
          Welcome Gen Onchain
        </h2>

        <p className="text-white/60">
          Leaderboard: Not Available
        </p>

        <button
          onClick={handleGENM}
          disabled={loading}
          className="mt-4 px-10 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-blue-500 font-bold text-lg disabled:opacity-50"
        >
          {loading ? "Processing..." : "GENM"}
        </button>

        <p className="text-xs text-white/40 mt-2">
          1x per wallet per day • Onchain
        </p>
      </main>
    </>
  );
}
