import { useRef, useState } from "react";
import Event from "./Event";
import TeamData from "../data/teams.json";
import {
    useLoaderData
} from "react-router-dom";

const ical = require('cal-parser');

export async function loader({ params }) {

    if (!TeamData.map(e => e.ics_name).includes(params.teamId))
        throw new Error("Équipe introuvable! Refais une recherche ou vérifie ton lien.");

    const ical_path = `${process.env.URL}/ics/${params.teamId}.ics`
    const ical_call = await fetch(ical_path);
    var ical_text = await ical_call.text();
    ical_text = ical_text.replace(/\\n/g, "<br />");
    const ical_dict = ical.parseString(ical_text);

    const cal_info = ical_dict.calendarData;
    var cal_events = [];

    ical_dict.events.forEach((elem) => {

        var desc = elem.description.value;
        desc = desc.replace(/<br \/>/g, "\n");
        cal_events.push({
            "key": elem.uid.value,
            "dtstamp": elem.dtstamp,
            "dtstart": elem.dtstart.value,
            "dtend": elem.dtend.value,
            "summary": elem.summary.value,
            "description": desc,
            "location": elem.location.value,
            "organizer": elem.organizer.value,
            "uid": elem.uid.value,
            "latitude": elem.geo.value.split(";")[0],
            "longitude": elem.geo.value.split(";")[1]
        });
    });
    return { ical_path, cal_info, cal_events };
}

export default function Calendar({ display_past }) {

    const { ical_path, cal_info, cal_events } = useLoaderData();

    const [save_cal, setSaveCal] = useState(false);
    const saveCalPopUp = useRef(null);

    const cal_events_flt = cal_events.filter(e => display_past || e.dtend >= Date.now());
    const cal_events_cpn = cal_events_flt.map(e => <Event {...e} />);

    const cal_dl_info = [
        {
            "name": "Google Calendar",
            "img_url": `${process.env.URL}/img/calendar/google-calendar.svg`,
            "link": `https://www.google.com/calendar/render?cid=webcal://${ical_path}`
        },
        {
            "name": "Apple iCal",
            "img_url": `${process.env.URL}/img/calendar/apple-calendar.png`,
            "link": `webcal://${ical_path}`
        },
        {
            "name": "Outlook Agenda",
            "img_url": `${process.env.URL}/img/calendar/outlook-calendar.svg`,
            "link": `https://outlook.live.com/calendar/0/addfromweb/?url=webcal://${ical_path}&name=${cal_info['x-wr-calname']}`
        },
        {
            "name": "Windows Calendar",
            "img_url": `${process.env.URL}/img/calendar/windows-calendar.svg`,
            "link": `webcal://${ical_path}`
        },
        {
            "name": "Office 365 Calendar",
            "img_url": `${process.env.URL}/img/calendar/office-calendar.svg`,
            "link": `https://outlook.office.com/calendar/0/addfromweb/?url=webcal://${ical_path}&name=${cal_info['x-wr-calname']}`
        },
        {
            "name": "Fichier ics",
            "img_url": `${process.env.URL}/img/calendar/file.svg`,
            "link": ical_path
        },
    ]

    const handleKeyDown = (event) => {
        const { key } = event;
        if (key === "Escape")
            setSaveCal(false);
    }

    const handleClickAddCal = (event) => {
        setSaveCal(true);
        saveCalPopUp.current.focus();
    }

    return (
        <div
            ref={saveCalPopUp}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            className="focus:outline-none"
        >
            {
                save_cal &&
                <div
                    className="fixed w-full h-full bg-white/50 backdrop-blur top-0 left-0 z-50"
                    onClick={() => setSaveCal(false)}
                >
                    <div
                        className="flex items-center justify-center w-full h-full"
                    >
                        <div
                            className="bg-white block w-auto drop-shadow-2xl rounded-3xl p-6 text-lg md:text-2xl divide-y "
                        >
                            <div className="mb-2 flex">
                                <p>Ajoute ce calendrier à ton agenda favori...</p>
                                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={() => setSaveCal(false)} className='w-6 ml-4'>
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
                                    </path>
                                </svg>
                            </div>
                            {
                                cal_dl_info.map((elem, key) => {
                                    return (
                                        <div className="hover:bg-slate-100 w-full h-full" key={key} >
                                            <a href={elem.link} className="flex space-x-2 h-full py-2">
                                                <img src={elem.img_url} alt={`${elem.name} icon`} width="32" />
                                                <p>{elem.name}</p>
                                            </a>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            }
            <div className='block'>
                <div className="block lg:grid lg:grid-cols-4 w-full items-center space-y-4 lg:mb-8">
                    <h1 className="text-center lg:text-left font-extrabold col-span-3 text-2xl sm:text-3xl">
                        {cal_info['x-wr-calname']}
                    </h1>
                    <p
                        className="w-max mx-auto lg:ml-auto rounded-3xl p-3 text-white font-semibold bg-sky-400 text-lg select-none transition duration-150 ease-out hover:scale-110"
                        onClick={handleClickAddCal}
                    >
                        Ajouter à l'agenda
                    </p>
                </div>
                <div className="divide-solid divide-y divide-slate-900/10">
                    {cal_events_cpn}
                </div>
            </div>
        </div >
    )


}