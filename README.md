# JuanIgnaso-Weather-App

## Descripción de la Aplicación
Aplicación hecha en **HTML/CSS** con **TailwindCSS** cuya función es mostrar el tiempo de la ubicación que el usuario busque a través de una **API** del tiempo.


## Función de la Aplicación
Mostrar información del tiempo actual y previsión a 5 días en función de como interactue el usuario con el formulario de la aplicación.

## Manera de uso de la Aplicación
### Buscar el tiempo por nombre
Escribe el nombre de municipio/ciudad que desees buscar en el input y dale al botón para que se muestre la previsión del tiempo

> [!TIP]
> Usa las sugerencias que aparecen debajo del input para ser más preciso a la hora de obtener la ubicación que estés buscando.

### Añadir o Guardar en favoritos
Si hay alguna ubicación que deseas guardar para consultar más adelante, puedes hacer click en el siguiente icono y tu ubicación de guardará en ***Guardados***

|                                                            Añadir Ubicación a Favoritos                                          |           Ver/Usar la lista de Guardados            |
| -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| ![icono para guardar ubicación](https://github.com/JuanIgnaso/Weather-App/assets/104755375/39ec9413-ef80-4cd9-8701-91240eaaec16) | ![botón de guardados](https://github.com/JuanIgnaso/Weather-App/assets/104755375/1cda0528-6ea8-4b1b-a57a-5a1eb6acea14) | 



### Previsión a 5 días
Más abajo tendrás un desplegable que mostrará la previsión para las siguientes 120 horas(5 días).

> [!NOTE]
> Haciendo click en cualquiera de las partes de la tabla de previsión se mostrará información más detallada, como orientación del viento o precipitación acumulada.
> 
> ![ventana modal de previsión detallada](https://github.com/JuanIgnaso/Weather-App/assets/104755375/d949ffa5-b904-49e8-b7f4-d90932b5a302)



## Requisitos para ejecutar la Aplicación
La Aplicación solo require de que tu equipo tenga **instalado Docker** sea **Docker CLI** o **Docker Desktop**

## Obtener la Aplicación
Para poder obtener,usar o probar la aplicación hay dos maneras de hacerlo, ambas requieren de cumplir los **Requisitos**

### Instalar la aplicación en **Releases**
![opción de Releases](https://github.com/JuanIgnaso/Weather-App/assets/104755375/bf773d78-6bf6-4848-aa6f-7e5cda2f0f52)

Una vez bajada, dentro de la carpeta raíz del proyecto ejecuta los siguientes comandos en orden:
```
docker build -t weather-app .
```

```
docker run --name nombre-de-contenedor -d -p 443:443  weather-app
```


### Docker pull
También te puedes bajar la imagen directamente de Docker con:
```
docker pull juanignaso/weather-app
```

Y una vez bajada la imagen la puedes usar con:

```
docker run --name nombre-de-contenedor -d -p 443:443  juanignaso/weather-app
```




