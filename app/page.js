"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  // Get username for the link
  const username = session?.user?.username || session?.user?.name;
  return (
    <>
      <div className="main flex items-center justify-center gap-4 flex-col text-white h-[44vh]">
        <div className="font-bold text-5xl flex items-center justify-center gap-2">
          Buy Me A Chai
          <span>
            <img className="invertImg" src="/tea.gif" width={88} alt="" />
          </span>
        </div>
        <p className="-mb-2">
          A crowdfunding platform for creators to fund their projects. A place
          where your fans can buy you a chai.
        </p>
        <p>Unleash the power of your fans and get your projects funded.</p>

        <div className="button flex gap-2">
          <button className="text-white bg-gradient-to-br from-purple-600 to-blue-500 font-medium rounded-lg text-sm px-4 py-2.5 text-center leading-5 transition-all duration-200 hover:bg-gray-800 hover:bg-none hover:ring-2 hover:ring-purple-600">
            Start Here
          </button>

          <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <span className="relative px-4 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent leading-5">
              Learn more
            </span>
          </button>
        </div>
      </div>
      <div className="line-divider bg-white h-1 opacity-10"></div>

      <div className="section-1 text-white">
        <h2 className="text-center font-bold text-3xl my-4">
          Your supporters can buy you a chai
        </h2>
        <div className="item-sec flex justify-around gap-5 container mx-auto pb-32 pt-14">
          <div className="item space-y-3 flex flex-col items-center justify-center">
            <img
              className="bg-slate-400 rounded-full p-2"
              src="/man.gif"
              width={88}
              alt=""
            />
            <p className="font-bold">Support Your Journey</p>
            <p className="text-sm italic">
              Use fan support to grow, create, and move forward
            </p>
          </div>
          <div className="item space-y-3 flex flex-col items-center justify-center">
            <img
              className="bg-slate-400 rounded-full p-2"
              src="/coin.gif"
              width={88}
              alt=""
            />
            {session && username ? (
              <Link
                href={`/${username}`}
                className="text-center hover:text-purple-400 transition-colors duration-200"
              >
                <p className="font-bold">Support with a Chai</p>
                <p className="text-sm italic">
                  Fans can support you with small, meaningful contributions
                </p>
              </Link>
            ) : (
              <>
                <p className="font-bold">Support with a Chai</p>
                <p className="text-sm italic">
                  Fans can support you with small, meaningful contributions
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Login to access your page
                </p>
              </>
            )}
          </div>
          <div className="item space-y-3 flex flex-col items-center justify-center">
            <img
              className="bg-slate-400 rounded-full p-2"
              src="/group.gif"
              width={88}
              alt=""
            />
            <p className="font-bold">Join the Community</p>
            <p className="text-sm italic">
              Your fans come together to support and cheer you
            </p>
          </div>
        </div>
      </div>

      <div className="line-divider bg-white h-1 opacity-10"></div>

      <div className="section-1 text-white">
        <h2 className="text-center font-bold text-3xl my-4">Learn More</h2>
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/ojuUnfqnUI0?si=wMUv4DG3ia6Wt4zn"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
}
