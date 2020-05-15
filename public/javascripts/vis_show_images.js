/*
 * @Author: Rui Li
 * @Date: 2020-02-22 22:37:33
 * @LastEditTime: 2020-05-14 21:14:20
 * @Description: 
 * @FilePath: /VisPubFigures/public/javascripts/vis_show_images.js
 */

//global variables
confDic = {
    'Vis': '#e74c3c',
    'InfoVis': '#3498db',
    'SciVis': '#f1c40f',
    'VAST': '#9b59b6'
}

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
    scrollTo(0, 0);

    //convert data to json format
    //to be finish
    imgDataDic = {};
    imgData.forEach((d, i) => {
        let imgID = d['imageID'];
        imgDataDic[imgID] = d;
    });
    //console.log(imgDataDic);

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
        let actual_width = div_width - 4;

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
        style="border: solid 2px ${confDic[conf]}; width:${div_width}px; ">
            <div class="image-a" id="thumb${i}">
                <img class="vis-img" id="img-thumb-${imageID}" style="width:${actual_width}px; height:${img_size - 4}px" src = ${img_thumburl} alt="">
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
            let actual_width = adjust_width - 4;
            let actual_height = size - 4;
            $("#"+divID).css("width", adjust_width + 'px');
            $("#img-thumb-"+imageID).css("width", actual_width + 'px');
            $("#img-thumb-"+imageID).css("height", actual_height + 'px');
        });

    });


}