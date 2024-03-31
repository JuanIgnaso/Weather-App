#Archivo para construir la app
FROM httpd:latest


# con:  docker run --rm httpd:latest cat /usr/local/apache2/conf/httpd.conf > my-httpd.conf <- recoges el archivo de configuracion de apache

COPY . /usr/local/apache2/htdocs/

COPY .cert /usr/local/apache2/conf/
COPY .key /usr/local/apache2/conf/

#Copiar el archivo de configuración de Apache para meterlo dentro del directorio de Apache de la Imagen de Docker
COPY ./my-httpd.conf /usr/local/apache2/conf/httpd.conf

###Queda generar de alguna forma los archivos .cert y .key y pegarlos en el directorio correcto