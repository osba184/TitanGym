const http = require("http");
const fs = require("fs");
const path = require("path");

const products = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "products.json"),
    "utf8"
  )
);

const server = http.createServer((req, res) => {

  // PERMITIR ACCESO DESDE REACT
  res.setHeader("Access-Control-Allow-Origin", "*");

  // SERVIR IMÁGENES
  if (req.url.startsWith("/images/")) {

    const imagePath = path.join(
      __dirname,
      req.url
    );

    fs.readFile(imagePath, (err, data) => {

      if (err) {
        res.writeHead(404);
        res.end("Imagen no encontrada");
        return;
      }

      const extension = path.extname(imagePath);

      const mimeTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp"
      };

      res.writeHead(200, {
        "Content-Type":
          mimeTypes[extension] ||
          "application/octet-stream"
      });

      res.end(data);
    });

    return;
  }

  // RAÍZ
  if (req.url === "/") {

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(
      JSON.stringify({
        message: "TitanGym API funcionando"
      })
    );

    return;
  }

  // TODOS LOS PRODUCTOS
  if (req.url === "/api/products") {

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify(products));

    return;
  }

  // PRODUCTO POR ID

  const match =
    req.url.match(/^\/api\/products\/(\d+)$/);

  if (match) {

    const id = parseInt(match[1]);

    const product =
      products.find(
        p => p.id === id
      );

    if (!product) {

      res.writeHead(404, {
        "Content-Type": "application/json"
      });

      res.end(
        JSON.stringify({
          error: "Producto no encontrado"
        })
      );

      return;
    }

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify(product));

    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json"
  });

  res.end(
    JSON.stringify({
      error: "Ruta no encontrada"
    })
  );
});

// server.listen(5173, () => { 
 // console.log(
  //  "TitanGym API ejecutándose en http://localhost:5173"
 // );
//});
const PORT = process.env.PORT || 5173;

server.listen(PORT, () => {
 
});
