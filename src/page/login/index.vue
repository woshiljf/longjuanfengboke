<template>
  <div class="login-box">

    <div class="loginText">

      <h1 style="--x: 6; --y: -6;">
        <span style="--index: 0; --alpha-l: 0.125; --alpha-u: 0.25;">龙</span>
        <span style="--index: 1; --alpha-l: 0.125; --alpha-u: 0.25;">卷</span>
        <span style="--index: 2; --alpha-l: 0.125; --alpha-u: 0.25;">风</span>
        <span style="--index: 3; --alpha-l: 0.125; --alpha-u: 0.25;">的</span>
        <span style="--index: 4; --alpha-l: 0.125; --alpha-u: 0.25;">博</span>
        <span style="--index: 5; --alpha-l: 0.125; --alpha-u: 0.25;">客</span>
      </h1>

      <!-- <h1 style="--x: 3; --y: -3;">
        <span style="--index: 0; --alpha-l: 0.25; --alpha-u: 0.5;">深</span><span
          style="--index: 1; --alpha-l: 0.25; --alpha-u: 0.5;">夜</span><span
          style="--index: 2; --alpha-l: 0.25; --alpha-u: 0.5;">网</span><span
          style="--index: 3; --alpha-l: 0.25; --alpha-u: 0.5;">抑</span><span
          style="--index: 4; --alpha-l: 0.25; --alpha-u: 0.5;">云</span><span
          style="--index: 5; --alpha-l: 0.25; --alpha-u: 0.5;"></span>
      </h1> -->

      <h1>
        <span style="--index: 0; --alpha-l: 0.5; --alpha-u: 1;">龙</span><span
          style="--index: 1; --alpha-l: 0.5; --alpha-u: 1;">卷</span><span
          style="--index: 2; --alpha-l: 0.5; --alpha-u: 1;">风</span><span
          style="--index: 3; --alpha-l: 0.5; --alpha-u: 1;">的</span><span
          style="--index: 4; --alpha-l: 0.5; --alpha-u: 1;">博</span><span
          style="--index: 5; --alpha-l: 0.5; --alpha-u: 1;">客</span>
      </h1>

    </div>

    <div class="bounceToDown loginBox">

      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px"
        class="demo-ruleForm login-container" v-if="isUserOrQr">
        <!-- 手机登入 -->
        <el-form-item prop="account" v-if="isPhone">
          <!-- el-icon-user-solid -->
          <label for="phone">
            <span style="color: #ffffff">手机号:</span>
            <el-input type="text" v-model="ruleForm2.account" placeholder="请输入手机号" autocomplete="on" id="phone" />
            <span class="show-pwd">
              <i class="el-icon-user-solid" />
            </span>
          </label>
        </el-form-item>
        <!-- 手机密码 -->
        <el-form-item prop="checkPass" v-if="isPhone">
          <label for="pwd">
            <span style="color: #ffffff">密码：</span>
            <el-input :type="passwordType" v-model="ruleForm2.checkPass" autocomplete="on" placeholder="请输入密码"
              @keyup.enter.native="login" id="pwd" />
            <span class="show-pwd" @click="showPwd">
              <i :class="passwordType === 'password' ? 'el-icon-view' : 'el-icon-view'" />
            </span>
          </label>
        </el-form-item>
        <!-- 邮箱登入 -->

        <el-form-item prop="account" v-if="isEmail">
          <!-- el-icon-user-solid -->
          <label for="phone">
            <span style="color: #ffffff">网易邮箱:</span>
            <el-input type="text" v-model="ruleForm2.account" placeholder="请输入邮箱号" autocomplete="on" id="phone" />
            <span class="show-pwd">
              <i class="el-icon-user-solid" />
            </span>
          </label>
        </el-form-item>

        <!-- 邮箱密码 -->
        <el-form-item prop="checkPass" v-if="isEmail">
          <label for="pwd">
            <span style="color: #ffffff">密码：</span>
            <el-input :type="passwordType" v-model="ruleForm2.checkPass" autocomplete="on" placeholder="请输入密码"
              @keyup.enter.native="login" id="pwd" />
            <span class="show-pwd" @click="showPwd">
              <i :class="passwordType === 'password' ? 'el-icon-view' : 'el-icon-view'" />
            </span>
          </label>
        </el-form-item>
        <el-checkbox click="remberuser" v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="login" :loading="logining">登录</el-button>
        </el-form-item>

        <div class="register" style="width: 100%">

          <el-tooltip class="item" effect="dark" content="网易云音乐手机账号" placement="top">
            <el-button type="danger" size="mini" :loading="dirloginLoad1" @click="phoneHandle">手机登录</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="网易云邮箱登录" placement="top">
            <el-button type="danger" size="mini" :loading="dirloginLoad2" @click="emailHandle">邮箱登录</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="网易云音乐app扫码登录" placement="top">
            <el-button type="danger" size="mini" :loading="dirloginLoad3" @click="qrHandle">扫码登录</el-button>
          </el-tooltip>

          <el-button type="danger" size="mini" :loading="dirloginLoad4" @click="directLogin">不想登录</el-button>
        </div>

      </el-form>

      <div class="login-container" v-if="!isUserOrQr">

        <img class="qrClass" :src="erWeiMaSrc" alt="二维码图片">

      </div>

    </div>

  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { get } from "@/utils/request";
import { geterWeiMaKey, getErWeiMaImg } from '@/api/login'
export default {
  props: {},
  data () {
    return {
      logining: false,
      dirloginLoad1: false,
      dirloginLoad2: false,
      dirloginLoad3: false,
      dirloginLoad4: false,
      ruleForm2: {
        account: "",
        checkPass: ""
      },
      passwordType: 'password',
      rules2: {
        account: [
          {
            required: true,
            message: "请输入登录账号",
            trigger: "blur"
          }
        ],
        checkPass: [
          {
            required: true,
            message: "请输入登录密码",
            trigger: "blur"
          }
        ]
      },
      checked: true,
      isPhone: true,
      isEmail: false,
      // 默认是手机号码登入
      loginMethod: 'LoginByUsername',
      erWeiMaSrc: '',
      isUserOrQr: true,
      unikey: ''
    };
  },
  created () {
    this.ruleForm2.checkPass = "";
    if (localStorage.getItem('userName')) {  // 记住密码操作
      this.ruleForm2.account = localStorage.getItem('userName');
      this.ruleForm2.checkPass = localStorage.getItem('password');
    }

    var iSstranger = true
    sessionStorage.setItem("stranger", JSON.stringify({ iSstranger }));


  },
  methods: {
    login () {
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          this.logining = true
          const params = {
            userCode: this.ruleForm2.account,
            password: this.ruleForm2.checkPass
          }
          this.loginHandle(params)
        } else {
          this.logining = false
          console.log('error submit!!')
          return false
        }
      })
    },
    loginHandle (params) {
      // 传入登录方法
      this.$store.dispatch(this.loginMethod, params).then((res) => {
        if (!getToken()) {
          this.$notify({
            title: '登录失败',
            message: '登录失败',
            type: 'error',
            duration: 2000
          })
          // loginLoading.close()
          return
        }
        // 不是陌生人
        var iSstranger = false
        sessionStorage.setItem("stranger", JSON.stringify({ iSstranger }));
        this.$store.commit('changeStronger', false)
        this.logining = false
        // loginLoading.close()
        this.$router.push({ path: "/" })  // 去主页
        this.$message({
          message: '晚上好，小宝贝',
          type: 'success',
          duration: 3 * 1000
        })

      }).catch((error) => {
        console.log(error)
        if (error.response) {
          this.$message({
            message: error.response.data.errorMsg || '用户名或密码错误，登录失败',
            type: 'error',
            duration: 5 * 1000
          })
        }
      }).finally(() => {
        this.logining = false
        // loginLoading.close()
      })

    },



    // 密码显示
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    directLogin () {
      // 陌生人登录
      var loginName = 'myFriend'
      sessionStorage.setItem("user", JSON.stringify({ loginName }));
      sessionStorage.setItem("navFlag", JSON.stringify({ navFlag: false }));

      this.dirloginLoad4 = true
      setTimeout(() => {
        this.dirloginLoad4 = false
        this.$router.push({ path: "/" })
        this.$message({
          message: 'hello，朋友',
          type: 'success',
          duration: 3 * 1000
        })
      }, 2000);

      this.$store.commit('changeStronger', true)
    },
    // 邮箱登入
    emailHandle () {
      this.isPhone = false
      this.isEmail = true,
        this.loginMethod = 'LoginByEmailname'
    },
    phoneHandle () {
      this.isPhone = true
      this.isEmail = false
      this.loginMethod = 'LoginByUsername'
    },
    // 二维码登入
    async qrHandle () {
      this.loginMethod = 'LoginCheckQrState'
      this.dirloginLoad3 = true
      var key = await this.getKey()
      this.unikey = key
      getErWeiMaImg(key).then(response => {

        // 显示二维码
        this.erWeiMaSrc = response.data.data.qrimg
        this.isUserOrQr = false
        this.dirloginLoad3 = false

        // 轮询的查看二维码接口的状态
        this.checkQrState()

      })

    },
    getKey () {
      return geterWeiMaKey().then(response => {
        return response.data.data.unikey

      })
    },
    // 二维码登录的细节信息，需要轮询查看二维码接口的状态
    checkQrState () {
      var that = this
      this.timeId = setInterval(() => {
        that.checkloginHandle(this.unikey)
      }, 3000);
    },

    checkloginHandle (key) {

      this.$store.dispatch(this.loginMethod, key).then(res => {

        if (res.code == 803) {
          // 登录成功
          clearInterval(this.timeId)
          this.qrLoginHandle()
        }
        // 二维码失效，重新发起二维码
        if (res.code == 800) {

          clearInterval(this.timeId)

        }
      })

    },
    qrLoginHandle () {
      // 传入登录方法
      if (!getToken()) {
        this.$notify({
          title: '登录失败',
          message: '登录失败',
          type: 'error',
          duration: 2000
        })
        // loginLoading.close()
        return
      }
      // 不是陌生人
      var iSstranger = false
      sessionStorage.setItem("stranger", JSON.stringify({ iSstranger }));
      this.$store.commit('changeStronger', false)
      this.logining = false
      this.getUserInfo()
    },
    // 二维码登录，获取用户信息
    getUserInfo () {
      get("api/user/account")
        .then(response => {
          // console.log("歌单", response);
          var loginName = response.data.profile.nickname;
          var userId = response.data.account.id;
          var userImage = response.data.profile.avatarUrl;
          sessionStorage.setItem("user", JSON.stringify({ loginName }));
          sessionStorage.setItem("userId", JSON.stringify({ userId }));
          sessionStorage.setItem("userImage", JSON.stringify({ userImage }));

          this.$router.push({ path: "/" })  // 去主页
          this.$message({
            message: '晚上好，小宝贝',
            type: 'success',
            duration: 3 * 1000
          })

        })
        .catch(e => {
          console.log(e);
        })
        .finally(e => {
          this.$router.push({ path: "/" })  // 去主页
        });
    },

  }
};
</script>

<style lang="scss">
@import "../../assets/css/them.scss";
@import "../../assets/css/style.css";
.login-box {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-image: url("../../assets/img/4.png");
  background-size: auto;
}

.loginBox {
  opacity: 0.3;
  transition: all 2s;
}
.text-header {
  font: 5em Brush Script MT;
  color: #a5536a;
  text-shadow: -4px -2px 0 #fff;
}
.register {
  display: -webkit-box;
  display: -ms-flexbox;
  /* display: flex; */
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: end;
}
.loginBox:hover {
  opacity: 0.8;
}

.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 500px;
  padding: 35px 35px 15px;
  // background: #333;
  background-color: rgba(0, 0, 0, 0.376);
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 40px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
.qrClass {
  width: 100%;
  height: auto;
}
label.el-checkbox.remember {
  margin: 0px 0px 35px 0px;
}
.bounceToDown {
  animation: myfirst 1s;
}
@keyframes myfirst {
  0%,
  60%,
  75%,
  90%,
  100% {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -3000px, 0);
    transform: translate3d(0, -3000px, 0);
  }
  60% {
    opacity: 1;
    -webkit-transform: translate3d(0, 25px, 0);
    transform: translate3d(0, 25px, 0);
  }
  75% {
    -webkit-transform: translate3d(0, -10px, 0);
    transform: translate3d(0, -10px, 0);
  }
  90% {
    -webkit-transform: translate3d(0, 5px, 0);
    transform: translate3d(0, 5px, 0);
  }
  100% {
    -webkit-transform: none;
    transform: none;
  }
}
</style>