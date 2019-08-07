const test = [
    {id: 1, text: "text1"},
    {id: 2, text: "text2"}
];
console.log(test.find((f) => {
    return f.id === 1;
}).text);
console.log(test.findIndex((f) => {
    return f.id === 1;
}));
