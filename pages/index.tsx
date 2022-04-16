import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typings'

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="  py-4 text-center ">
        <h1 className="cursor-pointer text-2xl font-extralight tracking-wider lg:text-2xl">
          <span className="font-extrabold text-fuchsia-500 underline decoration-fuchsia-500 underline-offset-1">
            ADITYA's
          </span>{' '}
          NFT MARKETPLACE
        </h1>
      </header>
      <main className="mt-10">
        <div>
          {collections.map((collection) => (
            <Link href={`/nft/${collection.slug.current}`}>
              <div className="mx-auto flex w-5/6 cursor-pointer flex-col items-center rounded-md border p-3 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:shadow-slate-300">
                <img
                  className="w-3/4 rounded-lg "
                  src={urlFor(collection.mainImage).url()}
                  alt=""
                />
                <div className="text-center">
                  <h2 className="my-2 font-serif text-2xl tracking-wide ">
                    {collection.title}
                  </h2>
                  <p className=" text-slate-300">{collection.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"]{
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

  const collections = await sanityClient.fetch(query)
  console.log(collections)

  return {
    props: {
      collections,
    },
  }
}
