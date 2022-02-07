import { Socket } from 'net';
import { cursorTo } from 'readline';
import { puerto, serverIp } from '../constants';
const enviarPedido = (cliente, productos, formaDePagoId) => {
    let client = new Socket();
    let productosStr = productos.reduce((prev, current) => {
        return `
            ${prev}
            <producto>
                <codigo>${current.id}</codigo>
                <cantidad>${current.cantidad}</cantidad>
                <preciounitario>${cursorTo.preciounitario}</preciounitario>
            </producto>
        `
    })
    client.connect(puerto, serverIp, function() {
        console.log('Connected');
        let message = `
            <pedido>
                <cliente>${cliente}</cliente>
                <productos>
                    ${productosStr}
                </productos>
                <horario>24</horario>
                <formadepago>${formaDePagoId}</formadepago>
            </pedido>
        `
        client.write(message);
    });
}

export default enviarPedido;
