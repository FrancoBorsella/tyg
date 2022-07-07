
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

async function getCoinId(coinId) {
    let coins = await getCoins();
    let id = 0;
    coins.forEach(element => {
        if (element.attributes.coinId == coinId) {
            id = element.id
        }
    });
    return id
}

async function getCoinData(coinId) {

    let id = await getCoinId(coinId)

    let res = await axios.get(URL + '/g1-cryptomonedas/' + id + '?populate=*', {
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
    await axios.post(URL + '/g1-cryptomonedas', { data: coin }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}


async function cargarDatosMoneda(coinId, coinData) {
    console.log(coinData)
    axios.put(URL + '/g1-cryptomonedas/' + coinId + '?populate=*', { data: { datos: coinData } }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

async function cargarDatos(coinId) {
    await auth();

    datos = {
        'precio': 0,
        'marketcap': 0,
        'volumen': 0
    };

    datos['precio'] = await getPrice(coinId);

    datos['marketcap'] = await getMrktCap(coinId);

    datos['volumen'] = await get24hVolumen(coinId);


    axios.post(URL + '/g1-datos', { data: datos }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(async (resp) => {
        let id = await getCoinId(coinId);
        let allData = await getCoinData(coinId);
        allData.attributes.datos.data.push(resp.data.data)


        console.log(allData)

        cargarDatosMoneda(id, allData.attributes.datos.data)
    })
}