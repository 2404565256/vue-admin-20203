<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menuTab"
          :key="item.id"
          :class="{'current': item.current }"
          @click="toggleMenu(item)"
        >{{item.txt}}</li>
      </ul>

      <!-- 表单start -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="loginFome"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-from">
          <label for="username">邮箱</label>
          <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-from">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="passwords" v-show="model=='register'" class="item-from">
          <label for="passwords">重复密码</label>
          <el-input
            id="passwords"
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <label for="code">验证</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <el-input id="code" v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSmas()"
                :disabled="codeButtonStatus.status"
              >{{codeButtonStatus.text}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            class="login-btn block"
            @click="submitForm('loginFome')"
            :disabled="loginButtonStatus"
          >{{model=='login'?"登录":"注册"}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// base64加密、md5加密及sha1加密
import sha1 from "js-sha1";
import { GetSms, Register, Login } from "@/api/login";
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVCode
} from "@/utils/validate";
export default {
  name: "login",
  // setup(props, context) {
  //   console.log(context);
  /**
   * attrs: (...)       ==  this.$attrs
   * emit: (...)        ==  this.$emit
   * listeners: (...)   ==  this.$listeners
   * parent: (...)      ==  this.$parent
   * refs: (...)        ==  this.$refs
   * root: (...)        ==  this
   */

  setup(props, { refs, root }) {
    //验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };

    // 验证密码
    let validatePassword = (rule, value, callback) => {
      // 过滤后的数据
      ruleForm.password = stripscript(value);
      value = ruleForm.password;

      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6至20位数字+字母"));
      } else {
        callback();
      }
    };

    // 验证重复密码
    let validatePasswords = (rule, value, callback) => {
      // 如果模块值为login, 直接通过
      if (model.value === "login") {
        callback();
      }

      // 过滤后的数据
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };

    // 验证验证码
    let validateCode = (rule, value, callback) => {
      // 过滤后的数据

      if (value === "") {
        return callback(new Error("请输入验证码"));
      } else if (validateVCode(value)) {
        return callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };

    /*********************************************************************************************************************
     * 声明数据
     */
    // 这里面放置data数据、生命周期、自定义的函数
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);

    // 模块值
    const model = ref("login");
    // 登录按钮禁用状态
    const loginButtonStatus = ref(true);

    //验证码状态
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });

    //倒计时
    const timer = ref(null);

    // 表单绑定数据
    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: ""
    });

    // 表单的验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });

    // console.log(isRef(model) ? true : false);

    /**
     * 声明函数
     */
    // 切换模块
    const toggleMenu = data => {
      menuTab.forEach(item => {
        item.current = false;
      });
      //高光
      data.current = true;
      //修改模块值
      model.value = data.type;
      resetFromData();
      //清除获取状态码定时器
      clearCountDown();
      loginButtonStatus.value = true;
    };

    /**
     * 清除表单数据
     */
    const resetFromData = () => {
      // 重置表单
      refs.loginFome.resetFields();
    };

    /**
     * 更新按钮的转态
     */

    const updatedButtonStatus = params => {
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    };

    /**
     * 获取验证码
     */
    const getSmas = () => {
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能为空！！");
        return false;
      }

      if (validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式有误，请重新输入！！");
        return false;
      }

      // 获取验证码
      let requestData = {
        username: ruleForm.username,
        module: model.value
      };

      // 修改获取验证码按钮状态
      updatedButtonStatus({
        status: true,
        text: "发送中"
      });

      //延时多长时间
      setTimeout(() => {
        //请求接口
        GetSms(requestData)
          .then(response => {
            let data = response.data;
            root.$message({
              message: data.message,
              type: "success"
            });
            // 启用登录注册按钮
            loginButtonStatus.value = false;
            // 调用定时器，倒计时
            countdown(60);
          })
          .catch(error => {
            console.log(error);
          });
      }, 500);
    };

    /**
     * 提交表单
     */
    const submitForm = formName => {
      console.log(model.value);

      refs[formName].validate(valid => {
        if (valid) {
          model.value == "login" ? login() : register();
          // alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    /**
     * 登录
     */

    const login = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      root.$store.dispatch ("app/login", requestData).then(response => {
          let data = response.data;
          console.log(data);

          root.$message({
            message: data.message,
            type: "success"
          });

          root.$router.push({
            name: "Console"
          });
          //清除获取状态码定时器
          clearCountDown();
        })
        .catch(error => {
          console.log(error);
        });
      // Login(requestData)
      //   .then(response => {
      //     let data = response.data;
      //     console.log(data);

      //     root.$message({
      //       message: data.message,
      //       type: "success"
      //     });

      //     root.$router.push({
      //       name: "Console"
      //     });
      //     //清除获取状态码定时器
      //     clearCountDown();
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
    };

    /**
     * 注册
     */
    const register = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
        module: "register"
      };

      Register(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          //模拟注册成功
          toggleMenu(menuTab[0]);
          clearCountDown();
        })
        .catch(error => {
          console.log(error);
        });
    };

    /**
     * 倒计时
     */

    const countdown = number => {
      //判断定时器是否存在，存在则清除
      if (timer.value) {
        clearInterval(timer.value);
      }

      let time = number;
      timer.value = setInterval(() => {
        time--;
        // console.log(time);
        if (time === 0) {
          clearInterval(timer.value);
          updatedButtonStatus({
            status: false,
            text: "再次获取"
          });
        } else {
          codeButtonStatus.text = `倒计时${time}秒`;
        }
      }, 1000);
    };

    /**
     * 清除倒计时
     */

    const clearCountDown = () => {
      // 还原验证码默认状态
      updatedButtonStatus({
        status: false,
        text: "获取验证码"
      });
      //  清除倒计时
      clearInterval(timer.value);
    };

    /**
     * 生命周期
     */
    // 挂载完成后
    onMounted(() => {
      // console.log(process.env.VUE_APP_ABC);
    });

    return {
      menuTab,
      model,
      ruleForm,
      rules,
      toggleMenu,
      submitForm,
      getSmas,
      loginButtonStatus,
      codeButtonStatus
    };
  }
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
  .item-from {
    margin-bottom: 13px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>