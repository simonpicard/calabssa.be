import HeaderBar from "../components/HeaderBar";
import { useRouteError } from "react-router-dom";

export default function ErrorPage({ data }) {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="antialiased">
      <div className="absolute z-0 top-0 inset-x-0 overflow-hidden pointer-events-none flex justify-end">
        <div className="w-[71.75rem] max-w-none flex-none">
          <img
            src={`${process.env.PUBLIC_URL}/img/bg-green.avif`}
            alt="background"
          />
        </div>
      </div>
      <div className="relative z-10">
        <HeaderBar data={data} />

        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 mt-32 sm:mt-16 max-w-[1280px] mx-auto z-10">
          <div id="error-page" className="flex justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-semibold">Oops!</h1>
              <br />
              <p>Désolé, une erreur inattendue s'est produite.</p>
              <br />
              <p>
                <i>{error.statusText || error.message}</i>
              </p>
            </div>
          </div>
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
