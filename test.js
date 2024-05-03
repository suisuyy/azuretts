fetch("https://api.ttsopenai.com/api/v1/public/text-to-speech-stream", {
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
            body: `{"model":"tts-1","voice":"alloy","speed":1,"input":"test"}`
        });