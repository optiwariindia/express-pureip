const filterIP=require("./filterIP");



const xff =
  "2001:db8::abcd, ::ffff:172.18.0.1, 49.36.10.20, 49.36.10.20";

console.log(filterIP(xff));
