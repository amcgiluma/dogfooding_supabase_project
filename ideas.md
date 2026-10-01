# Idea: un compañero agente que trabaja contigo

Estado: lluvia de ideas, no especificación cerrada.

## La propuesta

Una persona crea un compañero digital, le da una misión y recibe avances mientras trabaja. La interfaz habla de compañeros, misiones y capacidad de trabajo. La infraestructura queda detrás: una instancia EC2 con una imagen preparada, un harness de agentes, varios roles y memoria persistente.

El compañero debería estar disponible para la persona en cualquier momento. Queda por decidir si eso implica mantener la instancia encendida las 24 horas o despertarla cuando haya trabajo; son experiencias y costes distintos.

## Lo que haría la persona

1. Inicia sesión y crea un compañero como comienzo de un viaje.
2. Define qué quiere conseguir. Puede crear varias misiones y añadir una fecha límite.
3. Elige una capacidad fácil de entender: muy baja, baja, media, alta o muy alta. La pantalla explica qué cambia en ritmo, límite de uso y precio, sin exponer tipos de instancia ni parámetros de modelos.
4. Puede aceptar una propuesta inicial de equipo, por ejemplo planificador, ejecutor y verificador, y ajustarla.
5. Ve el estado de cada misión, avances concretos, bloqueos, resultados y siguientes pasos.
6. Sabe que los agentes pueden proponer ideas y mejoras para su propio trabajo. Hay que definir qué pueden aplicar solos y qué requiere su aprobación.

## Cómo podría funcionar por detrás

```text
Usuario y aplicación
       ↓
Supabase Auth + Postgres (compañeros, misiones, estado, uso)
       ↓
Control privado del ciclo de vida y del presupuesto
       ↓
EC2 con imagen preparada → harness por elegir → agentes + memoria
       ↓
Avances guardados en Postgres → interfaz actualizada con Realtime
```

- **Supabase**: identidad, datos estructurados, permisos y cambios de estado visibles en la interfaz. Realtime comunica avances; no sustituye el almacenamiento ni controla EC2 por sí solo.
- **EC2**: ejecuta la imagen preparada. Falta decidir si habrá una instancia por compañero, por usuario o un grupo compartido. La imagen incluiría la estructura de carpetas, configuración y memoria diseñada para el harness elegido.
- **Harness**: Pi o Hermes son candidatos, todavía por estudiar. El nombre «Pi-hole» mencionado al hablar puede referirse a Pi; conviene confirmar el producto exacto antes de elegir la imagen.
- **Trabajo interno**: los agentes coordinan misiones, tareas, ideas y mejoras mediante un backlog. Los trabajos programados (cron) pueden dar un ritmo distinto a cada nivel, pero la capacidad también necesita límites de coste y consumo del modelo.
- **Fecha límite**: podría concentrar más trabajo antes del vencimiento. Hay que definir qué ocurre si no llega a tiempo o agota su presupuesto.

## Pagos y capacidad: debate pendiente

La experiencia deseada es una sola suscripción en la aplicación. La persona no debería tener que contratar aparte un proveedor de modelos y pegar una API key. Para estudiar si esto funciona, hay que medir el coste real de EC2, disco, red, modelos y margen por cada nivel. También hay que decidir si la suscripción incluye una cuota, un límite de gasto o ambas cosas.

Los cinco niveles son una forma de presentar la oferta, todavía no cinco precios ni cinco configuraciones técnicas. «Más capacidad» podría significar más ejecuciones diarias, mejores modelos, más trabajo simultáneo o una combinación explícita. Prometer calidad solo por aumentar la frecuencia de cron sería engañoso.

## Preguntas para la próxima lluvia de ideas

- ¿Qué es exactamente un compañero y cuántos puede tener cada persona? ¿Cuántos agentes internos incluye?
- ¿Qué misiones iniciales debe saber hacer bien el primer prototipo?
- ¿Qué harness concreto elegimos y dónde se guarda su memoria cuando una instancia se detiene o sustituye?
- ¿Qué pueden cambiar los agentes por sí mismos? ¿Qué necesita revisión del usuario?
- ¿Qué significa «24/7»: disponible para recibir instrucciones o trabajando de forma continua?
- ¿Cómo se traduce cada nivel de capacidad a trabajo, límites y precio entendibles?
- ¿Quién paga las llamadas a los modelos? ¿Modelos alojados por un proveedor o ejecutados en EC2?
- ¿Qué debe pasar al pausar, cancelar, fallar o alcanzar un límite de gasto?

## Qué falta para empezar a construir

El repositorio contiene instrucciones y skills, pero todavía no tiene código de aplicación, esquema de datos, funciones, imagen EC2 ni configuración de despliegue. Harán falta:

1. **Base de la app**: frontend, rutas, diseño inicial y entorno de desarrollo. Se puede elegir el stack cuando aterricemos el primer recorrido.
2. **Proyecto Supabase**: Auth, tablas para compañeros y misiones, estados y eventos, políticas RLS por propietario y suscripciones Realtime con lectura autorizada. Por defecto, Juanma realiza los cambios dentro de Supabase con una guía paso a paso.
3. **Cuenta AWS de desarrollo**: puede ser una cuenta existente con un entorno aislado o una nueva. Para construir y probar, el agente necesita acceso temporal y limitado a EC2 y a los recursos concretos que usemos, nunca acceso root ni claves pegadas en el repo. El servicio que arranque instancias necesitará sus propios permisos de ejecución.
4. **Imagen y operación**: región, tipo inicial de instancia, AMI o plantilla de arranque, permisos mínimos, forma de acceder a la instancia, parada y limpieza, y destino de la memoria persistente.
5. **Proveedor de modelos y presupuesto**: elegir quién sirve los modelos, cómo se guardan sus credenciales y qué límites impiden gasto inesperado. Calcular precios solo después de medir un flujo real.
6. **Cobro y despliegue**: elegir proveedor de pagos y reglas de suscripción; conectar el despliegue de la app cuando exista. No hacen falta para validar el primer flujo local con un usuario de prueba.

Un primer corte razonable sería: un usuario, un compañero, una misión, una imagen fija, crear/pausar instancia y mostrar avances reales. Después se estudian varias misiones, niveles, agentes que se coordinan, mejoras propias y pagos.
