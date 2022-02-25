var constraints = {
                   video: { 
                       facingMode: 'environment'
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

botonfoto.addEventListener('click', tomarFoto);



function tomarFoto()
{
  console.log("test")

    
    sensorCamara.width = cameraView.videoWidth;
    sensorCamara.height = cameraView.videoHeight;
    sensorCamara.getContext("2d").drawImage(cameraView, 0, 0);
    salidaCamara.src = cameraSensor.toDataURL("image/png");


    var formData = new FormData();
    formData.append("imagen", salidaCamara.src);

  fetch('http://192.168.0.107:5000/predict/', {
    method: 'POST',
     })
.then(response => response.json())
.then(data => console.log(data));


}



window.addEventListener("load", bootCamara, false);