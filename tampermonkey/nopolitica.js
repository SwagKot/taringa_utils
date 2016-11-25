// ==UserScript==
// @name         No politica en T!
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Limpiar taringa de una vez
// @author       Gonzalolog
// @match        *.taringa.net/*
// @grant        none
// ==/UserScript==

//Filtros que nadie quiere
var filtros = ["Macri","Cristina","FPV","PRO","Cambiemos","Globoludos","Kuka","K ","Michetti","Elecciones","Vidal","Anibal","Tecnopolis","Lacri","dolar sube","Micheti"];

//Cuando se cargue la home, cargamos el script
$( document ).ready(function() {
    //En el caso muy raro en el que quieras ver los posts de politica, cree un boton el cual te permita intercalar entre solo ver los posts de politicas o los normales
    $(".tabs .content-right").append('<a href= "' + (window.location.hash == '#politica' ? '' : '#politica') + '" id="politicaBoton" class="btn a upload-button politica">' + (window.location.hash == '#politica' ? 'Normies' : 'Politica') + '!</a>');
    //Seleccionamos todos los elementos de titulos de los posts, asi hacemos un loop
    $(".list-l__title").contents().each(function(index){
        //Todos los posts pueden contener politica, por ende apuntamos a todos los posts como posible basura
        var canDelete = true;
        //Estamos en el hashtag de politica?
        var hashPolitica = window.location.hash == "#politica";
        //Hacemos un loop en cada filtro
        for(i=0;i < filtros.length; i++){
            //Estamos en la seccion politica?
            if(hashPolitica){
                //Este post tiene algun elemento de politica?
                if($(this).text().indexOf(filtros[i]) > -1){
                    //Como estamos en la seccion de politica, esta todo bien, asi que lo sacamos de la lista
                    canDelete = false;
                    break;
                }
                //Este post no tiene ninguna cosa de politica, por ende lo eliminamos
                if($(this).text().indexOf(filtros[i]) == -1){
                    canDelete = true;
                    break;
                }
            }else{
                //Este post tiene algo de politica?
                if($(this).text().indexOf(filtros[i]) > -1){
                    //Si, entonces cortamos la bocha, y como dijimos antes, de que TODO puede tener basura, le cortamos la bocha a este post para que despues se borre
                    break;
                }else{
                    //No tiene politica, AH, pero no con estre filtro, probemos con el que viene
                    canDelete = false;
                }
            }
        }
        //Si nunca cancelamos tal borrado, entonces eliminamos el bizabuelo del titulo
        //Post -> Selector de post -> Contenedor de titulo -> Titulo
        if(canDelete)
            $(this).parent().parent().parent().remove();
  });
});

//Creamos la funcion del boton que fuerce que se recarguen todos los posts
$( "#politicaBoton" ).click(function() {
  window.location.reload();
});
