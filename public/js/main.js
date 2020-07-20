//review images before update
$(document).ready(function () {
  let imagesPreview = function (input, placeToInsertImagePreview) {
    if (input.files) {
      let filesAmount = input.files.length;
      for (i = 0; i < filesAmount; i++) {
        let reader = new FileReader();
        reader.onload = function (event) {
          $($.parseHTML("<img>"))
            .attr("src", event.target.result)
            .attr("width", "150px")
            .attr("style", "margin-right: 10px")
            .appendTo(placeToInsertImagePreview);
        };
        reader.readAsDataURL(input.files[i]);
      }
    }
  };
  $("#image").on("change", function () {
    imagesPreview(this, "div.preview-images");
  });
});

// ==============================================================
// Auto select left navbar
// ==============================================================
$(function () {
  var url = window.location;
  var element = $("ul#sidebarnav a")
    .filter(function () {
      return this.href == url;
    })
    .addClass("active")
    .parent()
    .addClass("active");
  while (true) {
    if (element.is("li")) {
      element = element.parent().addClass("in").parent().addClass("active");
    } else {
      break;
    }
  }
});

//format currency
$(".currency").each(function () {
  var item = $(this).text();
  var num = Number(item).toLocaleString("en");

  if (Number(item) < 0) {
    num = num.replace("-", "");
    $(this).addClass("negMoney");
  } else {
    $(this).addClass("enMoney");
  }

  $(this).text(num);
});

//preloader
$(function () {
  $(".loader").fadeOut();
});
