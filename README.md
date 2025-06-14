INFORME FINAL COMPLETO

Trabajo Integrador de Ingeniería de Software y Comunicaciones

Título: Sistema de Backups Automáticos vía SSH para Dispositivos de Red



Introducción General

En el panorama actual de la tecnología de la información, las redes de comunicación constituyen la columna vertebral de las operaciones organizacionales, abarcando desde empresas multinacionales hasta instituciones académicas y gubernamentales. La creciente dependencia de estas infraestructuras ha elevado la necesidad de garantizar su confiabilidad, disponibilidad y capacidad de recuperación ante fallos. En este contexto, la gestión de dispositivos de red —como routers, switches y firewalls— se ha convertido en una tarea crítica que requiere soluciones avanzadas para mitigar riesgos asociados con la pérdida de datos o configuraciones esenciales.

La problemática central que aborda este trabajo radica en la gestión eficiente y segura de las copias de seguridad (backups) de las configuraciones de dispositivos de red. Estas configuraciones contienen información vital, como reglas de enrutamiento, políticas de seguridad y parámetros operativos, cuya pérdida puede derivar en interrupciones operativas significativas, violaciones de seguridad o costosos tiempos de inactividad. Históricamente, los backups han sido realizados de manera manual, un enfoque que no solo es susceptible a errores humanos, sino que también resulta ineficiente en términos de tiempo y escalabilidad, especialmente en redes con múltiples dispositivos distribuidos geográficamente.

Este proyecto propone una solución innovadora: el diseño e implementación de una aplicación web que automatiza el proceso de backups utilizando el protocolo SSH (Secure Shell), un estándar ampliamente reconocido por su seguridad y robustez. La aplicación, construida sobre una arquitectura cliente-servidor, emplea el microframework Flask en Python como núcleo del sistema, integrando tecnologías complementarias como SQLite para la gestión de datos y Paramiko para la comunicación segura con dispositivos remotos. Este enfoque no solo optimiza la operativa diaria, sino que también se alinea con las mejores prácticas de la industria, como la automatización de procesos repetitivos, la centralización de la gestión y la protección de datos sensibles.

Desde una perspectiva científica, este trabajo parte de la observación de un problema real —la ineficiencia y vulnerabilidad de los backups manuales— y formula una hipótesis: la implementación de una solución automatizada basada en tecnologías modernas puede mejorar significativamente la seguridad y eficiencia en la gestión de configuraciones de red. A través de un diseño experimental que incluye el desarrollo, prueba y evaluación de la aplicación, se busca validar esta hipótesis, proporcionando una herramienta práctica y un marco teórico que pueda servir como referencia para investigaciones futuras.



Objetivo General

El propósito principal de este proyecto es diseñar, desarrollar y evaluar una aplicación web que permita la gestión automatizada, segura y eficiente de backups de configuraciones de dispositivos de red. Este objetivo general se desglosa en los siguientes objetivos específicos, formulados con un enfoque científico:





Establecer conexiones seguras mediante SSH: Diseñar un sistema que utilice el protocolo SSH para conectar de forma remota a dispositivos de red, garantizando la confidencialidad e integridad de las comunicaciones mediante cifrado.



Automatizar el proceso de backups: Implementar una solución que ejecute comandos de respaldo en los dispositivos y transfiera los archivos resultantes al servidor de manera autónoma, reduciendo la intervención humana y minimizando errores.



Organizar y almacenar backups de forma estructurada: Crear un sistema de almacenamiento que facilite la identificación y recuperación de archivos, utilizando convenciones de nomenclatura basadas en metadatos como la IP del dispositivo y la fecha del respaldo.



Desarrollar una interfaz web intuitiva y funcional: Proporcionar una interfaz que permita a los usuarios gestionar dispositivos (alta, baja, modificación) e iniciar backups manualmente, evaluando su usabilidad mediante pruebas con usuarios reales.



Garantizar la seguridad de los datos: Implementar medidas de protección, como el cifrado de las credenciales almacenadas y la verificación de la integridad de los archivos transferidos, para cumplir con estándares de seguridad reconocidos.

Estos objetivos no solo responden a necesidades prácticas, sino que también se alinean con principios teóricos de la ingeniería de software (como la modularidad y la automatización) y las comunicaciones (como la seguridad en la transmisión de datos), proporcionando un marco sólido para la experimentación y validación de la solución propuesta.



Tecnologías Utilizadas

La selección de tecnologías para este proyecto se realizó con base en un análisis riguroso de sus características técnicas, compatibilidad y capacidad para cumplir con los requisitos establecidos. A continuación, se describen las tecnologías empleadas, su relevancia y su fundamentación teórica:





Python 3.x: Lenguaje de programación interpretado y de alto nivel, ampliamente adoptado en la comunidad científica y tecnológica por su simplicidad, legibilidad y extenso ecosistema de librerías. Su elección se justifica por su capacidad para manejar tareas de scripting, desarrollo web y automatización, áreas clave para este proyecto.



Flask: Microframework para desarrollo web en Python, caracterizado por su diseño ligero y flexible. Flask permite una rápida implementación de rutas HTTP, manejo de formularios y conexión con bases de datos, lo que lo hace ideal para prototipos funcionales y aplicaciones de mediana escala. Su minimalismo reduce la sobrecarga computacional, un factor crítico en entornos con recursos limitados.



HTML/CSS/JavaScript: Tecnologías fundamentales para la construcción de interfaces web. HTML proporciona la estructura semántica, CSS define la estética y la usabilidad visual, y JavaScript añade interactividad dinámica, mejorando la experiencia del usuario. Esta combinación sigue los principios de diseño centrado en el usuario, evaluados en el contexto de la ergonomía del software.



SQLite3: Base de datos relacional embebida que opera sin necesidad de un servidor dedicado. Su simplicidad, portabilidad y bajo consumo de recursos la convierten en una opción adecuada para entornos de desarrollo y pruebas. Desde un enfoque científico, su uso permite validar hipótesis sobre la eficiencia del almacenamiento estructurado en sistemas locales.



Paramiko: Librería de Python que implementa el protocolo SSH2, proporcionando una interfaz para conexiones seguras, ejecución de comandos remotos y transferencia de archivos vía SFTP. Su integración asegura que las operaciones cumplan con los principios de confidencialidad, autenticación e integridad definidos en los estándares de seguridad de redes.



SFTP (SSH File Transfer Protocol): Subprotocolo de SSH que utiliza cifrado para la transferencia segura de archivos. Su implementación se basa en la teoría de la criptografía simétrica y asimétrica, garantizando que los datos permanezcan protegidos durante la transmisión.

Estas tecnologías forman un sistema interconectado que combina eficiencia operativa con fundamentos teóricos sólidos, permitiendo la validación experimental de la solución propuesta.



Estructura del Proyecto

El diseño del proyecto sigue un enfoque modular y jerárquico, promoviendo la separación de responsabilidades y facilitando su mantenimiento, escalabilidad y evaluación. A continuación, se detalla cada componente principal:





app.py: Archivo central que inicializa la aplicación Flask y define las rutas HTTP. Actúa como el núcleo lógico del sistema, coordinando las interacciones entre el frontend, la base de datos y los módulos de backend.



ABM.py: Módulo dedicado a la gestión de dispositivos (Alta, Baja, Modificación). Implementa funciones para interactuar con la base de datos SQLite, asegurando la integridad de los datos mediante validaciones y consultas estructuradas.



ssh_service.py: Módulo que encapsula la lógica de conexión SSH y transferencia de archivos. Utiliza Paramiko para establecer conexiones seguras y ejecutar comandos, siguiendo un diseño orientado a la reutilización y la abstracción.



dispositivos.db: Base de datos SQLite que almacena información de los dispositivos (IP, nombre, usuario, contraseña, puerto). Su estructura relacional permite consultas eficientes y soporta futuras expansiones, como la adición de relaciones entre tablas.



templates/index.html: Plantilla HTML que define la interfaz de usuario, incluyendo formularios y botones interactivos. Su diseño se basa en principios de usabilidad y accesibilidad, evaluados mediante pruebas preliminares.



static/css/style.css: Hoja de estilos que garantiza una presentación visual coherente y profesional, optimizando la experiencia del usuario.



static/js/script.js: Archivo JavaScript que implementa funcionalidades dinámicas, como la validación de formularios y la actualización en tiempo real de la interfaz.



backups/: Directorio de almacenamiento para los archivos de backup, organizado por IP y fecha. Este diseño facilita la trazabilidad y recuperación de datos, un aspecto crítico para la validación de la solución.



ProyectoBackups/: Carpeta auxiliar que contiene documentación, scripts de prueba y recursos adicionales, sirviendo como un repositorio para el análisis y la presentación del proyecto.

Esta estructura refleja el principio de cohesión alta y acoplamiento bajo, permitiendo que cada componente sea evaluado y mejorado de manera independiente durante el desarrollo experimental.



Fundamento Teórico

El proyecto se sustenta en un marco teórico interdisciplinario que abarca la ingeniería de software, las comunicaciones y las bases de datos. A continuación, se desarrollan los conceptos fundamentales aplicados, con un enfoque científico que incluye referencias a modelos establecidos y principios validados.

Ingeniería de Software

La ingeniería de software proporciona las herramientas metodológicas para el diseño y desarrollo de sistemas robustos y mantenibles. Los principios aplicados incluyen:





Modularidad: El sistema se divide en módulos independientes (gestión de dispositivos, conexiones SSH, interfaz), permitiendo pruebas aisladas y mejoras incrementales. Este enfoque se deriva del principio de diseño modular de Parnas (1972), que enfatiza la independencia funcional.



Automatización: La eliminación de tareas manuales repetitivas se basa en la teoría de la optimización de procesos, un pilar de las metodologías ágiles y DevOps. Esto se valida experimentalmente al medir la reducción del tiempo operativo y los errores humanos.



Patrón MVC: Aunque no implementado estrictamente, la separación entre la base de datos (modelo), Flask (controlador) y las plantillas HTML (vista) sigue una lógica similar, facilitando la escalabilidad y el mantenimiento.



Pruebas y validación: El desarrollo incluye un enfoque iterativo con pruebas unitarias y funcionales, alineado con el método científico de experimentación y ajuste basado en resultados.

Comunicaciones y Redes

El sistema opera dentro del marco teórico de las redes de computadoras, utilizando modelos y protocolos estandarizados:





Modelo OSI (Open Systems Interconnection): Este modelo de siete capas proporciona un marco conceptual para entender las interacciones del sistema:





Capa 7 (Aplicación): SSH y SFTP operan en esta capa, gestionando la interacción directa con los dispositivos.



Capa 4 (Transporte): TCP asegura la entrega confiable de datos, un prerrequisito para las conexiones SSH.



Capa 3 (Red): IP permite la comunicación entre el servidor y los dispositivos remotos. Este análisis por capas valida la interoperabilidad del sistema en entornos de red reales.



SSH (Secure Shell): Basado en la criptografía de clave pública (RSA, DSA) y simétrica (AES), SSH asegura la autenticación y el cifrado de las comunicaciones. Su implementación sigue las especificaciones del RFC 4251, garantizando un estándar de seguridad verificable.



SFTP: Como extensión de SSH, SFTP hereda sus propiedades de seguridad y añade funcionalidades para la transferencia de archivos, optimizando la eficiencia de los backups.

Base de Datos Relacional

SQLite se fundamenta en la teoría de bases de datos relacionales de Codd (1970), que enfatiza la integridad referencial y la normalización:





Estructura tabular: Los datos de los dispositivos se almacenan en tablas con campos definidos (IP, usuario, contraseña), permitiendo consultas SQL eficientes.



Portabilidad: Su diseño embebido elimina dependencias externas, facilitando la replicación del experimento en diferentes entornos.

Arquitectura Cliente-Servidor

La arquitectura de tres capas (cliente, servidor, dispositivo remoto) se basa en principios de distribución de sistemas:

-| Capa | Responsabilidad | Tecnología | |-------|------------------|------------| | Cliente | Interfaz de usuario | Navegador web | | Servidor | Lógica de negocio | Flask | | Dispositivo | Fuente de datos | SSH/SFTP |

Esta arquitectura permite la validación experimental de la hipótesis al medir el rendimiento, la escalabilidad y la seguridad en cada capa.



Funcionamiento del Sistema

El sistema opera mediante un flujo de trabajo estructurado, diseñado para ser reproducible y evaluable:





Ingreso de datos: El usuario introduce la información del dispositivo (IP, usuario, contraseña, puerto) a través de un formulario web, validado en el frontend y backend.



Gestión de dispositivos: Flask procesa los datos y los almacena en SQLite mediante ABM.py, asegurando consistencia e integridad.



Conexión SSH: ssh_service.py utiliza Paramiko para autenticarse y conectar al dispositivo remoto, ejecutando comandos de respaldo específicos (por ejemplo, show running-config o export).



Transferencia de archivos: SFTP copia el archivo generado al directorio backups/, renombrándolo con un formato estandarizado (ejemplo: backup_192.168.1.1_2025-06-14.backup).



Retroalimentación: La interfaz muestra el resultado (éxito o error), permitiendo al usuario verificar el estado del proceso.

Este flujo se evaluó mediante pruebas controladas, midiendo métricas como tiempo de ejecución, tasa de éxito y consumo de recursos.



Ventajas del Sistema





Seguridad: El cifrado SSH protege contra interceptaciones y ataques de tipo "man-in-the-middle".



Eficiencia: La automatización reduce el tiempo operativo en un factor significativo (validado experimentalmente).



Escalabilidad: La modularidad permite integrar nuevos dispositivos y funcionalidades sin rediseñar el sistema.



Usabilidad: La interfaz simplifica la gestión, evaluada mediante retroalimentación de usuarios.



Posibilidades de Expansión





Automatización programada: Uso de schedulers como cron para backups periódicos.



Almacenamiento en la nube: Integración con servicios como AWS S3 para redundancia.



Análisis avanzado: Implementación de dashboards con métricas en tiempo real.



Seguridad mejorada: Autenticación multifactor y encriptación adicional de los backups.

Estas expansiones se plantean como hipótesis para futuras iteraciones, sujetas a validación experimental.



Conclusión

Este proyecto integra conocimientos teóricos y prácticos en un sistema funcional que resuelve un problema crítico en la gestión de redes. La aplicación de un enfoque científico —observación, hipótesis, diseño, experimentación y análisis— ha resultado en una solución robusta, segura y escalable, con un impacto potencial en entornos reales y académicos. Su diseño modular y fundamentación teórica lo convierten en una base sólida para investigaciones futuras, demostrando el valor de la interdisciplinariedad en la resolución de problemas tecnológicos.
