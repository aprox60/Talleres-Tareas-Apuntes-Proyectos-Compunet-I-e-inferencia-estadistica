import java.io.*;
import java.net.*;
import java.util.concurrent.Semaphore;

public class ManejadorCliente implements Runnable {
    private Socket socket;
    private Almacen almacen;
    private Semaphore semaforo;

    public ManejadorCliente(Socket socket, Almacen almacen, Semaphore semaforo) {
        this.socket = socket;
        this.almacen = almacen;
        this.semaforo = semaforo;
    }

    @Override
    public void run() {
        try (
            BufferedReader entrada = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter salida = new PrintWriter(socket.getOutputStream(), true)
        ) {
            String comando = entrada.readLine();
            if (comando == null) return;

            System.out.println("Comando recibido: " + comando);
            String respuesta;

            semaforo.acquire();
            try {
                respuesta = procesarComando(comando);
            } finally {
                semaforo.release();
            }

            salida.println(respuesta);

        } catch (IOException | InterruptedException e) {
            System.err.println("Error atendiendo cliente: " + e.getMessage());
        } finally {
            try { socket.close(); } catch (IOException ignored) {}
        }
    }

    private String procesarComando(String comando) {
        String[] partes = comando.trim().split("\\s+");

        if (partes[0].equalsIgnoreCase("READ") && partes.length == 2) {
            int id = Integer.parseInt(partes[1]);
            return almacen.consultarStock(id);

        } else if (partes[0].equalsIgnoreCase("UPDATE") && partes.length == 3) {
            int id = Integer.parseInt(partes[1]);
            int cambio = Integer.parseInt(partes[2]);
            return almacen.actualizarStock(id, cambio);

        } else {
            return "ERROR: Comando no reconocido. Use READ <id> o UPDATE <id> <cantidad>";
        }
    }
}