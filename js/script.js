const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
selectTag = document.querySelectorAll("select"),
exchangeIcon = document.querySelector(".exchange"),
translateBtn = document.querySelector("button");
icons = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => {
    for (const country_code in countries){
        // English is selected by default
        let selected;
        if(id == 0 && country_code == "en-GB") {
            selected = "selected";
        } else if(id == 1 && country_code == "es-ES") {
            selected = "selected";
        }

        let opt = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", opt); // Options tag inside Select tag
    }
})

exchangeIcon.addEventListener("click", () => {
    // Exchange text area and select tag values
    let temp = fromText.value,
    tempLang = selectTag[0].value;
    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    toText.value = temp;
    selectTag[1].value = tempLang;
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value,
    translateFrom = selectTag[0].value, // Get fromSelect tag value
    translateTo = selectTag[1].value;  // Get toSelect tag value
    
    if (!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

    //Fetching api response and returning it with parsing into js object, then receiving that obj.
    fetch(apiURL).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let voice;
            if(target.id == "from") {
                voice = new SpeechSynthesisUtterance(fromText.value);
                // Setting utterance language to fromSelect tag value
                voice.lang = selectTag[0].value;
            } else {
                voice = new SpeechSynthesisUtterance(toText.value);
                // Setting utterance language to toSelect tag value
                voice.lang = selectTag[1].value;
            }
            speechSynthesis.speak(voice);
        }
    });
});