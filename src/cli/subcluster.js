var fs = require("fs");
var commander = require("commander");
var winston = require("winston");

var subcluster = require("../subcluster");
var _networkCDCDateField = "hiv_aids_dx_dt";
var today = new Date();

commander
  .option("-i --input <input>", "Input HIV-TRACE results file")
  .option(
    "-o --output <output>",
    "Output HIV-TRACE results file with subclusters"
  )
  .parse(process.argv);

fs.readFile(commander.input, (err, data) => {
  let shiv_results = JSON.parse(data);

  let new_json = subcluster.annotate_priority_clusters(
    shiv_results.trace_results,
    0.005,
    _networkCDCDateField,
    36,
    12,
    today
  );

  // Write out new json with subclusters
  fs.writeFile(commander.output, JSON.stringify(new_json), d => {
    winston.info(
      "Subcluster inference completed. Please proceed with further downstream analysis."
    );
  });
});