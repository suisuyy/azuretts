const express = require('express');
const cors = require('cors'); // Add this line
const app = express();
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const path = require('path');

app.use(cors()); // Use cors middleware here

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/synthesize/:text', (req, res) => {
    const text = req.params.text;
    const audioFile = "YourAudioFile.wav";
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

    const voice = req.query.voicename || "de-DE-SeraphinaMultilingualNeural";

    speechConfig.speechSynthesisVoiceName = voice; 

    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(text,
        function (result) {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                console.log("synthesis finished.");
                res.download(audioFile); // This will initiate file download
            } else {
                console.error("Speech synthesis canceled, " + result.errorDetails +
                    "\nDid you set the speech resource key and region values?");
            }
            synthesizer.close();
            synthesizer = null;
        },
        function (err) {
            console.trace("err - " + err);
            synthesizer.close();
            synthesizer = null;
        });
    console.log("Now synthesizing to: " + audioFile);
});

const port = process.env.PORT || 7860;
app.listen(port, () => console.log(`Server is running on port ${port}`));
