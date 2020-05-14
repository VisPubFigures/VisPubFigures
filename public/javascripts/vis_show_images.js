/*
 * @Author: Rui Li
 * @Date: 2020-02-22 22:37:33
 * @LastEditTime: 2020-04-23 23:32:33
 * @Description: 
 * @FilePath: /VisAnnotation/Volumes/Dropbox/Dropbox/Project/Github_project/VisPubImg/static version/VisPubImg/public/javascripts/vis_show_images.js
 */
/**
 * @Description show images
 * @Author: Rui Li
 * @Date: 1/15/20
 */

//global variables
confDic = {
    'Vis':'#e74c3c',
    'InfoVis':'#3498db',
    'SciVis':'#f1c40f',
    'VAST':'#9b59b6'
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

    // $('#' + tag_name).css("border", "solid 1px #e67e22");
	// $('#' + tag_name).css("box-shadow", "inset 0px 0px 0px 1px #e67e22");

    //show the images
    for (let i = 0; i < imgData.length; i++) {
        var img_thumburl = imgData[i].thumb_url;
        var img_url = imgData[i].url;
        let conf = imgData[i]['Conference'];
        //var local_url = imgData[i].local_url;
        var sorted_score = null;
        if (showAnnotation == 1) {
            sorted_score = parseFloat(data[i].score).toFixed(2);
        }
        var image_div = document.createElement("div");
        image_div.className = "col-md-1 image-div";
        image_div.innerHTML = `
        <div class="card image-grid">
            <div class="panel-thumbnail img-panel" 
            style="border: solid 1px ${confDic[conf]}; box-shadow: inset 0px 0px 0px 1px ${confDic[conf]};">
                <div class="d-block mb-3  image-a" id="thumb${i}">
                    <img class="img-fluid img-thumbnial" src = ${img_thumburl} alt="">
                </div>
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


}