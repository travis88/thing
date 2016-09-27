$(document).ready(function () {
    // Переменные
    var FilesList;
    // Контейнеры
    var Navigation = $('div#FM_NavigationInput');
    var NavigationDir = $('div#DirNavigation');
    var NavigationFile = $('div#FileNavigation input:text');
    var DList = $('div#FM_DirList .Canvas');
    var FList = $('div#FM_FileList .Canvas');
    // Кнопки
    var Ok = $('div#FM_BtnOk');
    var Cancel = $('div#FM_BtnCancel');
    var Add_Folder = $('div#AddFolder');
    var Del_Folder = $('div#RemoveFolder');
    var Add_File = $('div#AddFile');
    var Del_File = $('div#RemoveFile');

    // Отменяем возможность выделения для всего документа
    $('body').bind({ selectstart: function () { return false; } });

    // Если пользователь вызвал менеджер не для выбора файла,
    // а для управления размещенными на сервере файлами, удаляем кнопку "Ок"
    if (top == self) { Ok.remove(); }

    Ok.click(function () { return false; });
    Cancel.click(function () {
        self.close();
        if (top == self) history.back();
        return false;
    });

    // Отслеживаем ввод текста в адресную строку
    NavigationFile.bind({
        keydown: function (e) {
            if (e.keyCode == 191 && $(this).val() != '') { DList.find('span[title="~' + GetPath() + '/"]').trigger('click'); }
            else if (e.keyCode == 191) { DList.find('div.MainDirectory > span').trigger('click'); }
        },
        keyup: function (e) {
            if (e.keyCode == 191) { $(this).val(''); }
            else { FList.find('.ItemTitle a[href="' + '..' + GetPath() + '"]').trigger('click'); }
        }
    });

    // Закрыть все открытые папки и показать содержимое корневой папки
    DList.find('div.MainDirectory > span').click(function () {
        DList.find('div.MainDirectory div.BulletedList').remove();
        $('div.Directory').removeClass('active');
        NavigationDir.empty().append($(this).attr('title'));
        NavigationFile.val('');
        MakeFileList($(this).attr('title'));
    });
    // Раскрывает каталог и показывает содержимое данной папки
    DList.find('div.Directory span').click(function () { Direct($(this)); });

    // Добавить каталог
    Add_Folder.click(function () {
        FList.find('div.SelectedFile').removeClass('SelectedFile');
        var NewFolder = $("<div/>", { "class": "Files_ListItem Directory SelectedFile" });
        NewFolder.append($("<div/>", { "class": "ItemSize" }));
        NewFolder.append($("<div/>", { "class": "ItemType" }).append('Папка с файлами'));
        NewFolder.append($("<div/>", { "class": "ItemDate" }));
        NewFolder.append($("<div/>", { "class": "ItemIcon" }).append($("<img/>", { "class": "folder", "src": "/img/_blank.gif" })));
        NewFolder.append($("<div/>", { "class": "ItemTitle" }).append($("<input/>", { "type": "text", "id": "FolderName", "value": "Новая папка" })));
        FList.find('div.ListHead').after(NewFolder);

        $('#FolderName').focus().bind({
            blur: function () {
                var DirPath = NavigationDir.text() + $(this).val() + "/";
                var PostUrl = "/Service/Files.ashx?action=insert&path=" + urlEncode(DirPath);
                var Status = AddContent(PostUrl);
                DList.find('span[title="' + NavigationDir.text() + '"]').trigger("click");

                if ($('div.Directory.active').length == 0) {
                    var NewDir = $('<div/>', { 'class': 'Directory' });
                    NewDir.append($("<span/>", { 'title': DirPath.toLowerCase() }).append($(this).val()));
                    NewDir.find('span').click(function () { Direct($(this)); });
                    DList.find('div.MainDirectory').append(NewDir);
                }
            },
            keydown: function (e) { if (e.keyCode == 13) { $(this).trigger('blur'); } }
        });
    });

    //  Удаляем выбранный каталог
    Del_Folder.click(function () {
        var Massege = 'Вы действительно хотите удалить папку ' + urlDecode(GetPath() + $('div.SelectedFile a').attr('href')) + ' ?';

        // Запрос для удаления
        var QueryString = '/Service/Files.ashx?action=delete&path=' + urlEncode(GetPath() + $('div.SelectedFile a').attr('href'));
        if (confirm(Massege)) {
            var Status = AddContent(QueryString);
            if ($('div.Directory.active').length == 0) { DList.find('span[title="~' + urlDecode($('div.SelectedFile a').attr('href')) + '"]').parent().remove(); };
            DList.find('span[title="' + NavigationDir.text() + '"]').trigger('click'); return;
        }
        else { return false; }
    });

    // Добавить файл при помощи кнопки
    Add_File.find('input:file').change(function (e) { FilesList = $(this)[0].files; UploadFiles(); });
    // Добавить файл пи помощи Drag & Drop 
    FList[0].ondragover = function () { return false; };
    FList[0].ondragleave = function () { return false; };
    FList[0].ondrop = function (e) { e.preventDefault(); FilesList = e.dataTransfer.files; UploadFiles(); return false; };

    // Удаляем выбранный файл
    Del_File.click(function () {
        var Massege = 'Вы действительно хотите удалить файл ' + urlDecode(GetPath()) + '?';
        // Запрос для удаления
        var QueryString = '/admin/Service/Files.ashx?action=delete&path=' + urlEncode(GetPath());
        if (confirm(Massege)) { var Status = AddContent(QueryString); DList.find('span[title="' + NavigationDir.text() + '"]').trigger("click"); return; }
        else { return false; }
    });

    // Функция, расскрытия директории
    function Direct(Object) {
        // Путь к каталогу, данные которого запрашивает пользователь
        var _DirPath = Object.attr('title');
        // Запрос для получения списка поддерикторий данного каталога
        var QueryString = '/FileManager/DirList.aspx?path=' + urlEncode(_DirPath);
        // Получаем список вложенных директорий данного каталога
        var _DirListContent = AddContent(QueryString, 'div.BulletedList');
        // Снимаем активность
        $('div.Directory').removeClass('active');
        // Если список директорий открыт, то закрываем его
        if (Object.parent().find('div.BulletedList').length > 0) { Object.parent().find('div.BulletedList').remove(); }
        // Добовляем какегории к карте
        _DirListContent.find('span').click(function () { Direct($(this)); });
        Object.parent().addClass('active').append(_DirListContent);
        // Вызываем функцию, для построения содержимого каталога
        MakeFileList(_DirPath);
        // Меняем путь в адресной строке
        NavigationDir.empty().append(_DirPath);
        NavigationFile.val('');
    };

    // Функция, показывает содержимое каталога
    function MakeFileList(DirPath) {
        // Запрос для получения списка файлов данного каталога
        var QueryString = '/FileManager/Index/FileList?path=' + urlEncode(DirPath);
        // Получаем список файлов данного каталога
        var _FileListContent = AddContent(QueryString, 'div.FileList');

        // Присваиваем папки обработчики событий
        _FileListContent.find('div.Files_ListItem').click(function () {
            FList.find('div.Files_ListItem').removeClass('SelectedFile');
            $(this).addClass('SelectedFile');
            NavigationFile.val(urlDecode($(this).find('a').attr('href').replace('../', '/').toLowerCase()));
            NavigationFile.attr('size', urlDecode($(this).find('a').attr('href').replace('../', '/').toLowerCase()).replace(GetDirPath(), '').length);
            Del_Folder.removeClass('disabled').addClass('disabled');
            Del_File.removeClass('disabled');
        });
        var timerId;
        _FileListContent.find('div.Files_ListItem.Directory').bind({
            click: function () {
                if (!timerId) timerId = setTimeout(function () { }, 500);
                NavigationFile.val('');
                Del_Folder.removeClass('disabled');
                Del_File.removeClass('disabled').addClass('disabled');
                return false;
            },  // Показываем содержимое директории
            dblclick: function () {
                clearTimeout(timerId);
                var title = urlDecode($(this).find('a').attr('href'));
                DList.find('div.Directory span[title="~' + title + '"]').trigger("click");
                return false;
            }
        });
        _FileListContent.find('div.Files_ListItem a').bind({
            click: function () { $(this).parent().trigger('click'); return false; },
            dblclick: function () { window.open($(this).attr('href'), '_blank'); return false; }
        });
        _FileListContent.find('div.Files_ListItem.Directory a').unbind().click(function () { $(this).parent().trigger('click'); return false; });

        Del_Folder.removeClass('disabled').addClass('disabled');
        Del_File.removeClass('disabled').addClass('disabled');
        // Меняем контент в блоке содержимого папки
        FList.empty().append(_FileListContent);
    };

    // Функция для отправки файлов на сервер
    function UploadFiles() {
        var data = new FormData();
        var PostUrl = "/Service/Files.ashx?action=insert&path=" + urlEncode(GetDirPath());

        for (var i = 0; i < FilesList.length; i++) { data.append(FilesList[i].name, FilesList[i]); }
        $.ajax({
            type: "POST",
            url: PostUrl,
            contentType: false,
            processData: false,
            data: data,
            success: function (result) { MakeFileList(GetDirPath()); },
            error: function () { if (FilesList.length = 1) alert("Ошибка. Файл не загружен"); else alert("Ошибка. Файлы не загружены"); }
        });
        FilesList = '';
    };

    // Получаем путь к какталогу в котором находимся (относительно корневого)
    function GetDirPath() { return NavigationDir.text().replace('~/', '/').toLowerCase(); };
    // Получаем имя выбранного файла
    function GetFileName() { return NavigationFile.val().toLowerCase(); }
    // Получаем путь из адресной строки
    function GetPath() { return (NavigationDir.text().replace('~/', '/') + NavigationFile.val()).toLowerCase(); }

    // Вызываем событие клика для корневого каталога, чтобы показать его содержимое
    DList.find('div.MainDirectory > span').trigger('click');
});



// Кодирование строки в UTF-8
function urlEncode(str) { return (str).replace('~/', '/').replace('../', '/').replace(/\+/g, '%20').replace(new RegExp("/", 'g'), '%2f'); }
// Декодирование строки из UTF-8 в windows-1251
function urlDecode(str) { return decodeURIComponent((str).replace('~/', '/').replace('../', '/').replace(/\+/g, '%20')); }

// Загружаем дополнительный контент с помощью AJAX
function AddContent(_ContentUrl, Object) {
    var Content = null;
    $.ajax({
        async: false,
        url: _ContentUrl,
        error: function () { Content = 'error'; },
        success: function (data) { Content = $(data).find(Object).removeAttr('id'); } });
    return Content;
};