# Validador de pagos

Aplicación web que importa un Excel con un lote de pagos, valida cada fila y exporta
`resultado.xlsx` con las columnas originales más `estado` y `motivo_error`.

## Cómo correrlo

Requisitos: Node.js 20 o superior (probado con Node 24) e internet para `npm install`,
porque la librería de Excel (SheetJS) se descarga de `cdn.sheetjs.com`.

```
npm install
npm start
```

Abrir http://localhost:4200, importar `data/datos_entrada.xlsx` (con el botón o arrastrándolo)
y pulsar **Exportar** para descargar `resultado.xlsx`.

En la raíz va incluido el `resultado.xlsx` generado con el archivo de ejemplo:
9 filas válidas y 6 inválidas.

## ¿Qué fue lo más difícil del reto y cómo lo resolviste?

Lo mas dificil fueron las validaciones, porque los datos tenian valores ocultos,por ejemplo el caso de Fernando, esperaba que su fila fuera valida y no fue el caso.Esto paso por que el importe de la fila se veia como '4500.12', pero la celda se guardaba como '4500.123'. Ademas habia una CLABE que parecia normal pero estaba guardaba como numero, asi que Excel ya habia perdido sus ultimos, si el programa leia el texto formateado, esas filas pasaban como validas.

Resolvi leyendo los valores crudos de las celdas y revisando el tipo de datos antes de convertirlos.Despues probe cada caso de las 15 filas, hasta que concidieran con lo que debia salir, cada mensaje de error dice exactamente que fallaba.

Fuera de las validaciones, lo que mas tiempo me tomo fueron detalles de la interfaz y sus animaciones, que no va dentro de los requisitos del entregable pero le da personalidad al trabajo.

## `Oscar Jared Alvarez Camarena`
