const data = {
    currentuser: {
        Image: {
            png: "image/avater/image-juliusomo.png",
            webp: "image/avater/image-juliusomo.webp",
        },
         username: "juliusomo",
    },
    comments: [
        {
            parent: 0,
            id: 1,
            content:
                "Impressiva! Though it seems the drag feature could be improverd. But overrall it looks incredible. you've nailed the design and the responsiveness at various breakpoints works really well.",
            createdAt: "2 week ago",
            score: 12,
            user: {
                image: {
                    png: "image/avater/image-amyrobson.png",
                    webp: "image/avater/image-amyrobson.webp",
                },
                username: "amyrobson",
            },
            replies: [],
        },
         {
            parent: 0,
            id: 2,
            content:
                "Woah your project looks awesome! How long have you been coding for? I'm still new,but think i want to dive into React as well soon. Perhaps you can give me an insight on where i can learn React? Thanks!",
            createdAt: "1 week ago",
            score: 5,
            user: {
                image: {
                    png: "image/avater/image-maxblagun.png",
                    webp: "image/avater/image-maxblagun.webp",
                },
                username: "maxblagun",
            },
            replies: [
                {
                    parent: 2,
                    id: 1,
                    content:
                        "If you're still new, I'd recommend focusing on the fundamentals of HTML,CSS, and JS before considering React. it's very tempting to jump ahead but lay a solid foundation first.",
                    createdAt: "6 days ago",
                    score: 4,
                    replyingTo: "maxblagun",
                    user: {
                        image: {
                            png: "image/avater/image-ramsesmiron.png",
                            webp: "image/avater/image-ramsesmiron.webp",
                        },
                        username: "ramsesmiron",
                    },
                },
                {
                    parent: 2,
                    id: 1,
                    content:
                        "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
                    createdAt: "4 days ago",
                    score: 2,
                    replyingTo: "ramsesmiron",
                    user: {
                        image: {
                            png: "image/avater/image-juliusomo.png",
                            webp: "image/avater/image-juliusomo.webp",
                        },
                        username: "juliusomo",
                    },
                },
            ],
        },
    ],      
};
 
function appendfrag(frag, parent) {
    let children = [].slice.call(frag.childNodes, 0);
    parent.appendChild(frag);
    return children[0]
}
 
const addComment = (body, parentId, replyTo = undefined) => {
    let commentParent=parentId===0?data.comments:data.comments.filter((c) => c.id == parentId)[0].replies;
    let newComment = {
        parent: parentId,
        id: commentParent.length == 0 ? 1 : commentParent[commentParent.length - 1].id + 1,
        content: body,
        createdAt: "Now",
        replyingTo: replyTo,
        score: 0,
        replies: parent == 0 ? [] : undefined,
        user:data.currentUser,
    }
    commentParent.push(newComment);
    initComments()
}
 
const deleteComment = (CommentObject) => {
    if (CommentObject.parent == 0) {
        data.comments = data.comments.filter((e) => e != CommentObject);
    } else {
        data.comments.filter((e)=>e.id===CommentObject.parent)[0].replies=data.comments.filter((e)=>e.id==CommentObject.parent)[0].replies.filter((e) => e != CommentObject);
    }
    initComments()
}
 
const promptDel = (CommentObject) => {
    const modalWrp = document.querySelector(".modal-wrp");
    modalWrp.classList.remove("invisible");
    modalWrp.querySelector(".yes").addEventListener("click", () => {
        deleteComment(CommentObject);
        modalWrp.classList.add("invisible");
    })
    modalWrp.querySelector(".no").addEventListener("click", () => {
        modalWrp.classList.add("invisible");
    })
}
 
const spanReplyInput = (parent, parentId, replyTo = undefined) => {
    if (parent.querySelectorAll(".reply-input")) {
        parent.querySelectorAll(".reply-input").forEach((e) => {
            e.remove()
        })
    }
}
 
const inputTemplate = document.querySelector(".reply-input-template");
const inputNode = inputTemplate.content.cloneNode(true);
const addedInput = appendfrag(inputNode, parent);
addedInput.querySelector(".bu-primary").addEventListener("click", () =>{
    let commentBody = addedInput.querySelector(".cant-input").value;
    if (commentBody.length == 0) return;
    addComment(commentBody.parentId,replyTo)
})
 
const createCommentNode = (CommentObject) => {
    const commentTemplate = document.querySelector(".comment-template");
    let commentNode = commentTemplate.content.cloneNode(true);
    commentNode.querySelector(".usr-name").textContent = commentObject.user.username;
    commentNode.querySelector(".usr-img").src = commentObject.user.image.webp;
    commentNode.querySelector(".score-number").textContent = commentObject.score;
    commentNode.querySelector(".cant-at").textContent = commentObject.createdAt;
    commentNode.querySelector(".c-body").textContent = commentObject.content;
    if (commentObject.replyingTo) {
        commentNode.querySelector(".reply-to").textContent = "@" + commentObject.replyingTo;
        commentNode.querySelector(".score-plus").addEventListener("click", () => {
            commentObject.score++;
            initComments();
        })
        commentNode.querySelector(".score-minus").addEventListener("click", () => {
            commentObject.score--;
            if (commentObject.score < 0) commentObject.score = 0;
            initComments()
        })
         if (commentObject.user.username == data.currentUser.username) {
            commentNode.querySelector(".comment").classList.add("this-user");
            commentNode.querySelector(".delete").addEventListener("click", () => {
                promptDel(commentObject)
            })
            commentNode.querySelector(".edit").addEventListener("click", (e) => {
                const path = e.path[3].querySelector(".c-body");
                if (path.getAttribute("contenteditable") == false || path.getAttribute("contenteditable") == null) {
                    path.getAttribute("contenteditable", true);
                    path.focus()
                } else {
                    path.removeAttribute("contenteditable")
                }
            })
            return commentNode;
        }
         
    }return commentNode    
}

const appendComment = (parentNode, commentNode, parentId) => {
    const bu_reply = commentNode.querySelector(".reply");
    const appendcant = appendfrag(commentNode, parentNode);
    const replyTo = appendcant.querySelector(".usr-name").textContent; /***/
    bu_reply.addEventListener("click", () => {
        if (parentNode.classList.contains("replies")) {
            spanReplyInput(parentNode,parentId,replyTo)
        } else {
            //console.log(appendComment.querySelector(".replies"));
            spanReplyInput(
            appendcant.querySelector(".replies"),
            parentId,
            replyTo
            );
        }
    });
};
 
function initComments(
    commentList = data.comments, 
    parent = document.querySelector(".comments-wrp")
) {
    parent.innerHTML = "";
    commentList.forEach((element) => {
        var parentId = element.parent == 0 ? element.id : element.parent;
        const comment_node = createCommentNode(element);
        if (element.replies && element.replies.length > 0) {
            initComments(element.replies, comment_node.querySelector(".replies"));
        }
        appendComment(parent,comment_node,parentId)
    }); 
}
 
initComments();
const cantinput = document.querySelector(".reply-input");
cantinput.querySelector(".bu-primary").addEventListener("click", () => {
    let commentBody = cantInput.querySelector(".cant-input").value;
    if (commentBody.length == 0) return;
    addComment(commentBody, 0);
    cantInput.querySelector(".cant-input").value = "";
});