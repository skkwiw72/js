// Reading assets params 
var jsonHeader;
var jsonTitle;
var defaultTemplateHTML = '';
var finalTemplateHTML = '';

$(document).ready(function () {
  $.getJSON('assets/states.json', function (json) {
    jsonHeader = json['header'];
    jsonTitle = json['title'];

    $.each(jsonHeader, function (key, value) {
      $('#header').append($("<option></option>")
        .attr("value", value)
        .text(key));
    });

    $.each(jsonTitle, function (key, value) {
      $('#title').append($("<option></option>")
        .attr("value", value)
        .text(key));
    });
  });

  $('[data-toggle="tooltip"]').tooltip();

  // Toggle menu
  $("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    if ($("#wrapper").hasClass("toggled")) {
      $("#template-content").css("margin-left", "-250px");
      $("#toggle-button").attr("class", "mdi mdi-fullscreen");
    } else {
      $("#template-content").css("margin-left", "0px");
      $("#toggle-button").attr("class", "mdi mdi-fullscreen-exit");
    }
  });

  // Quill
  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': ['#717171', '#41b9bb', '#003A60', '#ea4943', '#f6a323', '#4990e2'] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    // [{ 'align': ['', 'center', 'right'] }],
    ['link', 'image']
  ];

  var quill = new Quill('#editor', {
    placeholder: 'Escribe el texto aqui',
    modules: {
      toolbar: toolbarOptions
    },
    theme: 'snow'
  });

  quill.on('text-change', function (delta, oldDelta, source) {
    if (source == 'user') {
      $('#frameHTML').contents().find('#template-text').html($(".ql-editor").html());
      $('#frameHTML').contents().find('#template-text p').css('margin-top', '-18px');
      $('#frameHTML').contents().find('#template-text').find("img").css('max-width', '500px');
      $('#frameHTML').contents().find('#template-text').find("a").css('color', '#42B9BA');
      $('#frameHTML').contents().find('#template-text').find("a").attr('target', '_blank');
    }
  });

  // HTML template
  $(function () {
    document.getElementById("template-content").innerHTML = '<iframe id="frameHTML" src="./templates/default.html" width="100%" height="100%" frameborder="0" />';
  });

  // Change image header
$('#header-upload').change(function () {
  var file = this.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      // Establecer la cadena específica en lugar de la URL de datos
      var imgSrc = "cid:header";
      $('#frameHTML').contents().find('#template-img-header').attr("src", imgSrc);
      // Capturar el texto alternativo ingresado y asignarlo como atributo "alt" del encabezado
      var altHeaderText = $('#input-alt-header').val();
      $('#frameHTML').contents().find('#template-img-header').attr("alt", altHeaderText);
    }
    reader.readAsDataURL(file); // Leer el archivo como URL de datos
  }
});

// Change image title
$('#title-upload').change(function () {
  var file = this.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      // Establecer la cadena específica en lugar de la URL de datos
      var imgSrc = "cid:title";
      $('#frameHTML').contents().find('#template-img-title').attr("src", imgSrc);
      // Capturar el texto alternativo ingresado y asignarlo como atributo "alt" de la imagen titular
      var altTitleText = $('#input-alt-title').val();
      $('#frameHTML').contents().find('#template-img-title').attr("alt", altTitleText);
    }
    reader.readAsDataURL(file); // Leer el archivo como URL de datos
  }
});

  // Show/Hide Button
  $("#action-button").click(function (e) {
    if ($(this).is(':checked')) {
      $("#frameHTML").contents().find('#template-button').fadeIn();
      $('#button-info').fadeIn();
    } else {
      $("#frameHTML").contents().find('#template-button').fadeOut();
      $('#button-info').fadeOut();
    }
  });



  // Change button text
  $('#input-button').on('input', function (e) {
    console.log('1');
    if (this.value) {
      $("#frameHTML").contents().find('#template-text-link').text(this.value);
    } else
      $("#frameHTML").contents().find('#template-text-link').text('Não se esqueça do botão!');
  });

  // Change button link
  $('#input-link').on('input', function (e) {
    $("#frameHTML").contents().find('#template-button-link').attr("href", this.value);
    $("#frameHTML").contents().find('#template-button-text').attr("href", this.value);
    $("#frameHTML").contents().find('#template-text-link').attr("href", this.value);
  });

  // Change regards text
  $('#input-regards').on('input', function (e) {
    if (this.value)
      $("#frameHTML").contents().find('#template-regards').html('<br/><br/>' + this.value);
    else
      $("#frameHTML").contents().find('#template-regards').html('<br/><br/>Regards, Stéfano Girardelli ❤');
  })

  // Export file HTML
  function downloadInnerHTML (filename, elId, mimeType) {
    $('#frameHTML').contents().find('#template-button').css('margin-top', '20px');
    var elHtml = '<!DOCTYPE html>' + document.getElementById('frameHTML').contentWindow.document.getElementsByTagName(elId)[0].outerHTML;
    var link = document.createElement('a');
    mimeType = mimeType || 'text/plain';
    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
    link.click();
  }

  // Download button
  $('#download-button').click(function () {
    var filename = prompt("Escribe el nombre con el que quieres que sea guardado tu archivo:", "");
    if (filename != null) {
      downloadInnerHTML(filename + '.html', 'html', 'text/html');
      $.bootstrapGrowl("Your HTML file was downloaded with success!", { type: 'success', width: 350 });
    } else {
      $.bootstrapGrowl("Please, choose a filename to save", { type: 'danger', width: 350 });
    }
  });

$('#clipboard-button').click(function () {
    // Reemplazar completamente los atributos src en los elementos con data:image/png;base64
    $('#frameHTML').contents().find('[src^="data:image/png;base64"]').each(function () {
        var currentSrc = $(this).attr('src');
        // Reemplazar toda la cadena codificada en base64 con caracteres indefinidos
        var newSrc = 'cid:img' + ($(this).index() + 1) + 'REPLACE_WITH_YOUR_UNDEFINED_STRING';
        $(this).attr('src', newSrc);
    });

    // Ajustar el estilo CSS de los elementos p
    $('#frameHTML').contents().find('#template-text p').css('margin-top', '2px');

    // Obtener el HTML modificado
    var elHtml = '<!DOCTYPE html>' + document.getElementById('frameHTML').contentWindow.document.getElementsByTagName('html')[0].outerHTML;

    // Crear un elemento de entrada temporal y copiar el HTML al portapapeles
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(elHtml).select();
    document.execCommand("copy");
    $temp.remove();

    // Mostrar una notificación de éxito
    $.bootstrapGrowl("HTML generated with success!", { type: 'success', width: 350 });

    // Restaurar el estilo CSS de los elementos p
    $('#frameHTML').contents().find('#template-text p').css('margin-top', '-18px');
});


  $('#input-custom-text').on('input', function () {
  var customText = $(this).val();
  $("#frameHTML").contents().find('#template-custom-text').text(customText);
});







  

});
