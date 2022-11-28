import { useRouteError } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import TeamData from "../data/teams.json";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div>
            <HeaderBar data={TeamData} />
            <div id="error-page" className="flex justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-semibold">Oops!</h1>
                    <br />
                    <p>Désolé, une erreur inattendue s'est produite.</p>
                    <br />
                    <p>
                        <i>{error.statusText || error.message}</i>
                    </p>
                </div>
            </div>
        </div>
    );
}