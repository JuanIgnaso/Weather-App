#Archivo para construir la app
FROM httpd:latest

#Generar certificado: openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt
# con:  docker run --rm httpd:latest cat /usr/local/apache2/conf/httpd.conf > my-httpd.conf <- recoges el archivo de configuracion de apache

COPY . /usr/local/apache2/htdocs/

#Copiar el archivo de configuración de Apache para meterlo dentro del directorio de Apache de la Imagen de Docker
RUN sed -i \
    -e 's/^#\(Include .*httpd-ssl.conf\)/\1/' \
    -e 's/^#\(LoadModule .*mod_ssl.so\)/\1/' \
    -e 's/^#\(LoadModule .*mod_socache_shmcb.so\)/\1/' \
    conf/httpd.conf

COPY ./certificates/server.key /usr/local/apache2/conf/
COPY ./certificates/server.crt /usr/local/apache2/conf/

###Queda generar de alguna forma los archivos .cert y .key y pegarlos en el directorio correcto  http://localhost:443/