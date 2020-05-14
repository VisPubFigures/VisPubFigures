/**
* @Description The global control of the system
* @Author: Rui Li
* @Date: 9/10/19
*/

//global variables
var ifDB = 0; //if use database
var G_PAP_DATA = new Object(); // paper dataset
var G_IMG_DATA = new Object(); // image dataset
var G_KEYWORDS = null;

var pageUI = new Object();

$(document).ready(function () {
    if(ifDB == 0){
        dbStart();
    }
    else{

    }
});


/**
 * init dataset
 * @returns {Promise<void>}
 */
async function dbStart() {

    // G_PAP_DATA = await d3.csv('public/dataset/paperData.csv');
    G_IMG_DATA = await d3.csv("public/dataset/vispubData.csv");

    var currentData = G_IMG_DATA.slice(0, 10);
    //params of image numbers
    var img_count = G_IMG_DATA.length;
    var img_per_page = 204;
    var total_pages = Math.ceil(img_count / img_per_page);

    pageUI = new Page({
        id: 'pagination',
        pageTotal: total_pages, //total pages
        pageAmount: img_per_page,  //numbers of items per page
        dataTotal: img_count, //number of all items
        curPage:1, //initial page number
        pageSize: 10, //how many papes divides
        showPageTotalFlag:true, //show data statistics
        showSkipInputFlag:true, //show skip
        getPage: function (page) {
            //get current page number
            let currentData = G_IMG_DATA.slice(img_per_page*(page-1),img_per_page*page);
            presentImg(currentData, 0, 0, 1, 0);
        }
    });

    G_KEYWORDS = getAllKeywords(G_IMG_DATA);
    autocomplete(document.getElementById("search-box"), G_KEYWORDS);

    var currentData = G_IMG_DATA.slice(img_per_page*0, img_per_page*1);
    presentImg(currentData, 0, 0, 1, 0);

    //search event
    $('#search-btn').unbind('click').click(function () {
    });
    $("#search-btn").click(function () {
        var keyword = $('#search-box').val();
        keywordSearch(keyword);
    });


}

/**
 * refresh results based on the keyword search
 * @param keyword
 */
function keywordSearch(keyword) {

    var keywordData = filterDataByKeywords(keyword);
    console.log(keywordData);

    var img_count = keywordData.length;
    var img_per_page = 200;
    var total_pages = Math.ceil(img_count / img_per_page);

    pageUI.pageTotal = total_pages;
    pageUI.pageAmount = img_per_page;
    pageUI.dataTotal = img_count;
    pageUI.getPage = function(page){
        let currentData = keywordData.slice(img_per_page*(page-1),img_per_page*page);
        presentImg(currentData, 0, 0, 1, 0);
    };
    pageUI.init();
    var currentData = keywordData.slice(img_per_page*0, img_per_page*1);
    presentImg(currentData, 0, 0, 1, 0);



}















