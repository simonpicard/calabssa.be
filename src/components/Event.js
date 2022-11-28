import { useRef, useState } from "react";
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

function Event(props) {

    let date_str = props.dtstart.toLocaleDateString("fr-BE", { year: 'numeric', month: 'long', day: 'numeric' });
    let time_start_str = props.dtstart.toLocaleTimeString("fr-BE", { hour: "numeric", minute: "numeric" });
    let time_end_str = props.dtend.toLocaleTimeString("fr-BE", { hour: "numeric", minute: "numeric" });

    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const mapRef = useRef(null);

    const geo = [props.latitude, props.longitude];

    //toggle accordion function
    let toggleHandler = (e) => {
        setOpen(!open);
        setTimeout(() => mapRef.current.invalidateSize(), 300);
    };

    return (
        <div className="pt-2 mt-2 text-left">
            <div className="flex hover:text-sky-400 " onClick={toggleHandler}>
                <div className="grid grid-cols-6 xl:grid-cols-7 w-full">
                    <div className='row-start-1 col-start-1 flex-none h-auto'> {date_str} </div>
                    <div className="row-start-2 col-start-1 xl:row-start-1 xl:col-start-2 flex-none">{time_start_str} à {time_end_str}</div>
                    <div className="row-start-1 col-start-2 xl:col-start-3 col-span-5 font-semibold flex-none" >{props.summary}</div>
                    <div className='row-start-2 col-start-2 xl:col-start-3 col-span-5 flex'>{props.location}</div>
                </div>
                <p
                    className="my-auto text-2xl transition-[transform] ease-out duration-200 delay-[0ms] select-none"
                    style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
                >
                    {"❯"}
                </p>
            </div>
            <div
                className='flex overflow-hidden transition-[max-height] ease-out duration-200 delay-[0ms]'
                style={{ maxHeight: open ? ref.current.scrollHeight + "px" : "0px" }}
            >
                <div className='grid grid-cols-7'>
                    <MapContainer
                        ref={mapRef}
                        className="block h-auto z-0 row-start-1 col-start-1 col-span-2 m-2"
                        center={geo}
                        zoom={10}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={geo} />
                    </MapContainer>
                    <div className="block h-auto row-start-1 col-start-3 col-span-5" ref={ref}>
                        {props.description.split('\n\n').map((str) => <div className='my-1 py-1'>{str.split('\n').map((str2) => <p className='flex'>{str2}</p>)}</div>)}
                    </div>
                </div>
                <p
                    className="my-auto text-2xl select-none invisible"
                >
                    {"❯"}
                </p>
            </div>
        </div>
    );

    return (
        <div className="row pt-2 mt-2 text-left">
            <div className="flex hover:text-sky-400" onClick={toggleHandler}>
                <div className='gridcell w-40 flex-none'> {date_str} </div>
                <div className="gridcell w-40 flex-none">{time_start_str} à {time_end_str}</div>
                <div className="gridcell block mr-auto">
                    <div className="font-semibold flex-none" >{props.summary}</div>
                    <div className='flex'>{props.location}</div>
                </div>
                <p
                    className="my-auto text-2xl relative transition-[transform] ease-out duration-200 delay-[0ms] select-none"
                    style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
                >
                    {"❯"}
                </p>
            </div>
            <div
                className='flex overflow-hidden transition-[max-height] ease-out duration-200 delay-[0ms]'
                style={{ maxHeight: open ? ref.current.scrollHeight + "px" : "0px" }}
            >
                <MapContainer
                    ref={mapRef}
                    className="block w-[312px] min-w-[312px] h-auto z-0"
                    center={geo}
                    zoom={10}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={geo} />
                </MapContainer>

                <div className="block h-auto" ref={ref}>
                    {props.description.split('\n\n').map((str) => <div className='m-1 p-1'>{str.split('\n').map((str2) => <p className='flex'>{str2}</p>)}</div>)}
                </div>
            </div>
        </div>
    );
}

export default Event;