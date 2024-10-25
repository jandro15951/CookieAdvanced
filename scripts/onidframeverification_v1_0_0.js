const OK = "ok";
var SCRIPT_ID = "OnIdScript"
var FRAME_CONTAINER_ID = "";
var RESULT_CONTAINER_ID = "";
var NAME = "";
var LOGO_URL = "";
const VALIDATE_STEP = "redirect_to_steps";
const STEP_PARAM_NAME = "step";
const STEP = GetStep();
var USER = "";
const BASE_URL = "https://portal.onid.us/wa"
var PASSWORD = "";
const WELCOME_PAGE = `${BASE_URL}/onid-verification/WelcomePage.html?${STEP_PARAM_NAME}=${STEP}`;
var COMPONENT = "";
var STEPS_PAGE = "";
var CLASS = "";
var RESULT_CLASS = "";

function StartOnId(params){
    FRAME_CONTAINER_ID = params.FrameContainer;
    RESULT_CONTAINER_ID = params.ResultContainer;
    NAME = params.EntityName;
    LOGO_URL = params.EntityLogo;
    USER = params.User;
    PASSWORD = params.Password;
    CLASS = params.FrameCssClass;
    RESULT_CLASS = params.ResultCssClass;
    COMPONENT = `${BASE_URL}/auth?authmech=OnID+Password&do=login&username=${USER}&password=${PASSWORD}&cbval_vendorBase64=AAAk%2FwMGAAAAAQ%3D%3D&Submit1=Yes&&location=https%3a%2f%2fwebcomponentpsv.onid.us%2f`;
    STEPS_PAGE = `${BASE_URL}/onid-verification/Steps.html?backUrl=${window.location.href}&&name=${NAME}&&imageUrl=${LOGO_URL}`;
    loadIframe();


}

function GetAttribute(name){

    const scriptTag = document.getElementById(SCRIPT_ID);
    const value = scriptTag.getAttribute(name);
    if(value == null){
        console.log(`You should provide a ${name} attribute for proper functionality.`)
    }
    return value;
}

function loadIframe() {



    const iframeElement = document.createElement('iframe');
    iframeElement.id = "verificationFrame";
    iframeElement.allow = "fullscreen *; cross-origin *;";
    iframeElement.sandbox = "allow-scripts allow-storage-access-by-user-activation allow-same-origin allow-forms allow-modals";
    iframeElement.src = WELCOME_PAGE;
    if(CLASS != ""){
        iframeElement.classList.add(CLASS);
    }else{
        iframeElement.style.width = "100%";
        iframeElement.style.height = "500px";
        iframeElement.style.overflow = "auto";
        iframeElement.style.maxWidth = "800px";
    }
    
    
    var framecontainer = document.getElementById(FRAME_CONTAINER_ID);

    if(framecontainer){
        framecontainer.appendChild(iframeElement);
    }else{
        console.log("You should have a element <div> with id = frame-onid-container");
        return;
    }
    var resultContainer = document.getElementById(RESULT_CONTAINER_ID);
        if(RESULT_CLASS != "" && resultContainer){
            resultContainer.classList.add(RESULT_CLASS)
            }

    window.addEventListener('message', function (event) {
        // Check if the message is from the iframe
        if (event.source === iframeElement.contentWindow) {
            var resultDiv = document.getElementById(RESULT_CONTAINER_ID);

            console.log("Received response data from iframe:", event.data);
            if (event.data.message == OK) {


                document.getElementById('verificationFrame').allow = "camera *; microphone *; fullscreen *; cross-origin *;";
                document.getElementById('verificationFrame').src = COMPONENT;
                
                DeleteParam();

            }

            if (event.data.message == VALIDATE_STEP) {
              
            window.location.href = STEPS_PAGE;
            }
            if (typeof GetResultONID === "function") {
                GetResultONID(event.data);
              } else {
                console.log("The method GetResultONID does not exist.");
              }

            var procResponse = shortenStrings(event.data, 50);

            var response = JSON.stringify(procResponse, null, 2);

            var preElement = document.createElement('pre');
           
            preElement.style.whiteSpace = 'pre-wrap';
            preElement.style.backgroundColor = 'white';
            preElement.style.paddingLeft = '30px';
            preElement.textContent = response;
            if(resultDiv){
                resultDiv.appendChild(preElement);
            }
            
        }
    });


}



function shortenStrings(obj, maxLength) {
    if (typeof obj === 'string') {
        return obj.length > maxLength ? obj.substring(0, maxLength) + '...' : obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => shortenStrings(item, maxLength));
    }
    if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = shortenStrings(obj[key], maxLength);
        }
        return newObj;
    }
    return obj;
}

function DeleteParam() {
    const currentUrl = new URL(window.location);
    const params = currentUrl.searchParams;

    params.delete(STEP_PARAM_NAME);

    // Construye la nueva URL
    const newUrl = params.toString() ? currentUrl.toString() : currentUrl.origin + currentUrl.pathname;

    // Reemplaza la URL en el navegador sin recargar la página
    window.history.replaceState({}, document.title, newUrl);
}

function GetStep() {


    const urlParams = new URLSearchParams(window.location.search);

    var param = urlParams.get(STEP_PARAM_NAME);

    if (param == "null" || param == null) {

        param = "0";
    }

    return param;
}

