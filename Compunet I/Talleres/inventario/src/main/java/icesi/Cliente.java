package icesi;
import java.io.*;
import java.net.*;
import java.util.Scanner;

public class Cliente {
    private static final String HOST = "localhost";
    private static final int PUERTO = 9090;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("=== Cliente - Sistema de Inventario ===");
        System.out.println("Comandos disponibles: READ <id> | UPDATE <id> <cantidad>");
        System.out.println("Escriba 'salir' para terminar\n");

        while (true) {
            System.out.print("> ");
            String comando = scanner.nextLine().trim();

            if (comando.equalsIgnoreCase("salir")) break;
            if (comando.isEmpty()) continue;

            try (
                Socket socket = new Socket(HOST, PUERTO);
                PrintWriter salida = new PrintWriter(socket.getOutputStream(), true);
                BufferedReader entrada = new BufferedReader(new InputStreamReader(socket.getInputStream()))
            ) {
                salida.println(comando);
                String respuesta = entrada.readLine();
                System.out.println("Servidor: " + respuesta);

            } catch (IOException e) {
                System.err.println("No se pudo conectar al servidor: " + e.getMessage());
            }
        }

        System.out.println("Sesión cerrada.");
        scanner.close();
    }
}