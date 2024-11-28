document.addEventListener('DOMContentLoaded', function () {
    const botonConvertirJS = document.getElementById('botonConvertirJS');
    const botonLimpiarJS = document.getElementById('botonLimpiarJS');
    const entradaCodigoJSInput = document.getElementById('codigoJSInput');
    const salidaCodigoPython = document.getElementById('codigoPythonOutput');

    const botonConvertirPY = document.getElementById('botonConvertirPY');
    const botonLimpiarPY = document.getElementById('botonLimpiarPY');
    const entradaCodigoPythonInput = document.getElementById('codigoPythonInput');
    const salidaCodigoJSFromPY = document.getElementById('codigoJSFromPYOutput');

    const botonCopiarJS = document.getElementById('botonCopiarJS');
    const botonCopiarPY = document.getElementById('botonCopiarPY');

    // Conversión de JS a Python (funciones, if-else, bucles for, while, arreglos)
    function convertirJSToPython(codigoJS) {
        let codigoPY = codigoJS;

        // Convertir funciones de JS a Python
        codigoPY = codigoPY.replace(/function\s+(\w+)\s*\((.*?)\)\s*{([\s\S]*?)}/g, function (match, nombreFuncion, parametros, cuerpo) {
            return `def ${nombreFuncion}(${parametros}):\n    ${cuerpo.replace(/console\.log\((.*?)\);/g, 'print($1)')}\n`;
        });

        // Convertir los condicionales if-else de JavaScript a Python
        codigoPY = codigoPY.replace(/if\s*\((.*?)\)\s*{([\s\S]*?)}\s*else\s*{([\s\S]*?)}/g, function (match, condicion, cuerpoIf, cuerpoElse) {
            return `if ${condicion}:\n    ${cuerpoIf.replace(/console\.log\((.*?)\);/g, 'print($1)')}\nelse:\n    ${cuerpoElse.replace(/console\.log\((.*?)\);/g, 'print($1)')}`;
        });

        // Convertir los bucles for de JavaScript a Python
        codigoPY = codigoPY.replace(/for\s*\((let|var|const)\s*(\w+)\s*=\s*(.*?);\s*(\w+)\s*(<=?|>=?|==|!=)\s*(.*?);\s*(\w+)\+\+\)\s*{([\s\S]*?)}/g, function (match, tipo, variable, inicio, varCond, operador, fin, incremento, bloque) {
            return `for ${variable} in range(${inicio}, ${fin}):\n    ${bloque.replace(/console\.log\((.*?)\);/g, 'print($1)')}\n`;
        });

        // Convertir bucles while de JavaScript a Python
        codigoPY = codigoPY.replace(/while\s*\((.*?)\)\s*{([\s\S]*?)}/g, function (match, condicion, cuerpo) {
            return `while ${condicion}:\n    ${cuerpo.replace(/console\.log\((.*?)\);/g, 'print($1)')}`;
        });

        // Convertir declaraciones let/const/var a variables de Python
        codigoPY = codigoPY.replace(/\b(let|var|const)\s+(\w+)\s*=\s*(.*?);/g, function (match, tipo, variable, valor) {
            return `${variable} = ${valor}`;
        });

        // Convertir el console.log() de JavaScript a print() de Python
        codigoPY = codigoPY.replace(/console\.log\((.*?)\);/g, function (match, valor) {
            return `print(${valor})`;
        });

        return codigoPY;
    }

    // Conversión de Python a JS (funciones, if-else, bucles for, while, arreglos)
    function convertirPYToJS(codigoPY) {
        let codigoJS = codigoPY;

        // Convertir funciones de Python a JS
        codigoJS = codigoJS.replace(/def\s+(\w+)\s*\((.*?)\)\s*:/g, function (match, nombreFuncion, parametros) {
            return `function ${nombreFuncion}(${parametros}) {`;
        });

        // Convertir los condicionales if-else de Python a JavaScript
        codigoJS = codigoJS.replace(/if\s+(.*?)\s*:/g, function (match, condicion) {
            return `if (${condicion}) {`;
        });
        codigoJS = codigoJS.replace(/else\s*:/g, function () {
            return `else {`;
        });

        // Convertir los bucles for de Python a JavaScript
        codigoJS = codigoJS.replace(/for\s+(\w+)\s+in\s+range\((\d+),\s*(\d+)\):/g, function (match, variable, inicio, fin) {
            return `for (let ${variable} = ${inicio}; ${variable} < ${fin}; ${variable}++) {`;
        });

        // Convertir los bucles while de Python a JavaScript
        codigoJS = codigoJS.replace(/while\s+(.*?)\s*:/g, function (match, condicion) {
            return `while (${condicion}) {`;
        });

        // Convertir las declaraciones de variables de Python a let/const/var de JS
        codigoJS = codigoJS.replace(/(\w+)\s*=\s*(.*?)/g, function (match, variable, valor) {
            // Si la variable no es un arreglo, asignar `let` a la variable
            if (!valor.includes('[')) {
                return `let ${variable} = ${valor}`;
            } else {
                return `${variable} = ${valor}`;  // Si es un arreglo, no agregamos `let`
            }
        });

        // Convertir print() de Python a console.log() de JS
        codigoJS = codigoJS.replace(/print\((.*?)\)/g, function (match, valor) {
            return `console.log(${valor});`;
        });

        return codigoJS;
    }

    // Evento para la conversión de JS a Python
    botonConvertirJS.addEventListener('click', function () {
        const codigoJS = entradaCodigoJSInput.value.trim();
        if (codigoJS === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Ingrese código',
                text: 'Por favor, ingrese código JavaScript antes de convertirlo.',
            });
            return;
        }
        const codigoPY = convertirJSToPython(codigoJS);
        salidaCodigoPython.textContent = codigoPY;
    });

    // Evento para la conversión de Python a JS
    botonConvertirPY.addEventListener('click', function () {
        const codigoPY = entradaCodigoPythonInput.value.trim();
        if (codigoPY === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Ingrese código',
                text: 'Por favor, ingrese código Python antes de convertirlo.',
            });
            return;
        }
        const codigoJS = convertirPYToJS(codigoPY);
        salidaCodigoJSFromPY.textContent = codigoJS;
    });

    // Función para copiar al portapapeles
    function copiarAlPortapapeles(codigo) {
        navigator.clipboard.writeText(codigo).then(function () {
            Swal.fire({
                icon: 'success',
                title: '¡Código copiado!',
                text: 'El código ha sido copiado al portapapeles.',
            });
        }, function (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al copiar el código.',
            });
        });
    }

    // Evento de copiar JS a portapapeles
    botonCopiarJS.addEventListener('click', function () {
        const codigoJS = salidaCodigoPython.textContent.trim();
        if (codigoJS === '') {
            Swal.fire({
                icon: 'warning',
                title: 'No hay código',
                text: 'No hay código Python para copiar.',
            });
            return;
        }
        copiarAlPortapapeles(codigoJS);
    });

    // Evento de copiar Python a portapapeles
    botonCopiarPY.addEventListener('click', function () {
        const codigoPY = salidaCodigoJSFromPY.textContent.trim();
        if (codigoPY === '') {
            Swal.fire({
                icon: 'warning',
                title: 'No hay código',
                text: 'No hay código JS para copiar.',
            });
            return;
        }
        copiarAlPortapapeles(codigoPY);
    });

    // Limpiar entradas y salidas
    botonLimpiarJS.addEventListener('click', function () {
        entradaCodigoJSInput.value = '';
        salidaCodigoPython.textContent = '';
        Swal.fire({
            icon: 'info',
            title: '¡Limpiado!',
            text: 'El código JS y el resultado de Python han sido eliminados.',
        });
    });

    botonLimpiarPY.addEventListener('click', function () {
        entradaCodigoPythonInput.value = '';
        salidaCodigoJSFromPY.textContent = '';
        Swal.fire({
            icon: 'info',
            title: '¡Limpiado!',
            text: 'El código Python y el resultado de JS han sido eliminados.',
        });
    });
}); //alertas de cada boton con swetalert
