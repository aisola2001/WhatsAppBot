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

const bot = new Client({
    session: sessionData,
});

bot.initialize();

bot.on("qr", (qr) => {
    qrcode.generate(qr, {small: true});
});

// Guardar valores de sesión en el archivo luego de una autenticación exitosa
bot.on("authenticated", (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err){
        if(err){
            console.error("¡Error!", err);
        }
    });
});

// "Raisear" si la restauración de la sesión no tuvo éxito
bot.on("auth_failure", msg => {
    console.error('¡FALLO EN LA AUTENTICACIÓN!', msg);
})

bot.on("ready", () => {
    console.log("¡El Bot ya está conectado y listo!");
});

let is_new_number = true;
bot.on("message", message => {
    let test_number = "549" + "" + "@c.us";
    if(message.from === test_number){
        if(is_new_number){
            is_new_number = false;
            welcome_message = "¡Hola!\n";
            welcome_message += "\nSoy AIBot (por Azar & Isola) y soy el robot de City Gas 🤖\n";
            welcome_message += "\nLe puedo ayudar con los siguientes temas:\n";
            welcome_message += "*A.* Consulta de Cliente por Número de Teléfono\n";
            welcome_message += "*B.* Envío de un Pedido\n";
            welcome_message += "*C.* Consulta de un Pedido\n";
            welcome_message += "\nPor favor, escriba la letra que corresponda a su elección. Gracias.";
            bot.sendMessage(test_number, welcome_message);
        }
        if(message.body.toUpperCase === "A"){
            consult_client_message = "Ha seleccionado _Consulta de Cliente por Número de Teléfono_";
            bot.sendMessage(test_number, consult_client_message);
        }else if(message.body.toUpperCase === "B"){
            sending_an_order_message = "Ha seleccionado _Envío de un Pedido_";
            bot.sendMessage(test_number, consult_client_message);
        }else if(message.body.toUpperCase === "C"){
            consult_order_message = "Ha seleccionado _Consulta de un Pedido_";
            bot.sendMessage(test_number, consult_client_message);
        }else{
            bad_message = "¡Uy! No entendí 🤯\n";
            bad_message += "\nPor favor, vuelva a intentarlo.";
            bot.sendMessage(test_number, bad_message);
        }
    }
});
