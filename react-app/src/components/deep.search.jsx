import { useState } from "react";
import styles from "../components.css.styles/pdf.module.css";

function DeepPDFSearch() {
  const [unitName, setUnitName] = useState("");
  const [courseCode, setCourseCode] = useState("");

  const handleSearch = () => {
    // Deep search logic goes here (API call, backend query, etc.)
    console.log("Searching for:", { unitName, courseCode });
  };

  return (
    <div className={styles.pdfSection}>
      <div className={styles.headers}>Deep PDF Search</div>

      {/* Search Inputs */}
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Enter Unit Name..."
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Course Code (optional)..."
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Results Section */}
      <div className={styles.results}>
        <div className={styles.noResults}>No results yet</div>
      </div>
    </div>
  );
}

export { DeepPDFSearch };
