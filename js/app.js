const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

// Crear promise
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

window.onload = () => {
  consultarCriptomonedas();

  formulario.addEventListener("submit", submitFormulario);

  criptomonedasSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
};

function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => obtenerCriptomonedas(resultado.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
  e.preventDefault();

  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  // consultar la API
  consultarAPI();
}

function mostrarAlerta(mensaje) {
  const existeAlerta = document.querySelector(".error");
  if (!existeAlerta) {
    const divMensaje = document.createElement("div");

    divMensaje.classList.add("error");
    divMensaje.textContent = mensaje;
    formulario.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((cotizacion) =>
      mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda])
    );
}

function mostrarCotizacion(cotizacion) {
  limpiarHTML();
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `El precio es: <span>${formatoES(PRICE)}</span>`;

  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `<p>Precio más alto del día <span>${formatoES(
    HIGHDAY
  )}</span></p>`;

  const precioBajo = document.createElement("p");
  precioBajo.innerHTML = `<p>Precio más bajo del día <span>${formatoES(
    LOWDAY
  )}</span></p>`;

  const ultimasHoras = document.createElement("p");
  ultimasHoras.innerHTML = `<p>Variación últimas 24 hs <span>${formatoES(
    CHANGEPCT24HOUR
  )}</span></p>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
}

function formatoES(moneda) {
  let simbol = simbolCurrency(monedaSelect);
  let pos = Number(isEmpty(moneda));
  if (pos !== moneda.length) {
    let newMoneda = `${simbol}`;
    for (let i = pos; i < moneda.length; i++) {
      switch (moneda[i]) {
        case ".":
          newMoneda += ",";
          break;
        case ",":
          newMoneda += ".";
          break;
        default:
          newMoneda += moneda[i];
          break;
      }
    }
    return newMoneda;
  } else {
    let newMoneda = `${simbol} `;
    for (let i = 0; i < moneda.length; i++) {
      switch (moneda[i]) {
        case ".":
          newMoneda += ",";
          break;
        case ",":
          newMoneda += ".";
          break;
        default:
          newMoneda += moneda[i];
          break;
      }
    }
    return newMoneda;
  }
}

function isEmpty(cadena) {
  for (let c in cadena) {
    if (cadena[c] == " ") {
      return c;
    }
  }
  return cadena.length;
}

function simbolCurrency(currency) {
  let simbol;
  switch (currency.value) {
    case "ARS":
      simbol = "$";
      break;
    case "USD":
      simbol = "U$D";
      break;
    case "EUR":
      simbol = "€";
      break;
    case "GBP":
      simbol = "£";
      break;
    case "CNY":
      simbol = "¥";
      break;
    case "JPY":
      simbol = "¥";
      break;
  }
  return simbol;
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarSpinner() {
  limpiarHTML();

  const spinner = document.createElement("div");
  spinner.classList.add("spinner");

  spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  `;

  resultado.appendChild(spinner);
}
