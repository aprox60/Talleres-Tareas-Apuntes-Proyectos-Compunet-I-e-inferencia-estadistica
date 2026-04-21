package icesi;
import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class Servidor {
    private static final int PUERTO = 9090;
    private static final int MAX_HILOS = 5;
    private static final int PERMISOS_SEMAFORO = 3;

    public static void main(String[] args) throws IOException {
        Almacen almacen = new Almacen();
        Semaphore semaforo = new Semaphore(PERMISOS_SEMAFORO);
        ExecutorService pool = Executors.newFixedThreadPool(MAX_HILOS);

        ServerSocket servidor = new ServerSocket(PUERTO);
        System.out.println("Servidor activo en puerto " + PUERTO);

        while (true) {
            Socket cliente = servidor.accept();
            pool.execute(new ManejadorCliente(cliente, almacen, semaforo));
        }
    }
}
