import { useRef, useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css';
import {
    MapContainer,
    TileLayer,
    Marker
} from 'react-leaflet'
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
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

    const { height, width } = useWindowDimensions();

    let date_str = width >= 1024 ? props.dtstart.toLocaleDateString("fr-BE", { year: 'numeric', month: 'long', day: 'numeric' }) : props.dtstart.toLocaleDateString("fr-BE", { year: 'numeric', month: 'numeric', day: 'numeric' });
    let time_start_str = props.dtstart.toLocaleTimeString("fr-BE", { hour: "numeric", minute: "numeric" });
    let time_end_str = props.dtend.toLocaleTimeString("fr-BE", { hour: "numeric", minute: "numeric" });

    const [open, setOpen] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const ref = useRef(null);
    const mapRef = useRef(null);

    const geo = [props.latitude, props.longitude];

    //toggle accordion function
    let toggleHandler = (e) => {
        setOpen(!open);
        setTimeout(() => mapRef.current.invalidateSize(), 300);
    };

    return (
        <div className="pt-2 mt-2 text-left text-[#334155]">
            <div className="flex hover:text-sky-400 " onClick={toggleHandler}>
                <div className="grid grid-cols-6 lg:grid-cols-6 xl:grid-cols-7 w-full">
                    <div className='row-start-1 col-start-1 flex-none flex lg:block xl:grid xl:grid-cols-2 row-span-1 lg:row-span-2 xl:row-span-1 xl:col-span-2 space-x-1 lg:space-x-0'>
                        <div className='flex-none'> {date_str} </div>
                        <div className="flex-none">{time_start_str} à {time_end_str}</div>
                    </div>
                    <div className="row-start-2 col-span-full lg:row-start-1 lg:col-start-2 xl:col-start-3 lg:col-span-5 font-semibold flex-none" >{props.summary}</div>
                    <div className='row-start-3 col-span-full lg:row-start-2 lg:col-start-2 xl:col-start-3 lg:col-span-5 flex'>{props.location}</div>
                </div>
                <p
                    className="my-auto text-2xl transition-[transform] ease-out duration-200 delay-[0ms] select-none"
                    style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
                >
                    ❯
                </p>
            </div>
            <div
                className='flex overflow-hidden transition-[max-height] ease-out duration-200 delay-[0ms]'
                style={{ maxHeight: open ? ref.current.scrollHeight + (width < 768 ? 128 : 0) + "px" : "0px" }}
            >
                <div className='flex flex-col-reverse md:grid md:grid-rows-1 md:grid-cols-6 xl:grid-cols-7'>
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
                    <div className="block h-max md:row-start-1 md:col-start-1 xl:col-start-3 md:col-span-4 xl:col-span-5 text-justify" ref={ref}>
                        {props.description.split('\n\n').map((str) => <div className='my-1 py-1'>{str.split('\n').map((str2) => <p className='flex'>{str2}</p>)}</div>)}
                    </div>
                </div>
                {width >= 1280 &&
                    <p
                        className="my-auto text-2xl select-none invisible"
                    >
                        ❯
                    </p>
                }
            </div>
        </div>
    );
}

export default Event;