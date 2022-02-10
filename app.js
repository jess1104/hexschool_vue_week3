import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
const site = 'https://vue3-course-api.hexschool.io/v2'

createApp({
    data(){
        return{
            user:{
                "username": "",
                "password": ""
            }
        }
    },
    methods:{   
        login(){
            const url = `${site}/admin/signin`;
            axios.post(url,this.user).then((res)=>{
                console.log(res.data);
                const { token, expired } = res.data;
                    // 存入cookie
                    document.cookie = `jessToken=${token}; expires=${ new Date(expired) }; `;
                    window.location = 'products.html';
            }).catch((err)=>{
                console.dir(err);
                alert(err.data.message)
            }) 
        }
    }
}).mount('#app');