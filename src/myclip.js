
import GDL from "./GoogleDriveLibrary.js";


(function(window){

var myclip = window["myclip"] = {
  signIn(){
    console.log("sign in");
    if(GDL.isSignedIn()){
      console.log("already signed in");
    } else{
      GDL.signIn();
      GDL.addSignInListener(signedIn => {
        console.log(`signedIn: ${signedIn}`);
      });
    }
  },
  addClipItem(data){
    GDL.uploadToAppFolder("b.txt", data);
  },
  async getClipItem(){
    console.log(await GDL.getFileAsText(
          "107wJ1MwKSe-lQa2iLNfEx0SCoM2DTELCh4lS0yGUwKit_U9c8g"));

  },
  removeClipItem(id){

  },
  listClipItem(){
    GDL.listAppFolder();
  }
};

})(window);
