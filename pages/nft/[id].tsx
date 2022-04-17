import React, { useEffect, useState } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'
import Link from 'next/link'
import { BigNumber } from 'ethers'
import toast, { Toaster } from 'react-hot-toast'

interface Props {
  collection: Collection
}

const NftDropPage = ({ collection }: Props) => {
  const [claimedSupply, setClaminedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [priceInEth, setPriceInEth] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)
  // const [ownedNft, setOwnedNft] = useState<object>()
  // const [ownedNftName, setOwnedNftName] = useState<string>('')
  // const [ownedNftDesc, setOwnedNftDesc] = useState<string>('')
  // const [ownedNftImg, setOwnedNftImg] = useState<string>('')
  const [closeModal, setCloseModal] = useState<boolean>(true)
  const nftDrop = useNFTDrop(collection.address)

  // Authentication
  const connectToMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  useEffect(() => {
    if (!nftDrop) return
    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll()
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)
    }

    fetchPrice()
  }, [nftDrop])

  useEffect(() => {
    if (!nftDrop) return

    const fetchNftDropData = async () => {
      setLoading(true)

      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()
      setClaminedSupply(claimed.length)
      setTotalSupply(total)

      setLoading(false)
    }

    fetchNftDropData()
  }, [nftDrop])

  const mintNft = () => {
    if (!nftDrop || !address) return

    const quantity = 1

    setLoading(true)
    const notification = toast.loading('Minting...', {
      style: {
        background: 'white',
      },
    })

    nftDrop
      ?.claimTo(address, quantity)
      .then(async (txData) => {
        const receipt = txData[0].receipt
        const claimedTokenId = txData[0].id
        const claimedNft = await txData[0].data()

        toast('Minting Success', {
          duration: 5000,
        })

        // setOwnedNft(claimedNft)

        // setOwnedNftName(claimedNft?.metadata?.name)
        // setOwnedNftDesc(claimedNft?.metadata?.description)
        // setOwnedNftImg(claimedNft?.metadata?.image)
      })
      .catch((err) => {
        console.log(err)
        toast('Something Went Wrong')
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(notification)
      })
  }

  // const handleModal = () => {
  //   setCloseModal((prev) => !prev)
  // }

  return (
    <div className="flex h-screen flex-col overflow-x-hidden lg:grid lg:grid-cols-10">
      <Toaster position="top-center" />
      {/* Left */}
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-2 lg:col-span-4 lg:min-h-screen ">
        <div className="my-6 w-2/4 rounded-lg  bg-gradient-to-b from-fuchsia-600 to-pink-600 p-3  ">
          <img
            src={urlFor(collection.previewImage).url()}
            alt=""
            className=" mx-auto rounded-lg shadow-lg   "
          />
        </div>
        <div className="space-y-2  text-center font-serif">
          <h1 className="text-4xl font-medium tracking-wider text-white">
            {collection.nftCollectionName}
          </h1>
          <h2 className="text-xl text-slate-300">{collection.description}</h2>
        </div>
      </div>

      {/*Right*/}
      <div className="flex flex-1 flex-col p-11 lg:col-span-6">
        <header className="flex items-center justify-between">
          <Link href={'/'}>
            <h1 className="w-52 cursor-pointer text-xl font-extralight tracking-wider lg:text-2xl">
              <span className="font-extrabold text-fuchsia-500 underline decoration-fuchsia-500 underline-offset-1">
                Aditya's
              </span>{' '}
              NFT MARKETPLACE
            </h1>
          </Link>
          <button
            onClick={() => (address ? disconnect() : connectToMetamask())}
            className="rounded-full border-2  bg-gradient-to-b from-fuchsia-500 to-pink-500 px-4 py-2 font-bold text-white"
          >
            {address ? 'Sign Out' : 'Sign In'}
          </button>
        </header>
        <hr className="my-2  rounded-full border" />
        {address && (
          <p className="mt-4 text-center text-blue-800 lg:text-lg">
            You are logged in with wallet {address.substring(0, 5)}...
            {address.substring(address.length - 5)}
          </p>
        )}
        <div className="my-8 flex flex-1 flex-col items-center space-y-7 text-center lg:justify-center">
          <img
            src={urlFor(collection.mainImage).url()}
            alt=""
            className=" lg:w-2/3"
          />
          <h1 className=" text-3xl font-medium lg:text-5xl">
            {collection.title}
          </h1>
          {loading ? (
            <p className="animate-ping">Loading</p>
          ) : (
            <p className="text-green-500 lg:text-lg">
              {claimedSupply}/{totalSupply?.toString()} NFT's claimed!
            </p>
          )}
        </div>

        <button
          onClick={mintNft}
          disabled={
            loading || claimedSupply === totalSupply?.toNumber() || !address
          }
          className="h-16 w-full  rounded-full bg-fuchsia-500 text-lg font-bold text-white disabled:bg-gray-400 "
        >
          {loading ? (
            <>Loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>Sold Out</>
          ) : !address ? (
            <>Sign In to Mint</>
          ) : (
            <span>Mint NFT ({priceInEth}) ETH</span>
          )}
        </button>
      </div>
      {/* {ownedNft && closeModal ? (
        <div className="absolute flex min-h-screen w-[100vw] flex-col items-center justify-center bg-black/60  text-white">
          <div className="mb-6 flex w-72  flex-col items-center  rounded-lg bg-gradient-to-b from-fuchsia-600  to-pink-600 p-3 text-2xl font-medium shadow-md shadow-white">
            <p>You Claimed!</p>
            <img src={ownedNftImg} alt="" className="my-4" />
            <p>{ownedNftName}</p>
            <p>{ownedNftDesc}</p>
          </div>
          <button onClick={handleModal} className="rounded-md bg-black p-2">
            close
          </button>
        </div>
      ) : null} */}
    </div>
  )
}

export default NftDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
    _id,
    title, 
    address, 
    description, 
    nftCollectionName, 
    mainImage{
      asset
    },
    previewImage{
      asset
    },
    slug{
      current
    },
    creator-> {
      _id,
      name, 
      address, 
      slug{
        current
      },
    }
  }`

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}
