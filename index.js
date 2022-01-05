const fs = require("fs");
const qrcode = require("qrcode-terminal");
const {Client} = require("whatsapp-web.js");

// Ruta donde se guardará la data de la sesión
const SESSION_FILE_PATH = "./session.json";

// Cargar la data de la sesión si se guardó previamente
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    session: sessionData,
});

client.initialize();

client.on("qr", (qr) => {
    qrcode.generate(qr, {small: true});
});

// Guardar valores de sesión en el archivo luego de una autenticación exitosa
client.on("authenticated", (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err){
        if(err){
            console.error("¡Error!", err);
        }
    });
});

// "Raisear" si la restauración de la sesión no tuvo éxito
client.on("auth_failure", msg => {
    console.error('¡FALLO EN LA AUTENTICACIÓN!', msg);
})

client.on("ready", () => {
    console.log("¡Agustín ya está conectado!");
});

let is_new_number = true;
client.on("message", message => {
    let test_number = "549" + "" + "@c.us";
    if(message.from === test_number){
        if(is_new_number){
            is_new_number = false;
            welcome_message = "¡Hola!\n";
            welcome_message += "\nSoy AIBot (por Azar & Isola) y soy el robot de CityGas 🤖\n";
            welcome_message += "\nLe puedo ayudar con los siguientes temas:\n";
            welcome_message += "*A.* Consulta de Cliente por Número de Teléfono\n";
            welcome_message += "*B.* Envío de un Pedido\n";
            welcome_message += "*C.* Consulta de un Pedido\n";
            welcome_message += "\nPor favor, escriba la letra que corresponda a su elección. Gracias.";
            client.sendMessage(message.from, welcome_message);
        }
        if(message.body.toUpperCase === "A"){
            consult_client_message = "Ha seleccionado _Consulta de Cliente por Número de Teléfono_";
            client.sendMessage(message.from, consult_client_message);
        }else if(message.body.toUpperCase === "B"){
            sending_an_order_message = "Ha seleccionado _Envío de un Pedido_";
            client.sendMessage(message.from, consult_client_message);
        }else if(message.body.toUpperCase === "C"){
            consult_order_message = "Ha seleccionado _Consulta de un Pedido_";
            client.sendMessage(message.from, consult_client_message);
        }else{
            bad_message = "¡Uy! No entendí 🤯\n";
            bad_message += "\nPor favor, vuelva a intentarlo.";
            client.sendMessage(message.from, bad_message);
        }
    }
});
