<template>
  <a-form :form="form" @submit="loginIn">
    <div class="pageAll">
      <div class="loginForm">
        <div class="logTitle">欢迎！</div>
        <a-card title="登录" class="loginCard">
          <a-form-item>
            <a-input class="inputArea" v-model="uAccount" placeholder="用户名"
                     v-decorator="['username', { rules: [{ required: true, message: '请输入用户名' }] }]">
              <a-icon slot="prefix" type="user"/>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input class="inputArea" type="password" v-model="uPwd" placeholder="密码"
                     v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }] }]">
              <a-icon slot="prefix" type="eye"/>
            </a-input>
          </a-form-item>
          <div class="has-error">
            <a-form-item>
              <div v-show="showError" class="ant-form-explain has-error">用户名或密码不正确</div>
            </a-form-item>
          </div>
        </a-card>
        <a-form-item>
          <a-button type="primary" icon="login" @click="loginIn">立即登录</a-button>
        </a-form-item>
      </div>
    </div>
  </a-form>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data() {
    return {
      uAccount: "",
      uPwd: "",
      showError: false,
      form: this.$form.createForm(this, {name: 'login'}),
    }
  },
  mounted() {
    this.showError = false;
  },
  methods: {
    check() {
      this.form.validateFields(err => {
        if (!err) {
          console.info('success');
        }
      });
    },
    loginIn(e) {
      e.preventDefault();
      this.form.validateFields(err => {
        if (!err) {
          let formData = new FormData();
          formData.append('username', this.uAccount);
          formData.append('password', this.uPwd);
          this.$http.postHttp('login', formData, (data) => {
            const loginUser = {
              username: data.data.loginName,
              role: data.data.role
            }
            sessionStorage.setItem("loginUser", JSON.stringify(loginUser));
            this.$router.push({
              path: '/Home'
            });
          }, (e) => this.showError = true)
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.pageAll {
  width: 100vw;
  height: 100vh;
  background: url('../assets/loginBg.jpg') center center fixed no-repeat;
  background-size: cover;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .loginForm {
    .logTitle {
      font-weight: bold;
      font-size: 36px;
    }

    .loginCard {
      // border: none;
      // border-color: #459bf0;
      // box-shadow: -1px 1px 0px #459bf0;
      // background-color: #459bf0;
      // background:linear-gradient(to right bottom,#459bf0,#dddddd) ;
      border-radius: 8px;
      width: 400px;
      margin: 20px 8vw 20px 0;

      .inputArea {
        margin: 10px 0;
      }
    }

  }

}

</style>
