import { useRef, useState, useEffect } from "react";
import Event from "./Event";
import AddCalendarPopUp from "./AddCalendarPopUp";
import TeamData from "../data/teams.json";
import DayDiv from "../data/day_div.json";
import {
    useLoaderData
} from "react-router-dom";
import { Helmet } from "react-helmet";

const ical = require('cal-parser');

async function load_and_parse_cal(file_name) {
    const base_uri = `raw.githubusercontent.com/simonpicard/abssa-ical/main/data/07_model_output/ics/${file_name}.ics`
    const ical_path = `https://raw.githubusercontent.com/simonpicard/abssa-ical/main/data/07_model_output/ics/${file_name}.ics`
    const ical_webcal = ical_path.replace("https", "webcal")
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

    const ical_param = {
        ical_path: ical_path,
        ical_webcal: ical_webcal,
        base_uri: base_uri
    }

    return { ical_param, cal_info, cal_events };
}

export async function loader({ params }) {

    if (!Object.keys(TeamData).includes(params.teamId))
        throw new Error("Équipe introuvable! Refais une recherche ou vérifie ton lien.");

    const res = await load_and_parse_cal(params.teamId);
    res.team_info = {
        ...TeamData[params.teamId],
        calendar_id: params.teamId
    }
    res.cal_param = { display_past: false }
    return res;
}

export async function defaultLoader({ params }) {

    const today = new Date()
    today.setHours(0, 0, 0, 0);

    const dayDivFlt = Object.entries(DayDiv).filter(([key, value]) => new Date(value.date.replace(/-/g, "/")) >= today);

    var dayDivCandidates;

    if (dayDivFlt.length == 0) {
        dayDivCandidates = Object.entries(DayDiv);
    }
    else {

        const nextDay = dayDivFlt.reduce((prev, curr) => {
            return prev[1].day < curr[1].day ? prev : curr;
        })[1].day;

        dayDivCandidates = dayDivFlt.filter(([key, value]) => value.day === nextDay);
    }

    const [calendar_id, calendar_info] = dayDivCandidates[Math.floor(Math.random() * dayDivCandidates.length)];

    const res = await load_and_parse_cal(calendar_id);
    res.team_info = {
        search_name: calendar_info["name"],
        calendar_id: calendar_id,
        ...calendar_info
    }
    res.cal_param = { display_past: true }
    return res;
}

export default function Calendar({ display_past }) {

    const { team_info, ical_param, cal_info, cal_events, cal_param } = useLoaderData();

    const [save_cal, setSaveCal] = useState(false);
    const saveCalPopUp = useRef(null);

    const [showPast, setShowPast] = useState(cal_param.display_past);

    const cal_events_flt = cal_events.filter(e => showPast || e.dtend >= Date.now());
    const [events, setEvents] = useState(cal_events_flt);

    useEffect(() => {
        setEvents(cal_events.filter(e => showPast || e.dtend >= Date.now()));
    }, [showPast, cal_events]);

    useEffect(() => {
        setShowPast(cal_param.display_past);
    }, [team_info, cal_param]);

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

            <Helmet>
                <title>{"CalABSSA" + (team_info.club_name ? " - " + team_info.club_name : "")}</title>
                <meta name="description" content={team_info.caldesc} />
            </Helmet>
            {
                save_cal && <AddCalendarPopUp base_uri={ical_param.base_uri} cal_name={cal_info['x-wr-calname']} closeEvent={() => setSaveCal(false)} />
            }
            <div className='block'>

                <div className="block lg:flex w-full items-center space-y-4 lg:space-y-0 lg:mb-6 ">
                    <h1 className="text-center lg:text-left font-extrabold text-2xl sm:text-3xl w-full">
                        {team_info.search_name}
                    </h1>
                    <p
                        className="min-w-max max-w-max mx-auto rounded-3xl p-3 text-white font-semibold bg-sky-400 text-lg select-none cursor-pointer"
                        onClick={handleClickAddCal}
                    >
                        Ajouter à l'agenda
                    </p>
                </div>
                <div
                    className="flex items-center mt-2 md:mt-0 cursor-pointer"
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
        </div>
    )


}