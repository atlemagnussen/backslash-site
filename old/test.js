const test = [
    {id: 1, text: "text1"},
    {id: 2, text: "text2"}
];
const fil = test.findIndex(f => f.id === 1);
console.log(fil);
const arr = {
    "string1": "1",
    "string2": "2"
};
console.log(arr.string2);

console.log(test.find((f) => {
    return f.id === 1;
}).text);
