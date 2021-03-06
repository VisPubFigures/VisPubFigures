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
var G_AUTHORS = null; //all authors
var ifAllImage = 1;  //if all image are presented
var visMode = 1; //1: image mode, 2: paper mode
var yearPageDic = {}; //store the page index of each year for images
var yearPageDicPaper = {};  //store the 
var currentKeywords = ''; //store the current keywords results
var currentYearRange = [1990, 2019]; //store the current year range
var currentConferences = ['Vis', 'SciVis', 'InfoVis', 'VAST'];
var currentFigures = ['Figure', 'Table'];
var currentAuthors = 'All';
var img_per_page = 200;
var paper_per_page = 20;


var pageUI = new Object();
var scentData = {'1990': 0,
'1991': 0,
'1992': 0,
'1993': 0,
'1994': 0,
'1995': 0,
'1996': 0,
'1997': 0,
'1998': 0,
'1999': 0,
'2000': 0,
'2001': 0,
'2002': 0,
'2003': 0,
'2004': 0,
'2005': 0,
'2006': 0,
'2007': 0,
'2008': 0,
'2009': 0,
'2010': 0,
'2011': 0,
'2012': 0,
'2013': 0,
'2014': 0,
'2015': 0,
'2016': 0,
'2017': 0,
'2018': 0,
'2019': 0 };
var scentDataArr = [];


$(document).ready(function () {
    if (ifDB == 0) {
        dbStart();
    }
    else {

    }
});


/**
 * init dataset
 * @returns {Promise<void>}
 */
async function dbStart() {

    // G_PAP_DATA = await d3.csv('public/dataset/paperData.csv');
    G_IMG_DATA = await d3.csv("public/dataset/vispubData30.csv");
    G_IMG_DATA = sortImageByYear(G_IMG_DATA);  //sort images by year, then sort by conference, the sort by first page.
    countImageByYear(G_IMG_DATA); //update image data

    //params of image numbers
    var img_count = G_IMG_DATA.length;
    var total_pages = Math.ceil(img_count / img_per_page);

    //group images to paper dataset
    G_PAP_DATA = extractPaperData(G_IMG_DATA);
    //console.log(G_PAP_DATA);

    //create the dictionary to store the scent information, i.e. 1990: 1, 1995: 5, year: pageIndex
    resetYearIndexDic(G_IMG_DATA);
    resetYearIndexDicPaper(G_PAP_DATA);

    //set up multi-page interface
    pageUI = new Page({
        id: 'pagination',
        pageTotal: total_pages, //total pages
        pageAmount: img_per_page,  //numbers of items per page
        dataTotal: img_count, //number of all items
        curPage: 1, //initial page number
        pageSize: 10, //how many papes divides
        showPageTotalFlag: true, //show data statistics
        showSkipInputFlag: true, //show skip
        getPage: function (page) {
            //get current page number
            let currentData = G_IMG_DATA.slice(img_per_page * (page - 1), img_per_page * page);
            presentImg(currentData, 0, 0, 1, 0);
        }
    });

    //present images
    if (visMode == 1) {
        ifAllImage = 1;
        var currentData = G_IMG_DATA.slice(img_per_page * 0, img_per_page * 1);
        presentImg(currentData, 0, 0, 1, 0);
    }
    else if (visMode == 2) {
        ifAllImage = 0;
        let img_count = G_PAP_DATA.length;
        let img_per_page = 20;
        let total_pages = Math.ceil(img_count / img_per_page);
        pageUI.pageTotal = total_pages;
        pageUI.pageAmount = img_per_page;
        pageUI.dataTotal = img_count;
        pageUI.getPage = function (page) {
            let currentData = G_PAP_DATA.slice(img_per_page * (page - 1), img_per_page * page);
            presentUPPapers(currentData, img_count);
        };
        pageUI.init();
        var currentData = G_PAP_DATA.slice(img_per_page * 0, img_per_page * 1);
        presentUPPapers(currentData, img_count);
    }


    //set up keywords
    G_KEYWORDS = getAllKeywords(G_IMG_DATA);
    autocomplete(document.getElementById("search-box"), G_KEYWORDS);

    //set up author filters
    G_AUTHORS = getAllAuthors(G_IMG_DATA);
    G_AUTHORS = G_AUTHORS.filter(function (el) {
        return el != "";
    });
    
    // G_AUTHORS = G_AUTHORS.sort((a, b) => {
    //     return a.toLowerCase().localeCompare(b.toLowerCase());
    // });
    G_AUTHORS = swapArrayString(G_AUTHORS);
    G_AUTHORS = G_AUTHORS.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    //console.log(G_AUTHORS);
    //swap authors
    
    var auth = d3.select('#authors');
    auth.selectAll("option")
        .data(G_AUTHORS)
        .enter().append('option')
        .attr('value', function (d) {
            return d
        })
        .text(function (d) { return d });

    $("#authors").selectpicker("refresh");
    //filter authors
    auth.on('change', function () {
        currentAuthors = this.options[this.selectedIndex].value;
        filterData();
    })


    //filter keywords
    $('#search-btn').unbind('click').click(function () {
    });
    $("#search-btn").click(function () {
        var keyword = $('#search-box').val();
        currentKeywords = keyword;
        filterData();
    });

    //filter conferences
    $('input[name="visOptions"]').unbind('click').click(function () {
    });
    $('input[name="visOptions"]').click(function () {
        let activeConf = [];
        if ($('#vis-check').prop("checked")) {
            $('#vis-check-label').css('background', '#c0392b');
            $('#vis-check-label').css('border', '0px');
            activeConf.push('Vis');
        }
        else {
            $('#vis-check-label').css('background', '#fff');
            $('#vis-check-label').css('border', '1px solid #95a5a6');
        }

        if ($('#scivis-check').prop("checked")) {
            $('#scivis-check-label').css('background', '#2980b9');
            $('#scivis-check-label').css('border', '0px');
            activeConf.push('SciVis');
        }
        else {
            $('#scivis-check-label').css('background', '#fff');
            $('#scivis-check-label').css('border', '1px solid #95a5a6');
        }

        if ($('#infovis-check').prop("checked")) {
            $('#infovis-check-label').css('background', '#f39c12');
            $('#infovis-check-label').css('border', '0px');
            activeConf.push('InfoVis');
        }
        else {
            $('#infovis-check-label').css('background', '#fff');
            $('#infovis-check-label').css('border', '1px solid #95a5a6');
        }

        if ($('#vast-check').prop("checked")) {
            $('#vast-check-label').css('background', '#8e44ad');
            $('#vast-check-label').css('border', '0px');
            activeConf.push('VAST');
        }
        else {
            $('#vast-check-label').css('background', '#fff');
            $('#vast-check-label').css('border', '1px solid #95a5a6');
        }
        currentConferences = activeConf;
        filterData();
    });

    //filter conferences
    $('input[name="figureOptions"]').unbind('click').click(function () {
    });
    $('input[name="figureOptions"]').click(function () {
        let activeFigure = [];
        if ($('#figure-check').prop("checked")) {
            $('#figure-check-label').css('background', '#359bd7');
            $('#figure-check-label').css('border', '0px');
            activeFigure.push('Figure');
        }
        else {
            $('#figure-check-label').css('background', '#fff');
            $('#figure-check-label').css('border', '1px solid #95a5a6');
        }

        if ($('#table-check').prop("checked")) {
            $('#table-check-label').css('background', '#359bd7');
            $('#table-check-label').css('border', '0px');
            activeFigure.push('Table');
        }
        else {
            $('#table-check-label').css('background', '#fff');
            $('#table-check-label').css('border', '1px solid #95a5a6');
        }
        currentFigures = activeFigure;
        filterData();
    });

    //filter years
    function yearString(number) {
        return number.toString();
    }
    $(".js-range-slider").ionRangeSlider({
        type: "double",
        grid: true,
        min: '1990',
        max: '2019',
        step: 1,
        skin: "square",
        prettify: yearString,
        onChange: function (data) {

        },
        onFinish: function (data) {
            // fired on every range slider update
            let leftVal = data.from;
            let rightVal = data.to;
            currentYearRange[0] = leftVal;
            currentYearRange[1] = rightVal;
            filterData();
        },
    });


    //choose mode, image mode or paper mode
    $('#image-mode').unbind('click').click(function () {
    });
    $("#image-mode").click(function () {
        visMode = 1;
        ifAllImage = 1;
        $("#image-mode").css('border', 'solid 2px #333');
        $("#paper-mode").css('border', '0px');
        filterData();


    });
    $('#paper-mode').unbind('click').click(function () {
    });
    $("#paper-mode").click(function () {
        visMode = 2;
        ifAllImage = 0;
        $("#image-mode").css('border', '0px');
        $("#paper-mode").css('border', 'solid 2px #333');
        filterData();
    });

    //tooltip register
    $("#image-mode").tooltip();
    $("#paper-mode").tooltip();
    //$("#image-size-slider").tooltip();
}


/**
 * filter the data given current conditions
 */
function filterData() {
    console.log(currentYearRange, currentConferences, currentKeywords, currentAuthors, currentFigures);
    
    //1. filtering data by conference
    data = filterDataByConference(G_IMG_DATA, currentConferences);
    //2. filtering data by keywords, determine whether show year scent
    if (currentKeywords == '') {
        ifAllImage = 1;
    }
    else {
        ifAllImage = 0;
        data = filterDataByKeywords(data, currentKeywords);
    }
    //3. filtering data by authors
    if(currentAuthors == 'All'){
        ifAllImage = 1;
    }
    else{
        ifAllImage = 0;
        data = filterDataByAuthors(data, currentAuthors);
    }
    //4. filtering data by figure type (figure or table)
    data = filterDataByFigureType(data, currentFigures);

    //create the scent data
    countImageByYear(data);

    //4. filtering data by year
    let minYear = currentYearRange[0];
    let maxYear = currentYearRange[1];
    data = filterDataByYear(data, minYear, maxYear);

    console.log(data.length);
    

    var paperData = extractPaperData(data);

    //4. reset year index dictionary
    resetYearIndexDic(data);
    //5. update the interface
    if (visMode == 1) {
        var img_count = data.length;
        var total_pages = Math.ceil(img_count / img_per_page);

        pageUI.pageTotal = total_pages;
        pageUI.pageAmount = img_per_page;
        pageUI.dataTotal = img_count;
        pageUI.curPage = 1;
        pageUI.getPage = function (page) {
            let currentData = data.slice(img_per_page * (page - 1), img_per_page * page);
            presentImg(currentData, 0, 0, 1, 0);
        };
        pageUI.init();
        var currentData = data.slice(img_per_page * 0, img_per_page * 1);
        presentImg(currentData, 0, 0, 1, 0);
    }
    else if (visMode == 2) {
        ifAllImage = 0;
        let img_count = paperData.length;
        //paper_per_page = 20;
        let total_pages = Math.ceil(img_count / paper_per_page);
        pageUI.pageTotal = total_pages;
        pageUI.pageAmount = paper_per_page;
        pageUI.dataTotal = img_count;
        pageUI.curPage = 1;
        pageUI.getPage = function (page) {
            let currentData = paperData.slice(paper_per_page * (page - 1), paper_per_page * page);
            presentUPPapers(currentData, img_count);
        };
        pageUI.init();
        var currentData = paperData.slice(paper_per_page * 0, paper_per_page * 1);
        presentUPPapers(currentData, img_count);
    }

}

/**
 * count image numbers by year
 */
function countImageByYear(data){
    //console.log(scentData);
    //reset scent data
    Object.keys(scentData).forEach((d,i)=>{
        scentData[d] = 0;
    });
    data.forEach((d,i)=>{
        let year = d.Year;
        scentData[year] += 1;
    })
    let minYear = currentYearRange[0];
    let maxYear = currentYearRange[1];
    //console.log(minYear, maxYear);
    scentDataArr = [];
    Object.keys(scentData).forEach((d,i)=>{
        let subData = {};
        if(parseInt(d) >= minYear & parseInt(d) <= maxYear){
            subData['year'] = d;
            subData['val'] = scentData[d];
            subData['ifSelected'] = 1;
        }
        else{
            subData['year'] = d;
            subData['val'] = scentData[d];
            subData['ifSelected'] = 0;
        }
        scentDataArr.push(subData);
    });
    //console.log(scentDataArr);
}

/**
 * reset the year index pair for image dataset
 * @param {} data 
 */
function resetYearIndexDic(data) {
    let lastYear = -1;
    yearPageDic = {};
    data.forEach((d, i) => {
        if (d['Year'] != lastYear) {
            yearPageDic[d['Year']] = Math.floor(i / 204) + 1;
            lastYear = d['Year'];
        }
    });
}


function resetYearIndexDicPaper(data) {
    let lastYear = -1;
    yearPageDicPaper = {};
    data.forEach((d, i) => {
        if (d['Year'] != lastYear) {
            yearPageDicPaper[d['Year']] = Math.floor(i / 204) + 1;
            lastYear = d['Year'];
        }
    });
}


/**
 * sort images by year
 * @param {} arr 
 */
function sortImageByYear(arr) {
    arr.sort(function (a, b) {
        let imageIDA = a.recodeRank;
        let imageIDB = b.recodeRank;
        return imageIDA - imageIDB;
    });
    return arr;
}


/**
 * group image data into 2D array, where axis = 0 is the paper, axis = 1 correspond to the images
 * @param {} imgData 
 */
function extractPaperData(imgData) {

    //console.log(imgData);

    var paperData = [];
    var paperDic = {};

    imgData.forEach((d, i) => {
        let paperTitle = d['Paper Title'];
        if (paperTitle in paperDic) {
            // if (d['isUP'] == 1) {
                
            // }
            paperDic[paperTitle]['Figures'].push(d);
        }
        else {
            let subDataDic = {}; //store the paper information
            subDataDic['Paper Title'] = d['Paper Title'];
            subDataDic['Conference'] = d['Conference'];
            subDataDic['Keywords Author'] = d['Keywords Author'];
            subDataDic['Paper DOI'] = d['Paper DOI'];
            subDataDic['Paper FirstPage'] = d['Paper FirstPage'];
            subDataDic['Paper LastPage'] = d['Paper LastPage'];
            subDataDic['Paper type'] = d['Paper type'];
            subDataDic['Year'] = d['Year'];
            subDataDic['isUP'] = d['isUP'];
            subDataDic['Author'] = d['Author'];
            subDataDic['paper_url'] = d['paper_url'];
            subDataDic['Figures'] = [d];
            // if (d['isUP'] == 1) {
                
            // }
            paperDic[paperTitle] = subDataDic;
        }
    });

    Object.keys(paperDic).forEach((d, i) => {
        paperData.push(paperDic[d]);
    });

    return paperData;

}






