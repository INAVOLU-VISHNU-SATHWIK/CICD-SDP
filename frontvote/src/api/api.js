import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:2005/api", // backend base URL
});

// ✅ Function to set session (cookie)
export function setSession(sesname, sesvalue, expday) {
  let D = new Date();
  D.setTime(D.getTime() + expday * 86400000); // expday in days
  document.cookie = `${sesname}=${sesvalue};expires=${D.toUTCString()};path=/;secure`;
}

// ✅ Function to get session (cookie)
export function getSession(sesname) {
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookieData = decodedCookie.split(";");

  for (let c of cookieData) {
    let trimmed = c.trim(); // remove extra spaces
    if (trimmed.startsWith(sesname + "=")) {
      return trimmed.substring(sesname.length + 1);
    }
  }
  return "";
}

export default API;
