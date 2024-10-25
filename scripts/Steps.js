const COOKIE_NAME = "ONIDCOOKIE";
const BACK_URL ="backUrl";
const REDIRECT = GetParam(BACK_URL);
const NAME = "name";
const LOGO = "imageUrl";
var COOKIE = null;
Start();
function Start(){
SetValues();
}

function DeleteParams() {
    const currentUrl = new URL(window.location);
    const params = currentUrl.searchParams;

    params.delete(BACK_URL);
    params.delete(NAME);
    params.delete(LOGO);

    // Construye la nueva URL
    const newUrl = params.toString() ? currentUrl.toString() : currentUrl.origin + currentUrl.pathname;

    // Reemplaza la URL en el navegador sin recargar la página
    window.history.replaceState({}, document.title, newUrl);
}

function SetValues(){


    var url = GetParam(BACK_URL) ?? null;

    if(url != null){
        SetCookie();
    }
   

 
   
    COOKIE = getCookieObject(COOKIE_NAME);

    if(COOKIE){
        document.getElementById("imgLogo").src = COOKIE.imageUrl;
        document.getElementById("TitleName").innerHTML = COOKIE.name;
    }
    

    var values = GetText();

    var contador = 1;
    values.Steps.forEach(data => {

        var element = document.getElementById("step_"+contador);
 
        element.innerHTML = data;
        contador = contador + 1;
    });

     document.getElementById("btnAceptar").innerHTML = values.Accept;

DeleteParams();

}



function SetCookie(){

        setCookieObject(COOKIE_NAME, REDIRECT,GetParam(NAME) ?? "ONID", GetParam(LOGO) ?? "https://portal.onid.us/wa/onid-verification/assets/onid_logo.png");
  
}

function setCookieObject(cookieName, backUrl, name, imageUrl) {
    const obj = { backUrl, name, imageUrl };
    const jsonString = JSON.stringify(obj);
    
    // Set expiration date for 1 year
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 año en milisegundos
    const expires = "expires=" + date.toUTCString();
    
    // Set the cookie with the object string
    document.cookie = `${cookieName}=${jsonString};${expires};path=/`;
}


function getCookieObject(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            const jsonString = cookie.substring(name.length, cookie.length);
            return JSON.parse(jsonString); // Parse the JSON string back into an object
        }
    }
    
    return null; // Return null if the cookie is not found
}

function RedirectTo(){
    window.location.href = `${COOKIE.backUrl}?step=1`;
}

function GetParam(paramName){
const urlParams = new URLSearchParams(window.location.search);

const url = urlParams.get(paramName);

return url;
}