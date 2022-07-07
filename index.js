
var URL = 'https://gestionweb.frlp.utn.edu.ar/api';
var token = ""

var URL_CG = "https://api.coingecko.com/api/v3";

//coingecko
async function getPrice(coin) {
    let res = await axios.get(URL_CG + `/coins/${coin}`);
    return res.data.market_data.current_price["usd"]
}

async function get24hVolumen(coin) {
    let res = await axios.get(URL_CG + `/coins/${coin}`);
    return res.data.market_data.total_volume["usd"]
}

async function getMrktCap(coin) {
    let res = await axios.get(URL_CG + `/coins/${coin}`);

    return res.data.market_data.market_cap["usd"]
}

//strapi

async function auth() {
    if (!token) {

        let res = await axios.post(URL + '/auth/local', {
            identifier: '0nicolasmorales@gmail.com',
            password: 'Grupo1tyg'
        });
        token = res.data.jwt;
        console.log(token)
        return token;
    }
}


async function getCoins() {
    await auth();
    let res = await axios.get(URL + '/g1-cryptomonedas?populate=*', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data.data

}

//formato en que pasarle los datos(ejmplo): { 'simbolo': 'USDT', 'coinId': 'Tether' }
//addCoin({ 'simbolo': 'USDT', 'coinId': 'Tether' })
async function addCoin(coin) {
    await auth();
    let res = await axios.post(URL + '/g1-cryptomonedas', { data: coin }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

async function cargarDatos(coinId, coinData) {
    await auth();
    axios.put(URL + '/g1-cryptomonedas/' + coinId, { data: coinData }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}


//falta la funcion para cargar los datos


//prueba

cargarDatos(1, { datos: [1] })