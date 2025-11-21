import { useState, useRef, useEffect } from "react";
import searchCSS from "../mainCss/online.module.css";
import SearchView from "./overlayscan.jsx";

function Search({ toggle }) {
  // get user input
  const [query, setQuery] = useState("");
  // get results
  const [results, setResults] = useState([]);
  // error message
  const [errorMsg, setErrorMsg] = useState("");
  // link to Iframe
  const [link, resetLink] = useState(null);
  // setting codition for full/min screen
  const [isFull, set] = useState(false);
  //used to pass the search overlay state
  const [sView, resetView] = useState(false);
  // fullscreen ref
  const viewerRef = useRef(null);
  // scrooling to top when pdf preview is opened
  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // fullscreen functions
  function openFullScreen() {
    const elem = viewerRef.current;
    if (!elem) return;
    // modern browsers m edge firefox chrome
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
    // older browsers like safari
    else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
    // old microsoft fallback
    else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    set(true);
  }

  function exitFullScreen() {
    // for most browsers
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    // for safari
    else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    set(false);
  }
  // handling change when pressing escape to minimize window
  useEffect(() => {
    function handler() {
      // If NOT in fullscreen, update your state
      if (!document.fullscreenElement) {
        set(false);
        scrollTop();
      }
    }

    document.addEventListener("fullscreenchange", handler);

    return () => {
      document.removeEventListener("fullscreenchange", handler);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setResults([]);
    resetLink(null);
    resetView(true);
    api();
  };
  async function api() {
    setErrorMsg("");

    try {
      const res = await fetch("https://campushub-mq9h.onrender.com/api", {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({ val: query }),
      });
      const data = await res.json();

      if (!Array.isArray(data)) {
        setResults([]);
        setErrorMsg("Connection lost");
        return;
      } else if (data.length === 0) {
        return setErrorMsg("PDF not Found");
      }
      resetView(false);
      setResults(data);
    } catch (err) {
      setErrorMsg("Something went wrong. Try again.");
    }
  }

  function pdfView(pageLink) {
    resetLink(pageLink);
  }

  return (
    <div
      className={`${searchCSS.searchWrapper} ${
        toggle === "onlineDownloads" ? "" : searchCSS.activeScreen
      }`}
    >
      <form onSubmit={handleSearch} className={searchCSS.searchForm}>
        <input
          type="text"
          placeholder="Search files Online..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={searchCSS.searchInput}
        />
        <button type="submit" className={searchCSS.searchBtn}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>

      <SearchView view={sView} error={errorMsg} />

      <div className={searchCSS.resultsWrapper}>
        {results.map((item, index) => (
          <div
            key={index}
            className={searchCSS.pdfBox}
            onClick={() => {
              pdfView(item.pdfLink);
              scrollTop();
            }}
          >
            <div className={searchCSS.pdfPreview}></div>
            <div className={searchCSS.pdfInfo}>
              <h4>{item.title || "No Title"}</h4>
              <p>{item.creator || "Unknown Author"}</p>
              <span>{item.year || "N/A"}</span>
            </div>
          </div>
        ))}
      </div>

      {link && (
        <div ref={viewerRef} className={searchCSS.pdfViewLayer}>
          <div className={searchCSS.close}>
            <button
              title="close PDF preview"
              className={searchCSS.closeBtn}
              onClick={() => {
                resetLink(null);
                set(false);
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Fullscreen button */}
            <button>
              {!isFull ? (
                <i
                  className="fa-solid fa-up-right-and-down-left-from-center"
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={openFullScreen}
                  title="Fullscreen"
                ></i>
              ) : (
                <i
                  className="fa-solid fa-down-left-and-up-right-to-center"
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={exitFullScreen}
                  title="Minimize"
                ></i>
              )}
            </button>
          </div>

          <iframe src={link} frameBorder="0"></iframe>
        </div>
      )}
    </div>
  );
}
export default Search;
