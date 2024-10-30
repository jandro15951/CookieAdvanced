const COOKIE_NAME = "ONIDCOOKIE";
const STEP = GetParam("step");
const OK = "ok";
const REDIRECT_STEP = "redirect_to_steps";
const PARENT = "parentOrigin";


Start();
function Start() {
    SetValues();
    if (!IsAppleDevice()) {
        SendMessage(OK);
    } else {
        HasPermission();
    }
}

function SetValues(){

    const values = GetText();

    SetText("PermissionTitle", values.PermissionTitle);
    SetText("PermissionBody", values.PermissionBody);
    SetText("acceptCookies", values.PermissionBtn);



}


function SetText(id, text){
   const element = document.getElementById(id);
    element.innerHTML = text;
}


function HasPermission() {
    document.hasStorageAccess().then(
        function (hasAccess) {
            if (hasAccess == true) {

                // Si se tiene acceso al storage se redirecciona al web component con normalidad
                SendMessage(OK)
            } else {
                SendMessage(STEP);
                if (STEP == 0 || STEP == "null" || STEP == null) {
                    // Si la cookie no existe se redirecciona a los pasos a seguir
                    SendMessage(REDIRECT_STEP)
                } else {
                    // Si la cookie existe, mostramos el modal para aceptar el storage
                    ShowModal(1);

                }

            }
        },
        function (error) {
            console.error("Error al verificar el acceso al almacenamiento: ", error);
        }
    );
}



function GetParam(paramName) {
    const urlParams = new URLSearchParams(window.location.search);

    const url = urlParams.get(paramName);

    return url;
}

function ShowModal(show) {
    const modal = document.getElementById("cookieModal");
    const loader = document.getElementById("loader");

    if(show == 1){
        modal.style.display = "block";
        loader.style.display ="none";
    }else{
        modal.style.display = "none";
        loader.style.display ="flex";
    }


}


document.getElementById('acceptCookies').addEventListener('click', function () {
    ShowModal(0);
    document.requestStorageAccess().then(
        function () {
            SendMessage(OK)

        },
        function () {
            SendMessage("cookies_access_denied")
        }
    );
});


function SendMessage(messagePost) {
    window.parent.postMessage({ message: messagePost }, GetParam(PARENT));
}

function IsAppleDevice() {
    const userAgent = window.navigator.userAgent || window.opera;

    if (/iPad|iPhone|SamsungBrowser|iPod/.test(userAgent) && !window.MSStream) {
        return true;
    }


    if (navigator.userAgentData && navigator.userAgentData.platform) {
        return navigator.userAgentData.platform.includes('Mac');
    }
    


    return false;
}
