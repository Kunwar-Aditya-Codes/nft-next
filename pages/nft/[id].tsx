import React from 'react'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'
import Link from 'next/link'

interface Props {
  collection: Collection
}

const NftDropPage = ({ collection }: Props) => {
  // Authentication
  const connectToMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
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
          <p className="text-green-500 lg:text-lg">13/25 NFT's claimed!</p>
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
