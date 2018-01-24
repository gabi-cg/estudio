// JavaScript Document
"use strict";

// constantes globales: nombres de los botones de navegacion
const home = "home";
const recibo = "recibo";
const reporte = "reporte";

// al terminar de cargar el html principal, cargo partial render de home
$(document).ready(function(){
  loadRender("./sections/homeSection.html");
})

// cada vez que elijo botón de navigation bar se carga su correspondiente render
$("#home").on("click",function() {loadRender("./sections/homeSection.html",home)});
$("#clase").on("click",function() {loadRender("./sections/clasesSection.html",clase)});
$("#contact").on("click",function() {loadRender("./sections/contactoSection.html",contacto)});
$("#insc").on("click",function() {loadRender("./sections/inscripcionSection.html",inscripcion)});

// fn Partial Render que obtiene html a cargar en un div agregando funcionalidad
function loadRender(link,solapa) {
  $.ajax({
      type:"GET",
      url: link,
      dataType: "html",
      success: function(data) {
        $("#partialRender").html(data);
        switch(solapa) { // debo agregar funcionalidad a las páginas que lo necesitan
          case clase: {
            setFuncionalidadClases();
            break;
          }
          case inscripcion: {
            getInscripciones(); //muestro info en tabla
            $("#saveInscripcion").on("click",function() {guardarInscripcion()});
            break;
          }
        }
      },
      error:function(jqxml, status, errorThrown){
        $("#partialRender").text("No se pudo cargar la página");
        console.log(errorThrown);
      }
    });
}

// fn que setea la funcionalidad de los botones de cada clase
function setFuncionalidadClases() {
  console.log("entramo a fn de clases");
  $("#baby").on("click", function() {loadHorarios("./horarios/hBaby.html");
  });

  $("#clasico").on("click", function() {loadHorarios("./horarios/hClasico.html");
  });

  $("#contemporaneo").on("click", function() {loadHorarios("./horarios/hContemporaneo.html");
  });

  $("#contorsion").on("click", function() {loadHorarios("./horarios/hContorsion.html");
  });

  $("#hiphop").on("click", function() {loadHorarios("./horarios/hHiphop.html");
  });

  $("#teatro").on("click", function() {loadHorarios("./horarios/hTeatro.html");
  });
}

// fn Partial Render que obtiene html a cargar en un div agregando funcionalidad
function loadHorarios(link) {
  $.ajax({
      type:"GET",
      url: link,
      dataType: "html",
      success: function(data) {
        $("#infoItem").html(data);
      },
      error:function(jqxml, status, errorThrown){
        $("#infoItem").text("No se pudo cargar la página");
        console.log(errorThrown);
      }
    });
}

//----------------------------------------------------------

// fn que obtiene los datos del servicio REST
function getInscripciones() {
  event.preventDefault();
  var grupo = 9;
  $.ajax({
     method: "GET",
     dataType: 'JSON',
     url: "http://web-unicen.herokuapp.com/api/group/" + grupo,
     success: function(infoRest){
       cargarTablaInsc(infoRest);
     },
     error:function(jqxml, status, errorThrown){
       console.log(errorThrown);
     }
  });
}

// fn que carga los datos de servicio REST en una tabla
function cargarTablaInsc(infoRest) {
  var html = "";
  for (var i = 0; i < infoRest.information.length; i++) {
    html += '<tr>';
    html += '<td>'+infoRest.information[i]['thing'].clase+'</td>';
    html += '<td>'+infoRest.information[i]['thing'].nombre+'</td>';
    html += '<td>'+infoRest.information[i]['thing'].email+'</td>';
    html += '<td><input class="btn btn-default borrar" type="button" value="eliminar"></input></td>'
    html += '</tr>';
  }
  $("#tablaInsc").html(html);
  var botonesEliminar = $(".borrar");
  for (var i = 0; i < botonesEliminar.length; i++) {
    asignarEliminar(i, infoRest.information[i]['_id']);
  }
}

//fn que asigna a cada boton eliminar el hash del item REST
function asignarEliminar(i, id){
  var boton = $(".borrar")[i];
  boton.onclick = function(){
    deleteInscripcion(id);
  }
}

// fn que guarda objeto JSON en servicio REST
function guardarInscripcion(){
  event.preventDefault();
  var grupo = 9;
  var informacion = {
    clase: $("#selectClase").val(),
    nombre: $("#alumno").val(),
    email: $("#email").val()
  };
  var info = {
    group: grupo,
    thing: informacion
  };
  if (grupo && informacion){
    $.ajax({
      method: "POST",
      dataType: 'JSON',
      data: JSON.stringify(info),
      contentType: "application/json; charset=utf-8",
      url: "http://web-unicen.herokuapp.com/api/create",
      success: function(resultData){
        console.log(resultData);
        getInscripciones(); // recarga la tabla
      },
      error:function(jqxml, status, errorThrown){
        console.log(errorThrown);
        alert("Error por favor intente mas tarde");
      }
    });
  }
}

function deleteInscripcion(item) {
  $.ajax({
    url:"http://web-unicen.herokuapp.com/api/delete/" + item,
    method:"DELETE",
    success: function(resultData){
      console.log(resultData);
      getInscripciones(); // recarga la tabla
    },
    error:function(jqxml, status, errorThrown){
      alert('Error! - ver log en consola');
      console.log(errorThrown);
    }
  });
}
