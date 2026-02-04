import fs from "fs";
// READING FILES

// reading file asynchronously/non-blocking
() => {
  fs.readFile("hotel.html", "utf8", (err, data) => {
    if (err) return console.log("Error when reading file");
    console.log(data);
  });
};
// reading files synchronously/blocking
() => {
  let file = fs.readFileSync("hotel.html", "utf8");
  console.log(file);
};
// using readStream
() => {
  let read_stream = fs.createReadStream("hotel.html", "utf8");
  read_stream.on("data", (chunk) => {
    console.log(chunk);
  });
};

// CREATING FILES

// creating using asychronous way
() => {
  let data = "It's working correctly";
  fs.writeFile("txt.txt", data, (err) => {
    if (err) return console.log("Not working");
    console.log("Success when creating file Asynchronously");
  });
};

// creating files synchronously
() => {
  let info = "Working properly\n";
  let file = fs.writeFileSync("txt2.txt", info, { flag: "a" });
  console.log("Its working");
};
// creating files using writeStream
() => {
  let data = "WriteStream created\n";
  let write_stream = fs.createWriteStream("txt3.txt");
  write_stream.write(data);
  write_stream.on("error", (err) => {
    console.log("Unable to create writeStream");
  });
  write_stream.on("ready", () => {
    console.log("Write stream created successfully");
  });
};
// Creating piping
() => {
  let read_stream2 = fs.createReadStream("txt3.txt");
  read_stream2.on("error", (err) => {
    console.log("Error when creating readStream");
  });
  let write_stream2 = fs.createWriteStream("none.txt");
  read_stream2.pipe(write_stream2);
};
// creating a directory
fs.mkdir("uploads", (err) => {
  if (err) {
    console.log("Unable to create upload folder because it exists");
  }
});
