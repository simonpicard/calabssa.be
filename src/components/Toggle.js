export default function Toggle(props) {
  const { state, setState, children } = props;

  return (
    <div
      className="flex items-center mt-2 md:mt-0 cursor-pointer"
      onClick={() => setState(!state)}
    >
      <div
        className="block border-2 rounded-2xl bg-slate-200 w-10 h-min mr-1"
        style={{
          background: state ? "rgb(56 189 248)" : "rgb(226 232 240)",
          borderColor: state ? "rgb(56 189 248)" : "rgb(226 232 240)",
        }}
      >
        <span
          className="toggle-switch-switch block w-4 h-4 bg-white rounded-2xl transition-[margin]"
          style={{ marginLeft: state ? 20 : 0 }}
        />
      </div>
      {children}
    </div>
  );
}
