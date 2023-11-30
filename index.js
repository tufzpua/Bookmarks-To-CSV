
var cheerio = require("cheerio"),
    fs = require("fs");

//Инициализируем переменные из .env
require('dotenv').config();

console.log ( process.env.ENV__PATH_FILE );

fs.writeFile( process.env.ENV__PATH_FILE + "bookmarks.cvs", "", (err) => {
    // если произошла ошибка, выбрасываем исключение
    if (err) throw err;
    // выводим сообщение об успешной записи
    console.log('Данные сохранены в файл');
    });

fs.readFile(  process.env.ENV__PATH_FILE + 'bookmarks.html', "utf-8", function read(err, data) {
    if (err) {
        throw err;
    }
 
    var $ = cheerio.load(data);
    $("a").each(function(index, a) {
        var $a = $(a);
        var title = $a.text();
        var url = $a.attr("href");
        var categories = getCategories($a);
        if ( process.env.ENV__DEBUG == true ) {
        console.log(title, url, categories);
        }
        
        fs.appendFileSync( process.env.ENV__PATH_FILE + "bookmarks.cvs", `\n\"${title}\"; \"${url}\" `);

    });

});
 
function getCategories($a) {
    var $node = $a.closest("DL").prev();
    var title = $node.text()
    if ($node.length > 0 && title.length > 0) {
        return [title].concat(getCategories($node));
    } else {
        return [];
    }
}

//[EOF]
