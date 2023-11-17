
const urlDetails = "https://restcountries.com/v3.1/"
const container = document.querySelector("#container");
const navBtns = document.querySelectorAll(".navBtn");
const borders = document.querySelectorAll(".borderCountry");
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");
// const holder = document.getElementById("map");

let country = "israel"



const fetchApiAxios = async (url) => {

    const res = await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    console.log(res.data);
        return res.data;
};



const addContent = (holder, content) => {
    holder.append(content);
    const borderItems = document.querySelectorAll(".border-item");
    [...borderItems].map((item) => { item.addEventListener('click', createAgain) })
}

const createCountry = (obj) => {
    console.log(obj);
    const lanKeys = Object.keys(obj.languages);
    let languages = lanKeys.map((item) => obj.languages[item]);
    languages = languages.join(", ")
    const coinKeys = Object.keys(obj.currencies);
    let currencies = coinKeys.map((item) => obj.currencies[item].name + " " + obj.currencies[item].symbol);
    currencies = currencies.join(" ");
    const card = document.createElement("div");
    const content = document.createElement("div");


    card.className = "country p-2";
    card.innerHTML = `
    <div class="d-flex justify-content-between">    
    <div class="ps-5 pb-5">
    <h2 class="pt-5">${country}</h2>
    <div class="">pop: ${obj.population}</div>
    <div class="">region: ${obj.region}</div>
    <div class="">languages: ${languages}</div>
    <div class="">Coin: ${currencies}</div>
    <div class="">capital: ${obj.capital}</div>
    <div class=""><strong>Borders:</strong> </div>${obj.borders.map((item) => `<a href="#" class="pe-1 border-item text-danger" >${item}</a>`).join(" ")}
    </div>
    <img class="w-50 m-4" src=${obj.flags.png} alt=${obj.flags.alt} />
    </div>
    `;
    const map = document.createElement("div");
    map.innerHTML = `<iframe width="100%" height="380px" frameborder="0" scrolling="no" marginheight="0"marginwidth="0"
    src="https://maps.google.com/maps?q=${obj.latlng[0]},${obj.latlng[1]}&hl=iw&z=6&amp;output=embed">
    </iframe> `;
    card.appendChild(map);
    createBorders();
    return card
};

const createAgain = async (event) => {
    container.innerHTML = ''
    console.log(event.target.innerText);
    country = event.target.innerText;
  
      const res = await fetchApiAxios(`${urlDetails}alpha/${country}?fields=name,capital,currencies,region,population,languages,flags,borders,latlng`);
      console.log(res);
    addContent(container, createCountry(res)) 
}



const res = fetchApiAxios(`${urlDetails}translation/${country}?fields=borders,name,capital,currencies,region,population,languages,flags,latlng`);
res.then(
    (data) => {
        container.innerHTML = '';
        console.log(data);
        addContent(container, createCountry(data[0]));
    }
);


[...navBtns].map((btn) => btn.addEventListener('click', async (e) => {
    console.log(e.target.dataset.country);

    country = e.target.dataset.country;
    const res = fetchApiAxios(`${urlDetails}translation/${country}?fields=borders, name,capital,currencies,region,population,languages,flags,latlng`);
    res.then(
        (data) => {
            container.innerHTML = '';
            if (data.status != 404) {
                console.log(data);
                addContent(container, createCountry(data[0]));
            }
        }
    );
}));


const createBorders = () => {
    [...borders].map((border) => border.addEventListener('click', () => {
        console.log(border.innerText);

        country = border.innerText;
        const res = fetchApiAxios(`${urlDetails}alpha/${country}?fields=borders, name,capital,currencies,region,population,languages,flags,latlng`);
        res.then(
            (data) => {
                container.innerHTML = '';
                if (data.status != 404) {
                    console.log(data);
                    addContent(container, createCountry(data[0]));
                }
            }
        );
    }));
}


const searchCountry = async () => {
    console.log(searchInput.value);
    country = searchInput.value;
    console.log(country);
    const res = fetchApiAxios(`${urlDetails}translation/${country}?fields=borders, name,capital,currencies,region,population,languages,flags,latlng`);
    res.then(
        (data) => {
            container.innerHTML = '';
            if (data.status != 404) {
                console.log(data);
                addContent(container, createCountry(data[0]));
            }
        }

    ).catch((err)=>{alert("this country doesn't exists")})
}




searchBtn.addEventListener('click', searchCountry);
createBorders();







