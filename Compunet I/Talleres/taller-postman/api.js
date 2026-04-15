const express = require("express");
const app = express();
app.use(express.json());

// ─── Base de datos en memoria ────────────────────────────────────────────────
let usuarios = [
  { id: 1, nombre: "Ana García",    email: "ana@ejemplo.com",   edad: 28, ciudad: "Bogotá"   },
  { id: 2, nombre: "Carlos López",  email: "carlos@ejemplo.com", edad: 34, ciudad: "Medellín" },
  { id: 3, nombre: "María Rodríguez", email: "maria@ejemplo.com", edad: 22, ciudad: "Cali"   },
];

let productos = [
  { id: 1, nombre: "Portátil Pro",     precio: 2500000, categoria: "Tecnología", stock: 15 },
  { id: 2, nombre: "Mouse Inalámbrico", precio: 85000,  categoria: "Tecnología", stock: 50 },
  { id: 3, nombre: "Escritorio Roble", precio: 750000,  categoria: "Muebles",    stock: 8  },
  { id: 4, nombre: "Silla Ergonómica", precio: 620000,  categoria: "Muebles",    stock: 12 },
];

let nextUserId    = 4;
let nextProductId = 5;

// ─── Utilidad ────────────────────────────────────────────────────────────────
const notFound = (res, tipo, id) =>
  res.status(404).json({ error: `${tipo} con id ${id} no encontrado` });

// ════════════════════════════════════════════════════════════════════════════
//  USUARIOS
// ════════════════════════════════════════════════════════════════════════════

// GET /usuarios  – lista completa, con filtro opcional por ciudad
app.get("/usuarios", (req, res) => {
  const { ciudad } = req.query;
  const resultado  = ciudad
    ? usuarios.filter(u => u.ciudad.toLowerCase() === ciudad.toLowerCase())
    : usuarios;
  res.json({ total: resultado.length, usuarios: resultado });
});

// GET /usuarios/:id
app.get("/usuarios/:id", (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) return notFound(res, "Usuario", req.params.id);
  res.json(usuario);
});

// POST /usuarios  – crear usuario
app.post("/usuarios", (req, res) => {
  const { nombre, email, edad, ciudad } = req.body;
  if (!nombre || !email)
    return res.status(400).json({ error: "Los campos 'nombre' y 'email' son obligatorios" });

  const nuevo = { id: nextUserId++, nombre, email, edad: edad ?? null, ciudad: ciudad ?? null };
  usuarios.push(nuevo);
  res.status(201).json({ mensaje: "Usuario creado exitosamente", usuario: nuevo });
});

// PUT /usuarios/:id  – reemplazar usuario completo
app.put("/usuarios/:id", (req, res) => {
  const idx = usuarios.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return notFound(res, "Usuario", req.params.id);

  const { nombre, email, edad, ciudad } = req.body;
  if (!nombre || !email)
    return res.status(400).json({ error: "Los campos 'nombre' y 'email' son obligatorios" });

  usuarios[idx] = { id: usuarios[idx].id, nombre, email, edad: edad ?? null, ciudad: ciudad ?? null };
  res.json({ mensaje: "Usuario actualizado completamente", usuario: usuarios[idx] });
});

// PATCH /usuarios/:id  – actualización parcial
app.patch("/usuarios/:id", (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) return notFound(res, "Usuario", req.params.id);

  const campos = ["nombre", "email", "edad", "ciudad"];
  campos.forEach(c => { if (req.body[c] !== undefined) usuario[c] = req.body[c]; });
  res.json({ mensaje: "Usuario actualizado parcialmente", usuario });
});

// DELETE /usuarios/:id
app.delete("/usuarios/:id", (req, res) => {
  const idx = usuarios.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return notFound(res, "Usuario", req.params.id);

  const eliminado = usuarios.splice(idx, 1)[0];
  res.json({ mensaje: "Usuario eliminado exitosamente", usuario: eliminado });
});

// ════════════════════════════════════════════════════════════════════════════
//  PRODUCTOS
// ════════════════════════════════════════════════════════════════════════════

// GET /productos  – con filtro opcional por categoría
app.get("/productos", (req, res) => {
  const { categoria } = req.query;
  const resultado     = categoria
    ? productos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase())
    : productos;
  res.json({ total: resultado.length, productos: resultado });
});

// GET /productos/:id
app.get("/productos/:id", (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) return notFound(res, "Producto", req.params.id);
  res.json(producto);
});

// POST /productos
app.post("/productos", (req, res) => {
  const { nombre, precio, categoria, stock } = req.body;
  if (!nombre || precio === undefined)
    return res.status(400).json({ error: "Los campos 'nombre' y 'precio' son obligatorios" });

  const nuevo = { id: nextProductId++, nombre, precio, categoria: categoria ?? "General", stock: stock ?? 0 };
  productos.push(nuevo);
  res.status(201).json({ mensaje: "Producto creado exitosamente", producto: nuevo });
});

// PUT /productos/:id
app.put("/productos/:id", (req, res) => {
  const idx = productos.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return notFound(res, "Producto", req.params.id);

  const { nombre, precio, categoria, stock } = req.body;
  if (!nombre || precio === undefined)
    return res.status(400).json({ error: "Los campos 'nombre' y 'precio' son obligatorios" });

  productos[idx] = { id: productos[idx].id, nombre, precio, categoria: categoria ?? "General", stock: stock ?? 0 };
  res.json({ mensaje: "Producto actualizado completamente", producto: productos[idx] });
});

// PATCH /productos/:id
app.patch("/productos/:id", (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) return notFound(res, "Producto", req.params.id);

  const campos = ["nombre", "precio", "categoria", "stock"];
  campos.forEach(c => { if (req.body[c] !== undefined) producto[c] = req.body[c]; });
  res.json({ mensaje: "Producto actualizado parcialmente", producto });
});

// DELETE /productos/:id
app.delete("/productos/:id", (req, res) => {
  const idx = productos.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return notFound(res, "Producto", req.params.id);

  const eliminado = productos.splice(idx, 1)[0];
  res.json({ mensaje: "Producto eliminado exitosamente", producto: eliminado });
});

// ─── Inicio ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
