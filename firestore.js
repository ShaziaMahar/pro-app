const userDetails = document.querySelector(".userdetails")
const editsprofile = document.getElementById("editsprofile")
function createusercollection(user) {
  firebase.firestore()
    .collection("users")
    .doc(user.uid)
    .set({
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      phone: "",
      course: "",
      portfolioURL: "",
      gender: "",
    })
}
async function getuserinfoRealtime(userID) {
  if (userID) {
    const userdocRef = await firebase.firestore()
      .collection("users")
      .doc(userID)
    userdocRef.onSnapshot((doc) => {

      if (doc.exists) {
        const userinfo = doc.data()
        if (userinfo) {
          userDetails.innerHTML = `
            <h3 class="hello">${userinfo.name}</h3>
            <h3 class="hello">${userinfo.email}</h3>
            <h3 class="hello">${userinfo.phone}</h3>
            <h3 class="hello">${userinfo.specialty}</h3>
             <h3 class="hello">${userinfo.portfolioURL}</h3>
              <h3 class="hello">${userinfo.experience}</h3>
            `
          editsprofile["name"].value = userinfo.name
          editsprofile["profileEmail"].value = userinfo.email
          editsprofile["phone"].value = userinfo.phone
          editsprofile["specialty"].value = userinfo.specialty
          editsprofile["portfolioURL"].value = userinfo.portfolioURL
          editsprofile["experience"].value = userinfo.experience
          if (firebase.auth().currentUser.photoURL) {
            document.querySelector("#propic").src = firebase.auth().currentUser.photoURL
          }
        }
      }
    })
  } else {
    userDetails.innerHTML = `
            <h3>please login </h3>
            `
  }
}
function userupdate(e) {
  e.preventDefault()
  const userDocRef = firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid);
  userDocRef.update({
    name: editsprofile["name"].value,
    email: editsprofile["profileEmail"].value,
    phone: editsprofile["phone"].value,
    specialty: editsprofile["specialty"].value,
    portfolioURL: editsprofile["portfolioURL"].value,
    experience: editsprofile["experience"].value,
  })
}

function uploading(e) {
  const uid = firebase.auth().currentUser.uid;
  const fileRef = firebase.storage().ref().child(`/users/${uid}/profile`);
  const uploadTask = fileRef.put(e.target.files[0])


  uploadTask.on('state_changed',
    (snapshot) => {

      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      if (progress == `100`) alert("uploaded pic")

    },
    (error) => {
      console.log(error);
    },
    () => {

      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log('File available at', downloadURL);
        firebase.auth().currentUser.updateProfile({
          photoURL: downloadURL
        })
      });
    }
  );

} 