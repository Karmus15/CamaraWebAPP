var constraints = {
                   video: { 
                       facingMode: {exact:'environment'}
                          }
                  ,audio: false
                };
const vistaCamara= document.querySelector("#vista-camara"),
      salidaCamara= document.querySelector("#salida-camara"),
      sensorCamara= document.querySelector("sensor-camara"),
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


window.addEventListener("load", bootCamara, false);