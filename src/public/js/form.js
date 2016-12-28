$(".selection").each(function () {
    $(this).attr("data-amount", $(this).children().length);
});

$(".selection .option").click(function () {
    if (!$(this).hasClass("active")) {
        $(this).addClass("active").siblings().removeClass("active");
    }
});

$("input[type=file]").change(function () {
    var name = $(this).attr("id");
    var preview = name + "-preview";
    var $img = $("#" + preview + " img");
    var reader = new FileReader();
    reader.onload = function (evt) {
        $img.attr("src", evt.target.result);
    }
    reader.readAsDataURL(this.files[0]);
});

function getSelectionVal(selector) {
    return $(selector + " .option.active").attr("value");
}

function setSelectionVal(selector, value) {
    $(selector + " .option[value=" + value + "]").addClass("active").siblings().removeClass("active");
}

function getFormResult(selector) {
    var result = {};
    var inputs = $(selector + " input");
    for (var i = 0; i < inputs.length; i++) {
        var item = inputs.eq(i);
        if (item.attr("type") == "file") {
            result[item.attr("id")] = $("#" + item.attr("id") + "-preview img").attr("src");
        }
        else {
            result[item.attr("id")] = item.val();
        }
    }
    var selections = $(selector + " .selection");
    for (var i = 0; i < selections.length; i++) {
        var item = selections.eq(i);
        result[item.attr("id")] = getSelectionVal("#" + item.attr("id"));
    }
    var textareas = $(selector + " textarea");
    for (var i = 0; i < textareas.length; i++) {
        var item = textareas.eq(i);
        result[item.attr("id")] = $("#" + item.attr("id")).val();
    }
    return result;
}
