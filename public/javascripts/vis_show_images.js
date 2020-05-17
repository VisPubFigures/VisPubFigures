/*
 * @Author: Rui Li
 * @Date: 2020-02-22 22:37:33
 * @LastEditTime: 2020-05-16 23:42:32
 * @Description: 
 * @FilePath: /VisPubFigures/public/javascripts/vis_show_images.js
 */

//global variables
confDic = {
    'Vis': '#c0392b',
    'InfoVis': '#f39c12',
    'SciVis': '#2980b9',
    'VAST': '#8e44ad'
}

var unicycle;

/**
 * present the image in the page
 * @param imgData: the image dataset
 * @param showAnnotation: if show the value of sorted images
 * @param sortedKey: sorted column name
 * @param imgSize: the size of image
 * @param currentPage: current page
 */
function presentImg(imgData, showAnnotation, sortedKey = 0, imgSize = 1, currentPage) {

    d3.selectAll(".image-div").remove();
    d3.selectAll(".paper-div").remove();
    scrollTo(0, 0);

    //convert data to json format
    imgDataDic = {};
    imgData.forEach((d, i) => {
        let imgID = d['imageID'];
        imgDataDic[imgID] = d;
    });

    //set default height
    var img_size = 100;

    //show the images
    for (let i = 0; i < imgData.length; i++) {
        let img_thumburl = imgData[i].url;
        let imageID = imgData[i].imageID;
        let img_width = imgData[i].img_width;
        let img_height = imgData[i].img_height;
        let asp = img_width / img_height;  //aspect ratio
        let div_width = asp * img_size;
        let actual_width = div_width - 6;
        let conf = imgData[i]['Conference'];
        var sorted_score = null;
        if (showAnnotation == 1) {
            sorted_score = parseFloat(data[i].score).toFixed(2);
        }
        var image_div = document.createElement("div");
        image_div.className = "image-div";
        //box-shadow: inset 0px 0px 0px 1px ${confDic[conf]};
        image_div.innerHTML = `
        <div class="img-panel image-grid" id="img-grid-${imageID}" 
        style="border: solid 3px ${confDic[conf]}; width:${div_width}px; ">
            <div class="image-a" id="thumb${i}">
                <img class="vis-img" id="img-thumb-${imageID}" style="width:${actual_width}px; height:${img_size - 6}px" src = ${img_thumburl} alt="">
            </div>
        </div>  
        `;
        document.getElementById("image-gallery").appendChild(image_div);
    }

    //show the thumbnail
    var modal = document.getElementById('myModal');
    var modalImg = document.getElementById("ori-img");
    var paper_info = document.getElementById("paper-info");
    var author_info = document.getElementById("author-info");
    var link_info = document.getElementById("link-info");
    var year_info = document.getElementById("year-info");
    var type_info = document.getElementById("paper-type-info");
    var keyword_info = document.getElementById("keyword-info");
    $('.image-a').click(function (e) {
        var id = this.id.slice(5);
        modal.style.display = "block";
        modalImg.src = imgData[id].url;
        paper_info.innerHTML = imgData[id]['Paper Title'];
        author_info.innerHTML = imgData[id]['Author'];
        link_info.href = imgData[id]['paper_url'];
        link_info.innerHTML = imgData[id]['paper_url'];
        year_info.innerHTML = imgData[id]['Year'];
        type_info.innerHTML = imgData[id]['Paper type'];
        keyword_info.innerHTML = imgData[id]['Keywords Author'];
    });

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }




    // Change the image size as the range slider changes
    $(document).on('input', '#image-size-slider', function () {
        let size = $(this).val() * 4;
        $(".img-panel").css("height", size + 'px');
        $(".img-panel").each(function () {
            //according to the id to determine the width of the div and the image
            let divID = $(this).attr("id");
            let imageID = $(this).attr("id").slice(9);
            let img_width = imgDataDic[imageID].img_width;
            let img_height = imgDataDic[imageID].img_height;
            let asp = img_width / img_height;  //aspect ratio
            let adjust_width = asp * size;
            let actual_width = adjust_width - 6;
            let actual_height = size - 6;
            $("#" + divID).css("width", adjust_width + 'px');
            $("#img-thumb-" + imageID).css("width", actual_width + 'px');
            $("#img-thumb-" + imageID).css("height", actual_height + 'px');
        });

    });
    //show year scent
    showYearScent();

    $(window).resize(function () {
        showYearScent();
    });

}


/**
 * show paper data
 * @param {} paperData 
 */
function presentUPPapers(paperData, totalCount) {
    d3.selectAll(".paper-div").remove();
    d3.selectAll(".image-div").remove();
    $('#totalPageText').text(totalCount + ' papers in total');

    scrollTo(0, 0);

    //convert data to json format
    imgDataDic = {};
    paperData.forEach((d, i) => {
        //console.log(d);
        let figures = d['Figures'];
        figures.forEach((image, j) => {
            let imgID = image['imageID'];
            imgDataDic[imgID] = image;
        })
    });

    //set default height
    var img_size = 100;

    for (let paperIndex = 0; paperIndex < paperData.length; paperIndex++) {
        let paperTitle = paperData[paperIndex]['Paper Title'];
        let keywords = paperData[paperIndex]['Keywords Author'];
        let paperUrl = paperData[paperIndex]['paper_url'];
        let author = paperData[paperIndex]['Author'];
        let paper_div_id = 'p-'+paperIndex;
        var paper_div = document.createElement("div");
        paper_div.className = "paper-div";
        
        paper_div.innerHTML = `
        <div class='paper-panel row' id=${paper_div_id}>
            <a href=${paperUrl} target="_blank" class='paperTitle'>${paperTitle}</a>
            <span class='paperAuthors'>${author}</span>
            <span class='paperKeywords'>Keywords: ${keywords}</span>
        </div>
        `;
        document.getElementById("image-gallery").appendChild(paper_div);
        let imgData = paperData[paperIndex]['Figures'];
        for (let i = 0; i < imgData.length; i++) {
            let img_thumburl = imgData[i].url;
            let imageID = imgData[i].imageID;
            let img_width = imgData[i].img_width;
            let img_height = imgData[i].img_height;
            let asp = img_width / img_height;  //aspect ratio
            let div_width = asp * img_size;
            let actual_width = div_width - 6;
            let conf = imgData[i]['Conference'];
            let image_div = document.createElement("div");
            image_div.className = "image-div";
            //box-shadow: inset 0px 0px 0px 1px ${confDic[conf]};
            image_div.innerHTML = `
            <div class="img-panel image-grid" id="img-grid-${imageID}" 
            style="border: solid 3px ${confDic[conf]}; width:${div_width}px; ">
                <div class="image-a" id="thumb${i}">
                    <img class="vis-img" id="img-thumb-${imageID}" style="width:${actual_width}px; height:${img_size - 6}px" src = ${img_thumburl} alt="">
                </div>
            </div>  
            `;
            //console.log("p-"+paperIndex);
            document.getElementById("p-"+paperIndex).appendChild(image_div);
        }
    }

    // Change the image size as the range slider changes
    $(document).on('input', '#image-size-slider', function () {
        let size = $(this).val() * 4;
        $(".img-panel").css("height", size + 'px');
        $(".img-panel").each(function () {
            //according to the id to determine the width of the div and the image
            let divID = $(this).attr("id");
            let imageID = $(this).attr("id").slice(9);
            let img_width = imgDataDic[imageID].img_width;
            let img_height = imgDataDic[imageID].img_height;
            let asp = img_width / img_height;  //aspect ratio
            let adjust_width = asp * size;
            let actual_width = adjust_width - 6;
            let actual_height = size - 6;
            $("#" + divID).css("width", adjust_width + 'px');
            $("#img-thumb-" + imageID).css("width", actual_width + 'px');
            $("#img-thumb-" + imageID).css("height", actual_height + 'px');
        });

    });

    //show the thumbnail
    var modal = document.getElementById('myModal');
    var modalImg = document.getElementById("ori-img");
    var paper_info = document.getElementById("paper-info");
    var author_info = document.getElementById("author-info");
    var link_info = document.getElementById("link-info");
    var year_info = document.getElementById("year-info");
    var type_info = document.getElementById("paper-type-info");
    var keyword_info = document.getElementById("keyword-info");
    $('.vis-img').click(function (e) {
        var id = this.id.slice(10);
        modal.style.display = "block";
        modalImg.src = imgDataDic[id].url;
        paper_info.innerHTML = imgDataDic[id]['Paper Title'];
        author_info.innerHTML = imgDataDic[id]['Author'];
        link_info.href = imgDataDic[id]['paper_url'];
        link_info.innerHTML = imgDataDic[id]['paper_url'];
        year_info.innerHTML = imgDataDic[id]['Year'];
        type_info.innerHTML = imgDataDic[id]['Paper type'];
        keyword_info.innerHTML = imgDataDic[id]['Keywords Author'];
    });

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    //show year scent
    showYearScent();

    $(window).resize(function () {
        showYearScent();
    });
    

}

function showYearScent() {
    //Add scent to the page navigator
    if (ifAllImage == 1) {

        d3.selectAll('.year-scent').remove();
        Object.keys(yearPageDic).forEach((d, i) => {
            let pageIndex = yearPageDic[d];
            if ($('#page-' + pageIndex).length > 0) {
                //get the position of the tag
                let pos_left = document.getElementById('page-' + pageIndex).getBoundingClientRect().x;
                let pos_top = document.getElementById('page-' + pageIndex).getBoundingClientRect().y - 30;
                let page_width = document.getElementById('page-' + pageIndex).getBoundingClientRect().width;
                //console.log(pageIndex, pos_left, pos_top, page_width);
                let html_text = `
                    <div class="year-scent-inner">
                        <label>${d}</label>
                    </div>
                `;
                var div = d3.select("body").append("div")
                    .attr('pointer-events', 'none')
                    .attr("class", "year-scent")
                    .style("opacity", 1)
                    .html(html_text)
                    .style("width", page_width + 'px')
                    .style("height", 30 + 'px')
                    .style("left", pos_left + 'px')
                    .style("top", pos_top + 'px');

            }
        });
    }
    else {
        d3.selectAll('.year-scent').remove();
    }
}







