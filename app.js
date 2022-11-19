var constraints = {
                   video: { 
                       facingMode: 'environment'
                          }
                  ,audio: false
                };
var   camaraID = document.getElementById("camara"),
      vistaCamara= document.querySelector("#vista-camara"),
      salidaCamara= document.getElementById("salida-camara"),
      sensorCamara= document.querySelector("#sensor-camara"),
      interfaceID = document.getElementById("interface");
      botonfoto= document.querySelector("#boton-foto");
      tablaLiga = document.getElementById("tabla-liga");
      tablaPlantilla = document.getElementById("tabla-plantilla");
      botonPlantilla =document.getElementById("boton-plantilla");;
      botonLiga = document.getElementById("boton-liga");
      resultGlob = "";
      probGlob = null;
      teamid = null;
      ulPlayers = document.getElementById("ul-players");
      ulTeams = document.getElementById("ul-teams");
      divbox = document.getElementById("caja-equipo");
      divchance = document.getElementById("caja-chance");
      teamBox = document.getElementById("titulo-borde");          


function bootCamara() 
{
    navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(stream) 
        {
            track = stream.getTracks()[0];
            vistaCamara.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Algo salio mal", error);
        });
}

botonfoto.addEventListener('click', tomarFoto);
botonLiga.addEventListener('click', mostrarLiga);
botonPlantilla.addEventListener('click', mostrarPlantilla);
salidaCamara.addEventListener('click', mostrarCamara);

function mostrarLiga() 
{
    console.log("mostrarliga");
    tablaPlantilla.style.visibility = "hidden";
    tablaLiga.style.visibility = "visible";
}

function mostrarPlantilla() 
{
    console.log("mostrarplantilla");
    tablaPlantilla.style.visibility = "visible";
    tablaLiga.style.visibility = "hidden";
}

function mostrarCamara() 
{
    console.log("mostrarcamara");
    divbox.style.visibility = "hidden";
    divchance.style.visibility= "hidden";
    tablaPlantilla.style.visibility = "hidden";
    tablaLiga.style.visibility = "hidden";
    salidaCamara.src = null;
    salidaCamara.src = "//:0";
    
  /*  camaraID.removeChild(salidaCamara);
    let salidaCamara = document.createElement("img");
    salidaCamara.src = "";
    salidaCamara.src = "//:0";
    salidaCamara.alt = "";
    salidaCamara.id = "salida-camara";
    camaraID.insertBefore(salidaCamara, camaraID.interfaceID);*/
    //sensorCamara.getContext("2d").clearRect(0, 0, vistaCamara.videoWidth, vistaCamara.videoHeight);
}



async function fetchEquipo(formData) 
{
    let response = await fetch('https://karmus15-premierapi.herokuapp.com/predict/', 
    {
        method: 'POST',
        body: formData,
    })
    let data = response.json()
    result = await data;
    resultGlob = result[0];
    probGlob = result[1];
    return 1;     
}

function tomarFoto()
{
   
    sensorCamara.width = vistaCamara.videoWidth;
    sensorCamara.height = vistaCamara.videoHeight;
    sensorCamara.getContext("2d").drawImage(vistaCamara, 0, 0);
    salidaCamara.src = sensorCamara.toDataURL("image/png");
    
    //console.log(salidaCamara)

    var formData = new FormData();
    formData.append("imagen", salidaCamara.src);

    result = fetchEquipo(formData);
    result.then(()=>{
        //Promise Successful, Do something
        showChance();
        
        }).catch(()=>{
        //Promise Failed, Do something
        console.log("no hubo respuesta");
        })
}

function getTeamID(nameTeam)
{
    dictTeamID =    [{"id":33, "name": "manchester-united"},
                    {"id": 34, "name": "newcastle"},
                    {"id": 38, "name": "watford"},
                    {"id": 39, "name": "wolves"},
                    {"id": 40, "name": "liverpool"},
                    {"id": 41, "name": "southampton"},
                    {"id": 42, "name": "arsenal"},
                    {"id": 44, "name": "burnley"},
                    {"id": 45, "name": "everton"},
                    {"id": 46, "name": "leicester-city"},
                    {"id": 47, "name": "tottenham"},
                    {"id": 48, "name": "west-ham"},
                    {"id": 49, "name": "chelsea"},
                    {"id": 50, "name": "manchester-city"},
                    {"id": 51, "name": "brighton"},
                    {"id": 52, "name": "crystal-palace"},
                    {"id": 55, "name": "brentford"},
                    {"id": 63, "name": "leeds"},
                    {"id": 66, "name": "aston-villa"},
                    {"id": 71, "name": "norwich"},
                                                    ]

    indexTeam = dictTeamID.findIndex(
            function(x) 
            { 
            return x.name == nameTeam;
            });
    return dictTeamID[indexTeam].id
}

async function showChance()
{
    while (divchance.lastElementChild)  //limpio por si quedo texto antes
    {
        divchance.removeChild(divchance.lastElementChild);
    }

    if (probGlob < 0.5 || resultGlob == "Desconocido")
    {
    textoChance = document.createTextNode("No se encontro equipo \n(Prediccion:" + resultGlob + ", Nivel de confianza: " + (probGlob * 100).toFixed(2) + "%)");    
    chanceTag = document.createElement("p");
    chanceTag.style = "font-size: 21px;color:white"
    chanceTag.innerText = textoChance.textContent;
    divchance.appendChild(chanceTag);
    divchance.style.visibility= "visible";
    }else
    {
    textoChance = document.createTextNode("Prediccion:" + resultGlob + ", Nivel de confianza: " + (probGlob * 100).toFixed(2) + "%");    
    chanceTag = document.createElement("p");
    botonContinuar = document.createElement("button");
    botonContinuar.innerText = "Continuar";
    botonContinuar.style="background-color: white !important;color:black;font-size: 16px";
    botonContinuar.addEventListener('click', premierWindow);
    chanceTag.style = "font-size: 21px;color:white"
    chanceTag.innerText = textoChance.textContent;
    divchance.appendChild(chanceTag);
    divchance.appendChild(botonContinuar);
    divchance.style.visibility= "visible";
    //premierWindow();
    }
    
}

function llenarEquiposTabla(dataResponsePos)
{
    while (ulTeams.lastElementChild) 
    {
        ulTeams.removeChild(ulTeams.lastElementChild);
    }

    for (i = 0; i < 20; i++) //son siempre 20 equipos
    {
       let rowTeams = document.createElement("tr");
       if (teamid == dataResponsePos[0].league.standings[0][i].team.id)
       {
           rowTeams.classList.add('bg-primary')
       }
       let rankTeam = document.createElement("th");
       rankTeam.scope = "row";
       rankTeam.innerHTML = i+1;
       let imageTableTeam  = document.createElement("img");
       imageTableTeam.src = dataResponsePos[0].league.standings[0][i].team.logo;
       imageTableTeam.setAttribute('width', 42);
       imageTableTeam.setAttribute('height', 42);
       let nameTeam= document.createElement("td");
       nameTeam.appendChild(imageTableTeam);
       nameTeam.innerHTML += " " + dataResponsePos[0].league.standings[0][i].team.name;
       let pjTeam = document.createElement("td");
       pjTeam.innerHTML = dataResponsePos[0].league.standings[0][i].all.played;
       let pgTeam = document.createElement("td");
       pgTeam.innerHTML = dataResponsePos[0].league.standings[0][i].all.win;
       let ptsTeam = document.createElement("td");
       ptsTeam.innerHTML = dataResponsePos[0].league.standings[0][i].points;

     //  listPlayers.classList.add("list-group-item");
      // listPlayers.innerHTML = dataresponse[0].players[i].name;
      rowTeams.appendChild(rankTeam);
      rowTeams.appendChild(nameTeam);
      rowTeams.appendChild(pjTeam);
      rowTeams.appendChild(pgTeam);
      rowTeams.appendChild(ptsTeam);
       ulTeams.appendChild(rowTeams);
    }




}




function traducirPosicion(pos)
{
    if (pos == "Goalkeeper")
    {
        pos = "Arquero"
    }
    if (pos == "Defender")
    {
        pos = "Defensor"
    }
    if (pos == "Midfielder")
    {
        pos = "Mediocampista"
    }
    if (pos == "Attacker")
    {
        pos = "Delantero"
    }
    return pos;
}

function llenarJugadoresLista(dataresponse)
{

    while (ulPlayers.lastElementChild) 
    {
        ulPlayers.removeChild(ulPlayers.lastElementChild);
    }

    for (i = 0; i < dataresponse[0].players.length; i++)
    {
       let rowPlayers = document.createElement("tr");
       let numberPlayer = document.createElement("th");
       numberPlayer.scope = "row";
       numberPlayer.innerHTML = dataresponse[0].players[i].number;
       let imagePlayer = document.createElement("img");
       imagePlayer.src = dataresponse[0].players[i].photo;
       imagePlayer.setAttribute('width', 20);
       imagePlayer.setAttribute('height', 20);
       let namePlayer = document.createElement("td");
       namePlayer.appendChild(imagePlayer);
       namePlayer.innerHTML += " " + dataresponse[0].players[i].name;
       let agePlayer = document.createElement("td");
       agePlayer.innerHTML = dataresponse[0].players[i].age;
       let positionPlayer = document.createElement("td");
       positionPlayer.innerHTML = traducirPosicion(dataresponse[0].players[i].position);

     //  listPlayers.classList.add("list-group-item");
      // listPlayers.innerHTML = dataresponse[0].players[i].name;
      rowPlayers.appendChild(numberPlayer);
      rowPlayers.appendChild(namePlayer);
      rowPlayers.appendChild(agePlayer);
      rowPlayers.appendChild(positionPlayer);
       ulPlayers.appendChild(rowPlayers);
    }
}


async function premierWindow()
{
    botonContinuar.disabled = true;
    divchance.style.visibility= "hidden"
    teamid = getTeamID(resultGlob);

    
    let response = await fetch(`https://v3.football.api-sports.io/players/squads?team=${teamid}`, 
    {
        method: 'GET',
       // params: {name: 'Liverpool'},
        headers: {
            'x-rapidapi-host': "v3.football.api-sports.io",
            'x-apisports-key': '6c45e14fbd32baba0e20e85a7427dc4e'
          }
    })
    
   let responsePosiciones = await fetch ('https://v3.football.api-sports.io/standings?league=39&season=2022',
    {
        method: 'GET',
       // params: {name: 'Liverpool'},
        headers: {
            'x-rapidapi-host': "v3.football.api-sports.io",
            'x-apisports-key': '6c45e14fbd32baba0e20e85a7427dc4e'
          }
    }) 
    while (teamBox.lastElementChild) 
    {
        teamBox.removeChild(teamBox.lastElementChild);
    }

    let data = await response.json();
     let dataresponse = data.response;

     let dataPos = await responsePosiciones.json()
     let dataResponsePos = dataPos.response;    
   /* 
 console.log(dataresponse[0]); 
    console.log(dataResponsePos[0].league.standings[0][0].team.name);
    console.log(dataResponsePos[0].league.standings[0][0].points);
    var dict = [{id: 56, name: "David De Gea", age: "36", number: "22", position: "goalkeeper", "photo": "https://media.api-sports.io/football/players/159.png" }, {id: 56, name: "David De Gea", age: "36", number: "22", position: "goalkeeper", "photo": "https://media.api-sports.io/football/players/159.png" }, {id: 56, name: "David De Gea", age: "36", number: "22", position: "goalkeeper", "photo": "https://media.api-sports.io/football/players/159.png" }, {id: 56, name: "David De Gea", age: "36", number: "22", position: "goalkeeper", "photo": "https://media.api-sports.io/football/players/159.png" }  ]
      dict = JSON.stringify(dict);
     console.log(dict);
*/
        //Llenar tabla de jugadores:
    llenarJugadoresLista(dataresponse);
      //llenar tabla de equipos en la liga
    llenarEquiposTabla(dataResponsePos);

let imageTeam = document.createElement("img");
imageTeam.src = dataresponse[0].team.logo;  //response[0].team.logo
imageTeam.style = "position:relative ;top:5px; max-width: 100%; max-height: 100%; width: 75px; height: 75px"

var teamName = document.createTextNode(dataresponse[0].team.name)

var teamTag = document.createElement("p");
teamTag.id = "titulo-equipo"
teamTag.style = "position:relative;top:5px; text-align: center; width: 100%"

divbox.style.visibility = "visible";

//teamBox.insertBefore(imageTeam, teamBox.firstChild);
//divbox.appendChild(teamTag);
//document.getElementById("interface").appendChild(div);

teamTag.innerText = teamName.textContent;
teamBox.insertBefore(imageTeam, teamBox.firstChild);
teamBox.appendChild(teamTag)

botonPlantilla.click();


}



window.addEventListener("load", bootCamara, false);