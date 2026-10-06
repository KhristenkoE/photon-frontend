export function Overlay() {
  return (
    <>
      <div className='pointer-events-none absolute top-[-40px] left-0 z-[var(--feed-overlay-z-index)] h-full w-full bg-[linear-gradient(180deg,rgba(3,3,3,0.70)_0%,rgba(38,38,38,0)_25%)]'></div>
      <div className='pointer-events-none absolute bottom-[83px] left-0 z-[var(--feed-overlay-z-index)] h-[70px] w-full bg-[linear-gradient(180deg,rgba(3,3,3,0)_3%,rgba(22,22,22,0.063)_10%,rgba(38,38,38,0.15)_20%,rgba(38,38,38,0.450)_40%,rgba(38,38,38,0.650)_60%,rgba(38,38,30,0.850)_80%,rgba(38,38,38,1)_100%)]'></div>
    </>
  );
}
