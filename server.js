// inside server.js
const config = {
    host:'localhost',
    port: 5432,
    database: 'likeypixdb'
};
const pgp = require('pg-promise')({
    query: e => {
        // print the SQL query
        console.log(`QUERY: ${e.query}`);
    }
});
const db = pgp(config);

// db.query(`
//     SELECT * FROM users;
// `)
// .then((results) =>{
//     results.forEach((person)=>{
//         console.log(`Name: ${person.name} :Email: ${person.email}`)
//     })
// })
// .catch((e) => {
//     console.log('Whoopsie!')
// })

// Read
//-------Get all users--------
function getAllUsers(){

    db.many(`
        SELECT * FROM users;
    `)
    .then((users)=>{
        users.forEach((person)=>{
            console.log(`${person.name}, ${person.email}`)
        })
    })
    .catch((e) => {
        console.log(e)
    })
}

// getAllUsers();
    
//----Get all posts-------
function getAllPosts(){

    return db.many(`
        SELECT * FROM posts;
    `)
    .then((posts)=> {
        posts.forEach((blog)=> {
            console.log(blog)
            return blog;
        })
    })
    .catch((e) =>{
        console.log(e)
    })
}
// getAllPosts();

//--------Get user by ID---------
function getUserById(userId){
    return db.one(`
        SELECT * FROM users
            WHERE id = $1
    `, userId)
    .then(user => {
        return user;
    })
    .catch((e) => {
        console.log(e)
    })
}
//------Get all posts by a specific user-------
function getPostByUserId(userId){
    // Get the user
    // and get their posts
    // and return it all together!!!
    db.many(`
    SELECT * FROM posts
    WHERE user_id = $1
    `, userId)
    .then((posts => {
        const user = getUserById(userId)
        
        user.then(theUser => {
            //console.log((theUser))
            console.log(theUser)
            posts.forEach((blog) => {
                console.log(`${theUser.name}: ${blog.url}`)
            })
        })
    }))
    .catch((e)=>{
        console.log(e)
    })

}
// getPostByUserId(2)
//--------Get All Comments---------
function getAllComments(){

    db.many(`
        SELECT * FROM comments;
    `)
    .then((comments) => {
        comments.forEach((comment => {
            console.log(`${comment.comment}`)
        }))
    })
    .catch((e) => {
        console.log(e)
    })
}
// getAllComments();

//---------Get All Comments by UserId--------
function getAllCommentsUserId(userId){
    db.many(`
        SELECT * FROM comments
        WHERE id = $1
    `, userId)
    .then((comments) =>{
        const user = getUserById(userId)
        user.then((theUser) =>{
            comments.forEach((comment)=>{
                console.log(`${theUser.id} made the comment ${comment.comment}`)
            })
        })
    })
    .catch((e)=>{
        console.log(e)
    })

}
// getAllCommentsUserId(5);

//------Get All Comments with User--------
function getAllCommentsWithUser(userId){
    db.many(`
    SELECT * FROM comments
    WHERE id = $1
`, userId)
.then((comments) =>{
    const user = getUserById(userId)
    user.then((theUser) =>{
        comments.forEach((comment)=>{
            console.log(`${theUser.name} made the comment ${comment.comment}`)
        })
    })
})
.catch((e)=>{
    console.log(e)
})
}
// getAllCommentsWithUser(1)

//----- Get Post with Likes-------
function getPostWithLikes(){
    // DB many to do SQL to get your data
    db.many(`
        SELECT * FROM likes
        INNER JOIN comments  
        ON likes.post_id = comments.post_id
    `)
    // start a callback function to grab data from SQL
    .then((results) =>{
        // Do a forEach to be able to store the object data!
        results.forEach((row)  =>{
            console.log(`Post id ${row.post_id} made comment ${row.comment}`)

        })
    })
    .catch((e)=> {
        console.log(e)
    })
}

function getLikesForPostId(postId){
    return db.one(`
                select count(*) from likes
                    where post_id = $1
            `, postId)
            .then(({count})=>{
                // const {count} = mainCount
                return count;
            })
            .catch((e)=>{
                console.log(e)
            })
}

function getPostsWithLikes(){
    // well merge results from 2 promise chains
    // into a single return value

    getAllPosts()
        .then(posts => {
            console.log(posts);
            console.log("-----post------");
            posts.forEach((post, index) =>{
                getLikesForPostId(post.id)
                    .then((count) => {
                        // console.log(`The like count for post id ${post.id} is ${count}`)
                        post.likes = count
                    })
            })
        })
        .catch((e)=> {
            console.log(e)
        })
}
// getPostWithLikes(1)
// getPostsWithLikes();
getPostsWithLikes();

















//Create


// Update

// Delete


// OK to leave this out for an express.app
// WE want this for our command-line app
// pgp.end();
