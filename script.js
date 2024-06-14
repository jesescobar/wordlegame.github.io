document.addEventListener("DOMContentLoaded", () => {
  var palabra = "";
  const intentoMax = 5;
  let intentos = 0;

  const tablero = document.getElementById("tablero");
  const input_adivinar = document.getElementById("input_adivinar");
  const button_adivinar = document.getElementById("button_adivinar");
  const mensaje = document.getElementById("mensaje");

  // Funcion con async /await - Funcion asincrona para obtener una palabra aleatoria
  async function obtenerPalabra() {
    try {
      const response = await fetch(
        "https://random-word-api.herokuapp.com/word?length=5"
      );
      const data = await response.json();
      palabra = data[0].toUpperCase();
      crearTablero(); // llamamos a la función para crear el tablero de juego
    } catch (error) {
      mensaje.textContent = "Error al cargar la palabra";
    }
  }

  // Función para crear el tablero de juego
  function crearTablero() {
    // Recorre el número de intentos y crea una fila de letras por cada intento
    for (let i = 0; i < intentoMax; i++) {
      // Recorre la palabra objetivo y crea un div por cada letra
      for (let j = 0; j < palabra.length; j++) {
        const letterDiv = document.createElement("div");
        letterDiv.classList.add("letterBox");
        tablero.appendChild(letterDiv);
      }
    }
  }

  // Función para verificar la palabra ingresada
  function verifPalabraIngresada(palabra_ingresada) {
    const letras = tablero.querySelectorAll(".letterBox"); // Obtiene todos los divs de las letras
    const offset = intentos * palabra.length; // Calcula el offset para la fila actual

    // Recorre la palabra correcta y compara con la palabra ingresada
    for (let i = 0; i < palabra.length; i++) {
      const letraDiv = letras[offset + i];
      const letra = palabra_ingresada[i].toUpperCase();

      if (letra === palabra[i]) {
        // la letra es correcta y está en el lugar correcto
        letraDiv.classList.add("correcto");
      } else if (palabra.includes(letra)) {
        // la letra existe en la palabra pero no está en el lugar correcto
        letraDiv.classList.add("letraExiste");
      } else {
        // la letra no se encuentra en la palabra 
        letraDiv.classList.add("letraIncorrecta");
      }

      letraDiv.textContent = letra; // Muestra la letra en el div letterBox
    }
  }

  // Evento onclick del botón adivinar
  button_adivinar.addEventListener("click", () => {
    const palabra_ingresada = input_adivinar.value.trim().toUpperCase();

    // Verifica si la palabra ingresada tiene 5 letras
    if (palabra_ingresada.length !== palabra.length) {
      mensaje.textContent = "La palabra debe tener 5 letras";
      return;
    }

    // si el número de intentos es menor al máximo
    if (intentos < intentoMax) {
      verifPalabraIngresada(palabra_ingresada); // llama a la función para verificar la palabra ingresada
      intentos++; // incrementa el número de intentos

      if (palabra_ingresada === palabra) {
        mensaje.textContent = "¡Felicidades! Adivinaste la palabra";
        button_adivinar.disabled = true;
      } else if (intentos === intentoMax) {
        mensaje.textContent = `Has perdido. La palabra era: ${palabra}`;
        button_adivinar.disabled = true;
      }
    }
  });

  obtenerPalabra();
});
