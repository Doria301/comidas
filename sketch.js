var Camara;
var BotonesEntrenar;
var knn;
var modelo;
var Texto;
var Clasificando = false;
var InputTexbox;
var BotonTexBox;
var canvas;
var canvasContainer;
var etiquetaSaludable = 'saludable';
var etiquetaNoSaludable = 'no saludable';

function setup() {
  createCanvas(320, 240);
  background(255, 0, 0);
  Camara = createCapture(VIDEO);
  Camara.size(320, 240);
  Camara.hide();
  let miTitulo = createElement('h1', 'Identificador De comida saludable');
  miTitulo.addClass('titulo');
  modelo = ml5.featureExtractor("MobileNet", ModeloListo);
  knn = ml5.KNNClassifier();
/*createP("Ingrese el alimento ");*/
  /*InputTexbox = createInput("Alimento");*/

  /*BotonTexBox = createButton("tomar foto");
  BotonTexBox.mousePressed(EntrenarTexBox);*/

  cargarModelo(); // Cargar modelo previo, si existe

  Texto = createP("Modelo no Listo, esperando");
  Texto.addClass('texto');
  BotonesEntrenar = selectAll(".BotonEntrenar");

  for (var B = 0; B < BotonesEntrenar.length; B++) {
    BotonesEntrenar[B].style("margin", "5px");
    BotonesEntrenar[B].style("padding", "6px");
    BotonesEntrenar[B].mousePressed(PresionandoBoton);
  }

  var botonSaludable = createButton('Comida Saludable');
  botonSaludable.addClass('button1');
  botonSaludable.mousePressed(function() {
    EntrenarKnn(etiquetaSaludable);
  });

  var botonNoSaludable = createButton('Comida No Saludable');
  botonNoSaludable.addClass('button2');
  botonNoSaludable.mousePressed(function() {
    EntrenarKnn(etiquetaNoSaludable);
  });
}

function PresionandoBoton() {
  var NombreBoton = this.elt.innerHTML;
  console.log("Entrenando con " + NombreBoton);
  EntrenarKnn(NombreBoton);
}

function EntrenarKnn(ObjetoEntrenar) {
  const Imagen = modelo.infer(Camara);
  knn.addExample(Imagen, ObjetoEntrenar);
  guardarModelo(); // Guardar modelo después de entrenar
}

function ModeloListo() {
  console.log("Modelo Listo");
  Texto.html("Modelo Listo");
}

function clasificar() {
  const Imagen = modelo.infer(Camara);
  knn.classify(Imagen, function(error, result) {
    if (error) {
      console.error();
    } else {
      if (result.label === etiquetaSaludable) {
        console.log("Es comida saludable");
        Texto.html("Es comida saludable");
      } else if (result.label === etiquetaNoSaludable) {
        console.log("No es comida saludable");
        Texto.html("No es comida saludable");
      } else {
        console.log("No se pudo clasificar");
        Texto.html("No se pudo clasificar");
      }
    }
  });
}

function cargarModelo() {
  if (localStorage.getItem('modeloKNN')) {
    const modeloGuardado = JSON.parse(localStorage.getItem('modeloKNN'));
    knn.fromJSON(modeloGuardado);
  }
}

function guardarModelo() {
  const modeloSerializado = knn.toJSON();
  localStorage.setItem('modeloKNN', JSON.stringify(modeloSerializado));
}

function draw() {
  image(Camara, 0, 0, 320, 240);
  if (knn.getNumLabels() > 0 && !Clasificando) {
    setInterval(clasificar, 500);
    Clasificando = true;
  }
}