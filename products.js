import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";
const site = 'https://vue3-course-api.hexschool.io/v2'; 
const apiPath = 'jesswu';

// 先宣告一個變數
let productModal = {};
let delProductModal ={};
// 產品資料格式
const app = createApp({
  data() {
    return {
      products: [],
      detail:{},
      tempProduct: {
        // 多圖
        imagesUrl: [],
      },
      isNew:false
    };
  },
  methods: {
    checkLogin() {
      // 將token取出來
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)jessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      // 將偷肯帶入預設header
      axios.defaults.headers.common['Authorization'] = token;
      // check api
      const url = `${site}/api/user/check`;
      axios.post(url).then((res)=>{
        // console.log('check',res);
        // 檢查後去拿取資料
        this.getProducts();
      })
    },
    getProducts() {
      const url = `${site}/api/${apiPath}/admin/products/all`;
      axios.get(url).then((res)=>{
        // console.log('getProducts',res.data.products);
        this.products = res.data.products;  
      })
    },
    openModal(status, data) {
      // 新產品
      if(status === 'isNew'){
        this.tempProduct = {
          imagesUrl: []
        }
        productModal.show();
        this.isNew = true;
      }
      // 綁定舊產品的資料
      if(status === 'edit'){
        // 淺拷貝一份
        this.tempProduct = { ...data};
        productModal.show();
        this.isNew = false;
      }

      // 如果點擊刪除鈕
      if(status === 'delete'){
        // 打開deleteModal
        delProductModal.show();
        this.tempProduct ={ ...data};
      }
    },
    // 新增||編輯產品方法
    updateProduct() {
      let url = `${site}/api/${apiPath}/admin/product`;
      // api method
      let method = 'post';

      // 如果不是新的用put編輯
      if(!this.isNew){
        url = `${site}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
        method = 'put';
      }

      // 要post產品至後端
      // axios.post(url, { data: this.tempProduct })
      axios[method](url, { data: this.tempProduct }).then((res)=>{
        // 關掉modal
        productModal.hide();
        setTimeout(() => {
           // console.log(res);
          alert(res.data.message);
        }, 1000);
       
        // 再拿一次list的資料
        this.getProducts();
        
      })
    },
    // 刪除api
    deleteProduct() {
      let url = `${site}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(url).then((res)=>{
        delProductModal.hide();

        setTimeout(() => {
          // console.log(res);
         alert(res.data.message);
        }, 1000);
        this.getProducts();
       

      })
    }
  },
  mounted() {
    this.checkLogin();
    // 初始一個bs的modal 並在openModal方法去使用.show()
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });
    // 刪除模板
    delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'), {
      keyboard: false
    });
    
  }
});

app.mount('#app')