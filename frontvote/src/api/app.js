import API, { setSession } from "./api";

function signin() {
  const inputusername = document.getElementById("inputusername");
  const inputpassword = document.getElementById("inputpassword");
  const div1 = document.getElementById("div1");

  // Reset styles
  inputusername.style.border = "";
  inputpassword.style.border = "";
  div1.innerHTML = "";

  // Validation
  if (inputusername.value === "") {
    inputusername.style.border = "1px solid red";
    inputusername.focus();
    return;
  }
  if (inputpassword.value === "") {
    inputpassword.style.border = "1px solid red";
    inputpassword.focus();
    return;
  }

  // Data object
  const data = {
    email: inputusername.value,
    password: inputpassword.value,
  };

  // Call backend using Axios
  API.post("/users/signin", data)
    .then((res) => {
      signinResponse(res.data);
    })
    .catch((err) => {
      console.error("Signin error:", err);
      div1.innerHTML =
        "<br/><br/><label style='color:red'>Server error. Try again.</label>";
    });
}

function signinResponse(res) {
  const div1 = document.getElementById("div1");
  let rdata = res.split("::");

  if (rdata[0] === "200") {
    // Save JWT token in cookie
    setSession("csrid", rdata[1], 1);

    // Redirect to dashboard
    window.location.replace("/");
  } else {
    div1.innerHTML = `<br/><br/><label style="color:red">${rdata[1]}</label>`;
  }
}

export { signin };
