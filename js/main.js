//Variables globales
const formLogin = document.querySelector(".login-form"),
  email = document.getElementById("email"),
  pass = document.getElementById("password"),
  btnLogin = document.getElementById("btnLogin"),
  rememberMe = document.getElementById("rememberMe"),
  monto = document.getElementById('monto'),
  tiempo = document.getElementById('tiempo'),
  interes = document.getElementById('interes'),
  dropdown = document.getElementById('banco'),
  checkbox = document.getElementById("defaultCheck1"),
  simuladorPrestamo = document.querySelector("#simulador-prestamo"),
  btnCalcular = document.getElementById('btnCalcular'),
  btnSalir = document.getElementById('btnSalir'),
  wrapperInfo = document.querySelector("#wrapperInfo"),
  informacion = document.querySelector("#info-prestamo"),
  llenarTabla = document.querySelector('#lista-tabla tbody');

//Inicio de sesion

//Defino la funcion que va a almacenar los datos del usuario tanto en el local como en el session storage
function guardar(valor) {
  let user = { usuario: email.value, pass: password.value };

  if (valor === "sessionStorage") {
    sessionStorage.setItem("item", JSON.stringify(user));
  }
  if (valor === "localStorage") {
    localStorage.setItem("item", JSON.stringify(user));
  }

  return user;
}

//Obtener los datos ingresados por el usuario	
function obtenerDatos(datos) {
  if (datos) {
    email.value = datos.usuario;
    pass.value = datos.pass;
    btnLogin.innerText = "Ingresar";
  }
}

obtenerDatos(JSON.parse(localStorage.getItem("item")));

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  //Guardar los datos ya sea en un almacenamiento local o de sesión dependiendo de si se selecciono el checkbox recordarme o no respectivamente
  if (rememberMe.checked) {
    guardar("localStorage");
    setTimeout(() => {
      formLogin.classList.add("hidden");
      simuladorPrestamo.classList.remove("hidden");
    }, 1000);
  } else {
    guardar("sessionStorage");
    setTimeout(() => {
      formLogin.classList.add("hidden");
      simuladorPrestamo.classList.remove("hidden");
    }, 1000);
  }
});

//Fetch para la carga de datos estaticos del dropdown mediante llamada asincronica 
fetch("./js/data.json")
  .then(
    function (response) {
      // Examine the text in the response  
      response.json().then(function (data) {
        let option;

        for (let i = 0; i < data.length; i++) {
          option = document.createElement('option');
          option.text = data[i].name;
          option.value = data[i].tem;
          dropdown.add(option);
        }
      });
    }
  )

//al seleccionarse el checkbox habilita o deshabilita los campos de input y select  
checkbox.addEventListener('change', e => {

  if (e.target.checked) {
    setTimeout(() => {
      $('#interes').attr("disabled", true);
      $('#banco').attr("disabled", false);
    }, 100);
  } else {
    setTimeout(() => {
      $('#interes').attr("disabled", false);
      $('#banco').attr("disabled", true);
    }, 100);
  }
});

//Capturo el evento click del boton Calcular y ejecuto la simulacion, utilizo Jquery para remover la clase hidden asi como tambien se hace una validacion del checkbox de tipo de intereses del simulador
btnCalcular.addEventListener('click', () => {
  if (checkbox.checked == false) {
    calcularCuota(monto.value, interes.value, tiempo.value);
    setTimeout(() => {

      wrapperInfo.classList.remove("hidden");
      informacion.classList.remove("hidden");
    }, 300);
  } else {
    const temBanco = $('#banco').find(":selected").text();
    fetch("./js/data.json")
      .then(
        function (response) {

          response.json().then(function (data) {

            for (let i = 0; i < data.length; i++) {
              if (data[i].name == temBanco) {
                var interes = data[i].tem;
              }
            }

            calcularCuota(monto.value, interes, tiempo.value);
            setTimeout(() => {
              wrapperInfo.classList.remove("hidden");
              informacion.classList.remove("hidden");
            }, 300);

          });

        }
      )

  }
})

//Capturo el evento click del boton Salir para volver al login
btnSalir.addEventListener('click', () => {
  setTimeout(() => {
    simuladorPrestamo.classList.add("hidden");
    informacion.classList.add("hidden");
    wrapperInfo.classList.add("hidden");
    formLogin.classList.remove("hidden");
    document.querySelectorAll(".input").forEach((el) => {
      el.value = "";
    });
  });
}, 500);

//La funcion calcularCuota hace el calculo del simulador y tambien muestra los resultados  
function calcularCuota(monto, interes, tiempo) {

  while (llenarTabla.firstChild) {
    llenarTabla.removeChild(llenarTabla.firstChild);
  }

  let pagoInteres = 0, pagoCapital = 0, cuota = 0;

  cuota = monto * (Math.pow(1 + interes / 100, tiempo) * interes / 100) / (Math.pow(1 + interes / 100, tiempo) - 1);

  for (let i = 1; i <= tiempo; i++) {

    pagoInteres = parseFloat(monto * (interes / 100));
    pagoCapital = cuota - pagoInteres;
    monto = parseFloat(monto - pagoCapital);


    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${[i]}</td>
            <td>${cuota.toFixed(2)}</td>
            <td>${pagoCapital.toFixed(2)}</td>
            <td>${pagoInteres.toFixed(2)}</td>
            <td>${monto.toFixed(2)}</td>
        `;
    llenarTabla.appendChild(row)
  }

  span = document.querySelector("#mensaje");
  span.innerText = "Simulación exitosa";

  setTimeout(() => {
    span.innerText = "Borrar resultado";
    span.style.cursor = "pointer";
    span.addEventListener("click", () => {
      simuladorPrestamo.classList.remove("hidden");
      informacion.classList.add("hidden");
      wrapperInfo.classList.add("hidden");
      document.querySelectorAll(".input").forEach((el) => {
        el.value = "";
      });
    });
  }, 1000);

}
