import HeaderBar from "../components/HeaderBar";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";

export default function MainPage({ data }) {
  return (
    <div className="relative z-10 antialiased">
      <Helmet>
        <title>CalABSSA</title>
        <meta
          name="description"
          content="Les matches d'ABSSA sour forme de calendrier pour toutes ses équipe!"
        />
      </Helmet>

      <div className="absolute z-0 top-0 inset-x-0 overflow-hidden pointer-events-none flex justify-end">
        <div className="w-[71.75rem] max-w-none flex-none">
          <img
            src={`${process.env.PUBLIC_URL}/img/bg-green.avif`}
            alt="background"
            width="2296"
            height="668"
          />
        </div>
      </div>
      <div className="relative z-10">
        <HeaderBar data={data} />

        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 mt-32 sm:mt-16 max-w-[1280px] mx-auto z-10">
          <Outlet />
        </div>

        <footer className="flex text-sm px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 max-w-[1280px] mx-auto text-[#334155]">
          <p>
            Créé par{" "}
            <a
              href="https://www.simonmyway.com/?ref=calabssa"
              className="underline"
            >
              Simon Myway
            </a>
          </p>
          <p className="ml-auto text-right">
            Code open source sur{" "}
            <a
              href="https://github.com/simonpicard/calabssa.be"
              className="underline"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
