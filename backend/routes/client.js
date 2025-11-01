const express = require("express");
const router = express.Router();
const fs = require("fs");
const { generateRandomLogs, predictMLScore } = require("../utils");
const { addFilestoIPFS } = require("../ipfs");
const { addBlock } = require("../web3-methods");
const User=require('../models/user.model');
const Log=require('../models/dataModel')

router.post("/addLog", async (req, res) => {
  try {
    const  logData  = req.body;
    console.log("Received log data:", logData);
      const userId=logData.userId;
 
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const ml_risk_score = predictMLScore(logData);

    const logLine = `${logData.campLocation},${logData.timestamp},${logData.source},${logData.destination},${logData.user},${logData.device},${logData.eventType},${logData.eventDescription},${logData.eventSeverity},${ml_risk_score}\n`;

    await fs.promises.appendFile(
      `./${process.env.LOCAL_LOG_FOLDER}/${logData.campLocation}.txt`,
      logLine
    );

  
    await fs.promises.appendFile(
      `./${process.env.LOCAL_LOG_FOLDER}/All.txt`,
      logLine
    );

  
    const newLog = new Log({
      timestamp: logData.timestamp,
      source: logData.source,
      destination: logData.destination,
      user: user._id, 
      device: logData.device,
      eventType: logData.eventType,
      eventDescription: logData.eventDescription,
      eventSeverity: logData.eventSeverity,
      campLocation: logData.campLocation,
      mlRiskScore: ml_risk_score,
    });

    await newLog.save();

    console.log("✅ Log saved successfully to DB and files");
    res.status(200).json({ message: "Success" });

  } catch (err) {
    console.error("❌ Error in addLog API:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.post("/addLogs", async (req, res) => {
  try {
    const { numberoflogs, campLocation } = req.body;
    console.log("inside add logs");

    if (!numberoflogs || !campLocation) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let content = "";
    const logs = generateRandomLogs(numberoflogs, campLocation);

    logs.forEach((logData) => {
      content += `${campLocation},${logData.timestamp},${logData.source},${logData.destination},${logData.user},${logData.device},${logData.eventType},${logData.eventDescription},${logData.eventSeverity},${logData.mlRiskScore}\n`;
    });

    const folderPath = `./${process.env.LOCAL_LOG_FOLDER}`;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    await fs.promises.appendFile(`${folderPath}/${campLocation}.txt`, content);

    await fs.promises.appendFile(`${folderPath}/All.txt`, content);

    console.log("before success");

    return res.status(200).json({
      message: "Success",
      addedLogs: logs.length,
      campLocation,
    });
  } catch (error) {
    console.error("Error in /addLogs:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


router.post("/triggerIPFSBlockChain", async (req, res) => {
  const response = await addFilestoIPFS([
    {
      path: "Delhi.txt",
      content: fs.readFileSync(`./${process.env.LOCAL_LOG_FOLDER}/Delhi.txt`, {
        encoding: "base64",
      }),
    },
    {
      path: "Mumbai.txt",
      content: fs.readFileSync(`./${process.env.LOCAL_LOG_FOLDER}/Mumbai.txt`, {
        encoding: "base64",
      }),
    },
    {
      path: "Bangalore.txt",
      content: fs.readFileSync(
        `./${process.env.LOCAL_LOG_FOLDER}/Bangalore.txt`,
        {
          encoding: "base64",
        }
      ),
    },
  ]);
  addBlock(response[0].path, "Delhi");
  addBlock(response[1].path, "Mumbai");
  addBlock(response[2].path, "Bangalore");
  const bngContent = fs.readFileSync(
    `./${process.env.LOCAL_LOG_FOLDER}/Bangalore.txt`
  );
  const mumContent = fs.readFileSync(
    `./${process.env.LOCAL_LOG_FOLDER}/Mumbai.txt`
  );
  const delContent = fs.readFileSync(
    `./${process.env.LOCAL_LOG_FOLDER}/Delhi.txt`
  );
  fs.appendFileSync(
    `./${process.env.CENTRAL_LOG_FOLDER}/Delhi.txt`,
    delContent,
    function () {
      console.log("done");
    }
  );
  fs.appendFileSync(
    `./${process.env.CENTRAL_LOG_FOLDER}/Mumbai.txt`,
    mumContent,
    function () {
      console.log("done");
    }
  );
  fs.appendFileSync(
    `./${process.env.CENTRAL_LOG_FOLDER}/Bangalore.txt`,
    bngContent,
    function () {
      console.log("done");
    }
  );
  fs.appendFileSync(
    `./${process.env.CENTRAL_LOG_FOLDER}/All.txt`,
    bngContent + mumContent + delContent,
    function () {
      console.log("done");
    }
  );
  fs.writeFileSync(
    `./${process.env.LOCAL_LOG_FOLDER}/Bangalore.txt`,
    "",
    function () {
      console.log("done");
    }
  );
  fs.writeFileSync(
    `./${process.env.LOCAL_LOG_FOLDER}/Delhi.txt`,
    "",
    function () {
      console.log("done");
    }
  );
  fs.writeFileSync(
    `./${process.env.LOCAL_LOG_FOLDER}/Mumbai.txt`,
    "",
    function () {
      console.log("done");
    }
  );
  fs.writeFileSync(
    `./${process.env.LOCAL_LOG_FOLDER}/All.txt`,
    "",
    function () {
      console.log("done");
    }
  );

  res.json({ message: "Success" });
});


module.exports = router;
