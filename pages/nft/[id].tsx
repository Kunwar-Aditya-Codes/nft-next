import React from 'react'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'

const NftDropPage = () => {
  // Authentication

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left */}
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-2 lg:col-span-4 lg:min-h-screen ">
        <div className="my-6 w-2/4 rounded-lg  bg-gradient-to-b from-fuchsia-600 to-pink-600 p-3  ">
          <img
            src="/images/1.jpg"
            alt=""
            className=" mx-auto rounded-lg shadow-lg   "
          />
        </div>
        <div className="space-y-2  text-center font-serif">
          <h1 className="text-4xl font-medium tracking-wider text-white">
            CyberPunks
          </h1>
          <h2 className="text-xl text-slate-300">
            Welcome to world of Cybers!
          </h2>
        </div>
      </div>

      {/*Right*/}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        <header className="flex items-center justify-between">
          <h1 className="w-52 cursor-pointer text-xl font-extralight lg:text-2xl ">
            <span className="font-extrabold underline decoration-fuchsia-500/50 underline-offset-1">
              Cyber
            </span>{' '}
            Nft MarketPlace
          </h1>
          <button className="rounded-full border-2  bg-gradient-to-b from-fuchsia-500 to-pink-500 px-4 py-2 font-bold text-white">
            Sign In
          </button>
        </header>
        <hr className="my-2  rounded-full border" />
        <div className="my-8 flex flex-1 flex-col items-center space-y-7 text-center lg:justify-center">
          <img src="/images/hero.png" alt="" className=" lg:w-2/3" />
          <h1 className=" text-3xl font-medium lg:text-5xl">
            Code with Cyber Punks!
          </h1>
          <p className="text-green-500">13/25 NFT's claimed!</p>
        </div>

        <button className="h-16 w-full  rounded-full bg-gradient-to-b from-fuchsia-500 to-pink-500 text-lg font-bold text-white">
          Mint NFT (0.01Eth)
        </button>
      </div>
      <div></div>
    </div>
  )
}

export default NftDropPage
