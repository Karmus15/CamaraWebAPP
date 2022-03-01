var constraints = {
                   video: { 
                       facingMode: 'environment'
                          }
                  ,audio: false
                };
const vistaCamara= document.querySelector("#vista-camara"),
      salidaCamara= document.querySelector("#salida-camara"),
      sensorCamara= document.querySelector("#sensor-camara"),
      botonfoto= document.querySelector("#boton-foto");
      

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



function tomarFoto()
{

    
    sensorCamara.width = vistaCamara.videoWidth;
    sensorCamara.height = vistaCamara.videoHeight;
    sensorCamara.getContext("2d").drawImage(vistaCamara, 0, 0);
    salidaCamara.src = sensorCamara.toDataURL("image/png");

    //console.log(salidaCamara)
    var formData = new FormData();
    formData.append("imagen", salidaCamara.src);

  fetch('https://karmus15-premierapi.herokuapp.com/predict/', {
    method: 'POST',
    body: formData,
     })
.then(response => response.json())
.then(data => window.alert(data));


}



window.addEventListener("load", bootCamara, false);