import { useState } from "react";
import "./styles/find.scss";
import Filter from "../assets/images/Filter Iconvector.svg";
import Search from "../assets/images/Search Iconvector.svg";
import SearchPurple from "../assets/images/Search Iconvector Purple.svg";
import Location from "../assets/images/Location Iconvector.svg";

interface FindProps {
  setSearchQuery: (query: string) => void;
}

export default function Find({ setSearchQuery }: FindProps) {
  const [input, setInput] = useState("");
  const [cusine, setCusine] = useState("");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [isSimple, setIsSimple] = useState(true);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    setSearchQuery(input || name); // Update search query in Hotels.tsx
  };

  return (
    <section className="find-wrapper">
      <div className="search">
        <h1>Find Your Perfect Stay</h1>
        <h2>Search by Cuisine, Location, or Name</h2>
        <div className="searchbar">
          <form onSubmit={onSubmit} className={`input${isSimple ? "" : " complex"}`}>
            {isSimple ? (
              <>
                <img id="searchImage" src={Search} alt="Search icon" title="Search" />
                <input
                  type="text"
                  placeholder="Search for hotels"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                />
                <img id="filterImage" onClick={() => setIsSimple(false)} src={Filter} alt="Filter" />
              </>
            ) : (
              <>
                <input
                  placeholder="Cuisine"
                  type="text"
                  className="cusine"
                  value={cusine}
                  onChange={e => setCusine(e.target.value)}
                />
                <div className="location-input">
                  <img src={Location} alt="Location" />
                  <input
                    placeholder="Location"
                    type="text"
                    className="location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                </div>
                <input
                  placeholder="Name"
                  type="text"
                  className="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <button className="simple-button" onClick={() => setIsSimple(true)}>
                  Simple search
                </button>
              </>
            )}
            <button className="search-button" type="submit">
              <img src={SearchPurple} alt="Search" title="Search" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
