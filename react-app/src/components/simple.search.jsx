import styles from "../components.css.styles/pdf.module.css";
function PDFLibrary() {
  return (
    <div className={styles.pdfSection}>
      <div className={styles.headers}>PDF Library</div>
      <div style={{ fontWeight: "bold",color:"#fff" }}>
        Here you can access and manage your PDF resources.
      </div>
      <div className={styles.AllCategory}>
        {" "}
        <div className={styles.category}>New</div>
        <div className={styles.category}>Informatics</div>
        <div className={styles.category}>Information cience</div>
        <div className={styles.category}>Computer Science</div>
        <div className={styles.category}>Computer Graphics</div>
      </div>
      <div className={styles.search}>
        <input type="text" placeholder="Search PDFs..." />
        <button>Search</button>
      </div>
    </div>
  );
}
export { PDFLibrary };
