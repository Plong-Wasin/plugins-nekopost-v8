let splitUrl = window.location.href.split("/");
let nc_chapter_id, np_project_id, nc_chapter_no;
np_project_id = splitUrl[splitUrl.length - 2];
nc_chapter_no = splitUrl[splitUrl.length - 1];
const d = new Date();
let date = d.getFullYear() + ((parseInt(d.getMonth()) + 1) >= 10 ? (parseInt(d.getMonth()) + 1) : '0' + (parseInt(d.getMonth()) + 1)) + ((parseInt(d.getDate())) >= 10 ? (parseInt(d.getDate())) : '0' + (parseInt(d.getDate()))) + ((parseInt(d.getHours())) >= 10 ? (parseInt(d.getHours())) : '0' + (parseInt(d.getHours()))) + ((parseInt(d.getMinutes())) >= 10 ? (parseInt(d.getMinutes())) : '0' + (parseInt(d.getMinutes())))
fetch(
        `https://tuner.nekopost.net/ApiTest/getProjectDetailFull/${np_project_id}`
    )
    .then((response) => response.json())
    .then((json) => {
        for (item of json.projectChapterList) {
            if (item.nc_chapter_no == nc_chapter_no) {
                nc_chapter_id = item.nc_chapter_id;
                break;
            }
        }
        fetch(
                `https://fs.nekopost.net/collectManga/${np_project_id}/${nc_chapter_id}/${np_project_id}_${nc_chapter_id}.json?${date}`
            )
            .then((response2) => response2.json())
            .then((json2) => {
                for (let i = 0; i < json2.pageItem.length; i++) {
                    document.querySelectorAll('img.svelte-14e4tz0')[i].src = `https://fs.nekopost.net/collectManga/${np_project_id}/${nc_chapter_id}/${json2.pageItem[i].fileName}`
                }

            });
    });