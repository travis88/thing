$(document).ready(function () {
    if ($('.uc_input').length > 0) ucInput_init();
    
    //выбор стиля списка
    if ($('.uc_li_sel').length > 0) ucListSelect();
    if ($('.tables_settings').length > 0) ucTableSettings();//настройка таблица

    if ($('.btn_settings').length > 0) ucBtnSettings();//
    
    if ($('.on_element').length > 0) DisablElement();

    // Кнопка "Удалить" bg
    $('.uc_file_bg').find('.uc_preview_Del').click(function () {
        $('.uc_file_bg').find('input:file').removeClass('UnLook');
        $('.uc_file_bg').find('input:hidden').val('');
        $('.uc_file_bg .uc_preview').empty();

        return false;
    });

    //наличие радиокнопок с изображением
    if ($('.radio_img').length > 0) RadioImg();



    //// активация инпута
    //$('input.border_block').change(function () {     
    //    if ($(this).val() == '1') {
    //        $('input.border_bl_color').prop("disabled", true);
    //    }
    //    else {
    //        $('input.border_bl_color').prop("disabled", false);
    //    }
    //});
    

    //инициализаация TinyMCE
    $('textarea').each(function () {        
        if ($(this).attr("type") == "editor") {
            var Width = 0;
            var Height = 300;
            InitTinyMCE($(this).attr('id'), Width, Height, "/UserFiles/");
        }
        if ($(this).attr("type") == "liteeditor") {
            var Width = 0;
            var Height = 300;
            InitLiteTinyMCE($(this).attr('id'), Width, 300);
        }
        
    });
    //if ($('.uc_input.editor').length > 0) {
    //    $('.uc_input.editor').each(function () {
    //        var _width = $(this).attr('width');
    //        var _height = $(this).attr('height') ? $(this).attr('height') : 300;

    //        InitTinyMCE($(this).attr('id'), $(this).attr('width'), _height, $(this).attr('data-dir'));
    //    });
    //}
    //if ($('.uc_input.liteeditor').length > 0) {
    //    $('.uc_input.liteeditor').each(function () {
    //        var _width = $(this).attr('width') ? $(this).attr('width') : 600;
    //        var _height = $(this).attr('height') ? $(this).attr('height') : 250;

    //        InitLiteTinyMCE($(this).attr('id'), _width, _height, $(this).attr('data-dir'));
    //    });
    //}

    // Создаем события для блока "Помощь"
    //$('.icon-help-circled').click(function () { AddHelp($(this).parents('.uc_block')); });

    // Инициализация типовых текстовых полей
    //if ($('.uc_block.phone').length > 0) Add_ucPhone();
    //if ($('.uc_block.email').length > 0) Add_ucEmail();
    //if ($('.uc_block.date').length > 0 || $('.uc_block.datetime').length > 0) Add_ucData();
    //if ($('.uc_block.numeric').length > 0) Add_ucNum();
    //if ($('.uc_block.password').length > 0) Add_ucPass();

    // Инициализация селестов
    //if ($('.uc_select').length > 0) ucSelect_init();
    // Инициализация селестов
    //if ($('.uc_selectTree').length > 0) uc_selectTree_init();

    // Инициализация полей для выбора файлов
    if ($('.uc_fileupload').length > 0) ucFileUpload_Init();

    // Инициализация пользовательских сообщений
    //if ($('#msg_block').length > 0) msg_init();

    //Внеcение изьменений в элемент модели
    $(function () {
        $("select.changa").change(function () {
            var chVal = $(this).find('option:selected').val();            
            var chKey = $(this).attr("actkey");
            $("input[data-key=" + chKey + "]").val(chVal);
        });

        $(".inp_size,.tables_settings.change").change(function () {
            var chVal = $(this).val();
            var chKey = $(this).attr("actkey");
            $("input[data-key=" + chKey + "]").val(chVal);
        });
        $(".change").change(function () { ChangeSelElement($(this)) });
    });

   
})




function RadioImg() {
    $('.radio_img').each(function () {
        var _val = $(this).find('.radio_img_val').val();
        if (_val != "") {
            $(this).find('input[value=' + _val + '].radio_img_it').prop("checked", true).parent().addClass('radio_act');;
        }        
    });

    $('.radio_img input[type=radio]').change(function () {
        var name = $(this).attr('name');
        $("input[name=" + name + "]").parent().removeClass('radio_act');
        $("input[name=" + name + "]:checked").parent().addClass('radio_act');
        var _val = $("input[name=" + name + "]:checked").val();
        $(this).parent().parent().find('.radio_img_val').val(_val);
        
        //PrewRadioImg();
        //PrewShablonRadioImg();
    });

    PrewRadioImg();
    function PrewRadioImg() {
        var $Obj = $('#myModalTema').find('input:checked').parent();
        var Title = $Obj.find('span').text();
        var $Img = $Obj.find('img');
        $('#PreviewTema').empty();
        $('#PreviewTema').append(Title);
        
        $Img.clone().appendTo('#PreviewTema');
    }

    $('#myModalTema').on('hide.bs.modal', function () {
        PrewRadioImg();
    });

    PrewShablonRadioImg();
    function PrewShablonRadioImg() {
        var $Obj = $('#myModalShablon').find('input:checked').parent();
        var Title = $Obj.find('span').text();
        var $Img = $Obj.find('img');
        $('#PreviewShablon').empty();
        $('#PreviewShablon').append(Title);

        $Img.clone().appendTo('#PreviewShablon');
    }

    $('#myModalShablon').on('hide.bs.modal', function () {
        PrewShablonRadioImg();
    });
}

function DisablElement() {
    $('.on_element').each(function () {

        var DisId = $(this).attr("switch");
        var Status = $(this).val();
        SetStatusElem(DisId, Status);
    });


    //$('.on_element').val().change(alert("wv"));

    $('.on_element+div>button').click(function () {
        var DisId = $(this).parent().parent().find('.on_element').attr("switch");
        var Status = $(this).parent().parent().find('.on_element').val();
        SetStatusElem(DisId, Status);        
    });

    function SetStatusElem(DisId, Status) {
        $("[diselem='" + DisId + "']").each(function () {
            if (Status == '1') {
                $(this).prop("disabled", false);
            }
            else {
                $(this).prop("disabled", true);
            }            
        });        
    }
}

//Внезение изьменений в элемент модели
function ChangeSelElement(elem) {
    var chKey = elem.attr("actkey");
    var chVal = elem.val();
    $("input[data-key=" + chKey + "]").val(chVal);
}

function ChangeSelElementRadio(elem) {
    //$("[name='tab_set']")
    var RadioName = elem.attr("name");
    var ActElem = $("[name=" + RadioName + "]:checked");
    var chKey = $("[radiobutton=" + RadioName + "]").attr("actkey");//radiobutton
    var chVal = ActElem.val();
    $("input[data-key=" + chKey + "]").val(chVal);
}

// Инициализация текстовых полей
function ucInput_init() {
    $('.uc_input').each(function () {
        var ReadOnly = $(this).attr('readonly');
        var Important = $(this).attr('required');
        var Label = $(this).attr('title');
        var LabelCheck = $(this).attr('titlecheck');
        var LabelMeasure = $(this).attr('measure');
        var Type = $(this).attr('data-type');
        var Mask = $(this).attr('data-mask');
        var Help = $(this).attr('data-help');
        var TypeElem = $(this).attr('type');

        $(this).addClass('form-control').wrap('<div class="form-group"></div>');

        if (Label) { $(this).before('<label for="' + $(this).attr('id') + '">' + Label + ':</label>'); }
        

        if (Help && !ReadOnly) {
            $(this).wrap('<div class="input-group"></div>');
            $(this).after('<div class="input-group-addon"><div class="icon-help-circled" data-toggle="popover" data-placement="auto bottom" data-content="' + Help + '"></div></div>');

            $(this).next().find('div').popover();
        }
        var $This = $(this);
        if (TypeElem == "checkbox") {            
            var $btnGroup = $("<div/>", { 'class': 'btn-group btn-group-xs', 'data-toggle': 'buttons-radio' });
            var $btnYes = $("<button/>", { 'class': 'btn btn-default' }).append('Да');
            
            $btnYes.click(function () { change = 1; $This.attr('checked', 'true'); $btnNo.removeClass('active'); });

            var $btnNo = $("<button/>", { 'class': 'btn btn-default' }).append('Нет');
            $btnNo.click(function () { change = 1; $This.removeAttr('checked'); $btnYes.removeClass('active'); });

            if ($(this).attr('checked') == 'checked') $btnYes.addClass('active');
            else $btnNo.addClass('active');

            $btnGroup.append($btnYes).append($btnNo);
            $(this).after($btnGroup);
        }


        if (TypeElem == "label_checkbox") {
            $This.hide();
            var $btnGroup = $("<div/>", { 'class': 'btn-group', 'data-toggle': 'buttons-radio' });
            var $btnYes = $("<button/>", { 'class': 'btn btn-default' }).append('Да');

            $btnYes.click(function () { change = 1; $This.val('1'); $btnNo.removeClass('active'); if ($This.hasClass('border_block')) $('.border_bl_color').prop("disabled", false); $This.change(); });

            var $btnNo = $("<button/>", { 'class': 'btn btn-default' }).append('Нет');
            $btnNo.click(function () { change = 1; $This.val('0'); $btnYes.removeClass('active'); if ($This.hasClass('border_block')) $('.border_bl_color').prop("disabled", true); $This.change(); });

            if ($(this).val() == '1') $btnYes.addClass('active');
            else {
                $btnNo.addClass('active');
                if ($This.hasClass('border_block')) $('.border_bl_color').prop("disabled", true);
            }

            $btnGroup.append($btnYes).append($btnNo);
            $(this).after($btnGroup);
        }


        if (TypeElem == "sel_checkbox") {
            var SelTitle = $This.attr("selcheck");
            var $btnGroup = $("<div/>", { 'class': 'sel_checkbox btn-group btn-group-md' });
            var $btnElem = $("<div/>", { 'class': 'btn btn-default' }).append(SelTitle);            
            $btnGroup.append($btnElem);
            $(this).after($btnGroup);
            $This.hide();
            $This.parent().addClass("wr_sel_checkbox");
            $This.parent().parent().parent().addClass("wrap_sel");
            $This.parent().removeClass("form-group");
            Proverka();

            $btnElem.click(function () {
                if ($(this).hasClass("act")) {
                    $(this).removeClass("act");
                    $This.val(0);
                }
                else {
                    $(this).addClass("act");
                    $This.val(1);                    
                }
                Proverka();
                //$This.change();
                ChangeSelElement($This);
            });

            function Proverka() {
                var ActualZnach = $This.val();
                if (ActualZnach == 1) { $btnElem.addClass("act"); }
                else $btnElem.removeClass("act");
            }           

        }
        if (TypeElem == "color_sel"){            
            $This.removeClass('form-control');
            var ActualColor = $This.val();
            var $WrapBl = $("<div/>", { 'class': 'color_prev_wr'});
            var $InpColor = (" <input class='color_pick' type='color' name='favcolor' value='" + ActualColor + "'>");            
            var $PrevColor = $("<div/>", { 'class': 'color_prev', }).css({ 'background-color': ActualColor });
            $WrapBl.append($InpColor);
            $WrapBl.append($PrevColor);

            var NewElem = $This.after($WrapBl);
            $WrapBl.append($This);

            //if ($(this).val()=="") {
            //    $(this).val('#ffffff');
            //    $(this).parent().find('.color_prev').css('background-color', '#ffffff');
            //}

            $('.color_pick').change(function (e) {
                var NewColor = $(this).val();
                $(this).parent().find('.color_prev').css('background-color', NewColor);

                $(this).next().next().val(NewColor);
                //$This.change();
                ChangeSelElement($(this).next().next());
                //$This.val(NewColor);
            });

            $('.color_prev_wr input.changa').change(function (e) {
                var NewColor = $(this).val();
                $(this).parent().find('.color_prev').css('background-color', NewColor);
                ChangeSelElement($(this));
            });
            
        }
        if (TypeElem == "normal_checkbox") {
            $(this).removeClass('form-control');
            $(this).wrap("<label class='normal_check'></label>");//
            $(this).parent().parent().addClass('checkbox');
            $(this).parent().append(LabelCheck);
            $(this).attr("type", "checkbox");
            var selects = $(this).val();            
            if (selects == 1) {
                $(this).attr("checked", true);
            }

            $('.normal_check input:checkbox').change(function (e) {
                var $checkThis = $('.normal_check input:checkbox');
                if ($checkThis.prop('checked')) {
                    $checkThis.val(1);                 
                }
                else {
                    $checkThis.val(0);                 
                }
                //$This.change();
                ChangeSelElement($This)
            });

        }
        if (TypeElem == "font_size") {
            $(this).wrap("<label class='normal_check'></label>");
            $(this).addClass("inp_size");
            $(this).parent().append(LabelMeasure);
            $This.change();

            //допускаем только цифры
            $This.keypress(function(e){
                e = e || event;
                if (e.ctrlKey || e.altKey || e.metaKey) return;
                var chr = getChar(e);                
                if (chr == null) return;
                if (chr < '0' || chr > '9') {
                    return false;
                }
            });
            function getChar(event) {
                if (event.which == null) {
                    if (event.keyCode < 32) return null;
                    return String.fromCharCode(event.keyCode) // IE
                }
                if (event.which != 0 && event.charCode != 0) {
                    if (event.which < 32) return null;
                    return String.fromCharCode(event.which) // остальные
                }
                return null; // специальная клавиша
            }


        }
    });
}

function ucListSelect() {
    $('.uc_li_sel').each(function () {
        var $Elem = $(this);
        $Elem.hide();

        var ActuakVal = $Elem.val();
        $("[marker='" + ActuakVal + "']").addClass("act");

        var selElem = $Elem.parent().find('.sel_checkbox .act').attr("marker");

        $('.li_style_set .sel_checkbox div').click(function () {
            $(this).parent().find('div').removeClass('act');
            $(this).addClass('act');

            var SelEl = $(this).attr('marker');
            $Elem.val(SelEl);
            $Elem.change();
            ChangeSelElement($Elem);
        });
    });
}


function ucTableSettings() {
    $('.tables_settings').hide();
    var SelBorder = $('.tables_settings').val();
    
    $("[name='tab_set']").each(function () {
        if ($(this).val() == SelBorder) {
            $(this).attr('checked', true);
        }
    });

    //изьменение значение инпута при воборе другйо радиокнопки
    $("[name='tab_set']").change(function () {
        var SelElem = $("[name='tab_set']:checked").val();
        $('.tables_settings').val(SelElem);
        ChangeSelElementRadio($(this));
    });
}

function ucBtnSettings() {    
    $('.btn_settings').hide();
    var Sel = $('.btn_settings').val();

    $("[name='btn_set']").each(function () {
        if ($(this).val() == Sel) {
            $(this).attr('checked', true);

            ;
        }
    });

    //изьменение значение инпута при воборе другой радиокнопки
    $("[name='btn_set']").change(function () {
        var SelElem = $("[name='btn_set']:checked").val();
        $('.btn_settings').val(SelElem); tinymce.init
        ChangeSelElement($("[radiobutton='btn_set']"));
    });
}



// TinyMCE
function InitTinyMCE(id, _width, _height, directory) {
    tinymce.init({
        selector: "textarea#" + id,
        theme: "modern",
        add_unload_trigger: false,
        schema: "html5",
        plugins: [["anchor nonbreaking paste hr searchreplace  textcolor charmap  link autolink image media table visualblocks code fullscreen contextmenu iserv_media iserv_photo"]],
        toolbar: ' iserv_edit | iserv_photo iserv_media | undo redo | cut copy paste | fontsizeselect styleselect | bold italic underline superscript subscript | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | table | anchor link  image media | removeformat code ',
        contextmenu: "copy paste | link image",
        extended_valid_elements: "code",
        invalid_elements: "script,!--",
        convert_urls: false,
        relative_urls: false,
        image_advtab: true,
        cleanup: false,
        erify_html: false,
        statusbar: false,
        language: 'ru',
        menubar: false,
        verify_html: false,
        width: _width,
        height: _height,
        file_browser_callback: function (field_name, url, type, win) {
            var cmsURL = "";
            var _text = "http://" + window.location.hostname + ":" + window.location.port + "/FileManager/index?cmd=edit&path=" + directory;
            var video = "/admin/services/videolist";
            var photo = "/admin/services/photogallery";
            var iframe_id = "FileManager";

            switch (type) {
                case "iserv_media":
                    cmsURL = video;
                    var _link = $("<a/>", { 'title': 'Видеогалерея', 'href' : cmsURL});
                    //iframe_id = "video_manager";
                    PopUpFrame(_link);
                    break;
                case "iserv_photo":
                    cmsURL = photo;
                    var _link = $("<a/>", { 'title': 'Фотогалерея', 'href': cmsURL });
                    //iframe_id = "video_manager";
                    PopUpFrame(_link);
                    break;
                default: cmsURL = _text;
                    $('div#Canvas').after('<div id="Opacity"></div><iframe id="' + iframe_id + '" src="' + cmsURL + '">Ваш браузер не поддерживает плавающие фреймы!</iframe>');
                    break;
            }
            
            //$('div#Canvas').after('<div id="Opacity"></div><iframe id="' + iframe_id + '" src="' + cmsURL + '">Ваш браузер не поддерживает плавающие фреймы!</iframe>');
            $('iframe#FileManager').bind('load', function () { FileManagerLoad(field_name); });

            if (win.getImageData) win.getImageData();
        }
    });
}


// TinyMCE (Урезанная версия)
function InitLiteTinyMCE(id, _width, _height) {
    tinymce.init({
        selector: "textarea#" + id,
        theme: "modern",
        add_unload_trigger: false,
        schema: "html5",
        plugins: [["textcolor"]],
        toolbar: "fontsizeselect | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify",
        invalid_elements: "script,!--",
        convert_urls: false,
        relative_urls: false,
        image_advtab: true,
        cleanup: false,
        erify_html: false,
        statusbar: false,
        language: 'ru',
        width: _width,
        height: _height,
        menubar: false
    });
}

// Загружаем дополнительный контент с помощью AJAX
function AddContent(_ContentUrl, Object) {
    var Content = null;
    $.ajax({
        async: false,
        url: _ContentUrl,
        error: function () { Content = '<div>Error! This page is not found!</div>'; },
        success: function (data) {
            if (Object != "") { Content = $(data).find(Object); }
            else { Content = data; }
        }
    });
    return Content;
}

//  ------------------------- Old -----------------------
function Add_ucPhone() {
    $('.uc_block.phone input').keypress(
        function (key) {
            if (key.charCode == 32 || key.charCode == 40 || key.charCode == 41 || (key.charCode > 42 && key.charCode < 46) || (key.charCode > 47 && key.charCode < 60)) { }
            else { return false; }
        });
}
function Add_ucEmail() {
    $('.uc_block.email input').blur(function () {
        var emailMask = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        
        var value = $(this).val();
        if (!emailMask.test(value)) { $(this).addClass('error'); }
    });
}
function Add_ucData() {
    // Подключаем календарь
    $.getScript('http://web.it-serv.ru/js/plugins/jquery.ui.datepicker.js', function () {
        if ($('.uc_block.date').length > 0) {
            $('.uc_block.date input').datepicker({ onSelect: function (dateText, inst) { $(this).attr('value', dateText); } });
        }
        if ($('.uc_block.datetime').length > 0) {
            $('.uc_block.datetime input').datepicker({
                onSelect: function (dateText, inst) {
                    var d = new Date();
                    var Hours = (d.getHours() < 10) ? '0' + d.getHours() : d.getHours();
                    var Minutes = (d.getMinutes() < 10) ? '0' + d.getMinutes() : d.getMinutes();

                    $(this).val(dateText + " " + Hours + ":" + Minutes);
                }
            });
        }
    });
    // Подключаем маску
    if ($('.uc_block.date').length > 0) { Add_Mask($('.uc_block.date input'), '99.99.9999'); }
    if ($('.uc_block.datetime').length > 0) { Add_Mask($('.uc_block.datetime input'), '99.99.9999 99:99'); }
};
function Add_ucNum() {
    $('.uc_block.numeric input').keypress(function (key) {
        if (key.charCode < 44 || key.charCode > 57) return false;
    })
}
function Add_ucPass() { }

function Add_Mask(object, val) {
    $.getScript('/Content/plugins/jquery.maskedinput.js', function () { object.mask(val) })
}

// Блок "Помощь"
function AddHelp(Object) {
    var OpenHelp = $('.icon-help-circled.Active').parents('.uc_block');
    // закрываем все открытые блоки
    if (OpenHelp.length > 0 && Object.get(0) != OpenHelp.get(0)) {
        OpenHelp.find('.icon-help-circled').toggleClass("Active");
        OpenHelp.find('.uc_help').toggle(300);
    }

    // Открываем выбранный блок
    Object.find('.uc_help').toggle(300);
    // Помечаем выбранный блок как активный
    Object.find('.icon-help-circled').toggleClass("Active");
};

// Инициализация селестов
function ucSelect_init() {
    $('.uc_select').each(function () {
        var ReadOnly = ($(this).parent().attr('class').indexOf('readonly') > -1);
        var Important = ($(this).parent().attr('class').indexOf('importent') > -1);

        var $Select = $(this).find('select').css('display', 'none');
        // Создаем контейнер для отображения выбранных элементов
        var $Input = $("<div/>", { 'class': 'uc_Result' });
        // Создаем лист для представления списка записей
        var $List = $("<div/>", { 'class': 'uc_List' });
        // Определяем тип элемента
        var type = $Select.attr('multiple');
        if (type == 'multiple') { }
        else if ($Select.find('option:selected').length == 0) $Select.find('option:first').attr('selected', 'selected');

        var groups = {};
        $Select.find('option[data-group]').each(function () { groups[$.trim($(this).attr('option[data-group]'))] = true; });
        $.each(groups, function (c) {
            var $GroupItem = $("<div/>", { 'class': 'uc_ListGroup', 'data-group': c });
            $GroupItem.append(c);
            $List.append($GroupItem);
        });

        // Функция создает представление выбранного элемента в MltiSelect
        function addSelItem(title, value) {
            var $ResultItem = $("<div/>", { 'class': 'uc_ResultItem' });
            var $RItemClose = $("<div/>", { 'class': 'uc_ResultItemClose' });

            $ResultItem.click(function () { return false; });

            if (!ReadOnly) {
                $RItemClose.click(function () {
                    $Select.find('option[value="' + value + '"]').removeAttr('selected');
                    $List.find('div[data-value="' + value + '"]').removeClass('Sel');
                    $ResultItem.remove();
                    return false;
                });
                $ResultItem.append($RItemClose);
            }

            $ResultItem.append(title);
            $Input.append($ResultItem);
        }

        if (ReadOnly) {
            $Select.find('option:selected').each(function () {
                var key = $(this).text();
                var val = $(this).val();

                if (type == 'multiple') { addSelItem(key, val); }
                else { $Input.text(key); }
            });
            $Select.after($Input);
        }
        else {
            // Функция инициализации списка записей
            $Select.find('option').each(function () {
                var key = $(this).text();
                var val = $(this).val();
                var sel = $(this).attr('selected');
                var group = $(this).attr('data-group');

                // Добавляем запись в список
                var $Item = $("<div/>", { 'class': 'uc_ListItem', 'data-value': val });
                $Item.text(key);
                // Если запись отмечена как выбранная
                if (sel != null) {
                    $Item.addClass('Sel');
                    if (type == 'multiple') { addSelItem(key, val); }
                    else { $Input.text(key); }
                }

                $Item.click(function () {
                    if (type == 'multiple') { addSelItem($(this).text(), $(this).attr('data-value')); }
                    else {
                        $Select.find('option').removeAttr('selected');
                        $List.find('.uc_ListItem').removeClass('Sel');
                        $Input.empty().append($(this).text());
                    }
                    $Select.find('option[value="' + $(this).attr('data-value') + '"]').attr('selected', 'selected');

                    $Item.addClass('Sel');
                });

                if (group == null) $List.append($Item);
                else $List.find('div[data-group=' + group + ']').append($Item);
            });

            //  для вызова списка записей
            $Input.click(function () {
                $('body').unbind();

                $('.uc_List.Open').removeClass('Open').slideToggle(100).prev().removeClass('Open');
                $List.addClass('Open').slideToggle(100);
                $Input.addClass('Open');

                $('body').bind('click', function () { $List.removeClass('Open').slideToggle(100); $Input.removeClass('Open'); $(this).unbind() });
                return false;
            });
            // Добавляем Контейнер и Список на форму
            $Select.after($List).after($Input);
        }
    });
}
function uc_selectTree_init() {
    $('.uc_selectTree').each(function () {
        var $Tree = $(this).find('.uc_Tree');//.mCustomScrollbar().css('display', 'none');
        var $Input = $(this).find('.uc_Result');

        // Функция для визуального оформления выбранной записи
        function AddSelectItem() {
            $('.uc_selectTree .TreeLink').removeClass('Now');

            var val = $Input.prev().val();
            if (val != '') {
                var $SelectItem = $Tree.find('.treeUrl[href=' + val + ']');
                $SelectItem.parent().addClass('Now');
                $SelectItem.parents('.TreeBranch').prev().addClass('Now');

                $Input.empty().append($SelectItem.text());
            }
        }

        $Input.click(function () {
            var $BtnBlock = $("<div/>", { "id": "PopUpBtn" });
            var $Bg = $("<div/>", { "id": "Opacity" }).click(function () { $BtnBlock.remove(); $Bg.remove(); $Tree.toggle(); $('body').css('overflow-y', 'scroll'); });
            // Создаем кнопку "Выход без изменений"
            var $Back = $("<div/>", { "id": "uc_SaveBtn" }).append("Выйти без изменений").click(function () {
                AddSelectItem();

                $BtnBlock.remove();
                $Bg.remove();
                $Tree.toggle();
                $('body').css('overflow-y', 'scroll');
            });
            // Создаем кнопку "Выбрать"
            var $Save = $("<div/>", { "id": "PopUpClose" }).append("Выбрать").click(function () {
                var key = $Tree.find('.TreeLink.Now:last .treeUrl').text();
                var val = $Tree.find('.TreeLink.Now:last .treeUrl').attr('href');

                $(this).parents('.uc_selectTree').find('input').val(val);
                $Input.empty().append(key);

                $BtnBlock.remove();
                $Bg.remove();
                $Tree.toggle();
                $('body').css('overflow-y', 'scroll');
            });

            $('body').prepend($Bg).css('overflow-y','hidden');
            $BtnBlock.append($Save).append($Back);
            $Tree.append($BtnBlock);
            
            $Tree.toggle();
        });

        $Tree.find('.treeUrl').click(function () {
            var $Parent = $(this).parent().parent().parent();
            var key = $(this).text();
            var val = $(this).attr('href');

            if ($Parent.attr('class') == 'TreeBranch') $Parent.find('.TreeLink').removeClass('Now');
            else $('.uc_selectTree .TreeLink').removeClass('Now');

            $(this).parent().addClass('Now');

            return false;
        });
        $Tree.find('.treeIcon').unbind();

        AddSelectItem();
    })
}

// Инициализация полей для выбора файлов
function ucFileUpload_Init() {
    $('.uc_fileupload').each(function () {
        var $BlockTitle = $(this).find('.uc_title');
        var $ControlBlock = $(this).find('.uc_control');
        var $BlockPreview = $(this).find('.uc_preview');
        var $ResultInput = $(this).find('input[type=hidden]');

        // Разворачивает и сворачивает список файлов
        $BlockTitle.click(function () {
            var Class = $(this).parent().attr('class');

            $ControlBlock.slideToggle(
                function () {
                    if (Class.indexOf('Open') == -1) $(this).parent().addClass('Open');
                    else $(this).parent().removeClass('Open');
                });

            return false;
        });

        // Добавить файл при помощи кнопки
        $ControlBlock.find('input:file').change(function (e) {
            $(this).addClass('UnLook');
            $BlockPreview.empty();

            var File = $(this)[0].files[0];
            var FileName = File.name;
            var FileType = File.type;
            var FileSize = File.size;

            $ResultInput.val(FileName);

            var $PreviewBlock = $("<div/>", { 'class': 'uc_preview_item' });
            var $ImgBlock = $("<div/>", { 'class': 'uc_preview_img' });
            // если картинка
            if (FileType.indexOf('image') > -1) {
                var img = $("<img/>");
                img.attr('src', window.URL.createObjectURL(File));
                $ImgBlock.append(img);
            }
            else {
                $ImgBlock.append(File.substring(FileName.lastIndexOf(".") + 1));
            }
            $PreviewBlock.append($ImgBlock);

            var $InfoBlock = $("<div/>", { 'class': 'uc_preview_info' });
            $InfoBlock.append('<div class="uc_preview_name">' + FileName + '</div>');
            $InfoBlock.append('<div class="uc_preview_size">' + FileSize + '</div>');

            // Кнопка Удалить
            var $DelPreview = $("<div/>", { 'class': 'uc_preview_btn' }).append('удалить');
            $DelPreview.click(function () {
                $ControlBlock.find('input:file').removeClass('UnLook');
                $ResultInput.val('');
                $BlockPreview.empty();
            });

            $InfoBlock.append($DelPreview);
            $PreviewBlock.append($InfoBlock);
            $BlockPreview.append($PreviewBlock);
        });

        // Кнопка "Удалить"
        $(this).find('.uc_preview_Del').click(function () {
            $ControlBlock.find('input:file').removeClass('UnLook');
            $ResultInput.val('');
            $BlockPreview.empty();

            return false;
        });
    });
}

// Подгружаем значения в Select
function UC_SelectChenge(Object, ServiceUrl, Value) {
    $.getJSON(ServiceUrl + Value, function (Data) {
        $.each(Data, function (key, val) {
            var $Item = $("<div/>", { "data-value": val }).append(key);
            Object.append($Item);
        });
    })
        .done(function (data) { alert(ServiceUrl + Value); })
        .fail(function (err1, err2, err3) { alert('error') })
        .always(function () { });
}

// Инициализация пользовательских сообщений
function msg_init() {
    var $Massege = $('#msg_block');

    
    var $Msg = $("<div/>", { "id": "PopUpMassege", "class": $Massege.attr('class') });
    var $Bg = $("<div/>", { "id": "Opacity" });
    if ($Msg.find('#msg_close').attr("href") == "undefined") {
        $Bg.click(function () { $Bg.remove(); $Msg.remove(); })
    }
    else {
        
        $Bg.click(function () { top.location.href = $Msg.find('#msg_close').attr("href"); })
    }
    $('body').prepend($Bg);

    var msgTitle = $("<div/>", { "id": "msgTitle" }).append($Massege.attr('title'));
    var msgBody = $("<div/>", { "id": "msgBody" }).append($Massege.find('.msgText').text());
    var msgBtn = $("<div/>", { "id": "msgBtn" }).append($Massege.find('.msg_BtnBlock').html());

    msgBtn.find('#msg_close').addClass('ok').click(function () { $Bg.remove(); $Msg.remove(); });

    $Msg.append(msgTitle).append(msgBody).append(msgBtn);
    $Bg.after($Msg);
}

// Объявление событий для Файлового менеджера
function FileManagerLoad(getId) {
    var iframContent; //DOM содержащий содержимое iframe
    iframContent = $('iframe#FileManager').contents();

    // Создаем обработчик для кнопки "Выбрать файл"
    iframContent.find('#FM_BtnOk').bind('click', function () {
        $('#' + getId).val(iframContent.find('#DirNavigation').text().replace("~/", "/") + iframContent.find('#BackUrl').val());
        $('iframe#FileManager').remove();
        $('div#Opacity').remove();
    });

    // Создаем обработчик для кнопки "Отмена"
    iframContent.find('#FM_BtnCancel').bind('click', function () {
        $('iframe#FileManager').remove();
        $('div#Opacity').remove();
    });
};
