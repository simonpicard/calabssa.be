import agendaInfo from "../data/agendaInfo.json";

function stringTemplateParser(expression, valueObj) {
  const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
  let text = expression.replace(templateMatcher, (substring, value, index) => {
    value = valueObj[value];
    return value;
  });
  return text;
}

export default function Calendar({ baseUri, calName, closeEvent }) {
  const strTemplateParam = {
    baseUri,
    calName,
    publicUrl: process.env.PUBLIC_URL,
  };

  return (
    <div
      className="fixed w-full h-full bg-white/50 backdrop-blur top-0 left-0 z-50"
      onClick={closeEvent}
    >
      <div className="flex items-center justify-center w-full h-full">
        <div className="bg-white block w-auto drop-shadow-2xl rounded-3xl p-6 text-lg md:text-2xl divide-y ">
          <div className="mb-2 flex">
            <p>Enregistrer le calendrier</p>
            <svg
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              onClick={closeEvent}
              className="w-6 ml-4 cursor-pointer"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </svg>
          </div>
          {agendaInfo.map((elem, key) => {
            return (
              <div
                className="hover:bg-slate-100 w-full h-full cursor-pointer"
                key={key}
              >
                <a
                  href={stringTemplateParser(elem.link, strTemplateParam)}
                  className="flex space-x-2 h-full py-2"
                >
                  <img
                    src={stringTemplateParser(elem.img_url, strTemplateParam)}
                    alt={`${elem.name} icon`}
                    width="32"
                  />
                  <p>{elem.name}</p>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
