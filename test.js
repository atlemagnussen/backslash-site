const test = [
    {id: 1, text: "text1"},
    {id: 2, text: "text2"}
];
const fil = test.findIndex(f => f.id === 1);

console.log(fil);
console.log(test.find((f) => {
    return f.id === 1;
}).text);

