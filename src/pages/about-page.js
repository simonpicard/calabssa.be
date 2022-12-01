import AboutData from "../data/about.json";

export default function AboutPage() {

    console.log(AboutData);
    AboutData.forEach((value, key) => { console.log(value, key) });

    return (
        <div id="about-page" className="block justify-center divide-solid divide-y divide-slate-900/10 text-[#334155] items-center">
            {
                AboutData.map((value, key) => {
                    return (
                        <details key={key} className="pt-4 pb-2">
                            <summary className="cursor-pointer font-semibold mb-2">
                                {value.q}
                            </summary>
                            {value.a}
                        </details>
                    );
                })
            }
        </div >
    );
}