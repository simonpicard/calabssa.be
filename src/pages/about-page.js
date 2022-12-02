import AboutData from "../data/about.json";
import Accordion from "../components/Accordion";

export default function AboutPage() {
  return (
    <div
      id="about-page"
      className="block divide-solid divide-y divide-slate-900/ 10 text-[#334155] items-center"
    >
      {AboutData.map((value, key) => {
        return (
          <Accordion className="py-2" key={key}>
            <div className="font-semibold">{value.q}</div>
            <div className="text-justify">
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: value.a }}
              ></div>
            </div>
          </Accordion>
        );
      })}
    </div>
  );
}
