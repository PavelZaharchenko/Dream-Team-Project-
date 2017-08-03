class App {
    constructor() {
        this.init();
    }

    init() {
        this.commentsBox = new CommentsBox;
        this.tabController('.schedule-item', '.tab-content__item');
        this.addNewComment();
        this.startCommentReply();
        this.addCommentReply();
    }

    tabController(tabNavItem, tabContentItem) {
        $(tabNavItem).on('click', e => {
            let currentTabNumber = $(e.target).attr('data-num');
            
            $(tabContentItem)
                .removeClass('active')
                .eq(currentTabNumber - 1)
                .addClass('active');

        });
    }

    addNewComment() {
        $('.submit--comment').on('click', () => {
            let userName = $('.user-input').val();
            let commentText = $('.user-comment').val();
            let newComment = new UserComment(userName, commentText, this.idGenerate());
            this.commentsBox.push(newComment);

            // Clear inputs
            $('.form input, .form textarea').val('');
        });
    }

    startCommentReply() {
        $('.comments-list').on('click', '.reply-button', e => {
            this.parentCommentId = $(e.target).parents('.coments-item').attr('data-id');

            // TODO: менять кнопки под формой
            $('.submit--comment').addClass('hide');
            $('.submit--reply').removeClass('hide');
        });
    }

    addCommentReply() {
        $('.submit--reply').on('click', () => {
            let userName = $('.user-input').val();
            let commentText = $('.user-comment').val();
            let newComment = new UserComment(userName, commentText, this.parentCommentId, true);
            this.commentsBox.push(newComment);
        });
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
        localStorage.setItem('comments', JSON.stringify(this));
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
                    if ((comment.id === reply.id) && reply.isReply) {
                        const newElement = compiled(reply);
                        $(`.coments-item[data-id="${comment.id}"]`).after(newElement);
                    };
                })
        });


    }
}

class UserComment {
    constructor(userName, commentText, id, reply = false) {
        this.userName = userName;
        this.commentText = commentText;
        this.id = id;
        this.commentTime = this.getTime();
        this.isReply = reply;
    }

    getTime() {
        return moment().format('DD MMMM YYYY, HH:mm:ss');
    }
}

$(() => {new App;});