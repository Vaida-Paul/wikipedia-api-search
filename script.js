'use strict';

const submitBtn = document.getElementById('submit');
const input = document.getElementById('input');
const errorSpan = document.getElementById('error');
const results = document.getElementById('results');

const URL = 'https://en.wikipedia.org/w/api.php?';

//params, here i have the confifuration
const params = {
    origin: '*',
    format: 'json',
    action: 'query',
    prop: 'extracts',
    exchars: 250,
    exintro: true,
    explaintext: true,
    generator: 'search',
    gsrlimit: 10,
};

// ################
// Helper functions
// ################
const changeUIstate = () => {
    input.disabled = !input.disabled;
    submitBtn.disabled = !submitBtn.disabled;
};
const clearPreview = () => {
    results.innerHTML = '';
    errorSpan.innerHTML = '';
};
const isEmptyInput = input => {
    // when i remove from input field, so there is a nullish value
    if (!input || input === '') {
        return true;
    }
    return false;
};
const gatherData = pages => {
    // return an array
    const finalResults = Object.values(pages).map(page => ({
        pageID: page.pageid,
        title: page.title,
        intro: page.extract,
    }));
    showResults(finalResults);
};
const showError = error => {
    errorSpan.innerHTML = `${error}`;
};

const showResults = data => {
    data.forEach(result => {
        results.innerHTML += `
        <div class="results__item">
            <a href="https://en.wikipedia.org/?curid=${result.pageId}" target="_blank" class="card animated bounceInUp">
                <h2 class="results__item__title">${result.title}</h2>
                <p class="results__item__intro">${result.intro}</p>
            </a>
        </div>
    `;
    });
};

// ################
// Handler Functions
// ################
const getData = async () => {
    const userInput = input.value;
    if (isEmptyInput(userInput)) {
        return;
    }
    params.gsrsearch = userInput;
    clearPreview();
    changeUIstate();
    try {
        const { data } = await axios.get(URL, { params }); // await the request

        if (data.error) {
            throw new Error(data.error.info);
        }
        gatherData(data.query.pages);
        //results.innerHTML = data;
    } catch (error) {
        showError(error);
    } finally {
        changeUIstate();
    }
};
const handleKeyEvent = e => {
    if (e.key === 'Enter') {
        getData();
    }
};

// ################
// Events
// ################
const registerEventHandler = () => {
    input.addEventListener('keydown', handleKeyEvent);
    submitBtn.addEventListener('click', getData);
};

registerEventHandler();
