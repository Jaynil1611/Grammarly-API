const { Grammarly } = require("@stewartmcgown/grammarly-api");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

// const text = `When we have shuffled off this mortal coil,
// Must give us pause - their's the respect
// That makes calamity of so long life.`;

// const free = new Grammarly();

// (async () => {
//     const results = await free.analyse(text)
//     console.log(results);
// })();

const getRequiredDetailsFromGrammarly = (response) => {
  const finalResults = {
    alerts: [],
    result: {},
  };
  response.alerts.map((alert) => {
    const {
      title,
      minicardTitle,
      result,
      details,
      explanation,
      todo,
      text,
      cardLayout: { group },
    } = alert;
    finalResults.alerts.push({
      title: cleanOutput(title),
      minicardTitle: cleanOutput(minicardTitle),
      result: cleanOutput(result),
      details: cleanOutput(details),
      explanation: cleanOutput(explanation),
      todo: cleanOutput(todo),
      text: cleanOutput(text),
      group: cleanOutput(group),
    });
  });
  const { score } = response.result;
  finalResults.result.score = score;
  return finalResults;
};

const cleanOutput = (inputQuery) => {
  const newLineRegEx = /\r?\n|\r/;
  const htmlRegEx = /(<([^>]+)>)/gi;
  return inputQuery.replace(newLineRegEx, "").replace(htmlRegEx, "").toString();
};

app.get("/check", async function (req, res) {
  try {
    const grammarly = new Grammarly();
    const query = req.query.search;
    if (query.length > 0) {
      const parsedQuery = cleanOutput(query);
      const results = await grammarly.analyse(parsedQuery);
      const finalResults = getRequiredDetailsFromGrammarly(results);
      res.status(200).send(finalResults);
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    res.status(404).send("Error! Something is really wrong.");
  }
});

app.get("/", (req, res) => res.send("Welcome to Jaynil's Grammar Checker!"));

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Grammar Checker Running on ${port}`);
});
