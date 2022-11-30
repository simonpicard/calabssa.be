import SearchBar from "./SearchBar";
import {
    Link, Outlet
} from "react-router-dom";

function HeaderBar({ data }) {
    return (
        <div className='relative z-10'>
            <div className="fixed block top-0 border-b border-slate-900/10 w-full backdrop-blur bg-white/75 z-20 sm:space-y-0 divide-y">

                <div className="sm:hidden flex w-full p-2 items-center">
                    <Link to="/" className="flex items-center">
                        <img
                            src={`${process.env.PUBLIC_URL}/icon/soccer-459-edit.svg`}
                            className="h-9 w-9 min-w-[36px] min-h-[36px] mr-2"
                            alt="CalABSSA icon"
                        />
                        <p className="font-semibold text-2xl">CalABSSA</p>
                    </Link>
                    <Link to="/about" className="font-semibold text-2xl w-max ml-auto"><p >À propos</p></Link>
                </div>
                <div className="flex md:grid md:grid-cols-4 h-16 sm:space-x-4 items-center p-2">
                    <Link to="/" className="hidden sm:flex items-center w-max">
                        <img
                            src={`${process.env.PUBLIC_URL}/icon/soccer-459-edit.svg`}
                            className="h-9 w-9 min-w-[36px] min-h-[36px] md:mr-2"
                            alt="CalABSSA icon"
                        />
                        <p className="font-semibold text-2xl hidden md:block">CalABSSA</p>
                    </Link>
                    <SearchBar
                        data={data}
                        placeholder="Cherche une équipe"
                    />
                    <div>
                        <Link to="/about" className="hidden sm:grid">
                            <p className="font-semibold text-lg sm:text-2xl w-max place-self-end">À propos</p>
                        </Link>
                    </div>
                </div>
            </div>

            <div className='px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 mt-32 sm:mt-16 max-w-[1280px] mx-auto z-10'>
                <Outlet />
            </div>
        </div>
    )
}

export default HeaderBar;