FROM php:8.3-fpm

# Instalar dependencias del sistema y drivers
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl

# Instalar extensiones de PHP
RUN docker-php-ext-install pdo pdo_pgsql bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copiamos el código
COPY . .

# Eliminamos vendor y lock por si hay conflicto de arquitectura entre Fedora y el contenedor
RUN rm -rf vendor composer.lock

# Instalamos sin scripts para evitar errores de symlinks o permisos antes de tiempo
RUN composer install --no-interaction --no-scripts --optimize-autoloader

# Ahora sí, damos permisos
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]