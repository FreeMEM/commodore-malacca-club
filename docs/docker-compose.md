# Configuración Docker Compose

## Estrategia de Entornos

Usamos el sistema de **override** de Docker Compose:

```
docker-compose.yml              # Base: servicios comunes
docker-compose.override.yml     # Desarrollo (se aplica automáticamente)
docker-compose.prod.yml         # Producción (se especifica explícitamente)
```

| Archivo | Cuándo se usa | Qué incluye |
|---------|---------------|-------------|
| `docker-compose.yml` | Siempre | DB, WordPress, redes, volúmenes |
| `docker-compose.override.yml` | Automático en local | HTTP, puertos dev, sin SSL |
| `docker-compose.prod.yml` | Solo en servidor | HTTPS, Certbot, config SSL |

## Arquitectura

### Desarrollo (local)
```
┌──────────────────────────────────────────────────┐
│  localhost                                        │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│  │  Nginx  │───►│WordPress│───►│ MariaDB │      │
│  │  :8080  │    │  :9000  │    │  :3306  │      │
│  │  (HTTP) │    │ PHP-FPM │    │         │      │
│  └─────────┘    └─────────┘    └─────────┘      │
│                                                  │
│  ┌─────────┐                                    │
│  │  React  │  (npm run dev, fuera de Docker)    │
│  │  :5173  │                                    │
│  └─────────┘                                    │
└──────────────────────────────────────────────────┘
```

### Producción
```
┌──────────────────────────────────────────────────────────┐
│  cbmmalacca.freemem.space                                 │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐  ┌─────────┐ │
│  │  Nginx  │───►│WordPress│───►│ MariaDB │  │ Certbot │ │
│  │ :80/443 │    │  :9000  │    │  :3306  │  │  (SSL)  │ │
│  │ (HTTPS) │    │ PHP-FPM │    │         │  └─────────┘ │
│  └─────────┘    └─────────┘    └─────────┘              │
│       │                                                  │
│       └──► /var/www/html (React build estático)         │
└──────────────────────────────────────────────────────────┘
```

---

## Archivos de Configuración

### docker-compose.yml (Base)

```yaml
services:
  db:
    image: mariadb:10.11
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: ${WORDPRESS_DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - backend
    healthcheck:
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 5

  wordpress:
    image: wordpress:6.4-php8.2-fpm
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_NAME: wordpress
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: ${WORDPRESS_DB_PASSWORD}
    volumes:
      - wp_data:/var/www/html
      - ./wordpress/plugins/mcclub-core:/var/www/html/wp-content/plugins/mcclub-core
    networks:
      - backend

networks:
  backend:

volumes:
  db_data:
  wp_data:
```

### docker-compose.override.yml (Desarrollo)

```yaml
# Se aplica automáticamente con `docker compose up`
# NO subir a producción

services:
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    depends_on:
      - wordpress
    ports:
      - "8080:80"
    volumes:
      - ./nginx/dev.conf:/etc/nginx/conf.d/default.conf:ro
      - wp_data:/var/www/html:ro
    networks:
      - backend

  # Exponer DB para debug (opcional, comentar si no se necesita)
  db:
    ports:
      - "3306:3306"
```

### docker-compose.prod.yml (Producción)

```yaml
# Usar con: docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

services:
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    depends_on:
      - wordpress
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/prod.conf:/etc/nginx/conf.d/default.conf:ro
      - ./certbot/www:/var/www/certbot:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - wp_data:/var/www/html:ro
      - ./frontend/dist:/var/www/frontend:ro
    networks:
      - backend

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/www:/var/www/certbot
      - ./certbot/conf:/etc/letsencrypt
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

---

## Variables de Entorno

### .env.example (plantilla)

```env
# Base de datos
MYSQL_ROOT_PASSWORD=
WORDPRESS_DB_PASSWORD=

# Dominio (solo informativo en dev)
DOMAIN=localhost

# Producción
SSL_EMAIL=
```

### .env (desarrollo local)

```env
MYSQL_ROOT_PASSWORD=dev_root_password
WORDPRESS_DB_PASSWORD=dev_wp_password
DOMAIN=localhost
```

### .env.prod (producción)

```env
MYSQL_ROOT_PASSWORD=<password_seguro_generado>
WORDPRESS_DB_PASSWORD=<password_seguro_generado>
DOMAIN=cbmmalacca.freemem.space
SSL_EMAIL=admin@freemem.space
```

Generar passwords seguros:
```bash
openssl rand -base64 32
```

---

## Configuración Nginx

### nginx/dev.conf (Desarrollo)

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html;
    index index.php;

    # WordPress PHP
    location ~ \.php$ {
        fastcgi_pass wordpress:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # WordPress archivos estáticos
    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # Permitir CORS para desarrollo React
    location /wp-json/ {
        add_header Access-Control-Allow-Origin "http://localhost:5173" always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;

        if ($request_method = OPTIONS) {
            return 204;
        }

        try_files $uri $uri/ /index.php?$args;
    }
}
```

### nginx/prod.conf (Producción)

```nginx
# Redirect HTTP -> HTTPS
server {
    listen 80;
    server_name cbmmalacca.freemem.space;

    # Certbot challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name cbmmalacca.freemem.space;

    ssl_certificate /etc/letsencrypt/live/cbmmalacca.freemem.space/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cbmmalacca.freemem.space/privkey.pem;

    # SSL config recomendada
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # Frontend React (build estático)
    root /var/www/frontend;
    index index.html;

    # SPA: todas las rutas van a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # WordPress API
    location /wp-json/ {
        proxy_pass http://wordpress:9000;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME /var/www/html/index.php;
        fastcgi_pass wordpress:9000;
    }

    # WordPress Admin
    location /wp-admin/ {
        root /var/www/html;
        try_files $uri $uri/ /index.php?$args;

        location ~ \.php$ {
            fastcgi_pass wordpress:9000;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
        }
    }

    location /wp-login.php {
        root /var/www/html;
        fastcgi_pass wordpress:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # WordPress uploads
    location /wp-content/uploads/ {
        root /var/www/html;
    }
}
```

---

## Guía de Despliegue

### Desarrollo Local

```bash
# 1. Clonar repositorio
git clone <repo> cbm-malacca-club
cd cbm-malacca-club

# 2. Crear .env
cp .env.example .env
# Editar .env con passwords de desarrollo

# 3. Crear directorios nginx
mkdir -p nginx

# 4. Copiar configuración nginx dev
# (crear nginx/dev.conf con el contenido de arriba)

# 5. Levantar servicios
docker compose up -d

# 6. Verificar
docker compose ps
docker compose logs -f

# 7. Acceder
# WordPress admin: http://localhost:8080/wp-admin
# API: http://localhost:8080/wp-json/wp/v2/posts

# 8. Frontend React (en otra terminal)
cd frontend
npm install
npm run dev
# React: http://localhost:5173
```

### Producción (Servidor)

```bash
# 1. Conectar al servidor
ssh usuario@servidor

# 2. Clonar repositorio
git clone <repo> /var/www/cbm-malacca-club
cd /var/www/cbm-malacca-club

# 3. Crear .env de producción
cp .env.example .env
nano .env
# Poner passwords SEGUROS generados con: openssl rand -base64 32

# 4. Crear directorios
mkdir -p nginx certbot/www certbot/conf

# 5. Copiar configuración nginx prod
# (crear nginx/prod.conf)

# 6. Build del frontend
cd frontend
npm ci
npm run build
cd ..

# 7. Configurar DNS
# Apuntar cbmmalacca.freemem.space al IP del servidor

# 8. Primer despliegue SIN SSL (para obtener certificado)
# Temporalmente modificar nginx/prod.conf para solo escuchar en 80

# 9. Levantar servicios
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 10. Obtener certificado SSL
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d cbmmalacca.freemem.space \
  --email admin@freemem.space \
  --agree-tos \
  --no-eff-email

# 11. Restaurar nginx/prod.conf completo (con SSL)

# 12. Reiniciar nginx
docker compose -f docker-compose.yml -f docker-compose.prod.yml restart nginx

# 13. Verificar HTTPS
curl -I https://cbmmalacca.freemem.space
```

### Actualizar Producción

```bash
# 1. Conectar al servidor
ssh usuario@servidor
cd /var/www/cbm-malacca-club

# 2. Pull cambios
git pull origin main

# 3. Rebuild frontend si hay cambios
cd frontend
npm ci
npm run build
cd ..

# 4. Reiniciar servicios si hay cambios en docker-compose o plugins
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# 5. Si solo cambió el frontend, no hace falta reiniciar
# (los archivos estáticos se sirven directamente)
```

---

## Comandos Útiles

### Logs
```bash
# Todos los servicios
docker compose logs -f

# Servicio específico
docker compose logs -f nginx
docker compose logs -f wordpress
```

### Base de Datos
```bash
# Acceder a MySQL
docker compose exec db mysql -u wordpress -p wordpress

# Backup
docker compose exec db mysqldump -u wordpress -p wordpress > backup_$(date +%Y%m%d).sql

# Restore
docker compose exec -T db mysql -u wordpress -p wordpress < backup.sql
```

### WordPress
```bash
# Shell en contenedor WordPress
docker compose exec wordpress bash

# Permisos (si hay problemas de uploads)
docker compose exec wordpress chown -R www-data:www-data /var/www/html/wp-content
```

### SSL
```bash
# Ver certificados
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot certificates

# Renovar manualmente
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot renew

# Test renovación
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot renew --dry-run
```

### Limpieza
```bash
# Parar servicios
docker compose down

# Parar y eliminar volúmenes (CUIDADO: borra BD y archivos WP)
docker compose down -v

# Limpiar imágenes no usadas
docker image prune -a
```

---

## Checklist Despliegue Producción

- [ ] Servidor con Docker y Docker Compose instalados
- [ ] DNS configurado (cbmmalacca.freemem.space -> IP servidor)
- [ ] Puerto 80 y 443 abiertos en firewall
- [ ] `.env` con passwords seguros
- [ ] `nginx/prod.conf` creado
- [ ] Certificado SSL obtenido
- [ ] Frontend buildeado (`frontend/dist`)
- [ ] WordPress accesible en `/wp-admin`
- [ ] API accesible en `/wp-json/wp/v2/posts`
- [ ] HTTPS funcionando (candado verde)
- [ ] Cron de renovación SSL configurado (opcional, certbot lo hace solo)

---

## Troubleshooting

### WordPress no conecta a la BD
```bash
# Verificar que db está healthy
docker compose ps

# Ver logs de db
docker compose logs db

# Verificar credenciales en .env
```

### Error 502 Bad Gateway
```bash
# WordPress no está corriendo
docker compose logs wordpress

# Verificar que wordpress:9000 responde
docker compose exec nginx ping wordpress
```

### Certificado SSL no se genera
```bash
# Verificar que el dominio apunta al servidor
dig cbmmalacca.freemem.space

# Verificar que puerto 80 está abierto
curl http://cbmmalacca.freemem.space/.well-known/acme-challenge/test

# Ver logs de certbot
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs certbot
```
