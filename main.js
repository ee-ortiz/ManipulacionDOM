const url = "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

async function fetchData(){ 
    try {
        const response = await fetch(url);
        const exam = await response.json();
        return exam;
    } catch (error) {
        console.error(error);
    }
}

async function loadTableData(){
    const tabla = document.getElementById("inf");
    const items = await fetchData();
    let conteo = 1;
    items.forEach( item => {
        let row = tabla.insertRow();
        row.insertCell(0).outerHTML = "<th>"+ conteo + "</th>";
        row.insertCell(1).outerHTML = "<th>"+ item["events"] + "</th>"; 
        row.insertCell(2).outerHTML = "<th>"+ item["squirrel"] + "</th>";  
        conteo ++;
    });
}

loadTableData();

function existeEvento (evento, entrada) {
    return entrada.events.indexOf(evento) !== -1;
}

function tablaOcurrencias (evento, datos) {
    // tabla de TN, FN, FP, TP
    let tabla = [0, 0, 0, 0];
    for (let i = 0, len = datos.length; i < len; i++) {
        // quedaria de la siguiente forma:
        // index = 0: si no existe el evento y no se convirtio en ardilla (TN)
        // index = 1: si existe el evento y no se convirtio en ardilla (FN)
        // index = 2: si no existe el evento y se convirtio en ardilla (FP) 
        // index = 3: si existe el evento y se convirtió en ardilla (TP)
        
        let entrada = datos[i], index = 0; 
        if (existeEvento(evento, entrada)) index += 1;
        if (entrada.squirrel) index += 2;
        tabla[index] += 1;
    }
    return tabla;
}

function mcc (a, b, c, d) {
    const numerator = a * d - b * c;
    const denominator = Math.sqrt((a + b) * (c + d) * (a + c) * (b + d));
    return (numerator/denominator);
}

function compararMccs(dic1, dic2, key) {
    const obj1 = dic1[key]
    const obj2 = dic2[key]
  
    if (obj1 < obj2) {
      return 1
    }
    if (obj1 > obj2) {
      return -1
    }
    return 0
}

async function mostrarMcss(){

    var diccionarioEventos = [];
    const items = await fetchData();
    items.forEach(item => {
        item.events.forEach(evento => {
            if (diccionarioEventos.indexOf(evento) === -1) { diccionarioEventos.push(evento); }
        });
    });

    let tablas = diccionarioEventos.map(evento => { return {evento: evento, value: tablaOcurrencias(evento, items)}});

    var mccs = tablas.map(tabla => {
        return { event: tabla.evento, mcc: mcc.apply(null, tabla.value)};
    });

    mccs.sort((dic1, dic2) => {
        return compararMccs(dic1, dic2, 'mcc')
      })

    const tabla = document.getElementById("inf2");
    let conteo = 1;

    mccs.forEach( item => {
        let row = tabla.insertRow();
        row.insertCell(0).outerHTML = "<th>"+ conteo + "</th>";  
        row.insertCell(1).outerHTML = "<th>"+ item.event + "</th>"; 
        row.insertCell(2).outerHTML = "<th>"+ item.mcc + "</th>"; 
        conteo ++;

    });

}

mostrarMcss()