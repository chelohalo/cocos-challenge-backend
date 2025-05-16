# 🏦 Cocos Challenge - Backend

Este proyecto implementa una API REST con NestJS + TypeORM + PostgreSQL para resolver el challenge técnico de Cocos Capital.

---

## 📌 Endpoints implementados

### 1. `GET /portfolio/:userid`

Devuelve:

- Total de pesos disponibles (`cash`)
- Valor total del portfolio (cash + posiciones)
- Detalle de las posiciones del usuario con:
  - Ticker y nombre del activo
  - Cantidad de acciones
  - Precio actual (`close`)
  - Valor total de la posición
  - Rendimiento diario (%), basado en `previousclose` y `close`

---

### 2. `GET /instruments?query=algo`

Permite buscar instrumentos por:

- Ticker parcial o completo
- Nombre parcial o completo

---

### 3. `POST /orders`

Crea una orden con los siguientes campos:

```json
{
  "userid": 1,
  "instrumentid": 66,
  "side": "BUY | SELL | CASH_IN | CASH_OUT",
  "type": "MARKET | LIMIT",
  "size": 10
}
```

- Las órdenes `MARKET` se ejecutan automáticamente si hay fondos o acciones suficientes → `FILLED`
- Si no hay fondos → `REJECTED`
- Las órdenes `LIMIT` se guardan en estado `NEW`

---

### 4. `PATCH /orders/:id/cancel`

Permite cancelar una orden de tipo `LIMIT` que aún esté en estado `NEW`.  
Si la orden no existe o no puede ser cancelada, devuelve un error apropiado.

---

## 🧪 Postman Collection

Se incluye una colección para probar todos los endpoints:

📁 `postman/cocos-challenge.postman_collection.json`

---

## 🧪 Tests

Se incluye un test funcional (`e2e`) para el endpoint de creación de órdenes.

```bash
npm run test:e2e
```

---

## ⚙️ Configuración local

### 1. Clonar el repo

```bash
git clone git@github.com:chelohalo/cocos-challenge-backend.git
cd cocos-challenge-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear archivo `.env`

```env
PGHOST=...
PGUSER=...
PGPASSWORD=...
PGDATABASE=...
PORT=5432
```

### 4. Ejecutar la app

```bash
npm run start:dev
```

---
