


window.addEventListener("load", function(e){

const side_nav_sign_in = document.getElementById("side_nav_sign_in")
side_nav_sign_in.addEventListener("click", myclip.signIn);

const create_clip_button = document.getElementById("create_clip_button");
create_clip_button.addEventListener("click", () => {
  create_clip_options
});

const create_clip_options_text =
    document.getElementById("create_clip_options_text");
const create_clip_options_file =
    document.getElementById("create_clip_options_file");
const create_clip_options_image =
    document.getElementById("create_clip_options_image");

create_clip_options_text.addEventListener("click", () => {
  myclip.addClipItem("asdfasdf");
});


const side_nav_list_folder =
    document.getElementById("side_nav_list_folder");
side_nav_list_folder.addEventListener("click", () => {
  myclip.listClipItem();
});

const side_nav_get_file =
    document.getElementById("side_nav_get_file");
side_nav_get_file.addEventListener("click", async () => {
  await myclip.getClipItem();
});

});
