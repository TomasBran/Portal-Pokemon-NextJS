# Portal Pokemon

Portal Pokemon es un proyecto desarrollado en NextJS, que utiliza TailwindCSS para los estilos.
Es mi mayor proyecto, en el que más tiempo y ganas puse.

Tiene un menú Home con las herramientas y juegos a disposición.
El deploy está en: https://portal-pkmn.vercel.app/


## Dependencias

```bash
	"dependencies": {
		"next": "14.2.3",
		"react": "^18",
		"react-dom": "^18",
		"primereact": "^10.6.4",
		"react-autosuggest": "^10.1.0",
		"react-dnd": "^16.0.1",
		"react-dnd-html5-backend": "^16.0.1",
		"react-icons": "^5.1.0",
		"sonner": "^1.4.41",
		"sweetalert2": "^11.10.8",
		"sweetalert2-react-content": "^5.0.7"
	},
	"devDependencies": {
		"postcss": "^8",
		"tailwindcss": "^3.4.1"
	}
```
    
## Features

- Calculadora Pokemon - Para calcular fortalezas y debilidades.
- Gimnasio - Minijuego para probar tu valía como entrenador.
- Pokedle - Una versión Pokemon del famoso juego Wordle.
- Adivina el MoveSet - Juego para adivinar el pokemon con un set de movimientos random.
- Desafío de Tipos - Juego para poner a prueba tu conocimiento de la tabla de tipos.
- Construye un Pokemon - Un juego en el cual tendrás que construir al Pokemon perfecto con las opciones que te dan.


## Coming Soon

- Login/Profile
- Tienda Pokemon y sistema de recompensas


## Calculadora Pokemon

Tendrás a disposición los 18 tipos para elegir y ver los movimientos ultra efectivos (x4), efectivos (x2), neutrales (x1), poco efectivos (x0.5), muy poco efectivos (x0.25) e inmunes (x0).
Asímismo, está la herramienta Pokedex, para buscar cualquier Pokemon que quieras y/o que no conozcas sus tipos. Podés agregar y quitar tipos cuanto quieras, haciéndoles click a sus respectivos íconos, pero siempre con un límite de 2 (dos), como en el videojuego.

Esta sección utiliza una llamada a la PokeApi, y posee un Autocompletar de la librería AutoSuggest de React.


## Gimnasio

En el gimnasio, luego de darle a "Iniciar", podrás elegir la cantidad de Pokemon que quieras dentro de 6 opciones elegidas al azar. Luego podrás rollear nuevos Pokemon al azar, hasta 3 veces, o hasta que completes el equipo de 6.

La cantidad de Pokemon a rollear, será de 6 menos tu equipo hasta ahora seleccionado, es decir, si seleccionaste 2 Pokemon en tu equipo, se rollearan 4 nuevos para elegir. Hasta que completes tu equipo de 6.

Tiene un menu de opciones, para cambiar entre el modo normal y dificil, entre la suerte activada y desactivada, selector de generaciones, y mucho más.

También un sistema de sinergias que dependiendo los Pokemon que elijas, tu equipo puede ser aún mas fuerte.

El sistema de selección de generaciones, te permite jugar con las que quieras. Todas están disponibles.


## Pokedle

Una versión Pokemon del famoso juego Wordle.

En Pokedle tendrás que averiguar el Pokemon misterioso elegido al azar, usando como pistas algunas propiedades que puedan o no tener en común con el Pokemon que elijas (Generación, Tipos 1 y 2, Fuerza, Peso y Altura)

Tiene menu de opciones para cambiar las generaciones disponibles para jugar y ver tus estadísticas.


## Adivina el MoveSet

En este minijuego tendrás que adivinar cual es el misterioso Pokemon, basandote en la generacion, los movimientos que se han determinado al azar y su habilidad/habilidad oculta.

Esto pone a prueba el conocimiento del jugador para poder encontrar el pokemon indicado en la menor cantidad de intentos posibles.

Tiene menu de opciones para cambiar las generaciones disponibles para jugar y ver tus estadísticas.


## Desafío de tipos

En este minijuego tendrás que completar la tabla de tipos de un tipo que se te asignará al azar.

Es tanto un juego como una herramienta didáctica para aprender más sobre el juego.

Tiene menu de opciones ver tus estadísticas.


## Construye el Pokemon

En este minijuego tendrás que construir el Pokemon ideal con los que te van dando como opción, eligiendo en que estadística preferís colocarlo.

Tiene menu de opciones ver tus estadísticas.

