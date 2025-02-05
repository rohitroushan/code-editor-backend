var Grade;
var score = prompt("enter the marks");
if (score >= 90 && score <= 100) {
    Grade = "A";
}
else if (score >= 70 && score <= 89) {
    Grade = "B";
}
else if (score >= 60 && score <= 69) {
    Grade = "C";
}
else if (score >= 50 && score <= 59) {
    Grade = "D";
}
else if (score >= 0 && score <= 49) {
    Grade = "E";
}
else {
    Grade = "invalid data";
}
console.log(Grade);
