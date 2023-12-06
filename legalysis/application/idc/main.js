const express = require('express');
const bodyParser = require('body-parser');
const { promisify } = require('util');
const { execFile } = require('child_process');
 
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
const script1Path = 'llama.py';
const script2Path = "IPC.py";
 
const execFilePromise = promisify(execFile);
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
app.get('/', (req, res) => {
    res.send('Initiating the system');
});
 
app.post('/', async (req, res) => {
    let data = req.body.data;
    let description = req.body.description;
  description = description.replace(/ /g, "#");
    if (data === "Summarization") {
        try {
            const { stdout } = await execFilePromise('/home/ubuntu/jupyter_env/bin/python3', ['llama.py', description]);
            console.log('Python process completed successfully');
            res.send({ outputData: stdout });
        } catch (error) {
            console.error('Error executing Python process:', error.message);
            res.status(500).send({ error: error.message });
        }
    }
 
 
});
 
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
 