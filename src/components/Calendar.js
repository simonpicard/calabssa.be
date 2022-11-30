import { useRef, useState, useEffect } from "react";
import Event from "./Event";
import TeamData from "../data/teams.json";
import DayDiv from "../data/day_div.json";
import {
    useLoaderData
} from "react-router-dom";

const ical = require('cal-parser');

async function load_and_parse_cal(file_name) {
    const ical_path = `https://raw.githubusercontent.com/simonpicard/abssa-calendar/kedro/data/07_model_output/ics/${file_name}.ics`
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
            "dtstart": new Date(elem.dtstart.value.toLocaleString('en', { timeZone: 'UTC' })),
            "dtend": new Date(elem.dtend.value.toLocaleString('en', { timeZone: 'UTC' })),
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

export async function loader({ params }) {

    if (!Object.keys(TeamData).includes(params.teamId))
        throw new Error("Équipe introuvable! Refais une recherche ou vérifie ton lien.");

    const res = await load_and_parse_cal(params.teamId);
    res.team_info = TeamData[params.teamId]
    res.cal_param = { display_past: false }
    return res;
}

export async function defaultLoader({ params }) {

    const today = new Date().setHours(0, 0, 0, 0);

    const dayDivFlt = Object.entries(DayDiv).filter(([key, value]) => new Date(value.date) >= today);

    const nextDay = dayDivFlt.reduce((prev, curr) => {
        return prev[1].day < curr[1].day ? prev : curr;
    })[1].day;

    const dayDivCandidates = dayDivFlt.filter(([key, value]) => value.day === nextDay);

    const [calendar_id, calendar_info] = dayDivCandidates[Math.floor(Math.random() * dayDivCandidates.length)];

    const res = await load_and_parse_cal(calendar_id);
    res.team_info = {
        search_name: calendar_info["name"],
        ...calendar_info
    }
    res.cal_param = { display_past: true }
    return res;
}

export default function Calendar({ display_past }) {

    const { team_info, ical_path, cal_info, cal_events, cal_param } = useLoaderData();

    const [save_cal, setSaveCal] = useState(false);
    const saveCalPopUp = useRef(null);

    const [showPast, setShowPast] = useState(cal_param.display_past);

    const cal_events_flt = cal_events.filter(e => showPast || e.dtend >= Date.now());
    const [events, setEvents] = useState(cal_events_flt);

    useEffect(() => {
        setEvents(cal_events.filter(e => showPast || e.dtend >= Date.now()));
    }, [showPast, cal_events]);

    useEffect(() => {
        document.title = "CalABSSA - " + team_info.club_name;
        setShowPast(cal_param.display_past);
    }, [team_info, cal_param]);


    const cal_dl_info = [
        {
            "name": "Google Calendar",
            "img_url": `${process.env.PUBLIC_URL}/img/calendar/google-calendar.svg`,
            "link": `https://www.google.com/calendar/render?cid=webcal://${ical_path}`
        },
        {
            "name": "Apple iCal",
            "img_url": `${process.env.PUBLIC_URL}/img/calendar/apple-calendar.png`,
            "link": `webcal://${ical_path}`
        },
        {
            "name": "Outlook Agenda",
            "img_url": `${process.env.PUBLIC_URL}/img/calendar/outlook-calendar.svg`,
            "link": `https://outlook.live.com/calendar/0/addfromweb/?url=webcal://${ical_path}&name=${cal_info['x-wr-calname']}`
        },
        {
            "name": "Windows Calendar",
            "img_url": `${process.env.PUBLIC_URL}/img/calendar/windows-calendar.svg`,
            "link": `webcal://${ical_path}`
        },
        {
            "name": "Office 365 Calendar",
            "img_url": `${process.env.PUBLIC_URL}/img/calendar/office-calendar.svg`,
            "link": `https://outlook.office.com/calendar/0/addfromweb/?url=webcal://${ical_path}&name=${cal_info['x-wr-calname']}`
        },
        {
            "name": "Fichier ics",
            "img_url": `${process.env.PUBLIC_URL}/img/calendar/file.svg`,
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

                <div className="block lg:flex w-full items-center space-y-4 lg:space-y-0 lg:mb-6 ">
                    <h1 className="text-center lg:text-left font-extrabold text-2xl sm:text-3xl w-full">
                        {team_info.search_name}
                    </h1>
                    <p
                        className="min-w-max max-w-max mx-auto rounded-3xl p-3 text-white font-semibold bg-sky-400 text-lg select-none transition duration-150 ease-out hover:scale-110"
                        onClick={handleClickAddCal}
                    >
                        Ajouter à l'agenda
                    </p>
                </div>
                <div
                    className="flex items-center mt-2 md:mt-0"
                    onClick={() => setShowPast(!showPast)}

                >
                    <div
                        className="block border-2 rounded-2xl bg-slate-200 w-10 h-min mr-1"
                        style={{
                            background: showPast ? "rgb(56 189 248)" : "rgb(226 232 240)",
                            borderColor: showPast ? "rgb(56 189 248)" : "rgb(226 232 240)"
                        }}

                    >
                        <span
                            className="toggle-switch-switch block w-4 h-4 bg-white rounded-2xl transition-[margin]"
                            style={{ marginLeft: showPast ? 20 : 0 }}

                        />
                    </div>
                    Afficher les matches passés
                </div>
                <div className="divide-solid divide-y divide-slate-900/10">
                    {
                        events.map(e => <Event {...e} />)
                    }
                </div>
            </div>
        </div >
    )


}