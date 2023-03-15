// api data
const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
const token = "ec03e0fc43259ac9304b0de051959f59496b3650";

//search input
const inputTitle = document.querySelector("#title");
//search res
const ulRes = document.querySelector("#res");

//inputs
const inpKrTitle = document.getElementById("kr-title");
const inpFullTitle = document.getElementById("full-title");
const inpInn = document.getElementById("inn");
const inpAddress = document.getElementById("address");
const orgTitle = document.querySelector(".org-title");

inputTitle.oninput = () => checkData();
const checkData = async () => {
    ulRes.innerHTML = null;
    if (!inputTitle.value.length) {
        ulRes.style.display = "none";
    }

    const data = await getData();

    if (data.suggestions?.length) {
        ulRes.style.display = "flex";
        for (let elem of data.suggestions){
            const newElem = document.createElement("div");
            newElem.onclick = () => setValue(elem);
            newElem.innerHTML = `
                <span>
                    <h5>${elem.value}</h5>
                    <p>${elem.data.address.value}</p>
                </span>
            `;
            ulRes.appendChild(newElem)
        }
    } else {
        ulRes.innerHTML = `<h3>Результаты не найдены</h3>`
    }
}

function setValue(elem){
    inpKrTitle.value = elem.data.name.short;
    inpFullTitle.value = elem.data.name.full_with_opf;
    inpInn.value = elem.data.inn + " / " + elem.data.kpp;
    inpAddress.value = elem.data.address.value;
    inputTitle.value = "";
    orgTitle.innerHTML = "Тип предприятия: " + typeDescription(elem.data.type)
    ulRes.style.display = "none";
}

function typeDescription(type) {
    const TYPES = {
        'INDIVIDUAL': 'Индивидуальный предприниматель',
        'LEGAL': 'Организация'
    }
    return TYPES[type];
}

const getData = async () => {
    const options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
        },
        body: JSON.stringify({query: inputTitle.value})
    }

    const data = await fetch(url, options);
    return await data.json();
}

