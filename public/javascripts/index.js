const url = "cmt"
let refresh_page = ()=>{

}
const vm = new Vue({
    el: '#Posts',
    data: {
      posts: [],
      message:"",
      modified_message: "",
      p:0,
      q:"",
      page_info:{},
      not_yet_logged_in: true,
        username: "",
        password: "",  
        isAdmin: false,
    },
    watch:{
        q:function(){
            this.refresh_page();
        }
    },
    mounted() {
        this.refresh_page();
        // this.refresh_page();
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
        refresh_page:function(cb){
            axios.get(url,{params:{"q":this.q,"p":this.p}})
            .then(response => {
                this.posts = response.data.posts;
                this.page_info = response.data.page;
                if(cb)
                cb();
            });
        },
        change_page: function(p){
            if (p>0)
                this.p = p-1;
            this.refresh_page();
        },
        r_pq: function(){
            this.p=0;
            this.q="";
        },
        submit_new_post: function(){
            axios.post(url,{content:this.message})
            .then(response => {
                if(response.data=="ok"){
                    this.r_pq();
                    this.refresh_page(()=>{
                        this.message = "";
                    });
                }
            });
        },
        delete_post: function (id) {
            axios.delete(url,{params:{"id":id}})
            .then(response => {
                if(response.data=="ok"){
                    this.r_pq();
                    this.refresh_page();
                }
            });
        },
        update_post: function (id) {
            axios.patch(url,{id:id,content:this.modified_message})
            .then(response => {
                if(response.data=="ok"){
                    this.modified_message = "";
                    this.refresh_page();
                }
            });
        },
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
