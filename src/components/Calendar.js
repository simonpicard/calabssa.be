import { useEffect, useRef, useState } from "react";

import AddCalendarPopUp from "./AddCalendarPopUp";
import DayDiv from "../data/dayDiv.json";
import Event from "./Event";
import { Helmet } from "react-helmet";
import TeamData from "../data/teams.json";
import Toggle from "./Toggle";
import { useLoaderData } from "react-router-dom";

const ical = require("cal-parser");

async function loadAndParseCal(fileName) {
  var hostname, httpProtocol;
  if (process.env.NODE_ENV === "development") {
    hostname = "localhost:3000";
    httpProtocol = "http";
  }

  if (process.env.NODE_ENV === "production") {
    hostname = "calabssa.be";
    httpProtocol = "https";
  }

  const baseUri = `${hostname}/ics/${fileName}.ics`;
  const icalPath = `${httpProtocol}://${baseUri}`;
  const icalWebcal = `webcal://${baseUri}`;

  const icalCall = await fetch(icalPath);
  const icalText = await icalCall.text();
  const icalTextNewline = icalText
    .replace(/\\\r\n n/g, "<br />")
    .replace(/\\n/g, "<br />");

  const icalDict = ical.parseString(icalTextNewline);

  const icalInfo = icalDict.calendarData;
  const icalEvents = [];

  icalDict.events.forEach((elem) => {
    var desc = elem.description.value;
    desc = desc.replace(/<br \/>/g, "\n");
    icalEvents.push({
      key: elem.uid.value,
      dtstamp: elem.dtstamp,
      dtstart: elem.dtstart.value,
      dtend: elem.dtend.value,
      summary: elem.summary.value,
      description: desc,
      location: elem.location.value,
      organizer: elem.organizer.value,
      uid: elem.uid.value,
      latitude: elem.geo.value.split(";")[0],
      longitude: elem.geo.value.split(";")[1],
    });
  });

  const icalParam = {
    icalPath: icalPath,
    icalWebcal: icalWebcal,
    baseUri: baseUri,
  };

  return { icalParam, icalInfo, icalEvents };
}

export async function loader({ params }) {
  if (!Object.keys(TeamData).includes(params.teamId))
    throw new Error(
      "Équipe introuvable! Refais une recherche ou vérifie ton lien."
    );

  const loaderData = await loadAndParseCal(params.teamId);
  const currentTeamData = TeamData[params.teamId];

  loaderData.icalInfo.displayNameFull = currentTeamData.search_name;
  loaderData.icalInfo.displayNameShort = currentTeamData.club_name;

  loaderData.calSettings = {
    displayPast: false,
    setPageTitle: true,
    enableOptions: true,
  };

  return loaderData;
}

export async function defaultLoader() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayDivFlt = Object.entries(DayDiv).filter(
    (e) => new Date(Date.parse(e[1].date.replace(" ", "T"))) >= today
  );

  var dayDivCandidates;

  if (dayDivFlt.length === 0) {
    dayDivCandidates = Object.entries(DayDiv);
  } else {
    const nextDay = dayDivFlt.reduce((prev, curr) => {
      // return prev[1].day < curr[1].day ? prev : curr;
      return new Date(Date.parse(prev[1].date.replace(" ", "T"))) <
        new Date(Date.parse(curr[1].date.replace(" ", "T")))
        ? prev
        : curr;
    })[1].day;

    dayDivCandidates = dayDivFlt.filter((e) => e[1].day === nextDay);
  }

  const [calendarId, calendarInfo] =
    dayDivCandidates[Math.floor(Math.random() * dayDivCandidates.length)];

  const loaderData = await loadAndParseCal(calendarId);
  loaderData.icalInfo.displayNameFull = calendarInfo.name;
  loaderData.icalInfo.displayNameShort = loaderData.icalInfo["x-wr-calname"];

  loaderData.calSettings = {
    displayPast: true,
    setPageTitle: false,
    enableOptions: false,
  };
  return loaderData;
}

export default function Calendar() {
  const { icalParam, icalInfo, icalEvents, calSettings } = useLoaderData();

  const [saveCal, setSaveCal] = useState(false);
  const saveCalPopUp = useRef(null);

  const [showPast, setShowPast] = useState(calSettings.displayPast);

  const icalEventsFlt = icalEvents.filter(
    (e) => showPast || e.dtend >= Date.now()
  );
  const [events, setEvents] = useState(icalEventsFlt);

  useEffect(() => {
    setEvents(icalEvents.filter((e) => showPast || e.dtend >= Date.now()));
  }, [icalEvents, showPast]);

  useEffect(() => {
    setShowPast(calSettings.displayPast);
  }, [calSettings]);

  const handleKeyDownAddAgenda = (event) => {
    const { key } = event;
    if (key === "Escape") setSaveCal(false);
  };

  const handleClickAddAgenda = () => {
    if (calSettings.enableOptions) {
      setSaveCal(true);
      saveCalPopUp.current.focus();
    }
  };

  return (
    <div
      ref={saveCalPopUp}
      onKeyDown={handleKeyDownAddAgenda}
      tabIndex={-1}
      className="focus:outline-none"
    >
      {calSettings.setPageTitle && (
        <Helmet>
          <title>
            {"CalABSSA" +
              (calSettings.setPageTitle
                ? " - " + icalInfo.displayNameShort
                : "")}
          </title>
          <meta name="description" content={icalInfo["x-wr-caldesc"]} />
        </Helmet>
      )}

      {saveCal && (
        <AddCalendarPopUp
          baseUri={icalParam.baseUri}
          calName={icalInfo["x-wr-calname"]}
          closeEvent={() => setSaveCal(false)}
        />
      )}
      <div className="block">
        <div className="block lg:flex w-full items-center space-y-4 lg:space-y-0 lg:mb-6 ">
          <h1 className="text-center lg:text-left font-extrabold text-2xl sm:text-3xl w-full lg:min-h-[52px]">
            {icalInfo.displayNameFull}
          </h1>
          {calSettings.enableOptions && (
            <p
              className="min-w-max max-w-max mx-auto rounded-3xl p-3 text-white font-semibold bg-sky-400 text-lg select-none cursor-pointer"
              onClick={handleClickAddAgenda}
            >
              Ajouter à l'agenda
            </p>
          )}
        </div>
        {calSettings.enableOptions && (
          <Toggle state={showPast} setState={setShowPast}>
            Afficher les matches passés
          </Toggle>
        )}
      </div>
      <div className="divide-solid divide-y divide-slate-900/10">
        {events.map((e) => (
          <Event {...e} />
        ))}
      </div>
    </div>
  );
}
