/**
 * @Description search image by keywords
 * @Author: Rui Li
 * @Date: 01/16/2020
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
            keyword_list.push(keywords[j]);
        }
    }
    var uniq_keywords = [...new Set(keyword_list)];
    return uniq_keywords;
}

/**
 * return a subset of datasets based on the given keyword
 * @param keyword
 */
function filterDataByKeywords(keyword){
    var filterData = G_IMG_DATA.filter(function(item) {
        return item['Keywords Author'].includes(keyword);
    });
    return filterData;
}

