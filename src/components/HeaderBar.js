import SearchBar from "./SearchBar";
import {
    Link, Outlet
} from "react-router-dom";

function HeaderBar({ data }) {
    return (
        <div className='relative z-10'>
            <div className="fixed top-0 grid border-b border-slate-900/10 w-full backdrop-blur bg-white/75 grid-cols-4 items-center p-2 h-16 z-20">
                <div className="flex">
                    <img
                        src={`${process.env.PUBLIC_URL}/icon/icon-mini.svg`}
                        className="h-8"
                        alt="CalABSSA icon"
                    />
                    <p className="font-semibold text-2xl">CalABSSA</p>
                </div>
                <SearchBar
                    data={data}
                    placeholder="Cherche une équipe..."
                />
                <div>
                    <Link to="/about"><p className="font-semibold text-2xl text-right">A propos</p></Link>
                </div>
            </div>

            <div className='px-12 py-6 my-20 max-w-[1280px] mx-auto z-10'>
                <Outlet />
            </div>
        </div>
    )
}

export default HeaderBar;