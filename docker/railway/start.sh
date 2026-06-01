#!/bin/sh
set -e

cd /var/www/html

# Remove o arquivo de hot-reload do Vite (não deve existir em produção)
rm -f public/hot

# Cache de configuração para produção
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Substituir placeholder PORT no nginx.conf pelo valor real do Railway
sed -i "s/{{PORT}}/${PORT:-8000}/g" /etc/nginx/nginx.conf

# Rodar migrations automaticamente
php artisan migrate --force

# Garantir permissões de storage
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Iniciar PHP-FPM + Nginx via Supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
