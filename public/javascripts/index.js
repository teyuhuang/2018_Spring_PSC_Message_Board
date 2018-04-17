const url = "cmt"

const vm = new Vue({
    el: '#Posts',
    data: {
      posts: [],
      message:  "",
      modified_message: "",
      p:0,
      q:""
    },
    watch:{
        q:function(){
            axios.get(url,{params:{"q":this.q}})
            .then(response => {
            this.posts = response.data.posts;
            });
        }
    },
    mounted() {
        axios.get(url)
        .then(response => {
          this.posts = response.data.posts;
        })
      },
    methods: {
        submit_new_post: function () {
            axios.post(url,{content:this.message})
            .then(response => {
                if(response.data=="ok"){
                    axios.get(url)
                    .then(response => {
                    this.posts = response.data.posts;
                    this.message = "";
                    })
                }
            });
        },
        delete_post: function (id) {
            axios.delete(url,{params:{"id":id}})
            .then(response => {
                if(response.data=="ok"){
                    axios.get(url)
                    .then(response => {
                    this.posts = response.data.posts;
                    this.message = "";
                    })
                }
            });
        },
        update_post: function (id) {
            axios.patch(url,{id:id,content:this.modified_message})
            .then(response => {
                if(response.data=="ok"){
                    axios.get(url)
                    .then(response => {
                    this.posts = response.data.posts;
                    this.modified_message = "";
                    })
                }
            });
        },
    }
});

const login = new Vue({
    el: '#Login',
    data: {
        not_yet_logged_in: true,
        username: "",
        password: "",
        isAdmin: false,
    },
    mounted() {
        axios.post("login")
        .then(response => {
            switch(response.data){
                case "admin": 
                this.isAdmin=true; 
                case "ok": 
                this.not_yet_logged_in= false;
            }
        });
    },
    methods: {
        login: function () {
            axios.post("login",{user:this.username,
            pass:this.password})
            .then(response => {
                if(response.data=="ok"){
                    his.not_yet_logged_in= false;
                }
                else if(response.data=="admin"){
                    this.not_yet_logged_in= false;
                    this.isAdmin=true; 
                }
                else{

                }
                this.username = "";
                this.password = "";
            });
        },
        logout:function(){
            axios.post("logout")
                .then(response => {
                    if(response.data=="ok"){
                        this.not_yet_logged_in= true;
                        this.isAdmin=false; 
                    }
            });
        }
    }
    });