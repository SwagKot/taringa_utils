// ==UserScript==
// @name         Taringa Shouts beta
// @namespace    http://taringa.net/gonzalolog
// @version      0.1
// @description  Agrega ciertas funciones utiles al nuevo sistema de "Shout" en taringa
// @author       Gonzalolog
// @match        http://www.taringa.net/*
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

//Esperamos que taringa cargue la pagina
$(document).ready(function(){

    //Verificamos si estamos en la pagina de shouts
    if(window.location.pathname == "/shouts"){

        //Saca en lo que es mi opinion ese tinte gris a blanco
        $("body").css("background","rgb(250,250,250)")

        //Buscamos entre todos los shouts
        $(".shout-item > .shout-heading").each( function( index, element ){

            //Buscamos el ID del autor del shout
            var id = $(this).children(".shout-user").children(".shout-user-info").children("a")[0].dataset.uid;
            //Agregamos el elemento que bloquea al usuario desde el MI ("Esto no necesariamente significa bloquear")
            $(this).children(".wrap-actions").children(".dropdown-primary").append("<li><div class='icon-seguir-post require-login shout-action-hide' data-uid='"+id+"'>Esconder shouts</div></li>");

            //Marcamos a este shout como ya personalizado, lo que significa que no tenemos que agregar de nuevo el supuesto menu
            $(this).attr('custom', '1');

        });

        //Limpiamos los shouts antes de comenzar
        actualizarShouts();
    } else{
        //Como no estamos en la pestaña shouts, posiblemente estemos en la de un usuario, lo cual nos permite desbloquearlo
        limpiarUsuario(window.location.pathname);
    }

    $(".nav-principal > ul").append("<li class=''><a href='/shouts' class='header-main__item'>Shouts <small>beta</small></a></li>");

});

var actualizar = false;

function actualizarShouts(id){

    var bloqueados = [];
    var actualizar = false;

    //Cargamos la lista de bloqueados
    var jstring = GM_getValue("shout_bloqueados","[]");
    bloqueados = JSON.parse(jstring);

    //Buscamos de nuevo por todos los shouts cargados
    $(".shout-item > .shout-heading").each( function( index, element ){
        var bl = $(this).children(".shout-user").children(".shout-user-info").children("a")[0].dataset.uid;

        //Si el autor de tal shout esta dentro de nuestros bloqueados, eliminamos el shout
        if($.inArray(bl,bloqueados) > -1){
            $(this).parent().remove();
        }

        //Este shout es nuevo? Entonces le damos el atributo custom
        if($(this).attr("custom") != 1){
            //Buscamos el ID del autor del shout
            var sid = $(this).children(".shout-user").children(".shout-user-info").children("a")[0].dataset.uid;
            //Agregamos el elemento que bloquea al usuario desde el MI ("Esto no necesariamente significa bloquear")
            $(this).children(".wrap-actions").children(".dropdown-primary").append("<li><div class='icon-seguir-post require-login shout-action-hide' data-uid='"+sid+"'>Esconder shouts</div></li>");

            $(this).attr('custom', '1');

            //Ya que actualizamos almenos un elemento, tendriamos que actualizar el script
            actualizar = true;
        }

    });

    if(actualizar){
        //Creamos la funcion que es activada al pulsar el elemento
        $(".shout-action-hide").click(function(e){

            //Conseguimos el ID del autor al cual vamos a bloquear
            var id = $(this).attr("data-uid");
            console.log("Bloqueado usuario con el id: "+id);

            //Cargamos la lista de personas bloqueadas que tenemos
            var bloqueados = JSON.parse(GM_getValue("shout_bloqueados","[]"));
            //Agregamos a nuestro autor a la lista de bloqueado

            var agregar = true;

            for (var i = 0; i < bloqueados.length; i++) {
                //No queremos tener 2 veces el autor bloqueado, por ende solo agregamos al autor si no lo habiamos hecho antes
                if(bloqueados[i]==id)
                    agregar = false;
            }

            if(agregar)
                bloqueados.push(id);

            //Convertimos la lista de bloqueados en una cadena string
            var jsonSave = JSON.stringify(bloqueados);
            //Guardamos la lista asi la podemos usar despues
            GM_setValue("shout_bloqueados",jsonSave);

            //Actualizamos los shouts
            actualizarShouts();

        });
    }

}

//Verificamos si estamos en la pagina de shouts
if(window.location.pathname == "/shouts"){
    //Creamos un reloj que cada 5 segundos va a verificar si tenemos autores bloqueados, por el momento no sabria si hay una manera mas simple
    //de poder eliminar shouts a medida que estos cargan
    setInterval(checkShouts, 2500);
}
function checkShouts() {
    actualizarShouts();
}

function limpiarUsuario(loc){

    //Este es el codigo HTML que vamos a introducir en el perfil para poder restaurar al usuario
    var htmlbutton = "<a class='btn v mostrar_shouts_btn' data-uid='"+$(".follow-buttons > a").attr("objid")+"'><div class='btn-text following-text'><i></i>Mostar shouts</div></a>";
    //Cargamos de nuevo la lista con usuarios bloqueados
    var bloqueados = JSON.parse(GM_getValue("shout_bloqueados","[]"));

    if($.inArray($(".follow-buttons > a").attr("objid"),bloqueados) != -1){
        //Y colocamos nuestro codigo
        $(".follow-buttons").append(htmlbutton);
    }
}

$(".mostrar_shouts_btn").click(function(e){
    //Conseguimos el ID del autor al cual vamos a DESBLOQUEAR
    var id = $(this).attr("data-uid");

    //Cargamos la lista de personas bloqueadas que tenemos
    var bloqueados = JSON.parse(GM_getValue("shout_bloqueados","[]"));

    //Verificamos cual elemento de nuestra lista contiene tal elemento y luego lo eliminamos
    var index = bloqueados.indexOf(id);

    //Si existe tal id, entonces...
    if(index > -1){
        //Eliminamos de nuestra lista de bloqueados el pequeño autor
        bloqueados.splice(index,1);

        //Convertimos la lista de bloqueados en una cadena string
        var jsonSave = JSON.stringify(bloqueados);
        //Guardamos la lista asi la podemos usar despues
        GM_setValue("shout_bloqueados",jsonSave);

        //Eliminamos el boton ya que no nos sirve
        $(this).remove();
    }
});

var nuevoActivo;
var active;

//Creamos el evento keydown, para recibir cuando y cuando no tocamos una tecla
$(document).keydown(function (e) {

    // Si la tecla no es J, K o L
    if (e.keyCode == 74 || e.keyCode == 75 || e.keyCode == 76 || e.keyCode == 82) {

        //Si no hay ninguno, el primero va a ser el activo
        if($('.shout-item.active').length === 0){
            $('.shout-item').first().addClass("active");
        }

        if(e.keyCode == 74 || e.keyCode == 75){
            // Buscamos el shout activo
            active = $(".shout-item.active").removeClass("active");
        }

        // Manejamos cuando presionamos J
        if (e.keyCode == 74) {
            nuevoActivo = active.next('.shout-item');
        }

        //Cuando presionamos K
        if (e.keyCode == 75) {
            nuevoActivo = active.prev('.shout-item');
        }

        //Cuando presionamos L
        if (e.keyCode == 76) {
            $(".shout-item.active > .secondary-actions > .list-main-actions > li").children("a")[2].click();
        }

        //Cuando presionamos R
        if (e.keyCode == 82) {
            $(".shout-item.active > .secondary-actions > .list-main-actions > li").children("a")[1].click();
        }

        //Si tal shout existe, hacemos scroll
        if (nuevoActivo !== undefined) {
            nuevoActivo.addClass('active');
            $(document).scrollTop(nuevoActivo.position().top+64);
        }

    }
});
