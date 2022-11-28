import SearchBar from "./SearchBar";
import {
    Link, Outlet
} from "react-router-dom";

function HeaderBar({ data }) {
    return (
        <div className='relative z-10'>
            <div className="fixed top-0 flex space-x-4 md:grid md:grid-cols-4 border-b border-slate-900/10 w-full backdrop-blur bg-white/75 items-center p-2 h-16 z-20">
                <Link to="/" className="flex">
                    <img
                        src={`${process.env.PUBLIC_URL}/icon/icon-mini.svg`}
                        className="h-9 w-9 min-w-[36px] min-h-[36px]"
                        alt="CalABSSA icon"
                    />
                    <p className="font-semibold text-2xl hidden md:block">CalABSSA</p>
                </Link>
                <SearchBar
                    data={data}
                    placeholder="Cherche une équipe..."
                />
                <div>
                    <Link to="/about"><p className="font-semibold text-2xl w-max ml-auto">À propos</p></Link>
                </div>
            </div>

            <div className='px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 mt-16 max-w-[1280px] mx-auto z-10'>
                <Outlet />
            </div>
        </div>
    )
}

export default HeaderBar;