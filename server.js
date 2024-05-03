const express = require('express');
const cors = require('cors'); // Add this line
const app = express();
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const path = require('path');
const fs = require('fs')



app.use(cors()); // Use cors middleware here

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/tts/:text', async (req, res) => {
    let startTime=Date.now();
    console.log('start /tts ' + startTime);
    let text = req?.params?.text || 'test';
    let subtext= text.substring(0, 198);
    try {
        const response = await fetch("https://api.ttsopenai.com/api/v1/public/text-to-speech-stream", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "accept-language": "en-US,en;q=0.9",
                "authorization": "",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "Referer": "https://ttsopenai.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: JSON.stringify({ "model": "tts-1", "voice": "alloy", "speed": 1, "input": subtext })
        });
        console.log('response:', response.status,Date.now()-startTime);
        if (response.status !== 200) {
            // console.log(response);
            throw Error(response.status + await response.text())
        }
        const mp3Buffer = await response.arrayBuffer();
        console.log('gt mp3 buffer ',Date.now()-startTime);

        // const mp3File = fs.createWriteStream('output.mp3');
        // mp3File.write(Buffer.from(mp3Buffer));
        // mp3File.end();
        // console.log('MP3 file saved to output.mp3');

        // Send the saved file to the client
        res.set('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(mp3Buffer))
        console.log('sent output.mp3 ',Date.now()-startTime);

        return;
    } catch (error) {
        console.error(error, 'try azure tts');
    }



    let voice = req.query.voicename || "de-DE-SeraphinaMultilingualNeural";

    let audioFile = "audio.mp3";
    let speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
    let audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;
    speechConfig.speechSynthesisVoiceName = voice;
    let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

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

app.get('/atts/:text', (req, res) => {
    const text = req?.params?.text || 'test';

    fetch("https://api.ttsopenai.com/api/v1/public/text-to-speech-stream", {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9",
            "authorization": "",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referer": "https://ttsopenai.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `{"model":"tts-1","voice":"alloy","speed":1,${text}}`,
        "method": "POST"
    });

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
