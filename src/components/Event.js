import "leaflet/dist/leaflet.css";

import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useEffect, useRef, useState } from "react";

import Accordion from "../components/Accordion";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

function Event(props) {
  const { width } = useWindowDimensions();

  var dateFmt;
  if (width >= 768) {
    dateFmt = { year: "numeric", month: "long", day: "numeric" };
  } else {
    dateFmt = { year: "2-digit", month: "2-digit", day: "2-digit" };
  }
  const dateStr = props.dtstart.toLocaleDateString("fr-BE", dateFmt);
  const timeStartStr = props.dtstart.toLocaleTimeString("fr-BE", {
    hour: "numeric",
    minute: "numeric",
  });
  const timeEndStr = props.dtend.toLocaleTimeString("fr-BE", {
    hour: "numeric",
    minute: "numeric",
  });

  const mapRef = useRef(null);

  const geo = [props.latitude, props.longitude];

  const updateMap = () => {
    setTimeout(() => mapRef.current.invalidateSize(), 300);
  };

  const urlify = (txt) => {
    var urlRegex = /(https?:\/\/[^\s]+)/g;

    var links = txt.split(urlRegex);

    for (let i = 1; i < links.length; i += 2) {
      links[i] = (
        <a className="underline" key={"link" + i} href={links[i]}>
          {width < 640 ? "lien" : links[i]}
        </a>
      );
    }

    return links;
  };

  const formatDescription = (description) => {
    return description.split("\n\n").map((str, i) => (
      <div className="my-1 py-1" key={"desc" + i}>
        {str.split("\n").map((str2, i2) => (
          <p className="text-justify" key={"desc" + i + "_" + i2}>
            {urlify(str2)}
          </p>
        ))}
      </div>
    ));
  };

  return (
    <Accordion
      className="pt-2 mt-2 text-left text-[#334155]"
      openAction={updateMap}
    >
      <div className="grid grid-cols-6 lg:grid-cols-6 xl:grid-cols-7 w-full">
        <div className="row-start-1 col-start-1 flex-none flex lg:block xl:grid xl:grid-cols-2 row-span-1 lg:row-span-2 xl:row-span-1 xl:col-span-2 space-x-1 lg:space-x-0">
          <div className="flex-none"> {dateStr} </div>
          <div className="flex-none">
            {width >= 640 ? `${timeStartStr} à ${timeEndStr}` : timeStartStr}
          </div>
        </div>
        <div className="row-start-2 col-span-full lg:row-start-1 lg:col-start-2 xl:col-start-3 lg:col-span-5 font-semibold flex-none">
          {props.summary}
        </div>
        <div className="row-start-3 col-span-full lg:row-start-2 lg:col-start-2 xl:col-start-3 lg:col-span-5 flex">
          {props.location}
        </div>
      </div>

      <div className="flex flex-col-reverse md:grid md:grid-rows-1 md:grid-cols-6 xl:grid-cols-7">
        <MapContainer
          ref={mapRef}
          className="block z-0 h-32 md:h-auto md:row-start-1 col-start1 md:col-start-5 xl:col-start-1 col-span-2 md:ml-2 xl:mr-2 xl:ml-0"
          center={geo}
          zoom={10}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={geo} />
        </MapContainer>
        <div className="block h-max md:row-start-1 md:col-start-1 xl:col-start-3 md:col-span-4 xl:col-span-5 text-justify">
          {formatDescription(props.description)}
        </div>
      </div>
    </Accordion>
  );
}

export default Event;
