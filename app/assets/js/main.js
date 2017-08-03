class App {
    constructor() {this.init()}

    init() {
        this.commentsBox = this.createArr('commentsArchive');
        this.tabController('.schedule-item', '.tab-content__item');
        this.addNewComment();
        this.initCommentReply();
        this.addCommentReply();
    }

    tabController(tabNavItem, tabContentItem) {
        $(tabNavItem).on('click', e => {
            const currentTab = $(e.target);
            const currentTabNumber = currentTab.attr('data-num');
            
            $(tabNavItem).removeClass('active');
            currentTab.addClass('active');
            $(tabContentItem)
                .removeClass('active')
                .eq(currentTabNumber - 1)
                .addClass('active');

        });
    }

    addNewComment() {
        $('.submit--comment').on('click', () => {
            this.createCommentObject(this.idGenerate())
        });
    }

    initCommentReply() {
        $('.comments-list').on('click', '.comment__reply', e => {
            this.parentCommentId = $(e.target).parents('.comment').attr('data-id');

            // TODO: менять кнопки под формой
            $('.submit--comment').addClass('hide');
            $('.submit--reply').removeClass('hide');
        });
    }

    addCommentReply() {
        $('.submit--reply').on('click', () => {
            this.createCommentObject(this.parentCommentId, true);
            
            $('.submit--comment').removeClass('hide');
            $('.submit--reply').addClass('hide');
        });

        
    }

    createCommentObject(id, reply, time) {
        let userName = $('.user-input').val().trim();
        let commentText = $('.user-comment').val().trim();
        
        if (userName && commentText) {
            let newComment = new UserComment({
                userName: userName,
                commentText: commentText,
                id: id,
                time: time,
                reply: reply
            });
            this.commentsBox.push(newComment);
            $('.form').removeClass('error');
        } else {
            $('.form').addClass('error');
        }

        $('.form input, .form textarea').val('');
    }

    createArr(key) {
        if (localStorage.getItem(key)) {
            const jsonArr = JSON.parse(localStorage.getItem(key));
            let newArr = new CommentsBox;

            jsonArr.forEach(comment => {
                newArr.push(new UserComment({
                    userName: comment.userName,
                    commentText: comment.commentText,
                    id: comment.id,
                    time: comment.commentTime,
                    reply: comment.isReply
                }))
            });

            return newArr;
        } else {
            return new CommentsBox;
        }
    }

    idGenerate() {
        const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const idLenght = 16;
        let id = '';

        for (var i = 0; i < idLenght; i++) {
            id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        
        return id;
    }
}

class CommentsBox extends Array {
    constructor() {
        super();
    }

    push(comment) {
        super.push(comment);
		this.renderComments();
		this.save();
    }

    save() {
        localStorage.setItem('commentsArchive', JSON.stringify(this));
    }

    renderComments() {
        const comments = _.compact(this.map(comment => !comment.isReply ? comment : ''));
        const replys = _.compact(this.map(comment => comment.isReply ? comment : ''));
        const template = $('#template-comment').html();
        const compiled = _.template(template);

        $('.comments-list').html('');

        comments.forEach(comment => {
            const newElement = compiled(comment);
            $('.comments-list').append(newElement);
            
            replys
                .sort((a, b) => a.commentTime < b.commentTime)
                .forEach(reply => {
                    if (comment.id === reply.id) {
                        const newElement = compiled(reply);
                        $(`.comment[data-id="${comment.id}"]`).after(newElement);
                    };
                })
        });
    }
}

class UserComment {
    constructor(infoObj) {
        this.userName = infoObj.userName;
        this.commentText = infoObj.commentText;
        this.id = infoObj.id;
        this.commentTime = infoObj.time || this.getTime();
        this.isReply = infoObj.reply;
    }

    getTime() {
        return moment().format('DD MMMM YYYY, HH:mm:ss');
    }
}

$(() => {new App;});