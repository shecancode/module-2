document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

$(document).ready(function(){

    $("#edit-character-form").submit(function(e) {
      e.preventDefault();
      const firstname = $('edit-first').val();
      console.log(firstname);
      const editUserInfo = {};
      editUserInfo.firstname = $(".edit-first").val()
      editUserInfo.lastname = $(".edit-last").val()
      editUserInfo.email = $ (".edit-email").val();
      editUserInfo.password = $ (".edit-password").val();
      editUserInfo.zipcode = $(".edit-zipcode").val()
    
  })
})