class Country {
    constructor({ flags, name, region }) {
        this.flag = flags?.png || '';
        this.name = name?.common || 'Not found';
        this.region = region || 'Unknown';
    }

    getCatholicFact() {
        const facts = {
            "Italy": "Italy is home to the Vatican, the heart of Catholicism.",
            "Spain": "Spain has a deep Catholic heritage and many missionaries.",
            "Mexico": "Has the second-largest Catholic population in the world. Our Lady of Guadalupe appeared to St. Juan Diego in 1531, becoming the patroness of the Americas",
            "Brazil": "Brazil celebrates Our Lady of Aparecida as its patroness.",
            "Argentina": "Argentina is the birthplace of Pope Francis.",
            "Poland": "Poland gave the world Pope John Paul II.",
            "France": "Lourdes is one of the most visited pilgrimage sites due to the Marian apparitions.",
            
        };
        return facts[this.name] || "This country has a rich Catholic history.";
    }

    getSaint() {
        const saints = {
            "Italy": "St. Francis of Assisi",
            "Spain": "St. Teresa of Avila",
            "Mexico": "St. Juan Diego",
            "Brazil": "St. Dulce of the Poor",
            "Argentina": "St. Héctor Valdivielso Sáez",
            "Poland": "St. John Paul II",
            "Portugal": "St. Anthony of Padua",
            "France": "St. Joan of Arc",
            "Germany": "St. Boniface",
            "Ireland": "St. Patrick",
            "Philippines": "St. Lorenzo Ruiz",
            "United States": "St. Elizabeth Ann Seton",
            "Canada": "St. Josephine Bakhita",
            "Colombia": "St. Peter Claver",
            "Chile": "St. Alberto Hurtado",
            "Peru": "St. Rose of Lima",
            "Cuba": "St. Anthony Mary Claret",
            "Venezuela": "St. José de Anchieta",
            "El Salvador": "St. Oscar Romero",
            "Japan": "St. Maximilian Kolbe",
            "Lebanon": "St. Charbel Makhlouf",
            "France": "St. Joan of Arc",
            "Algeria": "St. Augustine of Hippo",
            "United_States": "St. Elizabeth Ann Seton",
        };
        return saints[this.name] || "No specific saint registered.";
    }

    getSaintImage() {
        const images = {
            "St. Francis of Assisi": "https://www.aciprensa.com/santos/images/Asis_04Octubre.jpg",
            "St. Teresa of Avila": "https://www.aciprensa.com/santos/images/TeresaAvila_14Octubre.jpg",
            "St. Juan Diego": "https://www.aciprensa.com/imagespp/sanjuandiego9diciembre.jpg?w=672&h=448",
            "St. Dulce of the Poor": "https://www.acidigital.com/images/ago13.jpg?w=680&h=378",
            "St. Héctor Valdivielso Sáez": "https://www.aciprensa.com/imagespp/Santo/395/st-hector.jpg",
            "St. John Paul II": "https://www.aciprensa.com/imagespp/sanjuanpabloiielgrande.jpg?w=672&h=448",
            "St. Rose of Lima": "https://www.aciprensa.com/imagespp/RosaDeLima_Agosto.jpg?w=672&h=448",
            "St. Oscar Romero": "https://www.aciprensa.com/imagespp/beatoromerooscar.jpg?w=672&h=448",
            "St. Maximilian Kolbe": "https://www.aciprensa.com/imagespp/sanmaximilianokolbe.jpg?w=672&h=448",
            "St. Patrick": "https://www.aciprensa.com/imagespp/sanpatricio17demarzo.jpg?w=672&h=448",
            "St. Charbel Makhlouf": "https://www.aciprensa.com/imagespp/sancharbelmakhlouf.jpg?w=672&h=448",
            "St. Joan of Arc": "https://www.aciprensa.com/santos/images/JuanaArco_30Mayo.jpg",
            "St. Augustine of Hippo": "https://www.aciprensa.com/imagespp/sanagustin-1724808071.jpg?w=672&h=448",
            "St. Elizabeth Ann Seton": "https://www.aciprensa.com/santos/images/IsabelAnaBayleySeton_04Enero.jpg",
        };
        const saint = this.getSaint();
        return images[saint] || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Christian_cross.svg/1024px-Christian_cross.svg.png";
    }
}

const getCountry = async (name) => {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`);
        if (!response.ok) throw new Error('Country not found');
        const data = await response.json();

        const country = new Country(data[0]);

        document.getElementById('pais_name').textContent = country.name;
        document.getElementById('pais_region').textContent = `Region: ${country.region}`;
        document.getElementById('pais_flag').src = country.flag;
        document.getElementById('pais_flag').alt = `Flag of ${country.name}`;
        document.getElementById('dato_catolico').textContent = country.getCatholicFact();
        document.getElementById('santo_pais').textContent = `Saint: ${country.getSaint()}`;
        document.getElementById('santo_img').src = country.getSaintImage();
        document.getElementById('santo_img').alt = `Image of ${country.getSaint()}`;

        document.getElementById('results').classList.remove('invisible');

        triggerAnimations();
    } catch (err) {
        alert("Could not fetch country. Make sure you write it in English and it's a real country.");
        console.error(err);
    }
};

const triggerAnimations = () => {
    const elements = ['pais_name', 'pais_flag', 'pais_region', 'dato_catolico', 'santo_pais', 'santo_img'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        el.classList.remove('fade-in', 'slide-in');
        void el.offsetWidth;
        el.classList.add(id === 'dato_catolico' || id === 'santo_pais' ? 'slide-in' : 'fade-in');
    });
};

document.getElementById('btn_search').addEventListener('click', () => {
    const input = document.getElementById('pais_input').value.trim();
    if (input) {
        getCountry(input);
    } else {
        alert('Please enter a country name in English.');
    }
})