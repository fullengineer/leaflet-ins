import { Map } from "../components/Map/Map.tsx";
import { NavBar } from "../components/NavBar.tsx";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="relative flex min-h-0 w-full flex-1 items-start justify-center">
        <Map containerClassName="flex flex-1 h-full w-full flex-1 items-center min-h-0" />
      </main>
    </>
  );
}
