var constraints = {
                   video: { facingmode: "environment"}, audio: false 
                  };
const vistaCamara= document.querySelector("#vista-camara"),
      salidaCamara= document.querySelector("#salida-camara"),
      sensorCamara= document.querySelector("sensor-camara"),
      botonfoto= doccument.querySelector("#boton-foto");

function bootCamara() 
{
    navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(stream) 
        {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        });
}


window.addEventListener("load", bootCamara, false);