/*
 * @Author: Rui Li
 * @Date: 2020-01-16 12:03:29
 * @LastEditTime: 2020-05-24 21:18:11
 * @Description: 
 * @FilePath: /VisPubFigures/public/javascripts/image_filter.js
 */ 

/**
 * find all keywords
 * @param data
 */
function getAllKeywords(data){
    var keyword_list = [];
    for(let i = 0;i < data.length;i++){
        let keywords = data[i]["Keywords Author"].split(',');
        for(let j = 0; j < keywords.length; j++){
            keyword_list.push(keywords[j].toLowerCase());
        }
    }
    var uniq_keywords = [...new Set(keyword_list)];
    return uniq_keywords;
}


function getAllAuthors(data){
    var author_list = [];
    for(let i = 0;i < data.length;i++){
        let authors = data[i]["Author"].split(';');
        for(let j = 0; j < authors.length; j++){
            author_list.push(authors[j]);
        }
    }
    var uniq_authors = [...new Set(author_list)];
    return uniq_authors;
}

/**
 * return a subset of datasets based on the given keyword
 * @param keyword
 */
function filterDataByKeywords(data, keyword){
    var filterData = data.filter(function(item) {
        //console.log(item['Keywords Author']);
        return item['Keywords Author'].toLowerCase().includes(keyword);
    });
    return filterData;
}

/**
 * return a subset of datasets based on the given authors
 * @param {} data 
 * @param {*} author 
 */
function filterDataByAuthors(data, author){
    var filterData = data.filter(function(item) {
        return item['Author'].split(';').includes(author);
    });
    return filterData;
}


/**
 * return conference subset
 * @param {selected conferences} confs 
 */
function filterDataByConference(data, confs){
    var filterData = data.filter(function(item) {
        return confs.includes(item['Conference']);
    });
    return filterData;
}

/**
 * return image dataset with the year range
 * @param {*} minYear 
 * @param {*} maxYear 
 */
function filterDataByYear(data, minYear, maxYear){
    var filterData = data.filter(function(item) {
        return (minYear <= item['Year']) & (item['Year'] <= maxYear);
    });
    return filterData;
}