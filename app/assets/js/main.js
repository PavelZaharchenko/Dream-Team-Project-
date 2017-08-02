class App {
    constructor() {
        this.init();
    }

    init() {
        this.tabController('.schedule-item', '.tab-content__item');
        this.addNewComment();
    }

    tabController(tabNavItem, tabContentItem) {
        $(tabNavItem).on('click', (e) => {
            let currentTabNumber = $(e.target).attr('data-num');
            
            $(tabContentItem)
                .removeClass('active')
                .eq(currentTabNumber - 1)
                .addClass('active');

        });
    }

    addNewComment() {
        $('.submit').on('click', () => {
            let userName = $('.user-input').val();
            let commentText = $('.user-comment').val();


            let newComment = new UserComment(userName, commentText);

            let arr = new CommentsBox;

            arr.push(newComment);

            // arr.save();



            // Clear inputs
            $('.form input, .form textarea').val('');
        });

        
    }
}

class CommentsBox extends Array {
    constructor() {
        super();
    }

    push(comment) {
        super.push(comment);
		this.renderComment(comment);
		// this.save();
    }

    save() {
        // console.log(this);
        localStorage.setItem('comments', JSON.stringify(this));
    }

    renderComment(comment) {
        const template = $('#template-comment').html();
		const compiled = _.template(template);
        const newElement = compiled(comment);
        
        $('.comments-list').append(newElement);
    }
}

class UserComment {
    constructor(userName, commentText) {
        this.userName = userName;
        this.commentText = commentText;
        this.commentTime = this.getTime();
    }

    getTime() {
        return moment().format('DD MMMM YYYY, HH:mm');
    }
}



$(() => {new App;});



// .user-input - name
// .user-comment 
// .submit






/* $(function() {

tabControl('.schedule-item', '.tab-content__item');

function tabControl(tabNav, tabContent) {
    $(tabNav).on('click', function() {
    var currentTabNumber = $(this).attr('data-number');
    $(tabContent).removeClass('active');
    $(tabContent).eq(currentTabNumber - 1).addClass('active');
        })
    }

    $( "#datepicker" ).datepicker();
}); */