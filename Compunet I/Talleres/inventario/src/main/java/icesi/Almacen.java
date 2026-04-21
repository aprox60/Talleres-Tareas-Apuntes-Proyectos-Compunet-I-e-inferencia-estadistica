package icesi; 
public class Almacen {
    private Producto[] productos;

    public Almacen() {
        productos = new Producto[10];
        String[] nombres = {
            "Guantes de nitrilo", "Mascarillas N95", "Jeringas 5ml",
            "Alcohol antiséptico", "Vendas elásticas", "Gasas estériles",
            "Termómetros digitales", "Oxímetros", "Tensiómetros", "Suero fisiológico"
        };
        for (int i = 0; i < 10; i++) {
            productos[i] = new Producto(i + 1, nombres[i], 100 + (i * 10));
        }
    }

    public synchronized String consultarStock(int id) {
        for (Producto p : productos) {
            if (p.getId() == id) return p.toString();
        }
        return "ERROR: Producto con ID " + id + " no encontrado";
    }

    public synchronized String actualizarStock(int id, int cambio) {
        for (Producto p : productos) {
            if (p.getId() == id) {
                int nuevoStock = p.getCantidad() + cambio;
                if (nuevoStock < 0) {
                    return "ERROR: Stock insuficiente. Stock actual: " + p.getCantidad();
                }
                p.setCantidad(nuevoStock);
                return "Stock actualizado: " + nuevoStock + " unidades restantes";
            }
        }
        return "ERROR: Producto con ID " + id + " no encontrado";
    }
}