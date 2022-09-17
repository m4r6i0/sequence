import sql from 'alasql'

const min = 1;
const max = 60;
const total = min + max;

const createTableSequence = "create table sequence (seq number)";
sql(createTableSequence);

const createArraySequence = [...new Array(total)].fill(min, max).map((e, i) => {
    const aux = "insert into sequence values(" + i + ")"
    return aux;
});
createArraySequence.forEach(insert => {
    sql(insert);
});

const queryCreateGame = "select " + 
                        "s1.seq as n1, " +
                        "s2.seq as n2, " +
                        "s3.seq as n3, " +
                        "s4.seq as n4, " +
                        "s5.seq as n5, " +
                        "s6.seq as n6  " +
                        "from sequence s1 " + 
                        "   join sequence s2 on s2.seq > s1.seq " +
                        "   join sequence s3 on s3.seq > s2.seq " +
                        "   join sequence s4 on s4.seq > s3.seq " +
                        "   join sequence s5 on s5.seq > s4.seq " +
                        "   join sequence s6 on s6.seq > s5.seq " +
                        "where s1.seq <> 0 ";

 const executeSequences = sql(queryCreateGame);
 console.log(executeSequences.length);





// //authors table
// sql("create table authors (id number, name string)");

// //books
// sql("create table books (author_id number, bookName string)");

// //add authors
// sql("insert into authors values(1, 'Salomon Rushdie')");
// sql("insert into authors values(2, 'Zibia Gasparetto')");
// sql("insert into authors values(3, 'Bruna Surfistinha')");

// //add books
// sql("insert into books(1, 'Versos Satanicos')");
// sql("insert into books(2, 'Morro das Ilusoes')");
// sql("insert into books(3, 'Doce Veneno do Escorpial')");

// const listAuthors = sql("select * from authors");
// const lisBooks = sql("select * from books")

// console.log('Authors List');
// console.log(listAuthors);

// console.log("books List")
// console.log(lisBooks);

// const books = "select a.name as ausName, b.bookName as bookName from authors a " + 
//                      "         join books b on a.id = b.author_id "

// console.log('Get Salomon Rushdie');
// const listBooks = sql(books);
// console.log(listBooks);








// import { sql } from 'alasql';

// var authors = 
// [  { id: 1, name: 'adam'},
//    { id: 2, name: 'bob'},
//    { id: 3, name: 'charlie'}
// ];

// var books = 
// [  { author_id: 1, title: 'Coloring for beginners'}, 
//    { author_id: 1, title: 'Advanced coloring'}, 
//    { author_id: 2, title: '50 Hikes in New England'},
//    { author_id: 2, title: '50 Hikes in Illinois'},
//    { author_id: 3, title: 'String Theory for Dummies'}, ];
 
// var res = sql('SELECT * FROM ? authors LEFT JOIN ? books ON authors.id = books.author_id',[authors, books]);

// console.log(res);